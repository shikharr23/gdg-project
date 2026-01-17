import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Charts from '../components/Charts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = await api.getDashboardSummary();
      setData(dashboardData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="max-w-4xl mx-auto p-6">Loading dashboard...</div>;
  if (error) return <div className="max-w-4xl mx-auto p-6 text-red-600">Error: {error}</div>;
  if (!data) return <div className="max-w-4xl mx-auto p-6">No data available</div>;

  const { overall, subjects } = data;

  const getRiskColor = (riskLevel) => {
    if (riskLevel === 'SAFE') return 'text-green-600';
    if (riskLevel === 'WARNING') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm bw-muted">Overview of your attendance across all subjects</p>
      </header>

      {/* Overall Summary */}
      <section className="mb-6 p-4 card bw-border">
        <h2 className="font-semibold mb-3">Overall Attendance</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm bw-muted">Attended</div>
            <div className="text-xl font-semibold">{overall.attended}</div>
          </div>
          <div>
            <div className="text-sm bw-muted">Total Classes</div>
            <div className="text-xl font-semibold">{overall.total}</div>
          </div>
          <div>
            <div className="text-sm bw-muted">Percentage</div>
            <div className="text-xl font-semibold">{overall.attendancePct}%</div>
          </div>
        </div>
      </section>

      {/* Charts */}
      <Charts overall={overall} subjects={subjects} />

      {/* Subjects List */}
      <section>
        <h2 className="font-semibold mb-3">Subjects</h2>
        {subjects.length === 0 ? (
          <div className="text-sm bw-muted">No subjects yet. <Link to="/subjects" className="bw-link">Add one</Link></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <div key={subject.subjectId} className="p-4 card bw-border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{subject.subjectName}</h3>
                    <div className="text-sm bw-muted">
                      {subject.attended} / {subject.total} classes
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${getRiskColor(subject.riskLevel)}`}>
                    {subject.riskLevel}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="text-sm bw-muted">Attendance: {subject.attendancePct}%</div>
                  <div className="text-sm bw-muted">Required: {subject.minRequired}%</div>
                  {subject.attendanceBuffer > 0 && (
                    <div className="text-sm text-green-600">Safe to bunk: {subject.attendanceBuffer} classes</div>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/attendance/${subject.subjectId}`}
                    className="text-sm bw-link"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
