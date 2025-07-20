const express = require('express');
const  app = express();
const { adminAuth } = require('../middlewares/auth');

app.use("/admin", adminAuth)

app.get("/admin/data", (req, res) => {
    throw new Error("This is a test error");
    res.send("Hello Welcome to DevTinder Backend!");
})

app.use("/",(err,req, res, next)=> {
    if(err){
        res.status(500).send("Internal Server Error");
    }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});