const supabase = require('../utils/supabaseClient');

/**
 * Service to process and rebuild attendance records based on raw logs
 * and other factors like leaves/permissions.
 */
class AttendanceService {
  /**
   * Rebuilds attendance for a specific employee on a specific date
   */
  async rebuildAttendance(empId, dateStr) {
    try {
      console.log(`[SERVICE] Rebuilding attendance for ${empId} on ${dateStr}`);

      // 1. Fetch all raw biometric logs for this user/date
      const { data: logs, error: logsError } = await supabase
        .from('attendance_logs')
        .select('timestamp, type')
        .eq('emp_id', empId)
        .gte('timestamp', `${dateStr}T00:00:00Z`)
        .lte('timestamp', `${dateStr}T23:59:59Z`)
        .order('timestamp', { ascending: true });

      if (logsError) throw logsError;

      if (!logs || logs.length === 0) {
        // No logs found? Maybe they were absent.
        return await this.updateAttendanceRecord(empId, dateStr, null, null, 'Absent');
      }

      // 2. Determine First In and Last Out
      const firstIn = logs[0].timestamp;
      const lastOut = logs.length > 1 ? logs[logs.length - 1].timestamp : firstIn;

      // 3. (Optional) Check for leaves/permissions logic could go here
      // For now, let's keep it simple: Present if logs exist.

      const status = 'Present';
      const remarks = `Logged from device. Total punches: ${logs.length}`;

      return await this.updateAttendanceRecord(empId, dateStr, firstIn, lastOut, status, remarks);
    } catch (error) {
      console.error(`[SERVICE ERROR] Rebuild failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Helper to update the final attendance record table
   */
  async updateAttendanceRecord(empId, date, inTime, outTime, status, remarks) {
    const { data, error } = await supabase
      .from('attendance_records')
      .upsert({
        emp_id: empId,
        date: date,
        in_time: inTime,
        out_time: outTime,
        status: status,
        remarks: remarks,
        updated_at: new Date().toISOString()
      }, { onConflict: 'emp_id, date' });

    if (error) throw error;
    return data;
  }
}

module.exports = new AttendanceService();
