import { addDaysStr } from '../srs/srs'

// 알림은 실제로 발송하지 않고, 멘토가 설정한 주기를 마지막 설정 시각(updated_at) 기준으로
// "다음 알림 예정일"만 계산해서 화면에 표시한다.
export function nextReminderDate(settings) {
  if (!settings?.reminder_interval_days || !settings.updated_at) return null
  const anchor = settings.updated_at.slice(0, 10)
  return addDaysStr(anchor, settings.reminder_interval_days)
}

export function hasHomework(settings) {
  return !!(settings && settings.homework_day_start && settings.homework_day_end)
}
