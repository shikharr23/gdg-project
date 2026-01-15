import express from "express"
import Subject from "../models/subject.js";
import { calculateAttendancePercentage, calculateSafeBunks, calculateRequiredAttendance, calculateRiskLevel } from "../utils/logic.js";
const analysisRouter = express.Router();

// GET /bunk-analysis/:subjectId - return bunk risk analysis for a subject
analysisRouter.get('/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found!" })
    }
    const attendancePercentage = calculateAttendancePercentage(subject.classesConducted, subject.classesAttended);
    const requiredAttendance = calculateRequiredAttendance(subject.classesConducted, subject.minAttendancePercent);
    const attendanceBuffer = calculateSafeBunks(subject.classesAttended, requiredAttendance);
    const riskLevel = calculateRiskLevel(attendancePercentage, subject.minAttendancePercent);
    res.json({ ok: true, subjectId, attendancePercentage, requiredAttendance, attendanceBuffer, riskLevel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default analysisRouter;
