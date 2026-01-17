const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export const api = {
  // Subjects
  async getSubjects() {
    const res = await fetch(`${API_BASE}/subjects`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load subjects');
    return data.subjects || [];
  },

  async getSubject(id) {
    const res = await fetch(`${API_BASE}/subjects/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load subject');
    return data.subject;
  },

  async createSubject(subject) {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subject),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create subject');
    return data.subject || data;
  },

  // Attendance
  async getAttendance(subjectId) {
    const res = await fetch(`${API_BASE}/attendance/${subjectId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load attendance');
    return data;
  },

  async updateAttendance(subjectId, classesConducted, classesAttended) {
    const res = await fetch(`${API_BASE}/attendance/${subjectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classesConducted, classesAttended }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update attendance');
    return data;
  },

  // Bunk Analysis
  async getBunkAnalysis(subjectId, futureSteps = 8) {
    const res = await fetch(`${API_BASE}/bunk-analysis/${subjectId}?future=${futureSteps}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load analysis');
    return data;
  },

  // Dashboard
  async getDashboardSummary() {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load dashboard');
    return data;
  },
};
