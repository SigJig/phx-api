
import Resource from '../../lib/http/resource'
import { MoneyCache as Table } from '../../database/api'
import { arrWithout } from '../../lib/utils/helpers'

export default class MoneyCache extends Resource {
    get table() { return Table }
    get fields(): Array<keyof typeof Table.fields> {
        return arrWithout(Object.keys(Table.fields), [
            // Add blacklisted columns here
        ])
    }
}
