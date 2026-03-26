'use client'

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { categories, TOTAL_ITEMS, MAX_SCORE } from './data/categories'
import { getBand, type Band } from './data/scoring'

export type CheckValue = 'yes' | 'part' | 'no'

type Screen = 'intro' | 'category' | 'email' | 'results'

type ChecklistState = {
  screen: Screen
  currentCategory: number
  items: Record<string, CheckValue | null>
}

type ChecklistAction =
  | { type: 'SET'; itemId: string; value: CheckValue }
  | { type: 'CLEAR'; itemId: string }
  | { type: 'START' }
  | { type: 'NEXT_CATEGORY' }
  | { type: 'PREV_CATEGORY' }
  | { type: 'SHOW_RESULTS' }
  | { type: 'RESTART' }

function buildInitialItems(): Record<string, null> {
  const items: Record<string, null> = {}
  categories.forEach((cat, ci) => {
    cat.items.forEach((_, ii) => {
      items[`${ci}-${ii}`] = null
    })
  })
  return items
}

const initialState: ChecklistState = {
  screen: 'intro',
  currentCategory: 0,
  items: buildInitialItems(),
}

function reducer(state: ChecklistState, action: ChecklistAction): ChecklistState {
  switch (action.type) {
    case 'SET':
      return { ...state, items: { ...state.items, [action.itemId]: action.value } }
    case 'CLEAR':
      return { ...state, items: { ...state.items, [action.itemId]: null } }
    case 'START':
      return { ...state, screen: 'category', currentCategory: 0 }
    case 'NEXT_CATEGORY':
      if (state.currentCategory >= categories.length - 1) {
        return { ...state, screen: 'email' }
      }
      return { ...state, currentCategory: state.currentCategory + 1 }
    case 'PREV_CATEGORY':
      if (state.currentCategory <= 0) return state
      return { ...state, currentCategory: state.currentCategory - 1 }
    case 'SHOW_RESULTS':
      return { ...state, screen: 'results' }
    case 'RESTART':
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
  categoryComplete: boolean
}

type ChecklistContextValue = {
  screen: Screen
  currentCategory: number
  items: Record<string, CheckValue | null>
  derived: DerivedState
  dispatch: (action: ChecklistAction) => void
  toggle: (itemId: string, value: CheckValue) => void
}

const ChecklistContext = createContext<ChecklistContextValue | null>(null)

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const derived = useMemo<DerivedState>(() => {
    const values = Object.values(state.items)
    const answered = values.filter((v) => v !== null)
    const totalScore = values.reduce((sum, v) => sum + scoreOf(v), 0)

    // Check if all items in current category are answered
    const cat = categories[state.currentCategory]
    const categoryComplete = cat
      ? cat.items.every((_, ii) => state.items[`${state.currentCategory}-${ii}`] !== null)
      : false

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
      categoryComplete,
    }
  }, [state.items, state.currentCategory])

  const toggle = useCallback((itemId: string, value: CheckValue) => {
    dispatch(
      state.items[itemId] === value
        ? { type: 'CLEAR', itemId }
        : { type: 'SET', itemId, value },
    )
  }, [state.items])

  return (
    <ChecklistContext.Provider value={{
      screen: state.screen,
      currentCategory: state.currentCategory,
      items: state.items,
      derived,
      dispatch,
      toggle,
    }}>
      {children}
    </ChecklistContext.Provider>
  )
}

export function useChecklist() {
  const ctx = useContext(ChecklistContext)
  if (!ctx) throw new Error('useChecklist must be used within ChecklistProvider')
  return ctx
}
