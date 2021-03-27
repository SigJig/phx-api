
const constants = require('../const');

const basic = {
    cop_licenses: '[]', med_licenses: '[]', civ_licenses: '[]', civ_gear: '[]', cop_gear: '[]', med_gear: '[]',
    civ_professions: '[]', cop_professions: '[]', med_professions: '[]', cop_perks: '[]', civ_perks: '[]',
    med_perks: '[]', hav_perks: '[]', hav_licenses: '[]', hav_gear: '[]', hav_professions: '[]', mi5_gear: '[]', hss_gear: '[]',
    new_gear: '[]', law_gear: '[]', tax_gear: '[]', ser_gear: '[]', achievements: '[]', so1_gear: '[]', loy_rewards: '[]',
    loy_last: new Date()
};

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('phxclients').del().truncate()
        .then(() => {
            const players = constants.players.ids;
            // Inserts seed entries
            const data = [
                {
                    playerid: players[0],
                    name: 'Player One',
                    cash: 200,
                    bankacc: 40000,
                    aliases: '"[]"'
                },
                {
                    playerid: players[1],
                    name: 'Player Two',
                    cash: 1000,
                    bankacc: 30000,
                    aliases: '"[]"'
                }
            ].map(x => ({...basic, ...x}));

            return knex('phxclients').insert(data);
        });
};
