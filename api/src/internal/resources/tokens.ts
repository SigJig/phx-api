
import Resource, { validateFields } from '../../lib/http/resource'
import UsersRsc from './users'
import { Tokens as Table, Users } from '../../database/api'
import { arrWithout } from '../../lib/utils/helpers'

export default class Tokens extends Resource {
    get table() { return Table }
    get fields(): Array<keyof typeof Table.fields> {
        return arrWithout(Object.keys(Table.fields), [
            // Add blacklisted columns here
        ])
    }

    @validateFields(UsersRsc, Users)
    select_user(fields: string[]) {
        this.addSelects(fields, 'user', Users)

        this.qb.innerJoin(Users.dbName, this.table.column('user_id'), Users.column('id'))
    }
}
