
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('phxalliances').del().truncate()
    .then(function () {
      // Inserts seed entries
      return knex('phxalliances').insert([
        {
          gangID: 1,
          allyID: 2
        },
        {
          gangID: 2,
          allyID: 3
        },
        {
          gangID: 3,
          allyID: 1
        }
      ]);
    });
};
