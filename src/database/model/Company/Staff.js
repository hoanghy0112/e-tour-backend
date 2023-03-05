const mongoose = require('mongoose')

const staffSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
        },
        image: {
            type: String,
        },
        role: {
            // admin, staff
            type: String,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
        },
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

const Staff = mongoose.model('Staff', staffSchema)

module.exports = Staff
