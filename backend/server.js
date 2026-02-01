require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const {
  welcomeEmail,
  habitReminderEmail,
  dailyDigestEmail,
  passwordResetEmail,
} = require('./emailTemplates')

const app = express()
const PORT = process.env.PORT || 3001

// --- Middleware ---
app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))

// --- Email Setup ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// --- In-Memory User Store (replace with a real DB in production) ---
const users = []

// --- JWT Auth Middleware ---
const authenticate = (req, res, next) => {
  const header = req.headers['authorization']
  const token = header && header.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

// ============================================================
// AUTH ROUTES
// ============================================================

// SIGN UP
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const exists = users.find((u) => u.email === email)
    if (exists) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = crypto.randomUUID()

    users.push({ userId, email, password: hashedPassword, name })

    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    // Send welcome email
    const welcome = welcomeEmail(name)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: welcome.subject,
      html: welcome.html,
    })

    res.json({ userId, email, name, token })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Signup failed' })
  }
})

// SIGN IN
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = users.find((u) => u.email === email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ userId: user.userId, email: user.email, name: user.name, token })
  } catch (err) {
    console.error('Signin error:', err)
    res.status(500).json({ error: 'Signin failed' })
  }
})

// SIGN OUT
app.post('/api/auth/signout', authenticate, (req, res) => {
  // JWT is stateless — just tell client to clear token
  res.json({ success: true })
})

// RESET PASSWORD
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body
    const user = users.find((u) => u.email === email)

    // Always return success to not reveal if email exists
    if (!user) {
      return res.json({ success: true })
    }

    const resetToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    const reset = passwordResetEmail(resetToken)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: reset.subject,
      html: reset.html,
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ error: 'Failed to send reset email' })
  }
})

// ============================================================
// NOTIFICATION ROUTES
// ============================================================

// SEND HABIT REMINDER EMAIL
app.post('/api/notifications/send-email', authenticate, async (req, res) => {
  try {
    const { email, habitName, reminderTime, userName } = req.body

    const reminder = habitReminderEmail(userName, habitName, reminderTime)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: reminder.subject,
      html: reminder.html,
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Send reminder error:', err)
    res.status(500).json({ error: 'Failed to send reminder email' })
  }
})

// SEND DAILY DIGEST EMAIL
app.post('/api/notifications/daily-digest', authenticate, async (req, res) => {
  try {
    const { email, userName, habits, date } = req.body

    const digest = dailyDigestEmail(userName, habits, date)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: digest.subject,
      html: digest.html,
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Daily digest error:', err)
    res.status(500).json({ error: 'Failed to send daily digest' })
  }
})

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`✅ Momentum backend running on http://localhost:${PORT}`)
})