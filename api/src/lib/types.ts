
export type OptionalParamCallable<T> = (...rest: any[]) => T

export type AnyObject<T> = {
    [k: string]: T
}

export type StringArrObject = AnyObject<string[]>

export type Class<T> = new (...rest: any[]) => T