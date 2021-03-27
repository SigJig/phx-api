

import { SimpleController, simpleDbRoute } from '../../lib/http/controller'
import Context from '../../lib/http/context'
import encrypt, { compare } from '../../lib/encrypt'

import UsersRsc from '../resources/users'
import TokensRsc from '../resources/tokens'

import { Users } from '../../database/api'
import { Token, auth } from '../../lib/http/auth'
import { mappy } from '../../lib/utils/proxies'
import { BadRequest, APIError, InvalidLogin } from '../../lib/http/errorhandler'

// Args should be prepared before calling
function fetchUser(username: any, email: any) {
    return Users.getTableConn().select(Users.column('id', true))
        .where(Users.column('name'), username)
        .orWhere(Users.column('email'), email)
        .first()
}

function verifyFields(obj: any) {
    return mappy(obj, function (val: string, f: string) {
        if (val === undefined) {
            throw new BadRequest(`Missing ${f}`)
        }

        return val
    }) 
}

class UsersController extends SimpleController {

    @auth('internal_perms', 'create')
    async create(ctx: Context) {
        // TODO: Require email authentication
        let { username, email, password } = verifyFields(ctx.req.body)

        username = Users.conn.raw('?', [username]), email = Users.conn.raw('?', [email])

        const existing = await fetchUser(username, email)

        if (existing !== undefined) {
            throw new APIError('Resource already exists', 'conflict')
        }

        const [ id ] = await Users.getTableConn().insert(Users.columnsMap({
            email,
            name: username,
            password: encrypt(password)
        }))

        ctx.status('created').add({id})
    }

    @auth('internal_perms', 'basic')
    async login(ctx: Context) {
        let { username, password } = verifyFields(ctx.req.body)

        const user = await Users.getTableConn()
                            .select(['id', 'name', 'password'].map(x => Users.column(x, true)))
                            .where(Users.column('name'), username)
                            .first()

        if (user === undefined || !compare(password, user.password)) {
            throw new InvalidLogin()
        }

        const token = await Token.create(user.id, '', { internal_perms: ['basic', 'create'] })

        return token.export()
    }

    @auth()
    @simpleDbRoute(UsersRsc, {single: true})
    async showMe(ctx: Context, rsc: UsersRsc) {
        return await rsc.findOrFail('id', this.userIdFromToken(ctx)).fetch()
    }

    @auth()
    @simpleDbRoute(TokensRsc)
    async myTokens(ctx: Context, rsc: TokensRsc) {
        const tokenId = this.userIdFromToken(ctx)

        // Fetch the user to make sure that it actually exists
        await new UsersRsc({select: ['id'], search: {'id': tokenId}}, ctx, {single: true}).fetch()

        rsc.qb.where(rsc.table.column('user_id'), tokenId)

        return await rsc.fetch()
    }

    protected userIdFromToken(ctx: Context) {
        return (ctx.req.token as Token).data.user_id!
    }

}

export default new UsersController(UsersRsc)