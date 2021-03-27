
import Resource from '../../lib/http/resource'
import { Gangs } from '../../database/arma'
import { arrWithout } from '../../lib/utils/helpers'

export default class GangsResource extends Resource {
    get table() { return Gangs }
    get fields(): Array<keyof typeof Gangs.fields> {
        return arrWithout(Object.keys(Gangs.fields), [
            // Add blacklist here
        ])
    }
}