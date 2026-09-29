import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { pool, testConnection } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const otpStore = new Map();

const getTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

// ----------------------------------------------------------------------
// 1. HEALTH & SYSTEM CHECK
// ----------------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'ONLINE',
    system: 'Dhaanish Hostel Management Production Backend',
    database: dbStatus ? 'CONNECTED' : 'DISCONNECTED',
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------------------------
// 2. AUTHENTICATION & REGISTRATION
// ----------------------------------------------------------------------
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email.toLowerCase(), { otp: otpCode, expiresAt: Date.now() + 5 * 60 * 1000 });

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Dhaanish Hostel Management" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🔑 Dhaanish Hostel Registration - Security OTP Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
            <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; border: 2px solid #0b192c;">
              <h2 style="color: #0b192c; text-align: center; margin-top: 0;">DHAANISH CHENNAI AUTONOMOUS</h2>
              <p style="color: #c51605; font-weight: bold; text-align: center; margin-bottom: 20px;">HOSTEL REGISTRATION SECURITY CODE</p>
              <p style="color: #333333; font-size: 14px;">Your 6-digit security verification code for <strong>${email}</strong> is:</p>
              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <span style="font-family: monospace; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #0b192c;">${otpCode}</span>
              </div>
              <p style="color: #666666; font-size: 12px;">This code is valid for 5 minutes. Do not share this OTP with anyone.</p>
            </div>
          </div>
        `
      });
      console.log(`Real OTP email sent to ${email}`);
    } catch (err) {
      console.warn('SMTP Dispatch log:', err.message);
    }
  } else {
    console.log(`[SMTP Not Configured] OTP generated for ${email}: ${otpCode}`);
  }

  res.json({ success: true, message: `OTP sent to ${email}` });
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email.toLowerCase());
  if (!record) return res.status(400).json({ error: 'No OTP generated for this email' });
  if (Date.now() > record.expiresAt) return res.status(400).json({ error: 'OTP has expired. Please request a new code.' });
  if (record.otp !== otp) return res.status(400).json({ error: 'Invalid verification code.' });

  res.json({ success: true });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, role } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      // Auto-provision user account for first-time login
      const [result] = await pool.query(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, 'hash_pwd_default', role || 'Student']
      );
      return res.json({ success: true, user: { id: result.insertId, email, role } });
    }
    return res.json({ success: true, user: users[0] });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database login failed', details: err.message });
  }
});

app.post('/api/auth/register-student', async (req, res) => {
  const s = req.body;
  const studentId = s.id || `STU-${Date.now().toString().slice(-4)}`;
  try {
    await pool.query(
      `INSERT INTO students 
      (id, name, reg_no, department, year, block, floor, room, bed_no, hostel_id, photo_url, email, phone, parent_name, parent_contact, status, verification_status, join_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Present', 'Active', ?)`,
      [
        studentId, s.name, s.regNo, s.department, s.year, s.block, s.floor, s.room, s.bedNo,
        s.hostelId, s.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        s.email, s.phone, s.parentName, s.parentContact, new Date().toISOString().split('T')[0]
      ]
    );

    // Update block occupancy count in MySQL
    await pool.query('UPDATE hostel_blocks SET occupied = occupied + 1 WHERE name = ?', [s.block]);

    res.json({ success: true, studentId });
  } catch (err) {
    console.error('Student registration error:', err);
    res.status(500).json({ error: 'Student registration failed', details: err.message });
  }
});

