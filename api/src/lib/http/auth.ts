
import { Request, Response, NextFunction } from 'express'
import { mappy } from '../../lib/utils/proxies'
import Context, { Status } from './context'
import JWT, { JsonWebTokenError } from 'jsonwebtoken'

import { Users, Tokens } from '../../database/api'
import logger from '../../logger'

export const Permissions = {
    arma_perms: ['basic', 'edit_west', 'edit_east', 'edit_indep', 'edit_civ'],
    internal_perms: ['basic', 'create', 'edit']
} as const

export type PermissionsObject = {
    [K in keyof typeof Permissions]?: string[]
}

export interface TokenData {
    user_id: string
    name?: string
    id?: string
    created_at?: Date
    expires_at?: Date
    is_admin?: boolean
}

export interface User {
    id: string
    name: string
    email: string
    password: string
    created_at: Date
}

export interface JWTPayload {
    id: string
}

export class Token {

    protected perm?: string
    protected _user?: User
    
    protected static defaultPerms: PermissionsObject = {
        arma_perms: ['basic']
    }

    constructor(public data: TokenData, public jwt: string) {
        const setPerms = Object.keys(Permissions).filter(x => Reflect.get(this.data, x) > 0)

        if (setPerms.length > 1) {
            throw new Error('token has multiple permissions set')
        }

        this.perm = setPerms[0]
    }

    export() {
        const res = {jwt: this.jwt, data: {
            ...this.data,
            perms: {}
        }}

        for (const [k, v] of Object.entries(Permissions)) {
            delete (res.data as any)[k];

            (res.data.perms as any)[k] = (v as any).reduce((acc: any, x: string) => {
                acc[x] = this.hasPerm(k as any, x)

                return acc
            }, {})
        }

        return res
    }

    static createBitwiseValue(t: keyof typeof Permissions, perms: string[] | {[K: string]: number}) {
        const arr = Reflect.get(Permissions, t)

        if (!(arr && Array.isArray(arr))) {
            throw new TypeError(`Expected array, got ${typeof arr}`)
        }

        perms = perms || []
        perms = Array.isArray(perms) ? perms : (
            Object.entries(perms)
            .filter(([_, v]) => !!v)
            .map(([k]) => k)
        ) as string[]

        return perms.reduce((acc: number, perm: string) => {
            const index = arr.indexOf(perm)

            if (index < 0) return acc

            return acc | (1 << index)
        }, 0)
    }

    static async fetch(token_id: string | number) {
        const data = await Tokens.getTableConn().select(Tokens.columns)
                                                .where(Tokens.column('id'), token_id)
                                                .first()

        if (data === undefined) throw new Error('token data is undefined')

        return data
    }

    static sign(data: TokenData) {
        const { id } = data

        return new Token(
            data,
            JWT.sign({id}, process.env.JWT_KEY as JWT.Secret)
        )
    }

    static async create(id: string | number, tokenName: string, perms?: PermissionsObject) {
        const { arma_perms, internal_perms } = mappy(perms || this.defaultPerms, (x: any, perm: keyof typeof Permissions) => {
            return this.createBitwiseValue(perm, x)
        })
        
        if ([arma_perms, internal_perms].filter((x: number) => x > 0).length > 1) {
            throw new Error(`token has too many perms or whatever`)
        }

        const [ token_id ] = await Tokens.getTableConn().insert(
            Tokens.columnsMap({
                name: tokenName,
                arma_perms: arma_perms,
                internal_perms: internal_perms,
                user_id: id
            })
        )
        
        return this.sign(await this.fetch(token_id))
    }

    hasPerm(section: keyof typeof Permissions, perm: string) {
        if (!this.perm || this.perm !== section) return false

        const perms = Reflect.get(Permissions, this.perm)
        const val = Reflect.get(this.data, this.perm)

        const idx = perms.indexOf(perm as any)

        if (idx === -1) {
            logger.warn('Unexpected perm ${perm} supplied to hasPerm')
            return false
        }
        
        return !!(val & (1 << idx))
    }

    async getUser() {
        if (this._user === undefined) {
            const user = await Users.getTableConn()
                                    .select(Users.columns)
                                    .where(Users.column('id'), this.data.user_id)
                                    .first()

            if (user === undefined) {
                throw new Error(`user ${this.data.user_id} for token ${this.data.id} is undefined`)
            }

            this._user = user
        }

        return this._user
    }
}

export class InvalidToken {
    reasons: Array<string>
    _status: Status = 'unauthorized'

    constructor(...reasons: Array<string>) {
        this.reasons = reasons && reasons.filter(x => !!x).length ? reasons : ['Invalid token supplied']
    }

    status(status: Status) {
        this._status = status

        return this
    }

    endSession(ctx: Context) {
        return this.reasons.reduce((ctx: Context, m: string) => ctx.error(m), ctx.status(this._status)).resolve()
    }
}

export function assertAuth(ctx: Context, section?: keyof typeof Permissions, ...data: string[]): boolean {
    const { token } = ctx.req

    try {
        if (token instanceof InvalidToken) throw token
        if (data !== undefined && data.length) {
            if (data.findIndex((k: string) => !token.hasPerm(section!, k)) > -1) {
                throw new InvalidToken('You are not allowed to edit this endpoint.').status('forbidden')
            }
        }
    }
    catch (e) {
        if (e instanceof InvalidToken) {
            e.endSession(ctx)
            return false
        }

        throw e
    }

    return true
}

export function auth(section?: keyof typeof Permissions, ...data: string[]) {
    return function decorator(target: any, k: string, desc: PropertyDescriptor) {
        const method = desc.value
        desc.value = function (ctx: Context, ...rest: any[]) {
            if (!assertAuth(ctx, section, ...data)) {
                return undefined
            }

            return method.apply(this, [ctx, ...rest])
        }

        return desc
    }
}

export async function middleware(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.get('Authorization')

        if (token === undefined) {
            throw 'No authentication token supplied'
        }
        
        token = token.replace('Bearer ', '')

        let payload: JWTPayload

        try {
            payload = JWT.verify(token, process.env.JWT_KEY as string) as JWTPayload
        }
        catch (e) {
            throw (e instanceof JsonWebTokenError ? undefined : e)
        }

        const dbEntry = await Tokens.getTableConn()
                                    .select(Tokens.columns)
                                    .where(Tokens.column('id'), payload.id)
                                    .first()

        if (dbEntry === undefined) {
            throw undefined
        }

        req.token = new Token(dbEntry, token)

        next()
    }
    catch (e) {
        if (e === undefined || typeof e === 'string') {
            // Set an invalid token. That way if we require authorization for a route later,
            // we can just check if the token is valid
            req.token = new InvalidToken(e)
            return next()
        }
        
        next(e)
    }
}