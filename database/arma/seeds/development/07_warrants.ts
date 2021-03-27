
import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
    let players = await knex('phxclients')
                               .select('playerid', 'name')
                               .orderByRaw('RAND()')
                               .limit(40)

    // Deletes ALL existing entries
    return knex('wanted').del()
        .then(() => {
            // Inserts seed entries
            return knex('wanted').insert(
                [...Array(25).keys()].map(() => {
                    const player = players.pop()
          
                    return {
                        wantedID: player.playerid,
                        wantedName: player.name,
                        wantedCrimes: '"[]"',
                        wantedBounty: Math.floor(Math.random() * 250000)
                    }
                })
            )
        })
}