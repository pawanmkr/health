import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDatabase } from './database/config';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.listen(6007, async () => {
    await connectDatabase();
    console.log('[SERVER]: Listening on PORT :6007');
});
