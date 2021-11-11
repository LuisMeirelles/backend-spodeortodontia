import express from 'express';
import router from './routes.js';

const app = express();

app.use(router);

const port = process.env.PORT || 3500;

app.listen(port, () => console.log(`running on port ${port}`));
