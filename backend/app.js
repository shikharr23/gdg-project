import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
// Configure CORS
const frontendOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173,http://localhost:3000").split(',').map(s => s.trim());
app.use(cors({
  origin: function(origin, callback) {
    // allow non-browser requests like curl/postman (no origin)
    if (!origin) return callback(null, true);
    if (frontendOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'), false);
  }
}));
// app.options('*', cors());

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
  const port = process.env.PORT || 4000;
  try {
    if (process.env.MONGO_URL) {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("Connected to MongoDB");
    } else {
      console.warn('MONGO_URL not set — starting server without DB (dev mode)');
    }
    app.listen(port, () => console.log(`Server listening on ${port}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}
main();


export default app;
