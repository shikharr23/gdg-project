import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// Graph removed: replaced with a simple projection list

export default function Subject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dto, setDto] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({ classesConducted: '', classesAttended: '' });

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [analysisData, attendance] = await Promise.all([
        api.getBunkAnalysis(id),
        api.getAttendance(id).catch(() => null)
      ]);
      setDto(analysisData);
      if (attendance) {
        setAttendanceData(attendance);
        setFormData({
          classesConducted: attendance.total || '',
          classesAttended: attendance.attended || '',
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateAttendance(e) {
    e.preventDefault();
    setUpdating(true);
    try {
      const classesConducted = parseInt(formData.classesConducted);
      const classesAttended = parseInt(formData.classesAttended);
      
      if (classesAttended > classesConducted) {
        alert('Classes attended cannot exceed classes conducted');
        setUpdating(false);
        return;
      }

      await api.updateAttendance(id, classesConducted, classesAttended);
      await fetchData(); // Refresh data
    } catch (err) {
      alert('Failed to update: ' + err.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div className="p-6">Loading analysis...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!dto) return <div className="p-6">No data</div>;

  const { subjectName, attendancePct, threshold, gap, daysNeededIfPerfect, projection, riskLevel } = dto;

  const getRiskColor = (risk) => {
    if (risk === 'SAFE') return 'text-green-600';
    if (risk === 'WARNING') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-sm bw-link mb-2">← Back</button>
        <h1 className="text-2xl font-bold mb-2">{subjectName || 'Subject'}</h1>
      </div>

      {/* Update Attendance Form */}
      <section className="mb-6 p-4 card bw-border">
        <h2 className="font-semibold mb-3">Update Attendance</h2>
        <form onSubmit={handleUpdateAttendance} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm bw-muted block mb-1">Classes Conducted</label>
              <input
                type="number"
                min="0"
                value={formData.classesConducted}
                onChange={(e) => setFormData({ ...formData, classesConducted: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="text-sm bw-muted block mb-1">Classes Attended</label>
              <input
                type="number"
                min="0"
                value={formData.classesAttended}
                onChange={(e) => setFormData({ ...formData, classesAttended: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={updating}
            className="px-4 py-2 bw-btn rounded"
          >
            {updating ? 'Updating...' : 'Update Attendance'}
          </button>
        </form>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="p-3 card bw-border">
          <div className="text-sm bw-muted">Attendance</div>
          <div className="text-xl font-semibold">{attendancePct}%</div>
        </div>
        <div className="p-3 card bw-border">
          <div className="text-sm bw-muted">Required</div>
          <div className="text-xl font-semibold">{threshold}%</div>
        </div>
        <div className="p-3 card bw-border">
          <div className="text-sm bw-muted">Gap</div>
          <div className="text-xl font-semibold">{gap}%</div>
        </div>
        <div className="p-3 card bw-border">
          <div className="text-sm bw-muted">Risk Level</div>
          <div className={`text-xl font-semibold ${getRiskColor(riskLevel)}`}>{riskLevel}</div>
        </div>
      </div>

      {/* Projection */}
      <div className="mb-4 p-4 card bw-border">
        <h3 className="font-semibold mb-2">Projection (if attending next classes)</h3>
        {(projection && projection.length) ? (
          <ul className="text-sm bw-muted list-disc pl-5">
            {projection.map((p, idx) => (
              <li key={idx}>Step {p.step}: {p.attendancePct}%</li>
            ))}
          </ul>
        ) : (
          <div className="text-sm bw-muted">No projection data</div>
        )}
        <div className="text-sm bw-muted mt-2">
          Days needed if attending all future classes: <strong>{daysNeededIfPerfect}</strong>
        </div>
      </div>
    </div>
  );
}
