const STORAGE_KEY = 'jp-word-srs-v2'

export function defaultData() {
  return {
    version: 2,
    cards: {}, // wordId -> SrsCard
    events: [], // { date, kind: 'new'|'review', wordId, correct }
    completedDays: [], // 암기 + 백지 복습까지 끝낸 Day 번호 목록
    levelUnlocked: { N5: true },
  }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData()
    const parsed = JSON.parse(raw)
    return { ...defaultData(), ...parsed }
  } catch {
    return defaultData()
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY)
  return defaultData()
}
