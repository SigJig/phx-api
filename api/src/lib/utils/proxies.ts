
/**
 * Proxy that deletes the property after it has been read.
 */
export function poppy(obj: object) {
    return new Proxy(obj as object, {
        get(t: any, v: any, r: any) {
            const prop = Reflect.get(t, v, r)
            Reflect.deleteProperty(t, v)

            return prop
        }
    })
}

export function mappy(obj: object, callback: CallableFunction) {
    return new Proxy(obj, {
        get(t: any, v: string, r: any) {
            const prop = Reflect.get(t, v, r)

            return callback(prop, v)
        }
    })
}