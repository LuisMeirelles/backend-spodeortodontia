export const up = knex => {
    return knex.schema.createTable('articles', table => {
        table.uuid('id')
            .primary();

        table.string('title')
            .notNullable();

        table.text('description')
            .notNullable();

        table.datetime('created_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            .notNullable();

        table.datetime('updated_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
            .notNullable();
    });
};

export const down = knex => {
    return knex.schema.dropTable('articles');
};
