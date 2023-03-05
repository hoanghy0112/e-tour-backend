const mongoose = require('mongoose')

const companySchema = new mongoose.Schema(
    {
        isApproveToActive: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        previewImages: {
            type: [String],
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
        },
        touristsRoutes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'TouristsRoute',
            },
        ],
        vouchers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Voucher',
            },
        ],
        rates: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Rate',
            },
        ],
        interests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Interest',
            },
        ],
        staffs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Staff',
            },
        ],
        companyReports: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CompanyReport',
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Company = mongoose.model('Company', companySchema)

module.exports = Company
