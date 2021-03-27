
import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return await Promise.all([
        knex('iteminfo').del().then(() => {
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
            ])
        }),
        knex('infocars').del().then(() => {
            const vehicles = ['C_SUV_01_F', 'B_LSV_01_unarmed_black_F', 'C_Tractor_01_F', 'I_Truck_02_transport_F', 'O_Truck_03_transport_F']

            return knex('infocars').insert(
                [...Array(vehicles.length).keys()].map(() => {
                    const price = Math.floor(Math.random() * 1e6)

                    return {
                        classname: vehicles.pop(),
                        buyPrice: price,
                        sellPrice: price / 2,
                        storage: Math.floor(Math.random() * 1000)
                    } 
                })
            )
        })
    ])
}
