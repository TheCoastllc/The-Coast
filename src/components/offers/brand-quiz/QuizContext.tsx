'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { questions } from './data/questions'
import { getTier, type ResultTier } from './data/results'

type Screen = 'intro' | 'question' | 'email' | 'results'

type QuizState = {
  screen: Screen
  currentQuestion: number
  answers: (number | null)[]
  score: number
  resultTier: ResultTier | null
  email: string
  submitting: boolean
  submitted: boolean
}

type QuizAction =
  | { type: 'START' }
  | { type: 'SELECT_ANSWER'; questionIndex: number; answerIndex: number }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SHOW_RESULTS' }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_DONE' }
  | { type: 'RESTART' }

function computeScore(answers: (number | null)[]): number {
  return answers.reduce<number>((sum, ansIdx, qIdx) => {
    if (ansIdx === null) return sum
    return sum + questions[qIdx].answers[ansIdx].points
  }, 0)
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START':
      return { ...state, screen: 'question', currentQuestion: 0, answers: new Array(10).fill(null), score: 0, resultTier: null }

    case 'SELECT_ANSWER': {
      const newAnswers = [...state.answers]
      newAnswers[action.questionIndex] = action.answerIndex
      return { ...state, answers: newAnswers }
    }

    case 'NEXT': {
      if (state.currentQuestion < questions.length - 1) {
        return { ...state, currentQuestion: state.currentQuestion + 1 }
      }
      return { ...state, screen: 'email' }
    }

    case 'PREV':
      if (state.currentQuestion > 0) {
        return { ...state, currentQuestion: state.currentQuestion - 1 }
      }
      return state

    case 'SHOW_RESULTS': {
      const score = computeScore(state.answers)
      return { ...state, screen: 'results', score, resultTier: getTier(score) }
    }

    case 'SET_EMAIL':
      return { ...state, email: action.email }

    case 'SUBMIT_START':
      return { ...state, submitting: true }

    case 'SUBMIT_DONE': {
      const score = computeScore(state.answers)
      return { ...state, submitting: false, submitted: true, screen: 'results', score, resultTier: getTier(score) }
    }

    case 'RESTART':
      return initialState

    default:
      return state
  }
}

const initialState: QuizState = {
  screen: 'intro',
  currentQuestion: 0,
  answers: new Array(10).fill(null),
  score: 0,
  resultTier: null,
  email: '',
  submitting: false,
  submitted: false,
}

type QuizContextValue = {
  state: QuizState
  dispatch: React.Dispatch<QuizAction>
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState)
  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider')
  return ctx
}
