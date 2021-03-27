
exports.up = async function(knex) {
  return knex.schema.createTable('phxstats_users', t => {
    t.increments('id').notNullable().primary().unsigned();
    t.integer('uid', 6).notNullable().references('uid').inTable('phxclients').onDelete('cascade');
    t.text('side');
    t.integer('kills', 11).notNullable().defaultTo(0);
    t.integer('deaths', 11).notNullable().defaultTo(0);
    t.integer('headshots', 11).notNullable().defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('phxstats_users');
};
