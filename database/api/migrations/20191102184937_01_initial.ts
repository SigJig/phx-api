
import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable('users', table => {
        table.increments('id').unsigned().primary()
        table.string('name', 20).notNullable().unique()
        table.string('email').notNullable().unique()
        table.string('password').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })

    await knex.schema.createTable('tokens', table => {
        table.increments('id').unsigned().primary()
        table.string('token_name').notNullable()
        table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
        table.integer('arma_perms', 1).defaultTo(0)
        table.integer('internal_perms', 1).defaultTo(0) // use for the internal api. this is seperate from the standard api tokens
        table.boolean('is_admin').defaultTo(false)
        table.boolean('is_active').defaultTo(true) // allows to deactive tokens without deleting them
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('expires_at')
    })
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('tokens')
    await knex.schema.dropTable('users')
}

