
import Knex from 'knex'
import Resource, { ResourceParams, ResourceOptions, validateFields } from '../../lib/http/resource'
import Context from '../../lib/http/context'

import IDCardsResource from './idcards'
import WarrantsResource from './warrants'
import GangsResource from './gangs'

import {
    Players,
    Gangs,
    IDCards,
    Warrants,
    CombatStats
} from '../../database/arma'

import { arrWithout } from '../../lib/utils/helpers'
import { BadRequest } from '../../lib/http/errorhandler'


export const whitelistFields = {
    edit_west: [
        'west_protection_level', 'west_academy_level', 'west_undercover_level',
        'west_specops_level', 'west_road_level', 'west_air_level', 'west_level'
    ],
    edit_east: [
        'east_level', 'east_air_level', 'east_specops_level', 'east_marine_level', 'east_undercover_level'
    ],
    edit_indep: ['indep_level', 'indep_rescue_level']
}

export function verifyPlayer(id: string | number) {
    const r = PlayersResource.dummy

    r.exactlyOne = true
    
    return r.idOrSteamid(id).fetch()
}

export function lookupSteamid(rsc: Resource, id: string | number, column: string) {
    return function (this: Knex.QueryBuilder) {
        const steamid = rsc.table.column(column)

        this.where(steamid, id)
            .orWhere(steamid, rsc.table.conn.raw(
                `(select ${Players.column('steamid')} from ${Players.dbName} where ${Players.column('id')}=? limit 1)`, [typeof id === 'number' ? id : parseInt(id)]
            ))
    }
}

export function lookupUID(rsc: Resource, id: string | number, column: string) {
    return function (this: Knex.QueryBuilder) {
        const uid = rsc.table.column(column)

        this.where(uid, id)
            .orWhere(uid, rsc.table.conn.raw(
                `(select ${Players.column('id')} from ${Players.dbName} where ${Players.column('steamid')}=? limit 1)`, [typeof id === 'string' ? id : id.toString()]
            ))
    }
}

export default class PlayersResource extends Resource {
    get table() { return Players }
    get fields(): Array<keyof typeof Players.fields> {
        return arrWithout(Object.keys(Players.fields), [
            // Add fields to be blacklisted here
        ])
    }

    idOrSteamid(id: string | number) {
        const self = this
        const prepped = self.table.conn.raw('?', [id])

        this.qb.where(function () {
            this.where(self.table.column('id'), prepped)
                .orWhere(self.table.column('steamid'), prepped)
        })

        return this
    }

    @validateFields(IDCardsResource, IDCards)
    select_idcard(fields: string[]) {
        this.addSelects(fields, 'idcard', IDCards)

        this.qb.leftJoin(IDCards.dbName, function () {
            this.on(
                    IDCards.column('player'),
                    '=',
                    Players.column('id')
                )
                .andOn(
                    IDCards.column('is_active'),
                    '=',
                    IDCards.conn.raw('?', [true])
                )
        })
    }

    @validateFields(WarrantsResource, Warrants)
    select_warrants(fields: string[]) {
        this.addSelects(fields, 'wanted', Warrants)

        this.qb.leftJoin(Warrants.dbName, Warrants.column('id'), Players.column('steamid'))
    }

    @validateFields(GangsResource, Gangs)
    select_gang(fields: string[]) {
        this.addSelects(fields, 'gang', Gangs)

        this.qb.leftJoin(Gangs.dbName, Gangs.column('id'), Players.column('gangid'))
    }

    // TODO: This could probably be improved quite a lot
    // TODO: Selecting for multiple sides causes alias conflict
    // combat_stats(side: string, fields: string[]) {
    //     const self = this
    //     const invalidFields = fields.filter(x => (['kills', 'deaths', 'headshots'].indexOf(x.toLowerCase()) === -1))

    //     const sideMap = {
    //         west: 'WEST',
    //         east: 'EAST',
    //         indep: 'INDEPENDENT',
    //         civ: 'CIVILIAN'
    //     }

    //     if (invalidFields.length) {
    //         throw new BadRequest(`unrecognized field(s) ${invalidFields.join(',')}`)
    //     }

    //     this.addSelects(fields, 'stats_' + side, CombatStats)

    //     this.qb.leftJoin(CombatStats.dbName, function () {
    //         this.on(CombatStats.column('player'), self.table.column('id'))
    //             .andOn(CombatStats.column('side'), CombatStats.conn.raw('?', [(sideMap as any)[side]]))
    //     })
    // }

    // select_stats_west(fields: string[]) {
    //     return this.combat_stats('west', fields)
    // }

    // select_stats_east(fields: string[]) {
    //     return this.combat_stats('east', fields)
    // }

    // select_stats_indep(fields: string[]) {
    //     return this.combat_stats('indep', fields)
    // }

    // select_stats_civ(fields: string[]) {
    //     return this.combat_stats('civ', fields)
    // }
}