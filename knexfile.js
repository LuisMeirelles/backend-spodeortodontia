// Update with your config settings.

import path from 'path';

const migrations = {
    tableName: 'knex_migrations',
    directory: path.join(path.dirname('.'), 'src', 'database', 'migrations')
};

export default {

    development: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'spodeortodontia'
        },
        migrations
    },

    production: {
        client: 'mysql',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations
    }

};
