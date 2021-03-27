
import Winston, { transports } from 'winston'

const { NODE_ENV = 'production' } = process.env

const level = ({
    development: 'debug',
    production: 'http',
    test: 'info'
} as any)[NODE_ENV]

const logger = Winston.createLogger({
    level: level,
    transports: [
        new transports.Console()
    ]
})

export default logger