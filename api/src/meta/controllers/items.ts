
import { simpleDbRoute, SimpleController, Mixin } from '../../lib/http/controller'
import { idOrClassName } from '../utils'
import ItemsRsc from '../resources/items'
import Context from '../../lib/http/context'

class Items extends SimpleController {
    static mixins = ['index'] as Mixin[]

    @simpleDbRoute(ItemsRsc, {single: true})
    async show(ctx: Context, rsc: ItemsRsc) {
        rsc.findOrFail.apply(rsc, idOrClassName(ctx.req.params.identifier))

        return await rsc.fetch()
    }
}
    
export default new Items(ItemsRsc)
