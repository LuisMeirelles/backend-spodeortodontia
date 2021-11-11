
export const up = knex => {
    return knex.schema.createTable('articles', table => {
        table.uuid('id')
            .defaultTo(knex.raw('(UUID())'))
            .primary();

        table.string('title')
            .notNullable();

        table.text('description').notNullable();
    });
};

export const down = knex => {
    return knex.schema.dropTable('articles');
};
