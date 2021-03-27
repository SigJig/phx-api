
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.transaction(trx => {
        const queries = [
          {
            uid: 0,
            gangid: 2
          }
        ].map(({uid, gangid}) => knex('phxclients').where('uid', uid).update({gangid}).transacting(trx))

        Promise.all(queries).then(trx.commit).catch(trx.rollback)
      });
};
