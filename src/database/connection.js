import knex from 'knex';
import knexfile from '../../knexfile.js';

const config = !process.env.NODE_ENV
    ? knexfile.development
    : knexfile.production;

export default knex(config);
