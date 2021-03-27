
import Resource from '../../lib/http/resource'
import { Warrants as Table } from '../../database/arma'
import { arrWithout } from '../../lib/utils/helpers'

export default class Warrants extends Resource {
    get table() { return Table }
    get fields(): Array<keyof typeof Table.fields> {
        return arrWithout(Object.keys(Table.fields), [

        ])
    }
}
