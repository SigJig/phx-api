
import * as Knex from 'knex'
import { arrIsEq } from '../../../utils/helpers'

export async function seed(knex: Knex): Promise<any> {
    const gangs = await knex('gangs').select('id').limit(15)
    let used: [number, number][] = []

    function getPair() {
        const rand = () => gangs[Math.floor(Math.random() * gangs.length)].id
        let pair: [number, number]
    
        do {
          pair = [rand(), rand()]
        } while (pair[0] === pair[1] || used.findIndex(x => (
          arrIsEq(pair, x) || arrIsEq(pair.reverse(), x)
        )) > -1);
    
        const [ gangID, allyID ] = pair;
    
        return { gangID, allyID }
    }

    // Deletes ALL existing entries
    return knex('phxalliances').del()
        .then(() => {
            // Inserts seed entries
            return knex('phxalliances').insert(
                [...Array(5).keys()].map(getPair)
            );
        });
};