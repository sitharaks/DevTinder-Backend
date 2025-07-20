const express = require('express');
const  app = express();

app.use("/user",[(req, res, next) => {
   // res.send("Hello Welcome to DevTinder Backend!");
    next();
},
(req, res)=> {
    res.send("Middleware executed");
    console.log("Middleware executed");
}])

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});