
import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable('moneycache', t => {
        t.increments('id').unsigned().primary()
        t.integer('player').unsigned().notNullable()
        t.bigInteger('balance').notNullable()
        t.timestamp('inserted_at').notNullable().defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('moneycache')
}

