
import 'mocha'
import { expect } from 'chai'

import resetDB from './utils/dbreset'
import { whitelistFields } from '../src/arma/resources/players'
import { Router, ArmaRouter, InternalRouter, request, statusCheck, MetaRouter } from './utils/server'
import HTTP from '../src/lib/constants/http'
import { authHeader, authenticated } from './utils/auth'

interface SimpleRoutes {
    [P: string]: {
        authOpts?: any,
        router: Router,
        routes: Array<[string | string[], keyof typeof HTTP]>
    }
}

const constants = {
    players: {
        valid: '12345678901234567',
        invalid: '21784367826',
        subroutes: ['deaths', 'vehicles', 'properties', 'moneycache']
    }
}

before(resetDB)

const simple: SimpleRoutes = {
    gangs: {
        router: new ArmaRouter('gangs'),
        routes: [
            ['', 'success'],
            ['1', 'success'],
            ['9999', 'not_found'],
            [['1', 'alliances'], 'success'],
            [['9999', 'alliances'], 'not_found'],
            ['alliances', 'success'],
            [['alliances', '1'], 'success'],
            [['alliances', '9999'], 'not_found']
        ]
    },
    players: {
        router: new ArmaRouter('players'),
        routes: [
            ['', 'success'],
            ['1', 'success'],
            ['9999', 'not_found'],
            [constants.players.valid, 'success'],
            [constants.players.invalid, 'not_found'],
            ...constants.players.subroutes.map(x => ([['1', x], 'success'])) as any,
            ...constants.players.subroutes.map(x => ([['9999', x], 'not_found'])) as any,
            ['deaths', 'success'],
            [['deaths', '1'], 'success'],
            [['deaths', '9999'], 'not_found']
        ]
    },
    properties: {
        router: new ArmaRouter('properties'),
        routes: [
            ['', 'success'],
            ['1', 'success'],
            ['9999', 'not_found']
        ]
    },
    vehicles: {
        router: new ArmaRouter('vehicles'),
        routes: [
            ['', 'success'],
            ['1', 'success'],
            ['9999', 'not_found']
        ]
    },
    vehicles_meta: {
        router: new MetaRouter('vehicles'),
        routes: [
            ['', 'success'],
            ['1', 'success'],
            ['9999', 'not_found']
        ]
    },
    items_meta: {
        router: new MetaRouter('items'),
        routes: [
            ['', 'success'],
            ['1', 'success'],
            ['9999', 'not_found']
        ]
    },
    users_me: {
        router: new InternalRouter('users', 'me'),
        routes: [
            ['', 'success'],
            ['tokens', 'success']
        ]
    },
    tokens: {
        authOpts: {
            internal_perms: ['basic']
        },
        router: new InternalRouter('tokens'),
        routes: [
            ['1', 'success'],
            ['2', 'forbidden'], // does exist, but is not mine
            ['9999', 'forbidden'], // does not exist, return forbidden
            ['me', 'success']
        ]
    }
}

for (const [k, {authOpts, router, routes}] of Object.entries(simple)) {
    describe(`simple routes for '${k}'`, () => {
        for (const [_route, status] of routes) {

            const realRoute = router.route(...(typeof _route === 'object' && Array.isArray(_route) ? _route : [_route]) as string[])

            it(`should return ${status} on '${realRoute}'`, statusCheck(request.get(realRoute), status, true, authOpts!))
        }
    })
}

describe('player whitelisting', () => {
    const router = new ArmaRouter('players')

    for (const [key, fields] of Object.entries(whitelistFields)) {
        const obj = fields.reduce((acc: any, x: string) => {
            acc[x] = '1'

            return acc
        }, {})

        const r = (x: number) => request.patch(router.route(`/${x}`)).send(obj)

        it(`${key} whitelist should fail without the ${key} perm`, statusCheck(r(1), 'forbidden'))
        it(`${key} whitelist should pass with the ${key} perm`, statusCheck(
            r(2), 'success',
            true, {
                arma_perms: ['basic', key]
            }
        ))
    }
})

describe('internal routes', () => {
    const reqBody = {
        username: 'testguy',
        email: 'testingfella@gmail.com',
        password: 'r34lly5ecure'
    }
    let jwt: string | undefined = undefined

    describe('create user', () => {
        const router = new InternalRouter('users')
        const create = () => request.post(router.route()).send(reqBody)

        it('should succesfully create a user', async () => {
            const res = await create()

            res.status.should.equal(HTTP.created)
        })

        it('should return conflict because user already exists', async () => {
            const res = await create()

            res.status.should.equal(HTTP.conflict)
        })

        it('should return bad request on missing field', async () => {
            const res = await request.post(router.route()).send({username: 'uhh', email: 'one@gmail.com'})

            res.status.should.equal(HTTP.bad_request)
        })
    })

    describe('login', () => {
        const router = new InternalRouter('users', 'login')

        // Login with the previously created user
        it('should pass with valid credentials', async () => {
            const res = await request.post(router.route()).send(reqBody)

            res.status.should.equal(HTTP.success)
            jwt = res.body.results.jwt
        })

        it('should return bad request on incorrect credentials', async () => {
            const tmpBody = {...reqBody, password: 'iamverynotsecure'}
            const res = await request.post(router.route()).send(tmpBody)

            res.status.should.equal(HTTP.bad_request)
        })

        it('should return bad request on missing field', async () => {
            const tmpBody = {username: 'testguy'}
            const res = await request.post(router.route()).send(tmpBody)

            res.status.should.equal(HTTP.bad_request)
        })
    })

    describe('create token', () => {
        const router = new InternalRouter('tokens')

        it('should fail without a token', async () => {
            const res = await request.post(router.route())

            res.status.should.equal(HTTP.unauthorized)
        })

        it('should fail with invalid token', async () => {
            const res = await authenticated(request.post(router.route()))

            res.status.should.equal(HTTP.forbidden)
        })

        it('should succesfully create a token without a body', async () => {
            const res = await request.post(router.route()).set(authHeader(jwt!))

            res.status.should.equal(HTTP.created)
        })

        it('should succesfully create a token with a token name', async () => {
            const res = await request.post(router.route()).send({name: 'Testing token'}).set(authHeader(jwt!))
            
            res.status.should.equal(HTTP.created)
            res.body.results.data.name.should.equal('Testing token')
        })

        it('should succesfully create a token with specified perms', async () => {
            const res = await request.post(router.route()).send({arma_perms: ['edit_west']}).set(authHeader(jwt!))
            
            res.status.should.equal(HTTP.created)
            expect(!!res.body.arma_perms.edit_west).to.equal(true)
        })

    })
})