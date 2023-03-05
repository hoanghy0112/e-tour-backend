const mongoose = require('mongoose')

const interestSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    touristsRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TouristsRoute',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
})

const Interest = mongoose.model('Interest', interestSchema)

module.exports = Interest
