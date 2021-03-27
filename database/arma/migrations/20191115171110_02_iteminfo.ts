
import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable('iteminfo', (table) => {
        table.increments('id').notNullable().primary().unsigned(),
        table.string('classname', 50).notNullable(),
        table.string('friendlyName', 50).notNullable(),
        table.integer('price', 11).notNullable()
    })
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('iteminfo')
}
