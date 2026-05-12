const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// ROUTES

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


// CONNECT DATABASE FIRST

console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log("MongoDB Connected");

  app.listen(5000, () => {

    console.log("Server running on port 5000");

  });

})

.catch((error) => {

  console.log(error);

});