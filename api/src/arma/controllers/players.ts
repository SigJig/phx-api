
import _ from 'underscore'

import Context from '../../lib/http/context'
import { Players } from '../../database/arma'
import { SimpleController, simpleDbRoute, Mixin } from '../../lib/http/controller'

import { lookupSteamid, whitelistFields, verifyPlayer } from '../resources/players'
import MoneyCacheRsc from '../resources/moneycache'
import PropertiesRsc from '../resources/properties'
import VehiclesRsc from '../resources/vehicles'
import PlayersRsc from '../resources/players'
import DeathsRsc from '../resources/deaths'

import { Token } from '../../lib/http/auth'
import { BadRequest, Forbidden, NotFound } from '../../lib/http/errorhandler'
import { auth } from '../../lib/http/auth'
import { AnyObject } from '../../lib/types'

class PlayersController extends SimpleController {

    static mixins = ['index'] as Mixin[]

    @auth('arma_perms', 'basic')
    @simpleDbRoute(PlayersRsc, {single: true})
    async show(ctx: Context, rsc: PlayersRsc) {
        const { identifier } = ctx.req.params

        return await rsc.idOrSteamid(identifier).fetch()
    }

    @auth('arma_perms', 'basic')
    @simpleDbRoute(DeathsRsc)
    async deathsIndex(ctx: Context, rsc: DeathsRsc) {
        return await rsc.fetch()
    }

    @auth('arma_perms', 'basic')
    @simpleDbRoute(DeathsRsc, {single: true})
    async showDeath(ctx: Context, rsc: DeathsRsc) {
        const { identifier } = ctx.req.params

        return await rsc.findOrFail('id', identifier).fetch()
    }

    @auth('arma_perms', 'basic')
    @simpleDbRoute(DeathsRsc)
    async playerDeaths(ctx: Context, rsc: DeathsRsc) {
        const { identifier } = ctx.req.params

        await verifyPlayer(identifier)

        rsc.qb.where(lookupSteamid(rsc, identifier, 'steamid'))

        return await rsc.fetch()
    }

    @auth('arma_perms', 'basic')
    @simpleDbRoute(VehiclesRsc)
    async playerVehicles(ctx: Context, rsc: VehiclesRsc) {
        const { identifier } = ctx.req.params

        await verifyPlayer(identifier)

        rsc.qb.where(lookupSteamid(rsc, identifier, 'steamid'))

        return await rsc.fetch()
    }

    @auth('arma_perms', 'basic')
    @simpleDbRoute(PropertiesRsc)
    async playerProperties(ctx: Context, rsc: PropertiesRsc) {
        const { identifier } = ctx.req.params

        await verifyPlayer(identifier)

        rsc.qb.where(lookupSteamid(rsc, identifier, 'steamid'))
        return await rsc.fetch()
    }

    @auth('arma_perms', 'basic')
    @simpleDbRoute(MoneyCacheRsc)
    async playerMoneyCache(ctx: Context, rsc: MoneyCacheRsc) {
        const { identifier } = ctx.req.params
        /**
         * TODO: Use PlayersRsc instead of raw DB conn
         */
        
        const prepped = Players.conn.raw('?', [identifier])

        // Get the correct user id, as it can be both steamid or uid
        const player = await Players.getTableConn()
                               .select(Players.column('id', true))
                               .where(Players.column('steamid'), prepped)
                               .orWhere(Players.column('id'), prepped)
                               .first()

        if (player === undefined || player.id === undefined) {
            throw new NotFound(identifier)
        }

        rsc.qb.where(rsc.table.column('player'), player.id)

        return await rsc.fetch()
    }

    @auth('arma_perms', 'basic')
    async update(ctx: Context) {
        /**
         * TODO: This returns 200 even if the player doesnt exist
         */
        const { token, body }: any = ctx.req
        const { identifier } = ctx.req.params
        let fields: AnyObject<any> = {}

        for (const [ key, val ] of Object.entries(body)) {
            const item = Object.entries(whitelistFields).find(([k, v]: [string, string[]]) => {
                return v.indexOf(key) > -1
            })


            if (item !== undefined) {
                const whitelist = item[0]

                if ((token as Token).hasPerm('arma_perms', whitelist)) {
                    fields[key] = val
                }
                else {
                    throw new Forbidden(`Unauthorized to alter field ${key}`)
                }
            }
            else {
                throw new BadRequest(`Field ${key} is not a valid field`)
            }
        }

        if (!fields) {
            throw new BadRequest('You need to specify fields to update')
        }

        const rawConn = Players.conn

        await Players.getTableConn().where(Players.column('id'), rawConn.raw('?', [identifier]))
                  .update(Object.entries(fields).reduce((acc: any, [k, v]) => {
                    acc[Players.column(k)] = rawConn.raw('?', [v])

                    return acc
                  }, {}))


        const rsc = new PlayersRsc({select: Object.keys(fields)}, ctx, {single: true})

        rsc.qb.where(Players.column('id'), rawConn.raw('?', [identifier])).first()

        return await rsc.fetch()
    }
    
}

export default new PlayersController(PlayersRsc, undefined)