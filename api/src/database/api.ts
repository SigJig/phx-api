
import Knex from 'knex'
import Connections from './index'
import Table from '../lib/db/table'

const { api } = Connections

export class APITable extends Table {
    static conn: Knex = api
}

export class Users extends APITable {
    static dbName = 'users'
    static fields = {
        id: 'id',
        name: 'name',
        email: 'email',
        password: 'password',
        created_at: 'created_at'
    } as const
}

export class Tokens extends APITable {
    static dbName = 'tokens'
    static fields = {
        id: 'id',
        name: 'token_name',
        user_id: 'user_id',
        arma_perms: 'arma_perms',
        internal_perms: 'internal_perms',
        is_admin: 'is_admin',
        is_active: 'is_active',
        created_at: 'created_at',
        expires_at: 'expires_at'
    } as const
}

export class MoneyCache extends APITable {
    static dbName = 'moneycache'
    static fields = {
        id: 'id',
        player: 'player',
        balance: 'balance',
        inserted_at: 'inserted_at'
    } as const
}

export default api