import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());

// Route modules
import subjectRouter from "./routes/subject.js";
import attendanceRouter from "./routes/attendance.js";
import bunkRouter from "./routes/bunkAnalysis.js";
import dashboardRouter from "./routes/dashboard.js";
// const simulatorRouter = require("./routes/leaveSimulator");

app.use("/subjects", subjectRouter);
app.use("/attendance", attendanceRouter);
app.use("/bunk-analysis", bunkRouter);
// app.use("/leave-simulator", simulatorRouter);
app.use("/dashboard", dashboardRouter);

app.get("/health", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");
  app.listen( process.env.PORT , () => console.log(`Server listening on ${process.env.PORT}`));
}
main();


export default app;
