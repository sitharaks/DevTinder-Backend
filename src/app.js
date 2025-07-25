const express = require('express');
const  app = express();
const  connectDB  = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const requestRouter = require('./routes/request');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user');
const cors = require('cors')
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use('/', authRouter);
app.use('/', requestRouter);
app.use('/', profileRouter);
app.use('/', userRouter)

connectDB()
   .then(() => {
       app.listen(3000, () => {
           console.log('Server is running on port 3000');
       });
   })
   .catch((error) => {
       console.error('Error connecting to the database:', error);
   });
