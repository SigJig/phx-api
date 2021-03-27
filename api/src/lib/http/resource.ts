
import _ from 'underscore'
import URL from 'url'
import Knex from 'knex'
import { mappy } from '../utils/proxies'
import { Class } from '../types'
import { BadRequest, NotFound } from './errorhandler'
import Context from './context'
import APIConstants from '../constants/api'
import Table from '../db/table'

export interface ResourceOptions {
    pagination?: boolean
    search?: boolean
    single?: boolean
    sort?: boolean
    initialize?: boolean
}

export interface ResourceParams {
    select?: Array<[string, string[]] | string>
    search?: object
    page?: string | number
    count?: string | number
    sort?: [string, string]
}

export function validateFields(rsc: Class<Resource>, table: any) {
    return function wrapper(target: Resource, k: string, desc: PropertyDescriptor) {
        const method = desc.value

        desc.value = function (fields: string[], ...rest: any[]) {
            return method.apply(this, 
                [
                    (fields && fields.length ? fields : (rsc as any).dummy.fields),
                    ...rest
                ]
            )
        }
    }
}

export type CallbackEntry = [Function, string[]]

export default abstract class Resource {

    abstract get table(): any
    abstract get fields(): string[]
    
    protected _qb!: Knex.QueryBuilder

    exactlyOne: boolean = false
    isFormatted: boolean = false
    used: boolean = false

    tables: {[k: string]: Table} = {}

    /*
    If there are more than one tables involved in the query, the
    columns need to be formatted in order to prevent collisions.

    To resolve this we store the selects in the resource, and add them
    to the querybuilder when we are fetching from the database.
    That way, we can properly format the columns, aswell as keep track of them,
    so that they can be resolved later.

    Example: 
        Incoming request has this query parameter: `select=id,gang[id]`
        This is on the /players resource.

        Because this request then relies upon 2 tables, we create aliases for the columns,
        and the SQL query becomes something like this:
        'SELECT `players`.`id` as players::id, `gangs`.`id` as gangs::id'

        The above query then returns something like this:
        {
            players::id: 1,
            gangs::id: 2
        }

        Which we can then easily parse to:
        {
            id: 1,
            gangs: {
                id: 2
            }
        }

    */
    selects: any = {
        local: {
            fields: []
        }
    }

    searchOperators = {
        'gt': '>',
        'gte': '>=',
        'lt': '<',
        'lte': '<=',
        'not': 'not',
        'eq': '='
    }

    options: ResourceOptions = {
        pagination: true,
        search: true,
        sort: true,
        single: false,
        initialize: true
    }

    constructor(public params: ResourceParams, ctx: Context | null, options: ResourceOptions) {
        this.options = {...this.options, ...options}

        if (this.options.initialize) {
            this.initParams(ctx!)
        }
        else if (this.options.single) {
            this.exactlyOne = true
        }
    }

    static get dummy() {
        return new (this as any)({}, null, {initialize: false})
    }

    get qb(): Knex.QueryBuilder {
        if (!this._qb) {
            this._qb = this.table.getTableConn()
        }

        return this._qb
    }

    initParams(ctx: Context) {

        const { req } = ctx
        const { single, pagination, search, sort } = this.options
        const { select } = this.params

        if (select && select.length) {
            let cbs: Array<CallbackEntry> = []

            for (const f of select) {
                const [ item, fields = [] ] = Array.isArray(f) ? f : [ f ]

                try {
                    const func = Reflect.get(this, `select_${item.toLowerCase()}`)

                    if (func === undefined) throw undefined

                    cbs.push([func, fields])
                }
                catch (e) {
                    if (this.fields.map((x: string) => x.toLowerCase()).indexOf(item.toLowerCase()) > -1) {
                        if (fields.length) {
                            throw new BadRequest(`Field ${item} does not support field indexing`)
                        }

                        this.addSelects(item)
                        continue
                    }

                    throw new BadRequest(`Unrecognized field ${f}`)
                }
            }

            if (cbs.length > APIConstants.selects.maxNested) {
                throw new BadRequest(
                    `Your query is too complicated. You can only select ${APIConstants.selects.maxNested} nested fields at a time`
                )
            }

            cbs.forEach(([x, y]) => this.callSelectFunc(x, [y]))
        }
        else {
            this.addSelects(this.fields)
        }

        if (!single) {
            if (pagination) {
                let { page, count } = mappy(this.params, (x: string | number) => x === undefined || typeof x === 'number' ? x : parseInt(x))
                const pathname = URL.parse(req.originalUrl).pathname

                const formatPage = (pageIdx: number) => URL.format({
                    protocol: req.protocol,
                    host: req.get('host'),
                    pathname: pathname,
                    query: Object.assign(req.query, {count: count}, {page: pageIdx})
                })

                const { countDefault, maximum } = APIConstants.pagination

                page = page || 0
                count = count || countDefault

                if (page > maximum) {
                    throw new BadRequest(`You can only select ${maximum} items at a time`)
                }

                ctx.add({
                    next: formatPage(page + 1)
                }, 'links')

                if (page > 0) {
                    ctx.add({
                        previous: formatPage(Math.max(page - 1, 0))
                    }, 'links')
                }

                this.qb.limit(count).offset(count * page)
            }
            if (search) {
                Object.entries(this.params.search || {}).forEach(x => this.applySearchParam(...x))
            }
            if (sort) {
                let [ sortColumn, sortOrder ] = this.params.sort!

                if (sortColumn !== undefined) {
                    const orderPrepped = sortOrder !== undefined && (['asc', 'desc'].indexOf(sortOrder.toLowerCase()) > -1) ? sortOrder : 'asc'

                    this.qb.orderBy(this.table.column(sortColumn), orderPrepped)
                }
            }
        }
        else {
            this.exactlyOne = true
        }
    }

