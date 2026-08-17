import { Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'
import { JLPT_BLOCKS, isBlockUnlocked } from '../utils/jlptTest'
import BackButton from '../components/BackButton'

export default function GamesHub() {
  const { data } = useApp()

  return (
    <div>
      <div className="page-header">
        <BackButton />
        <h1>🎮 게임</h1>
        <p>문장게임으로 감을 잡고, JLPT 모의고사로 실력을 확인해보세요</p>
      </div>

      <div className="section-title">문장게임</div>
      <Link to="/sentence-game" className="home-nav-card" style={{ marginBottom: 16 }}>
        <span className="icon">🧩</span>
        <span className="title">예문 순서 맞추기</span>
        <span className="sub">배운 단어의 예문으로 어순 연습</span>
      </Link>

      <div className="section-title">JLPT 모의고사</div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: -8, marginBottom: 12 }}>
        Day 7 · 14 · 21 · 28을 통과할 때마다 한 회차씩 열려요 (문자·어휘 15 + 문법 10 + 독해 5, 총 30문제)
      </p>
      <div className="jlpt-block-grid">
        {JLPT_BLOCKS.map((b) => {
          const unlocked = isBlockUnlocked(b.block, data.completedDays)
          const result = data.jlptTests?.[b.block]
          const cls = `jlpt-block-card${unlocked ? ' unlocked' : ' locked'}`
          const content = (
            <>
              <span className="jlpt-block-num">{b.block}회</span>
              <span className="jlpt-block-range">
                Day {b.startDay}~{b.endDay}
              </span>
              {unlocked ? (
                <span className="jlpt-block-score">{result ? `최고 ${result.bestCorrect}/${result.bestTotal}` : '응시 전'}</span>
              ) : (
                <span className="jlpt-block-score">🔒 잠김</span>
              )}
            </>
          )
          return unlocked ? (
            <Link key={b.block} to={`/jlpt/${b.block}`} className={cls}>
              {content}
            </Link>
          ) : (
            <div key={b.block} className={cls}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
