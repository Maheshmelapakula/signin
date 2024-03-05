const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { connection } = require("./config/db");
const { Usermodel }  = require("./models/User");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello");
});



app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
      }
  
      // Check if the user already exists
      const existingUser = await Usermodel.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
  
      // Create a new user
      const user = new Usermodel({ name, email, password });
      const savedUser = await user.save();
  
      res.json(savedUser);
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connection;
    try {
        console.log("DB connected");
    } catch (error) {
        console.log(error);
        console.log("Error in connecting to DB");
    }
    console.log(`Server started on port http://localhost:${PORT}`);
});
