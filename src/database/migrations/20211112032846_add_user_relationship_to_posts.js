export const up = knex => {
    return knex.schema.alterTable('articles', table => {
        table.uuid('user_id')
            .notNullable();

        table.foreign('user_id')
            .references('id')
            .inTable('users');
    });
};

export const down = knex => {
    return knex.schema.alterTable('articles', table => {
        table.dropForeign('user_id');
    });
};
