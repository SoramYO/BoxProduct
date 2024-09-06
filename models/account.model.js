const mongoose = require("mongoose");
const { create } = require("./product.image.model");

const accountSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        token: String,
        phone: String,
        avatar: String,
        role_id: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false,
        },
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
        deletedBy: {
            account_id: String,
            deletedAt: {
                type: Date,
                default: Date.now,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;