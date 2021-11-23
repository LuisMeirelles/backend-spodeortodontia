import database from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

export default {
    async store(req, res) {
        const { post } = req.body;
        const { userId } = req;

        if (!post) {
            return res.status(400)
                .json({
                    message: 'O post não pode estar vazio'
                });
        }

        const article_id = uuidv4();

        const [article, ...rawSections] = post.split('## ');

        const sections = rawSections.map((section, index) => {
            const [title, content] = section.split('\n\n');

            const id = title.toLowerCase().replace(/[^\wáéíóúàêõãâôç]/g, '-');

            return {
                id,
                index,
                title,
                content,
                article_id
            };
        });

        const [rawTitle, description] = article.split('\n\n');

        const title = rawTitle.replace('# ', '');

        const trx = await database.transaction();

        try {
            await trx('articles')
                .insert({
                    id: article_id,
                    title,
                    description,
                    user_id: userId
                });

            if (sections[0]) {
                await trx('sections')
                    .insert(sections);
            }

            trx.commit();

            res.status(201)
                .json({
                    message: 'Post adicionado com sucesso'
                });
        } catch (error) {
            trx.rollback();
            console.error(error);

            res.status(500)
                .json({
                    message: 'Ocorreu um erro ao inserir post no banco de dados',
                    error
                });
        }
    },

    async index(req, res) {
        const {
            limit,
            page
        } = req.query;

        const currentPage = parseInt(page || 1);

        if (currentPage <= 0) {
            return res.status(400)
                .json({
                    message: 'A página atual deve ser maior que zero.'
                });
        }

        const perPage = parseInt(limit || 10);

        if (perPage <= 0) {
            return res.status(400)
                .json({
                    message: 'O limite de posts por página deve ser maior que zero.'
                });
        }

        const offset = (currentPage - 1) * perPage;

        try {
            const posts = await database('articles')
                .offset(offset)
                .limit(perPage);

            if (!posts[0]) {
                return res.status(404)
                    .json({
                        message: 'A página requisitada não existe.'
                    });
            }

            res.json({
                message: 'Posts listados com sucesso.',
                posts
            });
        } catch (error) {
            console.error(error);

            res.status(500)
                .json({
                    message: 'Ocorreu um erro ao listar posts.',
                    error
                });
        }
    },

    async show(req, res) {
        const { id } = req.params;

        const trx = await database.transaction();

        try {
            const article = await trx('articles')
                .where({ id })
                .first();

            if (!article) {
                return res.status(404)
                    .json({
                        message: 'Post não encontrado'
                    });
            }

            const sections = await trx('sections')
                .where({ article_id: id })
                .orderBy('index')
                .select([
                    'id',
                    'title',
                    'content'
                ]);


            await trx.commit();

            res.status(200)
                .json({
                    message: 'Post encontrado',
                    post: {
                        ...article,
                        sections
                    }
                });
        } catch (error) {
            await trx.rollback();

            console.error(error);

            res.status(500)
                .json({
                    message: 'Ocorreu um erro ao buscar o usuário',
                    error
                });
        }
    }
};
