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
        <p>멘토가 준 숙제와 내가 직접 적은 할 일을 한눈에 확인해요</p>
      </div>

      {hasHomework(mentorSettings) && (
        <HomeworkChecklist
          startDay={mentorSettings.homework_day_start}
          endDay={mentorSettings.homework_day_end}
          completedDays={data.completedDays}
          dueDate={mentorSettings.homework_due_date}
        />
      )}

      <TodoList todos={data.todos} onAdd={addTodo} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  )
}
