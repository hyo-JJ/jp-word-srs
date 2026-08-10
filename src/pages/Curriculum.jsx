import { Link } from 'react-router-dom'
import { useApp } from '../store/AppDataContext'

const STATUS_LABEL = {
  todo: '시작 전',
  in_progress: '진행 중',
  failed: '재도전 필요',
  done: '완료',
}

export default function Curriculum() {
  const { dayList } = useApp()

  return (
    <div>
      <div className="page-header">
        <h1>28일 커리큘럼</h1>
        <p>하루 분량을 골라 암기 → 백지 복습(모드1·모드2) 순서로 진행하세요</p>
      </div>

      <div className="day-grid">
        {dayList.map((d) => (
          <Link key={d.day} to={`/day/${d.day}`} className={`day-tile day-tile-${d.status}`}>
            <div className="day-tile-num">Day {d.day}</div>
            <div className="day-tile-count">{d.total}개</div>
            <div className="day-tile-status">{STATUS_LABEL[d.status]}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
