import express from "express";
import Subject from "../models/subject.js";
import { calculateAttendancePercentage, calculateSafeBunks, calculateRequiredAttendance, calculateRiskLevel } from "../utils/logic.js";
const analysisRouter = express.Router();

// GET /bunk-analysis/:subjectId - return bunk risk analysis for a subject
analysisRouter.get('/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    const futureSteps = parseInt(req.query.future || '8', 10);
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const classesConducted = Number(subject.classesConducted || 0);
    const classesAttended = Number(subject.classesAttended || 0);
    const threshold = Number(subject.minAttendancePercent ?? 75);

    const attendancePct = calculateAttendancePercentage(classesConducted, classesAttended);
    const requiredAttendance = calculateRequiredAttendance(classesConducted, threshold);
    const attendanceBuffer = calculateSafeBunks(classesAttended, requiredAttendance);
    const riskLevel = calculateRiskLevel(attendancePct, threshold);

    const gap = Math.max(0, Number((threshold - attendancePct).toFixed(2)));
    const daysNeededIfPerfect = gap <= 0 ? 0 : Math.ceil((gap / 100) * classesConducted);

    // build a simple projection assuming the student attends the next N classes
    const projection = [];
    const steps = Math.max(1, Math.min(futureSteps, 50));
    for (let i = 1; i <= steps; i++) {
      const attended = classesAttended + i; // assume attending the next i classes
      const total = classesConducted + i;
      const pct = calculateAttendancePercentage(total, attended);
      projection.push({ step: `after ${i} attend${i>1?'s':''}`, attended, total, attendancePct: pct });
    }

    res.json({
      ok: true,
      subjectId,
      subjectName: subject.subjectName,
      classesConducted,
      classesAttended,
      attendancePct,
      threshold,
      gap,
      requiredAttendance,
      attendanceBuffer,
      daysNeededIfPerfect,
      riskLevel,
      projection,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default analysisRouter;
