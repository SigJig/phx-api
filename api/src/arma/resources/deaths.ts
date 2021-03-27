
import Resource from '../../lib/http/resource'
import { Deaths } from '../../database/arma'
import { arrWithout } from '../../lib/utils/helpers'

export default class DeathsResource extends Resource {
    get table() { return Deaths }
    get fields(): Array<keyof typeof Deaths.fields> {
        return arrWithout(Object.keys(Deaths.fields), [
        
        ])
    }
}