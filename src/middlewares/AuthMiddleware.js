import jwt from '../utils/jwtUtils.js';

export default {
    async auth(req, res, next) {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401)
                .json({
                    message: 'O token deve ser fornecido.'
                });
        }

        const token = authorization.replace('Bearer ', '');

        if (authorization === token) {
            return res.status(401)
                .set({
                    'WWW-Authenticate': 'Basic realm="Acesso a edição de recursos", charset="UTF-8"'
                })
                .json({
                    message: 'O tipo de token fornecido é inválido.'
                });
        }

        try {
            const tokenData = jwt.verify(token);

            req.userId = tokenData.userId;
            next();
        } catch (error) {
            console.error(error);

            const { message } = error;

            if (message === 'jwt malformed') {
                return res.status(401)
                    .json({
                        message: 'Token mal formatado.',
                        error
                    });
            }

            if (message === 'jwt expired') {
                return res.status(401)
                    .json({
                        message: 'Token expirado.',
                        error
                    });
            }
        }
    }
};
