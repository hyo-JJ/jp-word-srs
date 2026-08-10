import { supabase } from '../lib/supabaseClient'

const LEGACY_LOCAL_KEY = 'jp-word-srs-v3'

export function defaultData() {
  return {
    version: 3,
    cards: {}, // wordId -> { wordId, level, status, knownOnFlashcard, correctStreak, nextRecheckDate }
    days: {}, // day -> { flashcardDone, mode1Score, mode2Score, avgScore, passed, attempts, completed }
    wrongPool: [], // wordId 목록 (일차 구분 없이 누적)
    events: [], // { date, kind: 'flashcard'|'mode1'|'mode2'|'mc'|'recheck', wordId, correct }
    completedDays: [], // 70% 통과로 완료 처리된 Day 번호 목록
    levelUnlocked: { N5: true },
  }
}

function readLegacyLocalData() {
  try {
    const raw = localStorage.getItem(LEGACY_LOCAL_KEY)
    if (!raw) return null
    return { ...defaultData(), ...JSON.parse(raw) }
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
  if (row) return { ...defaultData(), ...row.data }

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