app.post('/api/auth/register-staff', async (req, res) => {
  const st = req.body;
  const id = st.id || `STF-${Date.now().toString().slice(-4)}`;
  try {
    await pool.query(
      `INSERT INTO registered_staff 
      (id, name, email, role, staff_id, phone, assigned_block, assigned_dept, designation, join_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, st.name, st.email, st.role, st.staffId, st.phone,
        st.assignedBlock || null, st.assignedDept || null, st.designation || null,
        new Date().toISOString().split('T')[0]
      ]
    );
    res.json({ success: true, id });
  } catch (err) {
    console.error('Staff registration error:', err);
    res.status(500).json({ error: 'Staff registration failed', details: err.message });
  }
});

// ----------------------------------------------------------------------
// 3. STUDENT REGISTRY API
// ----------------------------------------------------------------------
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students ORDER BY join_date DESC');
    res.json(rows);
  } catch (err) {
    console.error('Fetch students error:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/students/:id/approve-verification', async (req, res) => {
  try {
    await pool.query("UPDATE students SET verification_status = 'Active' WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve verification' });
  }
});

app.post('/api/students/:id/attendance-status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE students SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update attendance status' });
  }
});

// ----------------------------------------------------------------------
// 4. OUTING REQUESTS & LEAVE PERMISSIONS API
// ----------------------------------------------------------------------
app.get('/api/outing-requests', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM outing_requests ORDER BY applied_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch outing requests' });
  }
});

app.post('/api/outing-requests', async (req, res) => {
  const r = req.body;
  const id = `REQ-${Date.now().toString().slice(-4)}`;
  const appliedAt = new Date().toLocaleString();
  try {
    await pool.query(
      `INSERT INTO outing_requests
      (id, student_id, student_name, reg_no, dept, year, room, block, type, destination, reason, out_time, return_time, parent_phone, status, applied_at, monthly_pass_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending CC', ?, FALSE)`,
      [
        id, r.studentId, r.studentName, r.regNo, r.dept, r.year, r.room, r.block,
        r.type, r.destination, r.reason, r.outTime, r.returnTime, r.parentPhone, appliedAt
      ]
    );
    res.json({ success: true, id });
  } catch (err) {
    console.error('Submit outing request error:', err);
    res.status(500).json({ error: 'Failed to submit outing request' });
  }
});

app.post('/api/outing-requests/:id/cc-approve', async (req, res) => {
  try {
    await pool.query("UPDATE outing_requests SET status = 'Pending Warden' WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'CC approval failed' });
  }
});

app.post('/api/outing-requests/:id/cc-reject', async (req, res) => {
  try {
    await pool.query("UPDATE outing_requests SET status = 'CC Rejected' WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'CC rejection failed' });
  }
});

app.post('/api/outing-requests/:id/warden-approve', async (req, res) => {
  const approvedAt = new Date().toLocaleString();
  try {
    await pool.query(
      "UPDATE outing_requests SET status = 'Approved', approved_at = ?, monthly_pass_verified = TRUE WHERE id = ?",
      [approvedAt, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Warden approval failed' });
  }
});

app.post('/api/outing-requests/:id/warden-reject', async (req, res) => {
  try {
    await pool.query("UPDATE outing_requests SET status = 'Warden Rejected' WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Warden rejection failed' });
  }
});

// ----------------------------------------------------------------------
// 5. WARDEN MONTHLY QR RENEWAL API
// ----------------------------------------------------------------------
app.get('/api/monthly-qr/latest', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM monthly_qr_tokens ORDER BY id DESC LIMIT 1');
    const token = rows.length > 0 ? rows[0].token : 'DHAANISH-HOSTEL-QR-SEP-2026-TOKEN-VERIFIED';
    res.json({ token });
  } catch (err) {
    res.json({ token: 'DHAANISH-HOSTEL-QR-SEP-2026-TOKEN-VERIFIED' });
  }
});

app.post('/api/monthly-qr/generate', async (req, res) => {
  const { newToken, monthYear, wardenId } = req.body;
  try {
    await pool.query(
      'INSERT INTO monthly_qr_tokens (token, month_year, warden_id) VALUES (?, ?, ?)',
      [newToken, monthYear || 'Current Month', wardenId || 'Chief Warden']
    );
    res.json({ success: true, token: newToken });
  } catch (err) {
    console.error('QR generation error:', err);
    res.status(500).json({ error: 'Failed to generate QR token' });
  }
});

// ----------------------------------------------------------------------
// 6. HOSTEL BLOCKS & STAFF API
// ----------------------------------------------------------------------
app.get('/api/blocks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hostel_blocks');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

app.get('/api/staff', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM registered_staff');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Dhaanish Hostel API Server running on port ${PORT}`);
  await testConnection();
});
