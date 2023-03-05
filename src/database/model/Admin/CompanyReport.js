const mongoose = require('mongoose')

const companyReportsSchema = new mongoose.Schema(
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
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
        },
    },
    {
        timestamps: true,
    }
)

const CompanyReport = mongoose.model('CompanyReport', companyReportsSchema)

module.exports = CompanyReport
