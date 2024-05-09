import express from 'express';
import multer from "multer";
import { extractColumns } from './sheet';
import morgan from 'morgan';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.listen(6007, () => {
    console.log('Server is running on port 6007');
});

app
    .get('/health', (req, res) => {
        res.send('OK');
    })
    .post('/upload', upload.any(), async (req, res) => {
        if (!req.files) console.error("file not uploaded");

        if (Array.isArray(req.files) && req.files.length > 0) {
            const output = await extractColumns(req.files[0].path);
            console.log(output.headers);
            console.log(output.rows.length + " rows");

            // TODO: generate a unique id for the file and save file in blob storage with this id
            const file_id = crypto.randomBytes(16).toString('hex');

            res.json({
                headers: output.headers,
                rows: output.rows,
                file_id
            });
        }
    })
    .post('/columns/selected', (req, res) => {
        console.log(req.body);
        res.send('OK');
    });
