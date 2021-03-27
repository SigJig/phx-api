
import { AnyObject } from '../types'

export const isAsync = (fnc: CallableFunction): boolean => fnc.constructor.name.toLowerCase() === 'asyncfunction'

export const isObject = (x: any) => x && typeof x === 'object' && !Array.isArray(x)
export const isArray = (x: any) => x && Array.isArray(x)

export function deepMerge(target: AnyObject<any>, source: AnyObject<any>) {
    
    for (const key in source) {
        const tarVal = target[key]
        const srcVal = source[key]

        if (isObject(srcVal)) {
            if (!isObject(tarVal))
                target[key] = srcVal
            else
                target[key] = {...tarVal, ...srcVal}
        }
        else if (isArray(srcVal)) {
            if (!isArray(tarVal))
                target[key] = srcVal
            else
                target[key] = [...tarVal, ...srcVal]
        }
        else {
            target[key] = source[key]
        }
    }

    return target
}

export function objectSort(obj: any) {
    return Object.keys(obj).sort().reduce((acc: any, cur: string) => {
       acc[cur] = obj[cur]
       
       return acc
    }, {})
}

export function arrWithout(arr: any[], ...items: any[]) {
    if (!(items && items.length)) return arr

    if (items.length === 1 && Array.isArray(items[0])) {
        items = items[0]
    }

    return arr.filter(x => items.indexOf(x) === -1)
}

export function strip(s: string) {
    return s.replace(/(^\s+|\s+$)/g, '')
}