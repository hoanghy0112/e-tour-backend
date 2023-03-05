const mongoose = require('mongoose')

const applicationReportsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

const ApplicationReport = mongoose.model('ApplicationReport', applicationReportsSchema)

module.exports = ApplicationReport
