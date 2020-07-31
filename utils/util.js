const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTime_ymd = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/')
}
const formatTime_hm = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}
const formatDate_month = date => {
  const month = date.getMonth() + 1

  return [month].map(formatNumber)
}
const formatDate_day = date => {
  const day = date.getDate()

  return [day].map(formatNumber)
}
const formatDate_year = date => {
  const year = date.getFullYear()

  return [year].map(formatNumber)
}
const formatDate_hour = date => {
  const hour = date.getHours()

  return [hour].map(formatNumber)
}
const formatDate_minute = date => {
  const minute = date.getMinutes()

  return [minute].map(formatNumber)
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime_ymd: formatTime_ymd,
  formatTime_hm: formatTime_hm,
  formatDate_month: formatDate_month,
  formatDate_day: formatDate_day,
  formatDate_year:formatDate_year,
  formatDate_hour:formatDate_hour,
  formatDate_minute:formatDate_minute,
}