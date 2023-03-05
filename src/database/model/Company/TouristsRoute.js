const mongoose = require('mongoose')

const touristsRouteSchema = new mongoose.Schema(
    {
        reservationFee: {
            type: Number,
            default: 0,
        },
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: false,
            maxlength: [40, 'A tour name must have less or equal then 40 characters'],
            minlength: [10, 'A tour name must have more or equal then 10 characters'],
        },
        description: {
            type: String,
            required: [true, 'A tour must have a description'],
        },
        type: {
            type: String,
            // country, foreign
        },
        // route: {

        // }
        image: {
            type: String,
        },
        company: {
            type: mongoose.Schema.ObjectId,
            ref: 'Company',
        },
        rates: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Rate',
            },
        ],
        interests: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Interest',
            },
        ],
        tours: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Tour',
            },
        ],
    },
    {
        timestamps: true,
    }
)

const TouristsRoute = mongoose.model('TouristsRoute', touristsRouteSchema)

module.exports = TouristsRoute
