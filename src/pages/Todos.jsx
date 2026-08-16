import { useEffect, useState } from 'react'
import { useApp } from '../store/AppDataContext'
import { useAuth } from '../store/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { hasHomework } from '../utils/mentorSettings'
import HomeworkChecklist from '../components/HomeworkChecklist'
import TodoList from '../components/TodoList'

export default function Todos() {
  const { data, addTodo, toggleTodo, deleteTodo } = useApp()
  const { user } = useAuth()
  const [mentorSettings, setMentorSettings] = useState(null)
  const [tab, setTab] = useState('mine') // 'mentor' | 'mine'

  useEffect(() => {
    if (!user) return
    let cancelled = false
    supabase
      .from('mentor_settings')
      .select('*')
      .eq('mentee_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setMentorSettings(data)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  return (
    <div>
      <div className="page-header">
        <h1>투두리스트</h1>
        <p>멘토가 준 숙제와 내가 직접 적은 할 일을 나눠서 확인해요</p>
      </div>

      <div className="chip-row">
        <button className={`chip ${tab === 'mentor' ? 'active' : ''}`} onClick={() => setTab('mentor')}>
          멘토가 준 숙제
        </button>
        <button className={`chip ${tab === 'mine' ? 'active' : ''}`} onClick={() => setTab('mine')}>
          내 투두리스트
        </button>
      </div>

      {tab === 'mentor' &&
        (hasHomework(mentorSettings) ? (
          <HomeworkChecklist
            startDay={mentorSettings.homework_day_start}
            endDay={mentorSettings.homework_day_end}
            completedDays={data.completedDays}
            dueDate={mentorSettings.homework_due_date}
          />
        ) : (
          <div className="empty-state">
            <span className="emoji">🗒️</span>
            <h2>아직 배정된 숙제가 없어요</h2>
            <p>멘토가 숙제를 배정하면 여기에 Day별 체크리스트로 보여요.</p>
          </div>
        ))}

      {tab === 'mine' && <TodoList todos={data.todos} onAdd={addTodo} onToggle={toggleTodo} onDelete={deleteTodo} />}
    </div>
  )
}
