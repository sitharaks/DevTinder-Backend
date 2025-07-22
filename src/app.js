const express = require('express');
const  app = express();
const  connectDB  = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const requestRouter = require('./routes/request');
const profileRouter = require('./routes/profile');

app.use(express.json())
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', requestRouter);
app.use('/', profileRouter);

connectDB()
   .then(() => {
       app.listen(3000, () => {
           console.log('Server is running on port 3000');
       });
   })
   .catch((error) => {
       console.error('Error connecting to the database:', error);
   });
