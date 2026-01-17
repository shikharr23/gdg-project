import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Attendance() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchSubjects(); }, []);

  async function fetchSubjects() {
    setLoading(true);
    try {
      const subjectsList = await api.getSubjects();
      setSubjects(subjectsList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Attendance</h1>
      <p className="text-sm bw-muted mb-4">Open a subject to view bunk analysis and simulate recovery.</p>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {subjects.map(s => (
          <li key={s._id || s.subjectId} className="p-3 card bw-border">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{s.subjectName || s.name}</div>
                <div className="text-sm bw-muted">Attended: {s.classesAttended} / {s.classesConducted}</div>
              </div>
              <div>
                <Link to={`/attendance/${s._id || s.subjectId}`} className="bw-link">Analyze</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
