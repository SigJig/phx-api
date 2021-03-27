
const { ids } = require('../const').players

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('phxhouses').del().truncate()
    .then(function () {
      // Inserts seed entries
      return knex('phxhouses').insert([
        {
          pid: ids[0],
          pos: "[10000, 0, 0]"
        },
        {
          pid: ids[0],
          pos: "[17000, 11000, 0]"
        },
        {
          pid: ids[1],
          pos: "[5000, 3000, 0]"
        }
      ]);
    });
};
