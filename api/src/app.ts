
import Express from 'express'
import Helmet from 'helmet'
import Morgan from 'morgan'
import Limiter from 'express-rate-limit'

import * as Auth from './lib/http/auth'
import Context from './lib/http/context'
import versionHandler from './lib/http/version'
import apiErrorHandler from './lib/http/errorhandler'
import APIConstants from './lib/constants/api'
import logger from './logger'

import Arma from './arma/router'
import Internal from './internal/router'
import Meta from './meta/router'

const app = Express()
const apiRouter = Express.Router()

app.use(Limiter(APIConstants.rateLimit))
app.use(Helmet())
app.use(Morgan('combined', { stream: {
    write(str: string): void {
        logger.http(str)
    }
} }))

apiRouter.use(Express.json())
apiRouter.use(Context.middleware)
apiRouter.use(versionHandler)
apiRouter.use(Auth.middleware)

apiRouter.use('/arma', Arma)
apiRouter.use('/internal', Internal)
apiRouter.use('/meta', Meta)

apiRouter.use(apiErrorHandler)

app.use('/api', apiRouter)

export default app