const express = require('express');
const router = express.Router();

// POST /leave-simulator/:subjectId - run leave impact & recovery simulation
router.post('/:subjectId', async (req, res) => {
  const subjectId = req.params.subjectId;
  const { current = {}, futurePlan = {} } = req.body;
  // TODO: run simulation algorithm
  const sampleProjection = [
    { step: 'now', attended: current.attended || 40, total: current.total || 55, attendancePct: 72.7 },
    { step: 'after 5 attends', attended: (current.attended || 40) + 5, total: (current.total || 55) + 5, attendancePct: 76.5 }
  ];
  res.json({ ok: true, subjectId, projection: sampleProjection });
});

module.exports = router;
