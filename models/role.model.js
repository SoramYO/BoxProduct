const mongoose = require("mongoose");
const { create } = require("./product.image.model");

const roleSchema = new mongoose.Schema({
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    createdBy: {
        account_id: String,
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    updatedBy: {
        account_id: String,
        updateAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true
});

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;