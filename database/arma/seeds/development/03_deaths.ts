
import * as Knex from 'knex'

const sides = ['west', 'east', 'independent', 'civilian']

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    const players = await knex('phxclients').select('playerid').limit(15).orderByRaw('RAND()')

    return knex('deathgear').del()
        .then(() => {
            // Inserts seed entries
            return knex('deathgear').insert(
                [...Array(15).keys()].map(_ => ({
                    playerid: players[Math.floor(Math.random() * players.length)].playerid,
                    side: sides[Math.floor(Math.random() * sides.length)],
                    gear: '"[]"'
                }))
            )
        })
}