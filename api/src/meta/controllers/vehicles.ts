
import { simpleDbRoute, SimpleController, Mixin } from '../../lib/http/controller'
import { idOrClassName } from '../utils'
import VehiclesRsc from '../resources/vehicles'
import Context from '../../lib/http/context'
    
class Vehicles extends SimpleController {
    static mixins = ['index'] as Mixin[]

    @simpleDbRoute(VehiclesRsc, {single: true})
    async show(ctx: Context, rsc: VehiclesRsc) {
        rsc.findOrFail.apply(rsc, idOrClassName(ctx.req.params.identifier))

        return await rsc.fetch()
    }
}
    
export default new Vehicles(VehiclesRsc)
