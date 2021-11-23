export const up = knex => {
    return knex.schema.createTable('users', table => {
        table.uuid('id')
            .primary();

        table.string('name')
            .notNullable();

        table.string('email')
            .unique()
            .notNullable();

        table.string('username')
            .unique()
            .notNullable();

        table.string('password', 60)
            .notNullable();

        table.boolean('is_admin')
            .defaultTo(false);
    });
};

export const down = knex => {
    return knex.schema.dropTable('users');
};