    applySearchParam(field: string, value: string) {
        const [ name, operator = 'eq' ] = field.split('__')
        
        if (!(operator in this.searchOperators)) {
            throw new BadRequest(`Unrecognized search operator ${operator}`)
        }

        return this.qb.where(this.table.column(name), (this.searchOperators as any)[operator], (
            this.table.conn.raw('?', [value])
        ))
    }

    findOrFail(prop: string, id: any) {
        this.exactlyOne = true
        this.qb.where(this.table.column(prop), this.table.conn.raw('?', [id])).first()

        return this
    }


    addSelects(fields: string[] | string, alias?: string, table?: any) {
        if (!Array.isArray(fields)) {
            fields = [fields]
        }

        if (table !== undefined) {
            this.isFormatted = true

            const { dbName }: { dbName: string } = table

            const entry = this.selects[dbName]

            if (entry) {
                if (entry.aliasTo !== alias) {
                    throw new Error(
                        `Alias conflict: alias for ${dbName} is already set (new: ${alias}, current: ${entry.aliasTo})`
                    )
                }

                const arr = this.selects[dbName].fields

                arr.push.apply(arr, fields)
            }
            else {
                this.selects[dbName] = {
                    aliasTo: alias!,
                    table: table,
                    fields: fields
                }
            }
        }
        else {
            const arr = this.selects.local.fields

            arr.push.apply(arr, fields)
        }

        return this
    }

    resolveFormatted(data: any) {
        if (!this.isFormatted) return data

        const out: any = {}

        for (const [k, v] of Object.entries(data)) {
            const [ table, column ] = k.split('::')

            if (table === this.table.dbName ) {
                out[column] = v
            }
            else {
                if (!(table in this.selects)) {
                    throw new Error(`Formatted table ${table} not defined in ${this.selects}`)
                }

                const { aliasTo }: any = this.selects[table]

                if (!aliasTo) {
                    throw new Error(`Missing aliasTo column on query for ${k}`)
                }
    
                if (!(aliasTo in out)) { 
                    out[aliasTo] = {}
                }
    
                out[aliasTo][column] = v
            }

        }

        return out
    }
    
    constructQuery() {
        const selects = Object.entries(this.selects).reduce((acc: any[], [k, v]: [string, any]) => {
            const table = v.table || (k === 'local' ? this.table : undefined)
    
            if (table === undefined) throw new Error(`table is undefined in ${v}`)
    
            return acc.concat(v.fields.map((x: string) => table.column(x, true, this.isFormatted)))
        }, [])

        return this.qb.select(selects)
    }

    callSelectFunc(fnc: Function, args: any[], thisCtx: any = this): any {
        return fnc.apply(thisCtx, args)
    }

    async fetch() {
        if (this.used) {
            throw new Error(`This resource has already been used, and a new one needs to be constructed.`)
        }

        let result = await this.constructQuery()

        if (this.exactlyOne && (!result || (typeof result === 'object' && _.isEmpty(result)))) {
            throw new NotFound()
        }

        if (this.isFormatted) {
            result = (Array.isArray(result) ? result : [result]).map((x: any) => this.resolveFormatted(x))
        }

        this.used = true

        return result
    }
}