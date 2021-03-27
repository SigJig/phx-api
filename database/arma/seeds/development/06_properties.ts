
import * as Knex from 'knex'

const genCoord = () => (Math.random() * 25000).toFixed(2)

export async function seed(knex: Knex): Promise<any> {
    const players = await knex('phxclients').select('playerid').orderByRaw('RAND()').limit(20)

    // Deletes ALL existing entries
    return knex('phxhouses').del()
        .then(() => {
            // Inserts seed entries
            return knex('phxhouses').insert(
                [...Array(25).keys()].map(() => ({
                    pid: players[Math.floor(Math.random() * players.length)].playerid,
                    pos: `"[${genCoord()}, ${genCoord()}, ${genCoord()}]"`
                }))
            )
        })
}