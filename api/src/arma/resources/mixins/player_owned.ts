
import Resource, { validateFields } from '../../../lib/http/resource'
import { Players } from '../../../database/arma'
import PlayersResource from '../players'

export default abstract class PlayerOwnedMixin extends Resource {
    @validateFields(PlayersResource, Players)
    select_owner(fields: string[]) {
        this.addSelects(fields, 'owner', Players)

        this.qb.leftJoin(Players.dbName, Players.column('steamid'), this.table.column('steamid'))
    }
}