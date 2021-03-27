
import * as Knex from 'knex'

const words = [
    'lock',
    'cracker',
    'amusement',
    'previous',
    'frame',
    'ragged',
    'partner',
    'meal',
    'yielding',
    'rough',
    'cut',
    'pig',
    'sophisticated',
    'thrill',
    'pat',
    'innate',
    'loaf',
    'clear',
    'look',
    'utter',
    'expect',
    'rambunctious',
    'paddle',
    'trains',
    'agreement',
    'ill',
    'fated',
    'detailed',
    'popcorn',
    'circle',
    'scratch',
    'squeamish',
    'spiders',
    'harm',
    'cats',
    'adhesive',
    'stamp',
    'connect',
    'hate',
    'moor',
    'present',
    'serious',
    'knot',
    'recess',
    'embarrassed',
    'tedious',
    'waves',
    'part',
    'opposite',
    'ladybug',
    'rustic',
    'melt',
    'roomy',
    'alleged',
    'end',
    'beg',
    'responsible',
    'buzz',
    'far',
    'flung',
    'hypnotic',
    'rich',
    'instrument',
    'snotty',
    'shame',
    'complete',
    'grass',
    'succeed',
    'deliver',
    'punishment',
    'untidy',
    'accidental',
    'provide',
    'haunt',
    'ratty',
    'laugh',
    'employ',
    'horse',
    'tearful',
    'steer',
    'carry',
    'acceptable',
    'irritate',
    'horses',
    'pretend',
    'stupendous',
    'trashy',
    'reign',
    'crime',
    'exciting',
    'crow',
    'walk',
    'door',
    'statuesque',
    'desire',
    'fruit',
    'clean',
    'stranger',
    'word',
    'push',
    'swim',
    'sleepy'
]
  
const types = [
    'Gang',
    'Company',
    'Mafia',
    'Political Party',
    'Cartel'
]

function getName() {
    const word = words.pop()!
    return `The ${word[0].toUpperCase() + word.slice(1)}`
}


function getType() {
    return types[Math.floor(Math.random() * types.length)]
}

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex('gangs').del()
        .then(() => {
            // Inserts seed entries
            return knex('gangs').insert(
                [...Array(25).keys()].map(_ => {
  
                    return {
                        owner: 'none', // this should run independently, regardless of what is in the players table. we use another seed to create the relations
                        name: getName(),
                        type: getType()
                    };
                })
            )
        })
}