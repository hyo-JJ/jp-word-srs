import { supabase } from '../lib/supabaseClient'
import { LEVELS } from '../data/words'

const LEGACY_LOCAL_KEY = 'jp-word-srs-v3'

export function defaultData() {
  return {
    version: 4,
    cards: {}, // wordId -> { wordId, level, status, correctStreak, nextRecheckDate }
    levelDays: Object.fromEntries(LEVELS.map((level) => [level, { days: {}, completedDays: [] }])),
    // days: day -> { flashcardDone, mode1Score, mode2Score, avgScore, passed, attempts, completed }
    // completedDays: 70% 통과로 완료 처리된 Day 번호 목록
    wrongPool: [], // wordId 목록 (일차 구분 없이 누적)
    events: [], // { date, kind: 'flashcard'|'mode1'|'mode2'|'mc'|'recheck', wordId, correct }
    levelUnlocked: { N5: true },
    jlptTests: {}, // block(1~4) -> { attempts, lastCorrect, lastTotal, bestCorrect, bestTotal }
  }
}

// v3(N5 전용, days/completedDays가 최상위 필드)에서 v4(레벨별 levelDays)로 이관.
// 최상위 days/completedDays는 건드리지 않고(=구버전 필드 그대로 남김) levelDays.N5로 값만 복사한다.
function migrateLevelDays(data) {
  if (!data.levelDays) data.levelDays = {}
  if (!data.levelDays.N5) {
    data.levelDays.N5 = { days: data.days || {}, completedDays: data.completedDays || [] }
  }
  for (const level of LEVELS) {
    if (!data.levelDays[level]) data.levelDays[level] = { days: {}, completedDays: [] }
  }
  return data
}

function readLegacyLocalData() {
  try {
    const raw = localStorage.getItem(LEGACY_LOCAL_KEY)
    if (!raw) return null
    return migrateLevelDays({ ...defaultData(), ...JSON.parse(raw) })
  } catch {
    return null
  }
}

// 로그인한 사용자의 데이터를 Supabase에서 읽어온다.
// 아직 서버에 저장된 적 없는 첫 로그인이면, 로그인 전(로컬) 테스트 데이터를 1회 이관한다.
export async function loadData(userId) {
  const { data: row, error } = await supabase
    .from('user_app_data')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  if (row) return migrateLevelDays({ ...defaultData(), ...row.data })

  const initial = readLegacyLocalData() || defaultData()
  await saveData(userId, initial)
  return initial
}

export async function saveData(userId, data) {
  const { error } = await supabase
    .from('user_app_data')
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() })
  if (error) throw error
}

export async function resetData(userId) {
  const fresh = defaultData()
  await saveData(userId, fresh)
  return fresh
}
