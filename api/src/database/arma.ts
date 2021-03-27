
import Knex from 'knex'
import KnexConns, { Connections } from './index'
import Table from '../lib/db/table'

const { arma }: Connections = KnexConns

export abstract class ArmaTable extends Table {
    static conn = arma
}

export class Players extends ArmaTable {
    static dbName = 'phxclients'
    static fields = {
        id: 'uid',
        name: 'name',
        aliases: 'aliases',
        steamid: 'playerid',
        gangid: 'gangid',
        cardid: 'cardid',
        cash: 'cash',
        bank: 'bankacc',
        gang_level: 'ganglevel',
        admin_level: 'adminlevel',
        west_level: 'coplevel',
        west_air_level: 'npaslevel',
        west_road_level: 'tpulevel',
        west_specops_level: 'ctulevel',
        west_undercover_level: 'mi5level',
        west_academy_level: 'academylevel',
        west_protection_level: 'isSO1',
        east_level: 'havoclevel',
        east_air_level: 'hadlevel',
        east_specops_level: 'hsflevel',
        east_marine_level: 'hmulevel',
        east_undercover_level: 'hsslevel',
        indep_level: 'mediclevel',
        indep_rescue_level: 'sarlevel',
        donator_level: 'donatorLevel',
        prestige_level: 'prestigeLevel',
        civ_licenses: 'civ_licenses',
        west_licenses: 'cop_licenses',
        indep_licenses: 'med_licenses',
        east_licenses: 'hav_licenses',
        civ_professions: 'civ_professions',
        west_professions: 'cop_professions',
        indep_professions: 'med_professions',
        east_professions: 'hav_professions',
        civ_gear: 'civ_gear',
        west_gear: 'cop_gear',
        indep_gear: 'med_gear',
        east_gear: 'hav_gear',
        west_undercover_gear: 'mi5_gear',
        east_undercover_gear: 'hss_gear',
        west_protection_gear: 'so1_gear',
        new_gear: 'new_gear',
        law_gear: 'law_gear',
        tax_gear: 'tax_gear',
        ser_gear: 'ser_gear',
        civ_stats: 'civ_stats',
        west_stats: 'cop_stats',
        indep_stats: 'med_stats',
        east_stats: 'hav_stats',
        west_perks: 'cop_perks',
        indep_perks: 'med_perks',
        civ_perks: 'civ_perks',
        east_perks: 'hav_perks',
        achievements: 'achievements',
        level: 'level',
        xp: 'xp',
        civ_arrested: 'arrested',
        civ_jail_time: 'jail_time',
        east_arrested: 'hav_arrested',
        east_jail_time: 'hav_jail_time',
        west_blacklist: 'blacklist',
        east_blacklist: 'hav_blacklist',
        loy_days: 'loy_days',
        loy_rewards: 'loy_rewards',
        loy_last: 'loy_last',
        last_seen: 'last_seen',
        last_west_seen: 'lastcopseen',
        last_indep_seen: 'lastnhsseen',
        last_east_seen: 'lasthavocseen',
        last_civ_seen: 'lastcivseen',
        playtime: 'playtime',
        created_at: 'insert_time'
    } as const
}

export class Gangs extends ArmaTable {
    static dbName = 'gangs'
    static fields = {
        id: 'id',
        owner: 'owner',
        type: 'type',
        name: 'name',
        tag: 'tag',
        maxmembers: 'maxmembers',
        bank: 'bank',
        is_active: 'active',
        created_at: 'insert_time',
    } as const
}

export class Deaths extends ArmaTable {
    static dbName = 'deathgear'
    static fields = {
        id: 'id',
        steamid: 'playerid',
        side: 'side',
        gear: 'gear',
        created_at: 'timestamp'
    } as const
}

export class Alliances extends ArmaTable {
    static dbName = 'phxalliances'
    static fields = {
        id: 'id',
        requesting_gang: 'gangID',
        recieving_gang: 'allyID',
        is_active: 'active',
        created_at: 'ally_since'
    } as const
}

export class Vehicles extends ArmaTable {
    static dbName = 'phxcars'
    static fields = {
        id: 'id',
        side: 'side',
        classname: 'classname',
        type: 'type',
        steamid: 'pid',
        is_alive: 'alive',
        blacklist: 'blacklist',
        is_active: 'active',
        plate: 'plate',
        color: 'color',
        RGB: 'RGB',
        inventory: 'inventory',
        gear: 'gear',
        fuel: 'fuel',
        damage: 'damage',
        is_dead: 'dead',
        created_at: 'insert_time'
    } as const
}

export class Properties extends ArmaTable {
    static dbName = 'phxhouses'
    static fields = {
        id: 'id',
        steamid: 'pid',
        pos: 'pos',
        world: 'world',
        is_owned: 'owned',
        is_gang_owned: 'gang',
        is_garage: 'garage',
        created_at: 'insert_time'
    } as const
}

export class IDCards extends ArmaTable {
    static dbName = 'phxids'
    static fields = {
        id: 'id',
        steamid: 'playerid',
        player: 'uid',
        name: 'realname',
        age: 'age',
        gender: 'gender',
        ethnicity: 'ethnicity',
        is_fake: 'isFake',
        is_active: 'active'
    } as const
}

export class Warrants extends ArmaTable {
    static dbName = 'wanted'
    static fields = {
        id: 'wantedID',
        name: 'wantedName',
        crimes: 'wantedCrimes',
        bounty: 'wantedBounty',
        remove: 'removeWanted',
        is_active: 'active',
        created_at: 'insert_time'
    } as const
}

export class VehiclesMeta extends ArmaTable {
    static dbName = 'infocars'
    static fields = {
        id: 'id',
        classname: 'classname',
        buy_price: 'buyPrice',
        sell_price: 'sellPrice',
        capacity: 'storage'
    } as const
}

export class ItemsMeta extends ArmaTable {
    static dbName = 'iteminfo'
    static fields = {
        id: 'id',
        classname: 'classname',
        title: 'friendlyName',
        buy_price: 'price'
    } as const
}

export class CombatStats extends ArmaTable {
    static dbName = 'phxstats_users'
    static fields = {
        id: 'id',
        player: 'uid',
        side: 'side',
        kills: 'kills',
        deaths: 'deaths',
        headshots: 'headshots'
    }
}

export default arma