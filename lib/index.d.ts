
import * as Knex from 'knex';

export type DBType = 'api' | 'arma';

export function loadEnv(): void;
export function knexConfig(db: DBType, filepath?: string): Knex.Config;