/**
 * TODO: Change name of simpleDbRoute to something clearer
 * TODO: Add controller auth method, which is ran if the auth decorator is not applied
 * TODO: Tests for the above auth method
 * TODO: Move mixin loading to a class decorator
 */

import Context from './context'
import Resource, { ResourceOptions, ResourceParams } from './resource'
import { deepMerge } from '../utils/helpers'
import { formatSelects } from '../utils/params'
import { Class } from '../types'
import { auth } from './auth'
import { apply as mixinApply } from '../utils/mixins'
import { InternalError } from './errorhandler'

export function simpleDbRoute(rsc?: Class<Resource>, options?: ResourceOptions) {
    return function wrapper(target: Controller, key: string, descriptor: PropertyDescriptor) {
        const { value } = descriptor
        
        descriptor.value = function (this: Controller, ctx: Context, ...rest: any[]) {
            const resource = rsc || this.resource

            return value.apply(this, [ctx, _simpleDbRoute(ctx, resource, options), ...rest])
        }

        return descriptor
    }
}

export function _simpleDbRoute(ctx: Context, resource: Class<Resource>, options?: ResourceOptions) {
    const { query } = ctx.req

    const select = formatSelects(query.select)

    const params: ResourceParams = {...query, ...{
        select: select,
        search: !query.search ? {} : query.search.split(',').reduce((acc: object, x: string) => {
            const [ k, v ] = x.split(':')

            return {...acc, [k]: v}
        }, {}),
        sort: !query.sort ? [] : query.sort.split(',')
    }}

    return new resource(params, ctx, options)
}

export default abstract class Controller {
    resource: Class<Resource>

    constructor(resource: Class<Resource>) {
        this.resource = resource
    }

    route(key: string) {
        return Context.route(this, (this as any)[key])
    }
}

export interface SimpleControllerOptions {
    show?: {
        paramKey?: string,
        column?: string,
        simpleRouteParams?: object
    },
    index?: {
        simpleRouteParams?: object
    }
}

export type Mixin = 'show' | 'index'

export function loadMixins<T extends Class<{}>>(ctor: T) {
    const newCtor = class extends ctor {

    }

    const implement = ctor.prototype.mixins
    const typeTable: {[p in Mixin]: Class<any>} = {
        show: ShowMixin,
        index: IndexMixin
    }

    const mixins = Object.entries(typeTable)
                            .filter(([name]) => !implement || implement.indexOf(name) > -1)
                            .map(([_, x]) => x)

    mixinApply(newCtor, ...mixins)

    return newCtor
}

export class IndexMixin {

    @auth() // NO!
    async index(this: SimpleController, ctx: Context) {
        const rsc = _simpleDbRoute(ctx, this.resource, this.options.index!.simpleRouteParams!)
        
        return await rsc.fetch()
    }

}

export class ShowMixin {

    @auth() // NO!
    async show(this: SimpleController, ctx: Context) {
        const { paramKey, column, simpleRouteParams } = this.options.show!
        const val = ctx.req.params[paramKey!]
        
        const rsc = _simpleDbRoute(ctx, this.resource, simpleRouteParams)

        return await rsc.findOrFail(column!, val).fetch()
    }
    
}

@loadMixins
export class SimpleController extends Controller implements ShowMixin, IndexMixin {
    static mixins: Array<Mixin> = ['show', 'index']

    options: SimpleControllerOptions = {
        show: {
            paramKey: 'identifier',
            column: 'id',
            simpleRouteParams: {single: true}
        },
        index: {
            simpleRouteParams: {}
        }
    }

    constructor(rsc: Class<Resource>, options?: SimpleControllerOptions) {
        super(rsc)

        if (options !== undefined) {
            this.options = deepMerge(this.options, options)
        }

    }

    protected error(...args: any): any {
        throw new InternalError()
    }

    show(...args: any[]): any {
        return this.error(...args)
    }

    index(...args: any[]): any {
        return this.error(...args)
    }

}