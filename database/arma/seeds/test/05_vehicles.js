
const { ids } = require('../const').players

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('phxcars').del().truncate()
    .then(function () {
      function gen(player = 1, damage = 0.3, side = 'civilian') {
        return {
          classname: 'C_SUV_01_F',
          type: 'car',
          side: side,
          pid: ids[player],
          plate: [...Array(6).keys()].reduce(acc => acc + Math.floor(Math.random() * 10).toString(), ''),
          color: 0,
          inventory: '"[]"',
          gear: '"[]"',
          damage: damage
        }
      }
      // Inserts seed entries
      return knex('phxcars').insert(
        [
          [0],
          [0, 1, 'west'],
          [0, 0, 'civilian'],
          [1, 0, 'west'],
          [1, 0.5, 'independent']
        ].map(x => gen.apply(null, x))
      );
  });
};
