import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subWeeks,
  isToday,
  isSameDay,
  differenceInDays,
  parseISO,
} from 'date-fns'

export const formatDate = (date, pattern = 'yyyy-MM-dd') => {
  return format(date, pattern)
}

export const getToday = () => formatDate(new Date())

export const isTodayCheck = (dateString) => {
  return isToday(parseISO(dateString))
}

export const generateHeatmapDays = (weeksCount = 16) => {
  const today = new Date()
  const endDate = endOfWeek(today, { weekStartsOn: 0 })
  const startDate = startOfWeek(subWeeks(endDate, weeksCount - 1), {
    weekStartsOn: 0,
  })

  const days = eachDayOfInterval({ start: startDate, end: today })

  return days.map((date) => ({
    date: formatDate(date),
    dayOfWeek: date.getDay(),
    isToday: isToday(date),
  }))
}

export const calculateStreak = (completedDates) => {
  if (!completedDates.length) return 0

  const sorted = [...completedDates]
    .map((d) => parseISO(d))
    .sort((a, b) => b - a)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const mostRecent = sorted[0]
  mostRecent.setHours(0, 0, 0, 0)

  if (!isSameDay(mostRecent, today) && !isSameDay(mostRecent, yesterday)) {
    return 0
  }

  let streak = 1
  let currentDate = mostRecent

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = sorted[i]
    prevDate.setHours(0, 0, 0, 0)

    const diff = differenceInDays(currentDate, prevDate)

    if (diff === 1) {
      streak++
      currentDate = prevDate
    } else if (diff > 1) {
      break
    }
  }

  return streak
}

export const calculateLongestStreak = (completedDates) => {
  if (!completedDates.length) return 0

  const sorted = [...completedDates]
    .map((d) => parseISO(d))
    .sort((a, b) => a - b)

  let longest = 1
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInDays(sorted[i], sorted[i - 1])

    if (diff === 1) {
      current++
      longest = Math.max(longest, current)
    } else if (diff > 1) {
      current = 1
    }
  }

  return longest
}