const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

//! config using app
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ extended: false }));
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    throw err;
  }
};

//! connect Database
connectDB()
  .then(() => {
    //! use Router

    //! app listening
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
