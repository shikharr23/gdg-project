import express from "express";
import Subject from "../models/subject.js";
const subjectRouter = express.Router();

// GET /subjects - list subjects for the user
subjectRouter.get("/", async (req, res) => {
  // TODO: replace with DB lookup
  try {
    const allSubjects = await Subject.find({});
    res.json({ ok: true, subjects: allSubjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

subjectRouter.post("/", async (req, res) => {
  try {
    const newSubject = await Subject.create(req.body);
    res.json({
      msg: "Subject added!",
      subject: newSubject,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /subjects/:id - subject details
subjectRouter.get("/:id", async (req, res) => {
  try {
    const subjectId = req.params.id;
    // TODO: replace with DB lookup
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(400).json({ error: "Not found!" });
    res.json({ ok: true, subject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default subjectRouter;
