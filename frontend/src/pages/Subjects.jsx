import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function SubjectForm({ onAdd }) {
  const [form, setForm] = useState({
    subjectName: '',
    classesPerWeek: "",
    minAttendancePercent: 75,
    classesConducted: "",
    classesAttended: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: name.includes('Percent') || name.includes('PerWeek') || name.includes('Classes') ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await onAdd(form);
    setSaving(false);
    if (!result.ok) setError(result.error || 'Failed to add');
    else setForm({ subjectName: '', classesPerWeek: '', minAttendancePercent: 75, classesConducted: '', classesAttended: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 card w-full max-w-md mx-auto mb-4 bw-border">
      <h3 className="font-semibold mb-2">Add Subject</h3>
      <input name="subjectName" value={form.subjectName} onChange={handleChange} placeholder="Subject name" required className="w-full p-2 mb-2 border rounded" />
      <div className="flex gap-2">
        <input name="classesPerWeek" type="number" min="1" value={form.classesPerWeek} onChange={handleChange} placeholder='Classes Per Week' className="w-1/2 p-2 border rounded" />
        <input name="minAttendancePercent" type="number" min="0" max="100" value={form.minAttendancePercent} onChange={handleChange} placeholder="Min % (default: 75)" className="w-1/2 p-2 border rounded" />
      </div>
      <div className="flex gap-2 mt-2">
        <input name="classesConducted" type="number" min="0" value={form.classesConducted} onChange={handleChange} placeholder='Classes Conducted' className="w-1/2 p-2 border rounded" />
        <input name="classesAttended" type="number" min="0" value={form.classesAttended} onChange={handleChange} placeholder='Classes Attended' className="w-1/2 p-2 border rounded" />
      </div>
      <div className="flex justify-end mt-3">
        <button disabled={saving} className="px-3 py-1 rounded bw-btn">{saving ? 'Saving...' : 'Add'}</button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}

export default function Subjects() {
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

  async function handleAdd(subject) {
    try {
      const newSubject = await api.createSubject(subject);
      setSubjects((s) => [newSubject, ...s]);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <p className="text-sm bw-muted">Create and manage subjects for attendance tracking.</p>
      </header>

      <SubjectForm onAdd={handleAdd} />

      <section>
        <h2 className="font-semibold mb-2">Your Subjects</h2>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && subjects.length === 0 && <div>No subjects yet. Add one above.</div>}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subjects.map((s) => (
            <li key={s._id || s.subjectId} className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <div>
                        <div className="font-semibold">{s.subjectName || s.name || s.subjectId}</div>
                        <div className="text-sm bw-muted">Classes/week: {s.classesPerWeek ?? s.classesPerWeek}</div>
                </div>
                <div>
                        <Link to={`/attendance/${s._id || s.subjectId}`} className="bw-link">Open</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}



