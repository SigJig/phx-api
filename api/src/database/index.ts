
import Knex from 'knex'
import { knexConfig, DBType } from 'phoenix-api-lib'

const config = knexConfig

export type Connections = {[P in DBType]: Knex}

const connections: Connections = {
    arma: Knex(config('arma')),
    api: Knex(config('api'))
}

export default connections