const express = require('express');
const  app = express();
const { adminAuth } = require('../middlewares/auth');

app.use("/admin", adminAuth)

app.get("/admin/data", (req, res) => {
    res.send("Hello Welcome to DevTinder Backend!");
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});