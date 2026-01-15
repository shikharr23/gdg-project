export const calculateAttendancePercentage = (classesConducted, classesAttended) => {
    if (classesConducted === 0) {
        return 100;
    }
    return Number(((classesAttended / classesConducted) * 100).toFixed(2));
};

const calculateRequiredAttendance = (classesConducted, minAttendancePercent) => {
    return Math.ceil((minAttendancePercent / 100) * classesConducted);
};

const calculateSafeBunks = (classesAttended, requiredAttendance) => {
    return Math.max(classesAttended - requiredAttendance, 0);
};


const calculateRiskLevel = (attendancePercent, minAttendancePercent) => {
    if (attendancePercent >= minAttendancePercent + 5) return "SAFE";
    if (attendancePercent >= minAttendancePercent) return "WARNING";
    return "CRITICAL";
};

export { calculateAttendancePercentage, calculateSafeBunks, calculateRequiredAttendance, calculateRiskLevel };