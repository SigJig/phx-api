
import APIDB from '../../src/database/api'
import ArmaDB from '../../src/database/arma'

export async function resetAPI(this: Mocha.Context) {
    await APIDB.migrate.rollback()
    await APIDB.migrate.latest()
    
    return await APIDB.seed.run()
}

export async function resetArma(this: Mocha.Context) {
    await ArmaDB.migrate.rollback()
    await ArmaDB.migrate.latest()
    
    return await ArmaDB.seed.run()
}

export default async function setup(this: Mocha.Context) {
    await resetArma.call(this)
    return resetAPI.call(this)
}