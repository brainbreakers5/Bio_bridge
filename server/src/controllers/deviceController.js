const supabase = require('../utils/supabaseClient');
const Joi = require('joi');
const attendanceService = require('../services/attendanceService');

/**
 * Log attendance from biometric device
 */
const logAttendance = async (req, res) => {
  try {
    const schema = Joi.object({
      emp_id: Joi.string().required(),
      device_id: Joi.string().required(),
      timestamp: Joi.date().iso().required(),
      type: Joi.string().valid('IN', 'OUT').required(),
      raw: Joi.object(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
       return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { data, error: logError } = await supabase
      .from('attendance_logs')
      .insert([value])
      .select();

    if (logError) throw logError;

    // Trigger rebuild of attendance record for this date
    const dateStr = new Date(value.timestamp).toISOString().split('T')[0];
    await attendanceService.rebuildAttendance(value.emp_id, dateStr);

    res.status(201).json({ success: true, message: 'Attendance logged and record updated', data: data[0] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Register user from device (if new user added on machine)
 */
const deviceRegisterUser = async (req, res) => {
  try {
    const schema = Joi.object({
      emp_id: Joi.string().required(),
      device_pin: Joi.string().required(),
      full_name: Joi.string().optional().default('Device User'),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
       return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { data, error: regError } = await supabase
      .from('users')
      .upsert([value], { onConflict: 'emp_id' })
      .select();

    if (regError) throw regError;

    res.status(201).json({ success: true, message: 'User registered/updated from device', data: data[0] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get all users for device synchronization
 */
const syncUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('emp_id, full_name, device_pin');

    if (error) throw error;

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  logAttendance,
  deviceRegisterUser,
  syncUsers
};
