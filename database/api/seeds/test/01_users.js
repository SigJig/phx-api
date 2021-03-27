

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(() => {
            // Inserts seed entries
            return knex('users').insert([
                {
                    name: 'Donkey Fucker',
                    email: 'ilovedonkeys@sex.com',
                    password: '123456'
                },
                {
                    name: 'spawnthedeath',
                    email: 'imafuckingcunt@gmail.com',
                    password: 'abcdefg'
                },
                {
                    name: 'pew die pie',
                    email: 'trashyoutuber@trivago.com',
                    password: '123abc'
                }
            ]);
        });
};