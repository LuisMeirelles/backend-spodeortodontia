import express from 'express';

const app = express();

const port = process.env.PORT || 3500;

app.listen(port, () => console.log(`running on port ${port}`));
