const userModal = require("../schema/userSchema");
const bcrypt = require("bcryptjs");
const generateToken = require("../middleware/generateJwtToken");

//register - creating a user on our platform (user need to create thier acc to see our platform)

const registerUser = async (req, res) => {
  //user will enter this thing in input
  const { name, email, password, role } = req.body;

  //1. all things should be there orelse form should not submit
  if (!name || !email || !password) {
    return res.status(401).send("Please fill all the details to go ahead");
  }

  //check if the email is exist already or not means user already registered with same email
  let existingUser = await userModal.findOne({ email });
  if (existingUser) {
    return res.status(400).send("user already exist");
  } else {
    //if everything is good means if its not a existing user then create a user and save it in db

    try {
      //  Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await userModal.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      });
      await newUser.save();
      // Send the token in the response
      console.log("register succefully");
      return res.status(201).json({
        message: "User created successfully",
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id),
      });
    } catch (error) {
      console.log("error in registering user", error);
      return res.status(400).json({ error: error.message });
    }
  }
};

//login user

const loginUser = async (req, res) => {
  //user inputs email and password while login
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Both Email and password are required" });
  }

  try {
    //find user by email id in db
    const user = await userModal.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "invalid email or password" });
    }

    // 2. Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "invalid email or password" });
    }
    console.log("login succefully"); //this is for me for testing
    return res.status(200).json({
      message: "User logged in successfully",
      //just us to know who loggedin postman testing
      name: user.name,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//get all user

//lets give this route permision to only admins if a user is admin then only he can access all the users

const getAllUsers = async (req, res) => {
  try {
    const users = await userModal.find();
    if (!users || users.length === 0) {
      return res.status(401).json({ message: "no users found" });
    }

    //else users found send json
    res.status(201).json(users);
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ message: "server error" });
  }
};
module.exports = { registerUser, loginUser, getAllUsers };
