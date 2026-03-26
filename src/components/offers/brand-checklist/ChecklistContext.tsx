'use client'

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { categories, TOTAL_ITEMS, MAX_SCORE } from './data/categories'
import { getBand, type Band } from './data/scoring'

export type CheckValue = 'yes' | 'part' | 'no'

type ChecklistState = {
  items: Record<string, CheckValue | null>
}

type ChecklistAction =
  | { type: 'SET'; itemId: string; value: CheckValue }
  | { type: 'CLEAR'; itemId: string }
  | { type: 'RESET' }

function buildInitialItems(): Record<string, null> {
  const items: Record<string, null> = {}
  categories.forEach((cat, ci) => {
    cat.items.forEach((_, ii) => {
      items[`${ci}-${ii}`] = null
    })
  })
  return items
}

const initialState: ChecklistState = { items: buildInitialItems() }

function reducer(state: ChecklistState, action: ChecklistAction): ChecklistState {
  switch (action.type) {
    case 'SET':
      return { items: { ...state.items, [action.itemId]: action.value } }
    case 'CLEAR':
      return { items: { ...state.items, [action.itemId]: null } }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function scoreOf(val: CheckValue | null): number {
  if (val === 'yes') return 2
  if (val === 'part') return 1
  return 0
}

type DerivedState = {
  totalScore: number
  maxScore: number
  answeredCount: number
  totalItems: number
  yesCount: number
  partCount: number
  noCount: number
  band: Band | null
  progress: number
}

type ChecklistContextValue = {
  items: Record<string, CheckValue | null>
  derived: DerivedState
  toggle: (itemId: string, value: CheckValue) => void
  reset: () => void
}

const ChecklistContext = createContext<ChecklistContextValue | null>(null)

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const derived = useMemo<DerivedState>(() => {
    const values = Object.values(state.items)
    const answered = values.filter((v) => v !== null)
    const totalScore = values.reduce((sum, v) => sum + scoreOf(v), 0)

    return {
      totalScore,
      maxScore: MAX_SCORE,
      answeredCount: answered.length,
      totalItems: TOTAL_ITEMS,
      yesCount: values.filter((v) => v === 'yes').length,
      partCount: values.filter((v) => v === 'part').length,
      noCount: values.filter((v) => v === 'no').length,
      band: answered.length > 0 ? getBand(totalScore) : null,
      progress: (answered.length / TOTAL_ITEMS) * 100,
    }
  }, [state.items])

  const toggle = useCallback((itemId: string, value: CheckValue) => {
    dispatch(
      state.items[itemId] === value
        ? { type: 'CLEAR', itemId }
        : { type: 'SET', itemId, value },
    )
  }, [state.items])

  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return (
    <ChecklistContext.Provider value={{ items: state.items, derived, toggle, reset }}>
      {children}
    </ChecklistContext.Provider>
  )
}

export function useChecklist() {
  const ctx = useContext(ChecklistContext)
  if (!ctx) throw new Error('useChecklist must be used within ChecklistProvider')
  return ctx
}
