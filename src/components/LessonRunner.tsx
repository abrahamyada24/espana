import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Exercise } from '../types'
import { ExerciseView } from './ExerciseView'
import { ProgressBar } from './ProgressBar'
import { Icon } from './Icon'

export interface LessonResult {
  score: number // 0–100, based on first attempts
  xp: number
  mistakes: Exercise[]
}

/**
 * Runs a list of exercises. Wrong answers are re-queued at the end
 * (mastery learning): the lesson ends only when everything is answered correctly.
 */
export function LessonRunner({
  exercises,
  onFinish,
  exitTo,
}: {
  exercises: Exercise[]
  onFinish: (r: LessonResult) => void
  exitTo: string
}) {
  const [queue, setQueue] = useState<Exercise[]>(exercises)
  const [pos, setPos] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [firstWrong, setFirstWrong] = useState<Set<string>>(new Set())
  const [combo, setCombo] = useState(0)
  const [solved, setSolved] = useState(0)

  const total = exercises.length
  const current = queue[pos]

  function done(correct: boolean) {
    let nextQueue = queue
    let nextWrong = firstWrong
    if (!correct) {
      nextQueue = [...queue, current]
      if (!firstWrong.has(current.key)) {
        nextWrong = new Set(firstWrong).add(current.key)
        setFirstWrong(nextWrong)
      }
      setQueue(nextQueue)
      setCombo(0)
    } else {
      setCombo((c) => c + 1)
      setSolved((n) => n + 1)
    }
    const next = pos + 1
    if (next >= nextQueue.length) {
      const score = Math.round(((total - nextWrong.size) / total) * 100)
      const xp = 10 + Math.round(score / 10) + (score === 100 ? 5 : 0)
      onFinish({ score, xp, mistakes: exercises.filter((e) => nextWrong.has(e.key)) })
      return
    }
    setPos(next)
    setAttempt((a) => a + 1)
  }

  return (
    <div className="lesson">
      <div className="lesson-top">
        <Link to={exitTo} className="close" aria-label="Keluar dari latihan">
          <Icon name="x" size={22} />
        </Link>
        <ProgressBar value={solved} max={total} />
        {combo >= 3 && <span className="combo">{combo} beruntun</span>}
      </div>
      {queue.length > total && pos >= total && <p className="retry-note">Ulangi soal yang tadi salah</p>}
      <ExerciseView key={`${current.key}-${attempt}`} ex={current} onDone={done} />
    </div>
  )
}

