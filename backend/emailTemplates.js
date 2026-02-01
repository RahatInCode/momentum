const FRONTEND_URL = process.env.FRONTEND_URL

exports.welcomeEmail = (userName) => ({
  subject: 'Welcome to Momentum! 🚀',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0;">🎯 Welcome to Momentum!</h1>
      </div>
      <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <h2>Hi ${userName}! 👋</h2>
        <p>We're thrilled to have you join us on your journey to build better habits!</p>
        <h3>Getting Started:</h3>
        <ol>
          <li><strong>Add your first habit</strong> — What do you want to build or break?</li>
          <li><strong>Set up reminders</strong> — Choose when you want to be notified</li>
          <li><strong>Track your progress</strong> — Build streaks and stay motivated</li>
        </ol>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${FRONTEND_URL}" style="padding: 12px 32px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Get Started</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Happy habit building! 💪 — The Momentum Team</p>
      </div>
    </div>
  `,
})

exports.habitReminderEmail = (userName, habitName, reminderTime) => ({
  subject: `⏰ Reminder: ${habitName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0;">⏰ Time for Your Habit!</h1>
      </div>
      <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <h2>Hey ${userName}! 👋</h2>
        <p>This is your friendly reminder:</p>
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin: 0 0 8px 0; color: #92400e;">${habitName}</h2>
          <p style="margin: 0; color: #78350f;">Scheduled: ${reminderTime}</p>
        </div>
        <p>Every action counts! Take a moment now to complete this habit.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${FRONTEND_URL}" style="padding: 12px 32px; background: #f59e0b; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Mark as Complete</a>
        </div>
      </div>
    </div>
  `,
})

exports.dailyDigestEmail = (userName, habits, date) => {
  const completed = habits.filter(h => h.completed).length
  const total = habits.length
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0

  const rows = habits.map(h => `
    <div style="padding: 14px; border-left: 4px solid ${h.completed ? '#10b981' : '#ef4444'}; margin-bottom: 10px; background: ${h.completed ? '#f0fdf4' : '#fef2f2'}; border-radius: 8px;">
      <strong>${h.completed ? '✅' : '❌'} ${h.name}</strong><br>
      <small style="color: #6b7280;">Streak: ${h.currentStreak} days | Best: ${h.longestStreak} days</small>
    </div>
  `).join('')

  return {
    subject: `📊 Your Daily Report — ${rate}% Complete`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0;">📊 Daily Momentum Report</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">${new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2>Hi ${userName}! 👋</h2>
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <div style="font-size: 14px; opacity: 0.9;">Completion Rate</div>
            <div style="font-size: 64px; font-weight: bold; margin: 8px 0;">${rate}%</div>
            <div style="opacity: 0.9;">${completed} of ${total} habits completed</div>
          </div>
          ${rate === 100 ? `<div style="background: #10b981; color: white; padding: 18px; border-radius: 10px; text-align: center; margin: 20px 0;"><strong>🎉 Perfect Day!</strong> You completed every habit!</div>` : ''}
          <h3>Your Habits</h3>
          ${rows}
          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}" style="padding: 12px 32px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">View Dashboard</a>
          </div>
        </div>
      </div>
    `,
  }
}

exports.passwordResetEmail = (resetToken) => ({
  subject: '🔐 Reset Your Momentum Password',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0;">🔐 Password Reset</h1>
      </div>
      <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p>We received a request to reset your Momentum password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${FRONTEND_URL}/reset-password?token=${resetToken}" style="padding: 12px 32px; background: #ef4444; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        </div>
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; border-radius: 8px;">
          <p style="margin: 0; color: #991b1b;"><strong>⚠️</strong> This link expires in 1 hour.</p>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">If you didn't request this, safely ignore this email.</p>
      </div>
    </div>
  `,
})