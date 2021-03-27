
const constants = require('../const');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('gangs').del().truncate()
    .then(function () {
      const players = constants.players.ids;
      // Inserts seed entries
      return knex('gangs').insert([
        {
          owner: players[0],
          name: 'Roleplay time',
          type: 'Gang'
        },
        {
          owner: players[1],
          name: 'Spaghettios',
          type: 'Mafia'
        },
        {
          owner: 'none',
          name: 'Ciudad Juárez Cartel',
          type: 'Cartel'
        }
      ]);
    });
};
