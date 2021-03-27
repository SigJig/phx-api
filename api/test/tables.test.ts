
/**
 * Test our current database setup,
 * checking if the columns in our source code match the ones in our migrations
 */

import 'mocha'
import Chai, { expect } from 'chai'
import resetDB from './utils/dbreset'

before(resetDB)

import {
    Players,
    Gangs,
    Deaths,
    Alliances,
    Vehicles,
    Properties,
    IDCards,
    Warrants,
    VehiclesMeta,
    ItemsMeta
} from '../src/database/arma'

import { Users, Tokens, MoneyCache } from '../src/database/api'

async function testTables(tables: any[]) {
    return Promise.all(tables.map(async t => {
        const res: any = (
            (await t.conn.raw(`select * from information_schema.columns where table_name=?`, [t.dbName]))[0]
                  .map((x: any) => x.COLUMN_NAME)
        )
        
        it(`${t.name}.fields should match the columns in table \`${t.dbName}\``, () => {
            for (const f of Object.values(t.fields)) {
                expect(res.indexOf(f), `${f} does not exist in table`).to.be.above(-1)
            }
        })
    }))
}

function testWrapper(tables: any[]) {
    return function () {
        expect(async () => await testTables(tables)).to.not.throw()
    }
}

describe('API Database', testWrapper([Users, Tokens, MoneyCache]))
describe('Arma Database', testWrapper([
    Players,
    Gangs,
    Deaths,
    Alliances,
    Vehicles,
    Properties,
    IDCards,
    Warrants,
    VehiclesMeta,
    ItemsMeta
]))