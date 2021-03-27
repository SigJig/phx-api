// entrypoint

import app from './app'
import logger from './logger'

const port = process.env.HTTP_PORT

app.listen(port, () => logger.info(`Listening on port ${port}, using environment: ${process.env.NODE_ENV}`))