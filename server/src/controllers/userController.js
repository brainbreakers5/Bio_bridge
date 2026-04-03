const supabase = require('../utils/supabaseClient');
const Joi = require('joi');

/**
 * Get all users from Supabase
 */
const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Register a new user in Supabase
 */
const registerUser = async (req, res) => {
  try {
    const schema = Joi.object({
      emp_id: Joi.string().required(),
      full_name: Joi.string().required(),
      email: Joi.string().email(),
      department: Joi.string(),
      designation: Joi.string(),
      device_pin: Joi.string(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { data, error: registerError } = await supabase
      .from('users')
      .insert([value])
      .select();

    if (registerError) throw registerError;

    res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  registerUser
};
