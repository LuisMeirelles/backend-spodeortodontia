
export const up = knex => {
    return knex.schema.createTable('sections', table => {
        table.string('id')
            .notNullable();

        table.integer('index')
            .unsigned()
            .notNullable();

        table.string('title')
            .notNullable();

        table.text('content')
            .notNullable();

        table.uuid('article_id')
            .notNullable();

        table.foreign('article_id')
            .references('id')
            .inTable('articles');

        table.primary([
            'id',
            'article_id'
        ]);
    });
};

export const down = knex => {
    return knex.schema.dropTable('sections');
};
