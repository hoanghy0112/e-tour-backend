const mongoose = require('mongoose')

const voucherSchema = new mongoose.Schema(
    {
        expiredAt: {
            type: Date,
            default: Date.now(),
        },
        type: {
            // discount, free
            type: String,
        },
        description: {
            type: String,
        },
        usingCondition: {
            type: String,
        },
        image: {
            type: String,
        },
        value: {
            type: Number,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
        },
    },
    {
        timestamps: true,
    }
)

const Voucher = mongoose.model('Voucher', voucherSchema)

module.exports = Voucher
