const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./db/db");
const port = process.env.PORT;
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const setQuestion = require("./routes/setQuestionRoutes");
const setAssessment = require("./routes/setAssessmentRoutes");
const setPerformance = require("./routes/setPerformanceRoutes");
const setPK4 = require("./routes/setPK4Routes");
const setPK5 = require("./routes/setPK5Routes");
const setPKF5 = require("./routes/setPKF5Routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes, setQuestion, setAssessment, setPerformance, setPK4, setPK5, setPKF5);
app.use("/api/user", userRoutes);
app.use("/api/store", fileRoutes);

connectDB();

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});