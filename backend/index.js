import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';
import connectDb from './utils/db.js';
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
configDotenv({});

const PORT = process.env.PORT || 8281;

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
  origin: 'http://localhost:5173', // Specify the allowed frontend origin
  credentials: true,               // Allow credentials (cookies, headers, etc.)
};

app.use(cors(corsOptions));

app.use('/api/v1/user',userRoute)
app.use('/api/v1/post',postRoute)
app.use('/api/v1/message',messageRoute)



app.listen(PORT,()=>{
  connectDb();
  console.log(`server listen at port ${PORT}`);
})