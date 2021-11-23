import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import database from '../database/connection.js';

import jwt from '../utils/jwtUtils.js';

export default {
    async store(req, res) {
        const {
            name,
            email,
            username,
            password: rawPassword
        } = req.body;

        const nameRegex = /^[A-Z][a-z]+\s([A-Za-z][a-z]+\s?)+$/;
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const usernameRegex = /^([A-Za-z\d][^_])[A-Za-z\d._-]{3,18}[A-Za-z\d]$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?^&-])[A-Za-z\d#?!@$%^&*-]{8,}$/;

        if (!nameRegex.test(name)) {
            return res.status(400)
                .json({
                    message: 'Nome inválido.'
                });
        }

        if (!emailRegex.test(email)) {
            return res.status(400)
                .json({
                    message: 'Email inválido.'
                });
        }

        if (!usernameRegex.test(username)) {
            return res.status(400)
                .json({
                    message: 'Nome de usuário inválido.'
                });
        }

        if (!passwordRegex.test(rawPassword)) {
            return res.status(400)
                .json({
                    message: 'Senha inválida.'
                });
        }

        const id = uuidv4();
        const password = bcrypt.hashSync(rawPassword, 10);

        try {
            await database('users')
                .insert({
                    id,
                    name,
                    email,
                    username,
                    password
                });

            const token = jwt.sign({ userId: id });

            res.status(201)
                .json({
                    message: 'Usuário adicionado com sucesso.',
                    token
                });
        } catch (error) {
            console.error(error);

            if (error.code === 'ER_DUP_ENTRY') {
                const columnName = error.sqlMessage.split('\'')[3]
                    .split('.')[1]
                    .split('_')
                    .slice(1, -1)
                    .join('_');

                const fieldName = columnName === 'username'
                    ? 'nome de usuário'
                    : columnName;

                return res.status(409)
                    .json({
                        message: `O ${fieldName} já existe.`
                    });
            }

            res.status(500)
                .json({
                    message: 'Ocorreu um erro ao inserir usuário no banco de dados.',
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
                    message: 'O limite de usuários por página deve ser maior que zero.'
                });
        }

        const offset = (currentPage - 1) * perPage;

        try {
            const users = await database('users')
                .select([
                    'id',
                    'name',
                    'email',
                    'username',
                    'is_admin'
                ])
                .offset(offset)
                .limit(perPage);

            if (!users[0]) {
                return res.status(404)
                    .json({
                        message: 'A página requisitada não existe.'
                    });
            }

            res.json({
                message: 'Usuários listados com sucesso.',
                users
            });
        } catch (error) {
            console.error(error);

            res.status(500)
                .json({
                    message: 'Ocorreu um erro ao listar usuários.',
                    error
                });
        }
    },

    async show(req, res) {
        const { id } = req.params;

        try {
            const user = await database('users')
                .select([
                    'id',
                    'name',
                    'email',
                    'username',
                    'is_admin'
                ])
                .where({ id })
                .first();

            if (!user) {
                return res.status(404)
                    .json({
                        message: 'Usuário não encontrado.'
                    });
            }

            res.status(200)
                .json({
                    message: 'Usuário encontrado',
                    user
                });
        } catch (error) {
            console.error(error);

            res.status(500)
                .json({
                    message: 'Ocorreu um erro ao buscar o usuário',
                    error
                });
        }
    }
};
