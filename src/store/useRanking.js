import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabaseClient'
import { LEVELS } from '../data/words'

export const MIN_ATTEMPTS_FOR_RANK = 20
const RECALL_KINDS = ['mode1', 'mode2', 'mc', 'recheck']

function levelLabel(points) {
  if (points >= 800) return 'Gold'
  if (points >= 300) return 'Silver'
  return 'Bronze'
}

// 승인된 멘티 전원의 진행도를 모아 정답률 기준으로 순위를 매긴다.
// Stats 페이지와 Home 화면 리더보드가 이 훅 하나를 공유한다.
export function useRanking() {
  const { user } = useAuth()
  const [ranking, setRanking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    async function load() {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, nickname')
        .eq('role', 'mentee')
        .eq('approved', true)
      if (cancelled || !profiles) return
      const ids = profiles.map((p) => p.id)
      const { data: appRows } = ids.length
        ? await supabase.from('user_app_data').select('user_id, data').in('user_id', ids)
        : { data: [] }
      if (cancelled) return

      const statsById = Object.fromEntries(
        (appRows || []).map((r) => {
          const events = (r.data?.events || []).filter((e) => RECALL_KINDS.includes(e.kind))
          const correct = events.filter((e) => e.correct).length
          const mastered = Object.values(r.data?.cards || {}).filter((c) => c.status === 'mastered').length
          const completedCount = r.data?.levelDays
            ? Object.values(r.data.levelDays).reduce((sum, ld) => sum + (ld.completedDays?.length || 0), 0)
            : (r.data?.completedDays || []).length

          // 가장 진도가 나간 급수·Day (예: N4 Day 12까지) — LEVELS 순서상 뒤에 있을수록 우선
          let progress = null
          for (const level of LEVELS) {
            const days = r.data?.levelDays?.[level]?.completedDays || []
            if (days.length > 0) progress = { level, day: Math.max(...days) }
          }

          const points = mastered * 10 + completedCount * 20 + correct

          return [
            r.user_id,
            {
              mastered,
              total: events.length,
              correct,
              accuracy: events.length ? correct / events.length : 0,
              completedCount,
              progress,
              points,
            },
          ]
        })
      )

      const rows = profiles
        .map((p) => {
          const s = statsById[p.id] || {
            mastered: 0,
            total: 0,
            correct: 0,
            accuracy: 0,
            completedCount: 0,
            progress: null,
            points: 0,
          }
          return { id: p.id, name: p.nickname || p.username || '이름없음', level: levelLabel(s.points), ...s }
        })
        .sort((a, b) => {
          const aQualified = a.total >= MIN_ATTEMPTS_FOR_RANK
          const bQualified = b.total >= MIN_ATTEMPTS_FOR_RANK
          if (aQualified !== bQualified) return aQualified ? -1 : 1
          if (aQualified) {
            return b.accuracy - a.accuracy || b.total - a.total || b.completedCount - a.completedCount || b.mastered - a.mastered
          }
          return b.total - a.total || b.completedCount - a.completedCount
        })

      if (!cancelled) {
        setRanking(rows)
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user])

  return { ranking, loading }
}
