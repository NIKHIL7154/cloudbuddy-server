require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require("fs");
const path = require('path');

const mime = require('mime-types');

console.log(process.env.AWSaccessKeyId);
console.log(process.env.AWSsecretAccessKey);
AWS.config.update({
    accessKeyId: process.env.AWSaccessKeyId,
    secretAccessKey: process.env.AWSsecretAccessKey,
    region: 'ap-south-1'
});
const s3 = new AWS.S3();

async function uploadProject(taskId) {
    return new Promise(async (res, rej) => {
        const curpath=process.cwd();
        let buildFolder="dist";
        let PATH=path.join(curpath,"builder","projects",taskId);
        if (!fs.existsSync(PATH)) {
            rej('The specified path does not exist');
            return;   
        }
        if(!fs.existsSync(path.join(PATH,buildFolder))){
            buildFolder="build";
        }
        PATH=path.join(PATH,buildFolder);
        
        
        const bucketName = 'nikhil-thakur-bucket';
        const id= taskId.substring(0, 5);

        
        try{
            await processDirectory(bucketName, PATH,id);
            res('All files uploaded successfully!');
        }catch(err){
            rej('Error uploading files:', err);
        }
        
    });

}


const processDirectory = async (bucketName, currentPath, s3Path) => {
    // Recursive function to process files and folders
        const files = fs.readdirSync(currentPath);
    
        for (const file of files) {
            const fullPath = path.join(currentPath, file);
            const s3Key = path.join(s3Path, file);
    
            if (fs.lstatSync(fullPath).isDirectory()) {
                // If it's a folder, recursively process it
                await processDirectory(bucketName, fullPath, s3Key);
            } else {
                // If it's a file, upload to S3
                await uploadToS3(bucketName, fullPath, s3Key);
            }
        }
    };






const uploadToS3 = async (bucketName, filePath, key) => {
    const mimeType = mime.lookup(filePath) || 'application/octet-stream'; // Default MIME type

    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: bucketName,
        Key: key.replace(/\\/g, '/'), // The S3 key (path in the bucket)
        Body: fileContent,
        ContentType: mimeType,
    };
    console.log(`Uploading`)
    try {
        const data = await s3.upload(params).promise();
        console.log(`Uploaded successfully: ${data.Location}`);
    } catch (error) {
        console.log("Yahan b aya")
        throw new Error(`Error uploading ${key}:`, error);
    }
};



// Main function to upload files and folders



module.exports = uploadProject;