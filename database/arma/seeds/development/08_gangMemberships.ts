
import * as Knex from 'knex'

let relations: Array<[number, number]> = []

export async function seed(knex: Knex): Promise<any> {
    const players = await knex('phxclients').select('uid').limit(20).orderByRaw('RAND()')
    const gangs = await knex('gangs').select('id').limit(7).orderByRaw('RAND()')

    await knex.transaction(async (trx) => {
        const queries: Knex.QueryBuilder<any, any>[] = players.map(({uid}) => {
            return knex('phxclients')
                          .where('uid', uid)
                          .update({'gangid': gangs[Math.floor(Math.random() * gangs.length)].id})
                          .transacting(trx)
        })

        
        try {
            const qbs = await Promise.all(queries)

            return trx.commit(qbs)
        }
        catch (e) {
            return trx.rollback(e)
        }
    })
};
