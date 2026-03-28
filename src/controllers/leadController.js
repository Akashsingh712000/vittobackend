const { pool } = require('../config/db');
const { z } = require('zod');

// Schema validation for incoming web lead
const leadSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  institution_name: z.string().min(2, "Institution name is required"),
  institution_type: z.enum(["Bank", "NBFC", "MFI"]),
  city: z.string().min(2, "City is required"),
  loan_book_size: z.number().positive().optional(),
});

/**
 * POST /api/leads
 * Saves organization details to PostgreSQL
 */
const createLead = async (req, res, next) => {
  try {
    const data = leadSchema.parse(req.body);

    const query = `
      INSERT INTO leads (email, phone, institution_name, institution_type, city, loan_book_size)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      data.email,
      data.phone,
      data.institution_name,
      data.institution_type,
      data.city,
      data.loan_book_size || null,
    ];

    const result = await pool.query(query, values);
    
    // We send back 201 Created and the new lead object that PG returns
    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      // Postgres unique violation error code
      return res.status(409).json({
        success: false,
        message: "A lead with this email or phone already exists",
      });
    }
    next(error);
  }
};

/**
 * GET /api/leads/:id
 * Retrieves lead record by ID
 */
const getLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Simple UUID validation
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const query = `SELECT * FROM leads WHERE id = $1`;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({
      success: true,
      lead: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLead,
};
