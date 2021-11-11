
export const up = knex => {
    return knex.schema.createTable('sections', table => {
        table.increments('id')
            .primary();

        table.string('title')
            .notNullable();

        table.text('content')
            .notNullable();

        table.uuid('article_id')
            .notNullable();

        table.foreign('article_id')
            .references('id')
            .inTable('articles');
    });
};

export const down = knex => {
    return knex.schema.dropTable('sections');
};
