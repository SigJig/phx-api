
const constants = require('../const');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('deathgear').del().truncate()
    .then(function () {
      const { ids } = constants.players
      // Inserts seed entries
      return knex('deathgear').insert([
        {
          playerid: ids[0],
          side: 'west',
          gear: '"[]"'
        },
        {
          playerid: ids[0],
          side: 'civilian',
          gear: '"[]"'
        },
        {
          playerid: ids[0],
          side: 'independent',
          gear: '"[]"'
        },
        {
          playerid: ids[1],
          side: 'east',
          gear: '"[]"'
        },
        {
          playerid: ids[1],
          side: 'civilian',
          gear: '"[]"'
        }
      ]);
    });
};
