const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT , ()=>{
    console.log("server is start");
});