
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return Promise.all(
    [
      knex('iteminfo').del().truncate()
        .then(function () {
          // Inserts seed entries
          return knex('iteminfo').insert([
            {
              className: "U_I_C_Soldier_Bandit_4_F",
              friendlyName: "Bandit Clothes (Checkered)",
              price: 5100
            },
            {
                className: "U_I_C_Soldier_Bandit_2_F",
                friendlyName: "Bandit Clothes (Skull)",
                price: 5100
            },
            {
                className: "U_C_Man_casual_4_F",
                friendlyName: "Summer Clothes (Sky)",
                price: 200
            },
            {
                className: "U_C_Man_casual_5_F",
                friendlyName: "Summer Clothes (Yellow)",
                price: 200
            },
            {
                className: "U_C_Man_casual_6_F",
                friendlyName: "Summer Clothes (Red)",
                price: 200
            },
            {
                className: "U_C_Man_casual_2_F",
                friendlyName: "Casual Clothes (Blue)",
                price: 200
            },
            {
                className: "U_C_Man_casual_1_F",
                friendlyName: "Casual Clothes (Navy)",
                price: 200
            },
            {
                className: "U_C_man_sport_1_F",
                friendlyName: "Sport Clothes (Beach)",
                price: 225
            },
            {
                className: "U_C_man_sport_2_F",
                friendlyName: "Sport Clothes (Orange)",
                price: 200
            },
            {
                className: "U_C_man_sport_3_F",
                friendlyName: "Sport Clothes (Blue)",
                price: 225
            },
            {
                className: "U_C_Poloshirt_stripped",
                friendlyName: "Commoner Clothes (Striped)",
                price: 200
            },
            {
                className: "U_C_Poloshirt_redwhite",
                friendlyName: "Commoner Clothes (Red-White)",
                price: 200
            },
            {
                className: "U_C_Poloshirt_salmon",
                friendlyName: "Commoner Clothes (Salmon)",
                price: 200
            },
            {
                className: "U_C_Poloshirt_blue",
                friendlyName: "Commoner Clothes (Blue)",
                price: 200
            },
            {
                className: "U_C_Poor_2",
                friendlyName: "Worn Clothes",
                price: 250
            },
            {
                className: "U_C_Poloshirt_burgundy",
                friendlyName: "Commoner Clothes (Burgundy)",
                price: 200
            },
            {
                className: "U_C_Poloshirt_tricolour",
                friendlyName: "Commoner Clothes (Tricolor)",
                price: 200
            },
            {
                className: "U_BG_Guerrilla_6_1",
                friendlyName: "Guerilla Apparel",
                price: 250
            },
            {
                className: "U_C_IDAP_Man_cargo_F",
                friendlyName: "Aid Worker Clothes (Cargo) [IDAP]",
                price: 250
            },
            {
                className: "U_C_IDAP_Man_Jeans_F",
                friendlyName: "Aid Worker Clothes (Jeans) [IDAP]",
                price: 250
            },
            {
                className: "U_C_IDAP_Man_casual_F",
                friendlyName: "Aid Worker Clothes (Polo) [IDAP]",
                price: 250
            },
            {
                className: "U_C_IDAP_Man_shorts_F",
                friendlyName: "Aid Worker Clothes (Polo, Shorts) [IDAP]",
                price: 250
            },
            {
                className: "U_C_IDAP_Man_Tee_F",
                friendlyName: "Aid Worker Clothes (Tee) [IDAP]",
                price: 250
            },
            {
                className: "U_C_IDAP_Man_TeeShorts_F",
                friendlyName: "Aid Worker Clothes (Tee, Shorts) [IDAP]",
                price: 250
            },
            {
                className: "U_C_Mechanic_01_F",
                friendlyName: "Mechanic Clothes",
                price: 250
            },
            {
                className: "U_Competitor",
                friendlyName: "Competitor Suit",
                price: 250
            }
          ]);
        }),
      knex('infocars').del().truncate()
        .then(function () {
          knex('infocars').insert([
            {
              classname: 'C_SUV_01_F',
              buyPrice: 15000,
              sellPrice: 7500,
              storage: 75
            },
            {
              classname: 'B_LSV_01_unarmed_black_F',
              buyPrice: 300000,
              sellPrice: 150000,
              storage: 75
            },
            {
              classname: 'C_Tractor_01_F',
              buyPrice: 30000,
              sellPrice: 15000,
              storage: 20
            },
            {
              classname: 'I_Truck_02_transport_F',
              buyPrice: 500000,
              sellPrice: 250000,
              storage: 750
            },
            {
              classname: 'O_Truck_03_transport_F',
              buyPrice: 500000,
              sellPrice: 250000,
              storage: 750
            }
          ])
        })
    ]
  );
};
