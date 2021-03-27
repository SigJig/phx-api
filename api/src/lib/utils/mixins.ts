
import { Class } from '../types'

export function apply(ctor: any, ...mixinCtors: any[]) {
    for (const mCtor of mixinCtors) {
        for (const prop of Object.getOwnPropertyNames(mCtor.prototype)) {
            if (prop !== 'constructor') {
                ctor.prototype[prop] = mCtor.prototype[prop]
            }
        }
    }

    return ctor
}

export function mixins(...mixins: any[]) {
    return function wrapper<T extends Class<{}>>(ctor: T) {
        const _class = class extends ctor {  }

        return apply(_class, ...mixins)
    }
}