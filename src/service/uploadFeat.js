const {S3Client,GetObjectCommand,PutObjectCommand,} = require("@aws-sdk/client-s3")
const {getSignedUrl } = require("@aws-sdk/s3-request-presigner");



const s3client= new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId:process.env.AWSaccessKeyId,
        secretAccessKey:process.env.AWSsecretAccessKey
    }
})

async function getUrl(key){
    const command= new GetObjectCommand({
        Bucket:"nikhil-thakur-bucket",
        Key:key
    });
    const signedUrl=await getSignedUrl(s3client,command);
    console.log(signedUrl)
}

async function uploadFile(dir,type,uid){
    const command= new PutObjectCommand({
        Bucket:"nikhil-thakur-bucket",
        Key:`${uid}/${dir}`,
        ContentType:type,
    })
return await getSignedUrl(s3client,command,{expiresIn:80});

}





module.exports = {uploadFile}