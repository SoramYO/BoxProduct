const admin = require('../config/firebase-admin');
const bucket = admin.storage().bucket();

async function uploadFileToFirebase(file) {
    const { originalname, buffer } = file;
    const blob = bucket.file(originalname);
    const blobStream = blob.createWriteStream({
        resumable: false,
    });

    return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
            reject(err);
        });

        blobStream.on('finish', async () => {
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`;
            resolve(publicUrl);
        });

        blobStream.end(buffer);
    });
}

module.exports = uploadFileToFirebase;
