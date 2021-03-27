
import Chai from 'chai'
import HTTP from 'chai-http'
import App from '../../src/app'
import { authenticated } from './auth'

import HTTPCodes from '../../src/lib/constants/http'

Chai.use(HTTP)
Chai.should()

export const request = Chai.request(App).keepOpen()

export abstract class Router {

    baseRoute = ['api']
    _routes!: string[]

    constructor(...routes: string[]) {
        this._routes = routes
    }

    get routes() {
        return this.baseRoute.concat(this._routes)
    }

    protected _constructRoute(more: string[]) {
        return '/' + (this.routes.concat(more)).map(x => {
            return x.replace(/(^\/*|\/*$)/g, '')
        }).join('/')
    }

    route(...routes: string[]) {
        return this._constructRoute(routes)
    }
}

export class ArmaRouter extends Router {
    baseRoute = ['api', 'arma']
}

export class InternalRouter extends Router {
    baseRoute = ['api', 'internal']
}

export class MetaRouter extends Router {
    baseRoute = ['api', 'meta']
}

export function statusCheck(req: any, expect: number | keyof typeof HTTPCodes, auth: boolean = true, authArgs?: object) {
    const statusCode = typeof expect === 'number' ? expect : HTTPCodes[expect]

    return async function _statusCheck() {
        const response = await (auth ? authenticated(req, authArgs) : req)

        response.status.should.equal(statusCode)
    }
}

export default Chai