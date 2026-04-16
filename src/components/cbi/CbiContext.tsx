'use client'

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { CbiPillarId } from './data/questions'
import { getWave, type WaveResult } from './data/waves'

export type CbiPhase = 'hero' | 'intake' | 'questions' | 'gate' | 'result'

export type CbiForm = {
  name: string
  brand: string
  website: string
  email: string
}

export type CbiAnswers = Partial<Record<CbiPillarId, number>>

type CbiState = {
  phase: CbiPhase
  form: CbiForm
  qIdx: number
  answers: CbiAnswers
  submitting: boolean
  submitted: boolean
  error: string | null
}

type CbiAction =
  | { type: 'SET_PHASE'; phase: CbiPhase }
  | { type: 'UPDATE_FORM'; patch: Partial<CbiForm> }
  | { type: 'SET_QIDX'; qIdx: number }
  | { type: 'ANSWER'; pillar: CbiPillarId; value: number }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_DONE' }
  | { type: 'SUBMIT_ERROR'; error: string }

const initialState: CbiState = {
  phase: 'hero',
  form: { name: '', brand: '', website: '', email: '' },
  qIdx: 0,
  answers: {},
  submitting: false,
  submitted: false,
  error: null,
}

function reducer(state: CbiState, action: CbiAction): CbiState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase }
    case 'UPDATE_FORM':
      return { ...state, form: { ...state.form, ...action.patch } }
    case 'SET_QIDX':
      return { ...state, qIdx: Math.max(0, action.qIdx) }
    case 'ANSWER':
      return { ...state, answers: { ...state.answers, [action.pillar]: action.value } }
    case 'SUBMIT_START':
      return { ...state, submitting: true, error: null }
    case 'SUBMIT_DONE':
      return { ...state, submitting: false, submitted: true, error: null, phase: 'result' }
    case 'SUBMIT_ERROR':
      return { ...state, submitting: false, error: action.error }
    default:
      return state
  }
}

type Derived = {
  total: number
  wave: WaveResult
}

type CbiContextValue = {
  state: CbiState
  dispatch: React.Dispatch<CbiAction>
  derived: Derived
}

const CbiContext = createContext<CbiContextValue | null>(null)

export function CbiProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const derived = useMemo<Derived>(() => {
    const total = Object.values(state.answers).reduce<number>((s, v) => s + (v ?? 0), 0)
    return { total, wave: getWave(total) }
  }, [state.answers])

  const value = useMemo(() => ({ state, dispatch, derived }), [state, derived])

  return <CbiContext.Provider value={value}>{children}</CbiContext.Provider>
}

export function useCbi() {
  const ctx = useContext(CbiContext)
  if (!ctx) throw new Error('useCbi must be used within CbiProvider')
  return ctx
}
