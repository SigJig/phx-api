
import * as Auth from '../../src/lib/http/auth'

export function authHeader(token: string) {
    return {Authorization: `Bearer ${token}`}
}

export function createToken(options?: object): Promise<Auth.Token> {
    return Auth.Token.create(1, 'test_token', options)
}

export async function authenticated(r: any, options?: object) {
    const { jwt } = await createToken(options)

    return await r.set(authHeader(jwt))
}