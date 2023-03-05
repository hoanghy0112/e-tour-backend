const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        tour: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour',
        },
        status: {
            // pending, approved, rejected, cancelled
            type: String,
        },
        price: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
)

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket
