
import Resource from '../../lib/http/resource'
import { Users as UserTable } from '../../database/api'
import { arrWithout } from '../../lib/utils/helpers'

export default class Users extends Resource {
    get table() { return UserTable }
    get fields(): Array<keyof typeof UserTable.fields> {
        return arrWithout(Object.keys(UserTable.fields), [
            'password'
        ])
    }
}