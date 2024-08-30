const admin = require('../config/firebase-admin');
const bucket = admin.storage().bucket();
const { ref, uploadBytes } = require('firebase/storage');

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
            //if bucket.name have space, replace it with %20
            for (let i = 0; i < blob.name.length; i++) {
                if (blob.name[i] === ' ') {
                    blob.name = blob.name.replace(' ', '%20');
                }
            }
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`;
            resolve(publicUrl);
        });

        blobStream.end(buffer);
    });
}

module.exports = uploadFileToFirebase;
