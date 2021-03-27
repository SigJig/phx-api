
import { Request, Response, NextFunction } from 'express'
import HTTP from '../constants/http'

export type Status = number | keyof typeof HTTP
export type Report = 'warnings' | 'errors'
export type RouteFunction = (ctx: Context, ...rest: any[]) => any

export default class Context {
    data: {[P: string]: any} = {}
    req!: Request
    res!: Response

    constructor(req: Request, res: Response, next: NextFunction) {
        this.set(req, res)
        req.context = this
        next()
    }

    static middleware(...rest: [Request, Response, NextFunction]): object {
        return new Context(...rest)
    }

    static route(thisCtx: any, fnc: RouteFunction): ((req: Request, res: Response, next: NextFunction) => any) {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (req.context === undefined) throw new Error('Context not set on request object')

            return await req.context.set(req, res).handleCall(thisCtx, fnc, next)
        }
    }

    protected report(section: Report, report: string) {
        const data = this.data[section] || []
        data!.push(report)

        this.data[section] = data

        return this
    }

    async handleCall(thisCtx: any, fnc: RouteFunction, next: NextFunction): Promise<any> {
        let data: any
        try {
            data = await fnc.call(thisCtx, this)
        }
        catch (e) {
            return next(e)
        }

        return this.resolve(data)
    }

    set(req: Request, res: Response) {
        this.req = req
        this.res = res

        return this
    }

    add(newData: any, source: string = 'results') {
        const val = this.data[source]

        const valArr = [newData, val]

        const check = (callback: CallableFunction) => {
            if (valArr.find(callback as any) !== undefined) {
                if (valArr.find((e: any) => !callback(e) && e !== undefined) > -1) {
                    throw new Error(`types in ${valArr.map(x => typeof x).join(', ')} are not matching`)
                }
                return true
            }

            return false
        }

        let newVal: any

        if (check((e: any) => Array.isArray(e))) {
            newVal = val && val.length ? [...val, ...newData] : [...newData]
        }
        else if (check((e: any) => typeof e === 'object')) {
            newVal = Object.assign(newData, val)
        }
        else {
            newVal = newData
        }

        this.data[source] = newVal

        return this
    }

    status(code: number | keyof typeof HTTP) {
        if (typeof code !== 'number') {
            code = HTTP[code]
        }

        this.res.status(code)
    
        return this
    }

    resolve(data?: any): object {
        if (data !== undefined) {
            this.add(data)
        }

        if (!this.res.headersSent) {
            this.res.send(this.data)
        }

        return this
    }

    warn(report: string) {
        this.report('warnings', report)

        return this
    }

    error(report: string) {
        this.report('errors', report)

        return this
    }
}
