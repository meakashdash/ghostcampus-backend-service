import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { REGION, ACCESS_KEY, SECRET_ACCESS_KEY } from "../utils/config.js";


export class S3Service{
    constructor() {
        this.s3Client = new S3Client({
            region: REGION,
            credentials: {
                accessKeyId: ACCESS_KEY,
                secretAccessKey: SECRET_ACCESS_KEY,
            },
        });
    }

    async uploadFile(file, bucketName, folderName, key) {
        const fullPath = `${folderName}/${key}`;
        const uploadParams = {
            Bucket: bucketName,
            Key: fullPath,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };

        const command = new PutObjectCommand(uploadParams);

        try {
            await this.s3Client.send(command);
            const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fullPath}`;
            return fileUrl;
        } catch (error) {
            throw new Error(`Failed to upload file to S3: ${error.message}`);
        }
    }

    async uploadImages(files, bucketName, folderName, key) {
        try {
            let imageLocations = [];
            // if(files.images.length===1){
            //     files.images=[files.images]
            // }
            const uploadPromises = files.images.map(async (image, index) => {
                const fullPath = `${folderName}/${key}/${index}`;
                const uploadParams = {
                    Bucket: bucketName,
                    Key: fullPath,
                    Body: image.buffer,
                    ContentType: image.mimetype,
                    ACL: 'public-read',
                };
                const command = new PutObjectCommand(uploadParams);
                await this.s3Client.send(command);
                const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fullPath}`;
                imageLocations.push(fileUrl);
            });
            await Promise.all(uploadPromises);
            return imageLocations;
        } catch (error) {
            throw new Error(`Failed to upload files to S3: ${error.message}`);
        }
    }

    async uploadVideos(files, bucketName, folderName, key) {
        try {
            let videosLocations = [];
            // if(files.videos.length===1){
            //     files.videos=[files.videos]
            // }
            const uploadPromises = files.videos.map(async (video, index) => {
                const fullPath = `${folderName}/${key}/${index}`;
                const uploadParams = {
                    Bucket: bucketName,
                    Key: fullPath,
                    Body: video.buffer,
                    ContentType: video.mimetype,
                    ACL: 'public-read',
                };
                const command = new PutObjectCommand(uploadParams);
                await this.s3Client.send(command);
                const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fullPath}`;
                videosLocations.push(fileUrl);
            });
            await Promise.all(uploadPromises);
            return videosLocations;
        } catch (error) {
            throw new Error(`Failed to upload videos to S3: ${error.message}`);
        }
    }
}