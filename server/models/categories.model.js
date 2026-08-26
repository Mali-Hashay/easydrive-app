import mongoose from 'mongoose'
const Category = mongoose.models.Category || mongoose.model(
    "Category",
    new mongoose.Schema({
        name: {
            type: String,
            required: true, 
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        }
    }), "categories"
)

export default Category

