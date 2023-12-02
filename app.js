const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const PORT = 3000;
const path = require('path')
const multer = require('multer')
require("dotenv").config();
const AppError = require("./utilities/ErrorHandler");
const MainErrorHAndler = require("./Controllers/ErrorController");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: path.join(__dirname, "pubic/uploads"),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname))
  }
})

app.use(multer({storage}).single('image'))



mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`databse connected`));

app.get("/test", (req, res, next) => {
  res.json({ message: "Hello world" });
});

app.use("/user", require("./routes/userRoute"));
app.use("/story", require("./routes/storyRoute"));
app.use("/review", require("./routes/reviewRoutes"));
app.use("/libary", require("./routes/LibaryRoutes"));


app.all("*", (req, res, next) => {
  next(new AppError(`can't find this route on the server!!!`, 404));
});

app.use(MainErrorHAndler);

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
