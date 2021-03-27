
import * as Knex from 'knex'

let names = [
    'Emma',
    'Olivia',
    'Ava',
    'Isabella',
    'Sophia',
    'Charlotte',
    'Mia',
    'Amelia',
    'Harper',
    'Evelyn',
    'Abigail',
    'Emily',
    'Elizabeth',
    'Mila',
    'Ella',
    'Avery',
    'Sofia',
    'Camila',
    'Aria',
    'Scarlett',
    'Victoria',
    'Madison',
    'Luna',
    'Grace',
    'Chloe',
    'Penelope',
    'Layla',
    'Riley',
    'Zoey',
    'Nora',
    'Lily',
    'Eleanor',
    'Hannah',
    'Lillian',
    'Addison',
    'Aubrey',
    'Ellie',
    'Stella',
    'Natalie',
    'Zoe',
    'Leah',
    'Hazel',
    'Violet',
    'Aurora',
    'Savannah',
    'Audrey',
    'Brooklyn',
    'Bella',
    'Claire',
    'Skylar',
]

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(() => {
            // Inserts seed entries
            return knex('users').insert(
                [...Array(25).keys()].map(_ => {
                    const name = names.pop()
        
                    return {
                        name: name,
                        email: `${name}@gmail.com`,
                        password: [...Array(Math.floor(Math.random() * 16 + 4))].reduce((s, x) => s + Math.floor(Math.random() * 10).toString(), '')
                    }
                })
            )
        })
}
