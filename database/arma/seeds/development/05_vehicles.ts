
import * as Knex from 'knex'
import { numStr } from '../../../utils/helpers'

const sides = ['west', 'east', 'independent', 'civilian']

export async function seed(knex: Knex): Promise<any> {
    const players = await knex('phxclients').select('playerid').orderByRaw('RAND()').limit(20)

    // Deletes ALL existing entries
    return knex('phxcars').del()
        .then(() => {
            // Inserts seed entries
            return knex('phxcars').insert(
                [...Array(25).keys()].map(x => {
                    return {
                        classname: 'C_SUV_01_F',
                        type: 'car',
                        side: sides[Math.floor(Math.random() * sides.length)],
                        pid: players[Math.floor(Math.random() * players.length)].playerid,
                        plate: numStr(6),
                        color: 0,
                        inventory: '"[]"',
                        gear: '"[]"',
                        damage: Math.random()
                    }
                })
            )
        })
}