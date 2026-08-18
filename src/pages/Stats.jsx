import { useEffect, useState } from 'react'
import { useApp } from '../store/AppDataContext'
import { useAuth } from '../store/AuthContext'
import { supabase } from '../lib/supabaseClient'
import StatTile from '../components/StatTile'
import BackButton from '../components/BackButton'
import { isLevelUnlocked } from '../srs/mastery'
import { LEVELS } from '../data/words'

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']
const ROADMAP_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']
const MEDAL = ['🥇', '🥈', '🥉']
const MIN_ATTEMPTS_FOR_RANK = 20

export default function Stats() {
  const { stats, reset } = useApp()
  const { user, signOut } = useAuth()
  const [ranking, setRanking] = useState(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    async function load() {
      const { data: profiles } = await supabase.from('profiles').select('id, username, nickname').eq('role', 'mentee').eq('approved', true)
      if (cancelled || !profiles) return
      const ids = profiles.map((p) => p.id)
      const { data: appRows } = ids.length
        ? await supabase.from('user_app_data').select('user_id, data').in('user_id', ids)
        : { data: [] }
      if (cancelled) return
      const recallKinds = ['mode1', 'mode2', 'mc', 'recheck']
      const statsById = Object.fromEntries(
        (appRows || []).map((r) => {
          const events = (r.data?.events || []).filter((e) => recallKinds.includes(e.kind))
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

          return [
            r.user_id,
            {
              mastered,
              total: events.length,
              correct,
              accuracy: events.length ? correct / events.length : 0,
              completedCount,
              progress,
            },
          ]
        })
      )
      const rows = profiles
        .map((p) => {
          const s = statsById[p.id] || { mastered: 0, total: 0, correct: 0, accuracy: 0, completedCount: 0, progress: null }
          return { id: p.id, name: p.nickname || p.username || '이름없음', ...s }
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
      setRanking(rows)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user])

  function handleReset() {
    if (window.confirm('모든 학습 기록을 초기화할까요? 이 작업은 되돌릴 수 없어요.')) {
      reset()
    }
  }

  return (
    <div>
      <div className="page-header">
        <BackButton />
        <h1>통계</h1>
      </div>

      <div className="stat-grid">
        <StatTile icon="🔥" label="연속 학습" value={stats.streak} unit="일" tone="coral" />
        <StatTile
          icon="✅"
          label="오늘 정답률"
          value={stats.todayRecallDone ? Math.round((stats.todayRecallCorrect / stats.todayRecallDone) * 100) : 0}
          unit="%"
          tone="sky"
        />
        <StatTile icon="📗" label="오늘 암기" value={stats.todayFlashcardDone} unit="개" tone="mint" />
        <StatTile
          icon="✏️"
          label="오늘 복습"
          value={stats.todayRecallCorrect}
          unit={`/ ${stats.todayRecallDone}`}
          tone="butter"
        />
        <StatTile icon="📘" label="완료한 Day" value={stats.completedDays} unit={`/ ${stats.dayCount}`} tone="mint" />
        <StatTile icon="📝" label="오답노트" value={stats.wrongPoolCount} unit="개" tone="coral" />
      </div>

      {ranking && ranking.length > 0 && (
        <>
          <div className="section-title">🏆 정답률 랭킹</div>
          <div className="card">
            {ranking.map((r, i) => (
              <div className={`rank-row${r.id === user?.id ? ' is-me' : ''}`} key={r.id}>
                <span className="rank-medal">{MEDAL[i] || i + 1}</span>
                <span className="rank-name">
                  <span className="rank-name-row">
                    {r.name}
                    {r.id === user?.id && <span className="rank-me-badge">나</span>}
                  </span>
                  {r.progress && (
                    <span className="rank-progress">
                      {r.progress.level} Day {r.progress.day}까지
                    </span>
                  )}
                </span>
                <span className="rank-value">
                  {r.total >= MIN_ATTEMPTS_FOR_RANK ? (
                    <span>정답률 {Math.round(r.accuracy * 100)}%</span>
                  ) : (
                    <>
                      <span>{r.total}/{MIN_ATTEMPTS_FOR_RANK}문제</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                        정답률 집계까지 {MIN_ATTEMPTS_FOR_RANK - r.total}문제 남음
                      </span>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="section-title">최근 7일 정답률</div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
          {stats.trend.map((t) => (
            <div key={t.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: '100%',
                  height: 70,
                  display: 'flex',
                  alignItems: 'flex-end',
                  background: 'var(--surface-2)',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: t.accuracy === null ? 0 : `${t.accuracy * 100}%`,
                    background: 'var(--accent)',
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {WEEKDAY[new Date(t.date + 'T00:00:00').getDay()]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">레벨별 진행률</div>
      <div className="card">
        {stats.levelStats.map((ls) => (
          <div key={ls.level} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span>{ls.level}</span>
              <span style={{ color: 'var(--text-muted)' }}>
                완전암기 {ls.mastered} · 오답노트 {ls.wrongPoolCount} · 학습중 {ls.learning} · 전체 {ls.total}
              </span>
            </div>
            <div className="progress-bar">
              <div style={{ width: `${ls.total ? (ls.mastered / ls.total) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">급수 로드맵</div>
      <div className="card">
        <div className="level-roadmap">
          {ROADMAP_LEVELS.map((level) => {
            const ls = stats.levelStats.find((s) => s.level === level)
            let cls = 'level-roadmap-item'
            let sub = '단어 준비 중'
            if (ls) {
              if (ls.allDaysDone && ls.unlocked && isLevelUnlocked(ls.rate)) {
                cls += ' unlocked'
                sub = '완료'
              } else if (ls.unlocked) {
                cls += ' current'
                sub = `${Math.round(ls.rate * 100)}%`
              } else {
                sub = '🔒 잠김'
              }
            }
            return (
              <div key={level} className={cls}>
                {level}
                <span className="sub">{sub}</span>
              </div>
            )
          })}
        </div>
        {stats.levelStats
          .filter((ls) => ls.allDaysDone && !isLevelUnlocked(ls.rate))
          .map((ls) => (
            <p key={ls.level} style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>
              {ls.level} {ls.dayCount}일을 모두 완료했지만 전체 암기율이 {Math.round(ls.rate * 100)}%예요. 90%
              이상이어야 다음 급수가 열려요 — 아래 부족한 단어를 오답노트에서 더 복습해보세요.
            </p>
          ))}
      </div>

      {Object.entries(stats.weakWordsByLevel).map(([level, words]) =>
        words.length > 0 ? (
          <div key={level}>
            <div className="section-title">
              {level} 부족한 단어 ({words.length})
            </div>
            <div className="card">
              {words.map((w) => (
                <div className="word-row" key={w.id}>
                  <div className="main">
                    <div className="word">
                      {w.word}
                      {w.word !== w.reading && <span className="reading"> · {w.reading}</span>}
                    </div>
                    <div className="meaning">{w.meaning}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}

      <div className="section-title">설정</div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}로 로그인 중</p>
        <button className="btn btn-ghost" onClick={signOut}>
          로그아웃
        </button>
        <button className="btn btn-danger" onClick={handleReset}>
          학습 기록 초기화
        </button>
      </div>
    </div>
  )
}
