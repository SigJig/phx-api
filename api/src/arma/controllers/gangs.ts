
import Context from '../../lib/http/context'
import { SimpleController, simpleDbRoute } from '../../lib/http/controller'
import { auth } from '../../lib/http/auth'

import GangsRsc from '../resources/gangs'
import AlliancesRsc from '../resources/alliances'

class Gangs extends SimpleController {
    
    @auth('arma_perms', 'basic')
    @simpleDbRoute(AlliancesRsc)
    async alliancesIndex(ctx: Context, rsc: AlliancesRsc) {
        return await rsc.fetch()
    }

    @auth('arma_perms', 'basic')
    @simpleDbRoute(AlliancesRsc, {single: true})
    async showAlliance(ctx: Context, rsc: AlliancesRsc) {
        const { identifier } = ctx.req.params

        rsc.findOrFail('id', identifier)

        return await rsc.fetch()
    }

    @auth('arma_perms', 'basic')
    @simpleDbRoute(AlliancesRsc)
    async gangAlliances(ctx: Context, rsc: AlliancesRsc) {
        const { identifier } = ctx.req.params

        await GangsRsc.dummy.addSelects('id').findOrFail('id', identifier).fetch()

        rsc.qb.where(function () {
            this.where(rsc.table.column('requesting_gang'), identifier)
                .orWhere(rsc.table.column('recieving_gang'), identifier)
        })

        return await rsc.fetch()
    }

}

export default new Gangs(GangsRsc)