const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
    name: String,
    img: {
        data: Buffer,
        contentType: String
    }
});
const Image = mongoose.model('Image', imgSchema);

module.exports = Image
