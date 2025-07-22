const express = require('express');
const  app = express();
const  connectDB  = require('./config/database');
const User = require('./models/user');
const { validateSignup } = require('./utils/validateSignup');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(express.json())
app.use(cookieParser());

app.post('/signup', async ( req, res) => {
    const { isValid, errors } = validateSignup(req);
    if (!isValid) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const userObj = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordHash,
    })
    try{
        await userObj.save()
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' + error.message }); 
    }
  
})

app.post('/login', async (req, res)=> {
    const { email, password } = req.body;
    const userEmail = await User.findOne({ email: email });
    if (!userEmail) {
        return res.status(404).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, userEmail.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: userEmail._id }, 'sith@133732gdgdhus', {
        expiresIn: '1h' // Token expiration time
    });
    res.cookie('token', token);
    res.status(200).json({ message: 'Login successful' });
    
})


app.get('/profile',(req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, 'sith@133732gdgdhus', async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
})
// feed api - to get all users from the database
app.get("/feed", async (req, res) => {
    try{
    const users =  await User.find({});
        if(users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
            res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
   
})

// Api to get user by email 
app.get('/user/:email', async(req, res) => {
    const userEmail = req.params.email
   try{
        const UserInfo = await User.find({ email: userEmail });
    if (UserInfo.length === 0) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.send(UserInfo);
   } catch (error) {
       console.error('Error fetching user:', error);
       res.status(500).json({ message: 'Internal server error' });
   }
})

// Api to get user by email 
app.get('/userId/:id', async(req, res) => {
    const userId = req.params.id
   try{
        const UserInfo = await User.findById(userId );
    if (UserInfo.length === 0) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.send(UserInfo);
   } catch (error) {
       console.error('Error fetching user:', error);
       res.status(500).json({ message: 'Internal server error' });
   }
})

// Delete user by id
app.delete('/userDelete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user by id
app.patch('/userUpdate/:id', async (req, res) => {
    const userId = req.params.id;
    const data  = req.body
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, data, {
            new: true, // Return the updated document
            runValidators: true // Validate the update against the schema
        });
        const ALLOWED_FIELDS = ['age', 'gender', 'bio', 'skills','photoUrl'];
        const updatedFields = Object.keys(data).every(field => ALLOWED_FIELDS.includes(field));
        if(!updatedFields) {
            throw Error('Invalid fields in update request' + JSON.stringify(data));
        }
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
connectDB()
   .then(() => {
       app.listen(3000, () => {
           console.log('Server is running on port 3000');
       });
   })
   .catch((error) => {
       console.error('Error connecting to the database:', error);
   });
