const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config(); //This line initializes the dotenv configuration, so the code access the .env file
const connectToDb = require("./db/connectToDb");
const UserRoutes = require("./routes/userRoutes");
const cors = require("cors");

app.use(express.json());
app.use(cors());

//routes
app.use("/api/user", UserRoutes);

const PORT = process.env.PORT || 8080;

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`connected to ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message, "error in db connection");
  });
