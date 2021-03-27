
import { Router, Request, Response, NextFunction } from 'express'
import { InvalidToken } from '../lib/http/auth'
import { Forbidden } from '../lib/http/errorhandler'

import Users from './controllers/users'
import Tokens from './controllers/tokens'

const router = Router()

router.route('/users')
    .get(Users.route('index')) // TODO: Remove this endpoint
    .post(Users.route('create'))

router.post('/users/login', Users.route('login'))

router.get('/users/me', Users.route('showMe'))
router.get('/users/me/tokens', Users.route('myTokens'))

router.post('/tokens', Tokens.route('create'))
router.route('/tokens/:identifier')
    .patch(Tokens.route('update'))

router.get('/tokens/me', Tokens.route('showMe'))


export default router