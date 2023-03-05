const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        image: {
            type: String,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        identity: {
            type: String,
        },
        identityExpiredAt: {
            type: Date,
        },
        tickets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Ticket',
            },
        ],
        vouchers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Voucher',
            },
        ],
        interests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Interest',
            },
        ],
        rates: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Rate',
            },
        ],
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User
