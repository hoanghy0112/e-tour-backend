const mongoose = require('mongoose')

const rateSchema = new mongoose.Schema(
    {
        star: {
            type: Number,
        },
        description: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
        },
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
        },
        touristsRoute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TouristsRoute',
        },
    },
    {
        timestamps: true,
    }
)

const Rate = mongoose.model('Rate', rateSchema)

module.exports = Rate
