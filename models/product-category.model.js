const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,
    parent_id: {
        type: String,
        default: "",
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    createBy: {
        account_id: String,
        createAt: {
            type: Date,
            default: Date.now,
        },
    },
    updateBy: {
        account_id: String,
        updateAt: {
            type: Date,
            default: Date.now,
        },
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedBy: {
        account_id: String,
        deletedAt: {
            type: Date,
            default: Date.now,
        },
    },
}, {
    timestamps: true,
});

const ProductCategory = mongoose.model("ProductCategory", productSchema, "product-category");

module.exports = ProductCategory;