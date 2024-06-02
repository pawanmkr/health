import fs from "fs";
import { Response } from "express";
import { BlobServiceClient, BlobClient, ContainerClient, BlobDownloadResponseModel } from "@azure/storage-blob";

import env from "../config/env";

export type BlobResponse = {
    url: string,
    name: string,
    mimetype: string,
};

// Creating a BlobServiceClient instance using the connection string from environment variables
const blobServiceClient = BlobServiceClient.fromConnectionString(env.AZURE_STORAGE_CONNECTION_STRING);

// Creating a ContainerClient instance for a specific container using the container name from environment variables
const containerClient: ContainerClient = blobServiceClient.getContainerClient(env.AZURE_STORAGE_CONTAINER_NAME);

/**
 * Uploads a file to Azure Blob Storage.
 * @param file - The file object provided by Multer middleware in Express.
 * @returns An object containing the URL, name, and MIME type of the uploaded blob.
 */
export async function uploadFile(file: Express.Multer.File): Promise<BlobResponse> {
    // Checking if the container exists
    const exists = await containerClient.exists();
    if (!exists) {
        // Creating the container if it does not exist
        await containerClient.create();
    }

    // Creating a BlockBlobClient for the specific file
    const blockBlobClient = containerClient.getBlockBlobClient(file.filename);

    // Reading the file data from the file system
    const fileData = fs.readFileSync(file.path);

    // Uploading the file data to the blob
    await blockBlobClient.uploadData(fileData);

    // Creating & Returning a blob object containing the URL, name, and MIME type of the uploaded blob
    return {
        url: blockBlobClient.url,
        name: file.filename,
        mimetype: file.mimetype,
    };
}

/**
 * Downloads a blob from Azure Blob Storage and streams it to the client response.
 * @param blobName - The name of the blob to download.
 * @param response - The Express response object to stream the blob to.
 */
export async function downloadBlobAsStream(blobName: string, response: Response): Promise<void> {
    // Creating a BlobClient for the specific blob
    const blobClient: BlobClient = containerClient.getBlobClient(blobName);

    // Downloading the blob
    const downloadResponse: BlobDownloadResponseModel = await blobClient.download();

    // Checking if there were no errors and if the readable stream body is available
    if (!downloadResponse.errorCode && downloadResponse.readableStreamBody) {
        // Setting headers for the response
        response.setHeader("Content-Disposition", `attachment; filename="${blobName}"`);
        if (downloadResponse.contentType) {
            response.setHeader("Content-Type", downloadResponse.contentType);
        }

        // Streaming the blob data to the response
        downloadResponse.readableStreamBody.on("data", (chunk) => response.write(chunk));

        // Ending the response once the stream ends
        downloadResponse.readableStreamBody.on("end", () => {
            response.end();
            console.log(`Download of ${blobName} succeeded`);
        });
    }
}
