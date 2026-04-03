const supabase = require('../utils/supabaseClient');

/**
 * Fetch attendance logs from Supabase
 */
const getAttendance = async (req, res) => {
  const { emp_id, start_date, end_date } = req.query;

  try {
    let query = supabase
      .from('attendance_logs')
      .select('*, users(full_name, department)')
      .order('timestamp', { ascending: false });

    if (emp_id) query = query.eq('emp_id', emp_id);
    if (start_date) query = query.gte('timestamp', `${start_date}T00:00:00Z`);
    if (end_date) query = query.lte('timestamp', `${end_date}T23:59:59Z`);

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getAttendance };
