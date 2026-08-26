import 'dotenv/config'; 
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import CategoriesRouter from './routers/categories.router.js'
import CarsRouter from './routers/cars.router.js';
import RentalRouter from './routers/rentals.router.js';
import UsersRouter from './routers/users.router.js';
import PaymentRouter from './routers/payments.router.js';
import AuthRouter from './routers/auth.router.js';
import ContactRouter from './routers/contact.router.js';


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;



const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

connectDB().then(() => {
    console.log("connected to database");
}).catch(err => {
     console.log("error while tring to connect databse");
})

app.use("/categories",CategoriesRouter);
app.use("/cars",CarsRouter);
app.use('/rentals',RentalRouter);
app.use('/users',UsersRouter);
app.use('/payments',PaymentRouter);
app.use('/auth',AuthRouter);
app.use('/contact', ContactRouter);

app.listen(PORT,()=>{
    console.log("server is running");
})

// פונקציה שתרוץ כל מספר דקות ע''מ לעורר את השרת ב- Render
app.get('/ping', (req, res) => {
    res.status(200).send("PONG");
});

