const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema(
    {
        departureAt: {
            type: Date,
            default: Date.now(),
        },
        type: {
            // normal, promotion
            type: String,
        },
        image: {
            type: String,
        },
        touristsRoute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TouristsRoute',
        },
        tickets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Ticket',
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
