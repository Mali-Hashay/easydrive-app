import mongoose from 'mongoose'

const Car=mongoose.models.Car|| mongoose.model(
    "Car",
    new mongoose.Schema({
        
        brand:{type: String,required:true},
        model:{type:String, required: true},
        licensePlate:
        {
            type:String,
            required:true,
            trim: true,
            unique: true,
            minlength: 7,
            maxlength: 8,
        },
        year: 
        {
            type: Number,
            required: true,
            min: 2000,
            max: 2027,
        },

        categories: 
        [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Category',
                required: true,
            },     
        ],

        seats:{type:Number,required:true,min:4, max:9},
        transmission:{type:String,required:true,enum:['automatic', 'manual'] },
        fuelType:{type:String,required:true, enum:['electric','hybrid','gasoline','diesel']},
        mileage:{type:Number,min:0,default:0},
        dailyPrice:{type:Number, required:true, min:0},
        status:{type:String,required:true,enum:['available','rented','maintenance','inactive'], default:'available'},
        imageUrl:{type:String,required:true},
    }, { collection: 'cars' })
)

export default Car;