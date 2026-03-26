'use client'

import { useQuiz } from '../QuizContext'
import { questions } from '../data/questions'
import { AnswerCard } from '../components/AnswerCard'
import { QuizNavigation } from '../components/QuizNavigation'
import { ProgressBar } from '@/components/offers/ProgressBar'

export function QuestionScreen() {
  const { state, dispatch } = useQuiz()
  const { currentQuestion, answers } = state
  const q = questions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]
  const progress = ((currentQuestion + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col bg-[#0D1117]">
      {/* Progress */}
      <ProgressBar progress={progress} className="fixed top-0 left-0 right-0 z-50 bg-white/[0.06]" />

      {/* Question counter */}
      <div className="pt-10 px-5">
        <p className="text-center text-white/30 text-xs tracking-[0.2em] uppercase font-medium">
          Q{currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Question + Answers */}
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="max-w-xl w-full">
          <h2 className="text-lg md:text-xl font-medium text-white leading-relaxed mb-8 text-center">
            {q.text}
          </h2>

          <div className="space-y-3">
            {q.answers.map((answer, i) => (
              <AnswerCard
                key={answer.letter}
                letter={answer.letter}
                text={answer.text}
                selected={selectedAnswer === i}
                onClick={() => dispatch({ type: 'SELECT_ANSWER', questionIndex: currentQuestion, answerIndex: i })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <QuizNavigation
        canGoBack={currentQuestion > 0}
        canGoForward={selectedAnswer !== null}
        onBack={() => dispatch({ type: 'PREV' })}
        onNext={() => dispatch({ type: 'NEXT' })}
      />
    </div>
  )
}
