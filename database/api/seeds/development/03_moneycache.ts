/**
 * Requries arma/01_players seed to be ran first.
 */

import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
    const armaKnex = Knex.default(require('../../../knexfile.arma'))

    // Deletes ALL existing entries
    const players = await armaKnex('phxclients')
                 .select('uid')
                 .orderByRaw('RAND()')
                 .limit(20)

    return await knex('moneycache').insert(players.reduce((acc, {uid}) => {
        return acc.concat([...Array(Math.floor(Math.random() * 40)).keys()].map(() => {
            return {
                player: uid,
                balance: (Math.random() * 5e6).toFixed(1)
            }
        }))
    }, []))
}
