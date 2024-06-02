import { Request, Response } from 'express';
import { BlobResponse, uploadFile } from '../services/storage';
import { healthReports, sheets } from '../schema';
import axios from 'axios';
import db from '../config/postgres';
import env from '../config/env';

/**
 * Uploads a CSV file to cloud storage, 
 * saves metadata to database, and sends it to analytics service for processing.
 * 
 * @param req Express request object
 * @param res Express response object
 * @returns Response from analytics service
 * @throws 500 if file upload fails
 * @throws 500 if analytics service fails to process file
 * @throws 500 if analytics report fails to save to database
 * @throws 500 if file metadata fails to save to database
 * @throws 422 if analytics service returns 422
 * @throws 400 if no files were uploaded
 */
export async function uploadCsvFile(req: Request, res: Response) {
    // Check if file was uploaded
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Upload file to cloud storage
    let blob: BlobResponse;
    try {
        blob = await uploadFile(req.files[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Failed to upload file');
    }

    // Save file metadata to database
    let [id] = await db
        .insert(sheets)
        .values({
            userId: 12,
            name: blob.name,
            url: blob.url,
            mimeType: blob.mimetype
        })
        .returning({ id: sheets.id })
        .execute();

    if (!id) return res.status(500).send('Failed to upload file');

    // Send file to analytics service for processing
    let response = await axios
        .post(`${env.ANALYTICS_API_URL}/v1/fileupload/carvach`, {
            file: req.files[0]
        }, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

    if (response.status === 422) return res.sendStatus(422);
    if (response.status !== 200) return res.status(500).send('Failed to process file');

    // Save analytics report to database
    response = await axios
        .post(`${env.ANALYTICS_API_URL}/v1/analyze/${"tenantId"}`, {
            carId: "rnadomcarid"
        });

    if (response.status !== 200) {
        return res.status(500).send('Failed to process file');
    }

    // Save analytics report to database
    [id] = await db
        .insert(healthReports)
        .values({
            userId: 12,
            sheetId: Number(id),
            report: response.data
        })
        .returning({ id: healthReports.id })
        .execute();

    if (!id) return res.status(500).send('Failed to process file');

    // Return analytics report
    return res.json(response.data);
}