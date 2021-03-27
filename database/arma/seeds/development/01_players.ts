
import * as Knex from 'knex'
import { numStr } from '../../../utils/helpers'

const basic = {
    cop_licenses: '[]',
    med_licenses: '[]',
    civ_licenses: '[]',
    civ_gear: '[]',
    cop_gear: '[]',
    med_gear: '[]',
    civ_professions: '[]',
    cop_professions: '[]',
    med_professions: '[]',
    cop_perks: '[]',
    civ_perks: '[]',
    med_perks: '[]',
    hav_perks: '[]',
    hav_licenses: '[]',
    hav_gear: '[]',
    hav_professions: '[]',
    mi5_gear: '[]',
    hss_gear: '[]',
    new_gear: '[]',
    law_gear: '[]',
    tax_gear: '[]',
    ser_gear: '[]',
    achievements: '[]',
    so1_gear: '[]',
    loy_rewards: '[]',
    loy_last: new Date()
}

const names = [
    'Liam', 'Noah', 'William', 'James', 'Oliver', 'Benjamin', 'Elijah', 'Lucas', 'Mason', 'Logan',
    'Alexander', 'Ethan', 'Jacob', 'Michael', 'Daniel', 'Henry', 'Jackson', 'Sebastian', 'Aiden',
    'Matthew', 'Samuel', 'David', 'Joseph', 'Carter', 'Owen', 'Wyatt', 'John', 'Jack', 'Luke', 'Jayden',
    'Dylan', 'Grayson', 'Levi', 'Isaac', 'Gabriel', 'Julian', 'Mateo', 'Anthony', 'Jaxon', 'Lincoln',
    'Joshua', 'Christopher', 'Andrew', 'Theodore', 'Caleb', 'Ryan', 'Asher', 'Nathan', 'Thomas', 'Leo'
]
  
const lastNames = [
    'SHEA', 'ROUSE', 'HARTLEY', 'MAYFIELD', 'ELDER', 'RANKIN', 'HANNA', 'COWAN', 'LUCERO', 'ARROYO',
    'SLAUGHTER', 'HAAS', 'OCONNELL', 'MINOR', 'KENDRICK', 'SHIRLEY', 'KENDALL', 'BOUCHER', 'ARCHER',
    'BOGGS', 'ODELL', 'DOUGHERTY', 'ANDERSEN', 'NEWELL', 'CROWE', 'WANG', 'FRIEDMAN', 'BLAND', 'SWAIN',
    'HOLLEY', 'FELIX', 'PEARCE', 'CHILDS', 'YARBROUGH', 'GALVAN', 'PROCTOR', 'MEEKS', 'LOZANO', 'MORA',
    'RANGEL', 'BACON', 'VILLANUEVA', 'SCHAEFER', 'ROSADO', 'HELMS', 'BOYCE', 'GOSS', 'STINSON', 'SMART',
    'LAKE', 'IBARRA', 'HUTCHINS', 'COVINGTON', 'REYNA', 'GREGG', 'WERNER', 'CROWLEY', 'HATCHER',
    'MACKEY', 'BUNCH', 'WOMACK', 'POLK', 'JAMISON', 'DODD', 'CHILDRESS', 'CHILDERS', 'CAMP', 'VILLA', 'DYE', 'SPRINGER', 
].map(x => x.toLowerCase()).map(x => `${x[0].toUpperCase()}${x.slice(1)}`)

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex('phxclients').del()
        .then(() => {
            // Inserts seed entries
            return knex('phxclients').insert(
                [...Array(25).keys()].map(x => {
                    const name = `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
                  
                    return {...basic, ...{
                        playerid: numStr(17),
                        name: name,
                        cash: 10000,
                        bankacc: 20000,
                        aliases: `["${name}"]`
                    }}
                })
            )
        })
}
