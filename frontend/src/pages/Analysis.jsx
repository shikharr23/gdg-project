import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Analysis() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

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

  if (loading) return <div className="max-w-3xl mx-auto p-6">Loading subjects...</div>;
  if (error) return <div className="max-w-3xl mx-auto p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Bunk Analysis</h1>
      <p className="text-sm bw-muted mb-4">Select a subject to view detailed bunk risk analysis.</p>
      
      {subjects.length === 0 ? (
        <div className="text-sm bw-muted">
          No subjects yet. <Link to="/subjects" className="bw-link">Add one</Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subjects.map((s) => (
            <li key={s._id || s.subjectId} className="p-3 card bw-border">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{s.subjectName || s.name}</div>
                  <div className="text-sm bw-muted">
                    {s.classesAttended || 0} / {s.classesConducted || 0} classes
                  </div>
                </div>
                <div>
                  <Link
                    to={`/attendance/${s._id || s.subjectId}`}
                    className="bw-link"
                  >
                    Analyze
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
