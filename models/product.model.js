const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const { create } = require("./product.image.model");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  product_category_id: {
    type: String,
    default: ""
  },
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  //thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  thumbnail: String,
  status: String,
  position: Number,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  createBy: {
    account_id: String,
    createAt: {
      type: Date,
      default: Date.now
    }
  },
  updateBy: {
    account_id: String,
    updateAt: {
      type: Date,
      default: Date.now
    }
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedBy: {
    account_id: String,
    deletedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;