
import { strip } from './helpers'

export function formatSelects(selects: string | undefined) {
    if (!selects) return []
    
    const formatFields = (x: string[]) => x.filter(y => y).map(y => strip(y))
    
    let out: Array<[string, Array<string>] | string> = []
    
    selects = selects.replace(/(\w+)\[(\w+(,\s?\w+)*,?)\],?/g, function (full: string, name: string, fields: string) {
        out.push([strip(name), formatFields(fields.split(','))])

        return ''
    })

    return out.concat(formatFields(selects.split(',')))
}