
import Resource from '../../lib/http/resource'
import { Alliances } from '../../database/arma'
import { arrWithout } from '../../lib/utils/helpers'

export default class AlliancesRsc extends Resource {
    get table() { return Alliances }
    get fields(): Array<keyof typeof Alliances.fields> {
        return arrWithout(Object.keys(Alliances.fields), [
        
        ])
    }
}