import { Router } from "express";
import { uploadCsvFile } from "../controllers";
import upload from '../middlewares/upload';

const router = Router();

router
    .get('/health', (req, res) => res.send('OK'))
    .post('/upload', upload.any(), uploadCsvFile);