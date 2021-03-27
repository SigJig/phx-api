
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('phxstats_users').del()
    .then(async function () {
      const players = await knex('phxclients').select('uid').limit(25);
      // Inserts seed entries

      function getRand(by=1000) {
        return Math.floor(Math.random() * by);
      };

      const sides = ['CIVILIAN', 'INDEPENDENT', 'EAST', 'WEST'];
      return knex('phxstats_users').insert(
          [...Array(10).keys()].map(() => {
            const uid = players.pop().uid;
            const side = sides[Math.floor(Math.random() * sides.length)];

            return {
              side: side,
              uid: uid,
              kills: getRand(),
              deaths: getRand(),
              headShots: getRand(100)
            };
          }, [])
        );
    });
};
