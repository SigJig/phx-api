
import Resource from '../../lib/http/resource'
import PlayerOwnedMixin from './mixins/player_owned'
import { mixins } from '../../lib/utils/mixins'
import { Vehicles as Table } from '../../database/arma'
import { arrWithout } from '../../lib/utils/helpers'

@mixins(PlayerOwnedMixin)
export default class Vehicles extends Resource {
    get table() { return Table }
    get fields(): Array<keyof typeof Table.fields> {
        return arrWithout(Object.keys(Table.fields), [

        ])
    }
}