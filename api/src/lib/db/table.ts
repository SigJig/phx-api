
import Knex from 'knex'
import { AnyObject } from '../types'

/*
    The tables contain each column in the SQL table.

    This is mainly to validate against columns passed in the query by the user
    It is also good as if the column name is changed in the db,
    (a fairly common occurence in the arma db by the altislife team). This allows us to change
    the column name in the table below, and it will have no effect on the API, or the columns referenced in the code.

    It also makes it easier to handle resources, to dynamically create routes
*/
export default abstract class Table {
    static dbName: string
    static fields: AnyObject<string>
    static conn: Knex

    static getTableConn() {
        return this.conn(this.dbName)
    }

    static get columns(): string[] {
        return Object.keys(this.fields).map(x => this.column(x, true))
    }

    static column(c: string, select: boolean = false, advancedAlias: boolean = false): string {
        const [ alias, dbName ] = this.columnRaw(c)
        const sql = `${this.dbName}.${dbName}`

        const preppedAlias = advancedAlias ? `${this.dbName}::${alias}` : alias

        return select ? sql + ` as ${preppedAlias}` : sql
    }

    static columnRaw(c: string): [string, string] {
        const val = Reflect.get(this.fields, c, this)

        if (val === undefined) {
            throw new Error(`column ${c} does not exist on table ${this.dbName}`)
        }

        return [ c, val ]
    }

    static columnsMap(obj: object, ...args: any[]) {
        return Object.entries(obj).reduce((acc: object, [k, v]) => {
            (acc as any)[this.column(k, ...args)] = v

            return acc
        }, {})
    }
}