
import * as Knex from 'knex'

const nouns = [
    'north',
    'babies',
    'crown',
    'representative',
    'expansion',
    'crowd',
    'magic',
    'writing',
    'steam',
    'flame',
    'popcorn',
    'drawer',
    'wax',
    'texture',
    'winter',
    'square',
    'sense',
    'creator',
    'sidewalk',
    'shirt',
    'muscle',
    'reason',
    'degree',
    'pickle'
]
  
const verbs = [
    'dysfunctional',
    'mushy',
    'uncovered',
    'melted',
    'zesty',
    'statuesque',
    'intelligent',
    'elderly',
    'sick',
    'ignorant',
    'thinkable',
    'apathetic',
    'six',
    'unable',
    'sturdy',
    'outrageous',
    'fantastic',
    'alluring',
    'glossy',
    'rabid',
    'white',
    'hilarious',
    'medical',
    'didactic',
    'relieved'
]
  
let used = new Set()
  
export async function seed(knex: Knex): Promise<any> {
    function getPhrase() {
        const _get = () => `${verbs[Math.floor(Math.random() * verbs.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`
    
        let phrase = _get()
    
        while (used.has(phrase)) {
            phrase = _get()
        };
    
        used.add(phrase)
    
        return phrase
    };

    const users = await knex('users').select('id').orderByRaw('RAND()').limit(20)

    function genToken() {
        return {
            user_id: users[Math.floor(Math.random() * users.length)].id,
            token_name: getPhrase()
        }
    }

    // Deletes ALL existing entries
    return knex('tokens').del().truncate()
        .then(() => {
            // Inserts seed entries
            return knex('tokens').insert([
                {
                    ...genToken(),
                    internal_perms: 0xFF // Master token, created with id 1
                },
                ...[...Array(15).keys()].map(genToken)
            ])
        })
}
