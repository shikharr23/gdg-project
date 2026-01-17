import express from "express";
import Subject from "../models/subject.js";
const attendanceRouter = express.Router();


attendanceRouter.get("/:subjectId", async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        ok: false,
        msg: "Subject not found",
      });
    }

    // Calculate attendance percentage (handle division by zero)
    const attendancePct =
      subject.classesConducted === 0
        ? 0
        : (subject.classesAttended / subject.classesConducted) * 100;

    res.json({
      ok: true,
      subjectId,
      attended: subject.classesAttended,
      total: subject.classesConducted,
      attendancePct: Math.round(attendancePct * 100) / 100, 
      minRequired: subject.minAttendancePercent,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

attendanceRouter.put("/:subjectId", async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { classesConducted, classesAttended } = req.body;


    if (
      classesConducted < 0 ||
      classesAttended < 0 ||
      classesAttended > classesConducted
    ) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid attendance values",
      });
    }

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        ok: false,
        msg: "Subject not found",
      });
    }


    subject.classesConducted = classesConducted;
    subject.classesAttended = classesAttended;

    await subject.save();


    res.json({
      ok: true,
      msg: "Attendance updated successfully",
      subject,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

export default attendanceRouter;