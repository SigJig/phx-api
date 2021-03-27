
import { simpleDbRoute, SimpleController } from '../../lib/http/controller'
import { auth, Token } from '../../lib/http/auth'
import { poppy, mappy } from '../../lib/utils/proxies'
import APIDB, { Tokens as TokensTable, Users } from '../../database/api'
import Context from '../../lib/http/context'
import TokensRsc from '../resources/tokens'

class Tokens extends SimpleController {

    @auth('internal_perms', 'create')
    async create(ctx: Context) {
        // TODO: Do this properly lmfao
        let body = ctx.req.body

        const user_id: any = APIDB.raw('?', [(await Token.fetch(this.getTokenId(ctx))).user_id])
        const name: any = body.name ? APIDB.raw('?', [poppy(body).name]) : ''

        const token = await Token.create(user_id, name, body)

        ctx.add(token.export()).status('created')
    }

    @auth('internal_perms', 'edit')
    @simpleDbRoute(TokensRsc, {single: true})
    async update(ctx: Context, rsc: TokensRsc) {
        const { identifier } = ctx.req.params

        const prepped = TokensTable.conn.raw('?', [identifier])

        await TokensTable.getTableConn().update(ctx.req.body) // TODO: Validate ctx.req.body
                                .where(TokensTable.column('id'), prepped)

        return await rsc.findOrFail('id', identifier).fetch()
    }

    @auth()
    @simpleDbRoute(TokensRsc, {single: true})
    async showMe(ctx: Context, rsc: TokensRsc) {
        return await rsc.findOrFail('id', this.getTokenId(ctx)).fetch()
    }

    protected getTokenId(ctx: Context) {
        return (ctx.req.token as Token).data.id!
    }

}

export default new Tokens(TokensRsc)
