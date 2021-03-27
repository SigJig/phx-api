
const [ player ] = require('../const').players.ids

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('wanted').del().truncate()
    .then(function () {
      // Inserts seed entries
      return knex('wanted').insert({
        wantedID: player,
        wantedName: 'Johnny Outlaw',
        wantedCrimes: '"[]"',
        wantedBounty: 115000
      });
    });
};
