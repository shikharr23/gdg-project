import express from "express";
import Subject from "../models/subject.js";
import {
  calculateAttendancePercentage,
  calculateSafeBunks,
  calculateRequiredAttendance,
  calculateRiskLevel,
} from "../utils/logic.js";
const dashboardRouter = express.Router();

// GET /dashboard/summary - aggregated summary for user
dashboardRouter.get('/summary', async (req, res) => {
  try {
    const subjects = await Subject.find({});
    
    // Calculate overall attendance across all subjects
    const overallAttendance = subjects.reduce((acc, subject) => acc + subject.classesAttended, 0);
    const overallTotal = subjects.reduce((acc, subject) => acc + subject.classesConducted, 0);
    const overallAttendancePercentage = calculateAttendancePercentage(overallTotal, overallAttendance);

    // Format subjects array with analysis metrics
    const subjectsSummary = subjects.map((subject) => {
      const attendancePct = calculateAttendancePercentage(
        subject.classesConducted,
        subject.classesAttended
      );
      const requiredAttendance = calculateRequiredAttendance(
        subject.classesConducted,
        subject.minAttendancePercent
      );
      const attendanceBuffer = calculateSafeBunks(
        subject.classesAttended,
        requiredAttendance
      );
      const riskLevel = calculateRiskLevel(
        attendancePct,
        subject.minAttendancePercent
      );

      return {
        subjectId: subject._id,
        subjectName: subject.subjectName,
        attendancePct,
        attended: subject.classesAttended,
        total: subject.classesConducted,
        minRequired: subject.minAttendancePercent,
        requiredAttendance,
        attendanceBuffer,
        riskLevel,
      };
    });

    res.json({
      ok: true,
      overall: {
        attended: overallAttendance,
        total: overallTotal,
        attendancePct: overallAttendancePercentage,
      },
      subjects: subjectsSummary,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default dashboardRouter;
