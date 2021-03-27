
import 'mocha'

import { resetAPI } from './utils/dbreset'
import { authHeader } from './utils/auth'
import Chai, { request, statusCheck, ArmaRouter } from './utils/server'

const defaultTestRoute = new ArmaRouter('players').route()

const createRequest = () => request.head(defaultTestRoute)

before(resetAPI)

describe('authentication', () => {
    it('should fail without a token supplied', statusCheck(createRequest(), 'unauthorized', false))
    it('should fail with an invalid token', statusCheck(createRequest().set(authHeader('invalid')), 'unauthorized', false))

    it('should pass with a valid token', statusCheck(createRequest(), 'success'))
})