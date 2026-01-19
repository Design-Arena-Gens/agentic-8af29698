'use client'

import { useState, useEffect } from 'react'

interface Exercise {
  id: string
  name: string
  sets: Set[]
}

interface Set {
  id: string
  reps: number
  weight: number
}

export default function Home() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [exerciseName, setExerciseName] = useState('')
  const [showAddExercise, setShowAddExercise] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('workoutData')
    if (saved) {
      setExercises(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('workoutData', JSON.stringify(exercises))
  }, [exercises])

  const addExercise = () => {
    if (exerciseName.trim()) {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: exerciseName,
        sets: []
      }
      setExercises([...exercises, newExercise])
      setExerciseName('')
      setShowAddExercise(false)
    }
  }

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const newSet: Set = {
          id: Date.now().toString(),
          reps: 0,
          weight: 0
        }
        return { ...ex, sets: [...ex.sets, newSet] }
      }
      return ex
    }))
  }

  const updateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(set =>
            set.id === setId ? { ...set, [field]: value } : set
          )
        }
      }
      return ex
    }))
  }

  const deleteSet = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.filter(set => set.id !== setId)
        }
      }
      return ex
    }))
  }

  const deleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId))
  }

  const clearWorkout = () => {
    if (confirm('Clear all workout data?')) {
      setExercises([])
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">💪 Workout Tracker</h1>
            {exercises.length > 0 && (
              <button
                onClick={clearWorkout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Clear All
              </button>
            )}
          </div>

          {showAddExercise ? (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addExercise()}
                placeholder="Exercise name (e.g., Bench Press)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={addExercise}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Add Exercise
                </button>
                <button
                  onClick={() => {
                    setShowAddExercise(false)
                    setExerciseName('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddExercise(true)}
              className="w-full mb-6 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
            >
              + Add Exercise
            </button>
          )}

          {exercises.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl">No exercises yet. Add your first exercise to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{exercise.name}</h2>
                    <button
                      onClick={() => deleteExercise(exercise.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  {exercise.sets.length > 0 && (
                    <div className="mb-3">
                      <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-semibold text-gray-600">
                        <div className="col-span-2">Set</div>
                        <div className="col-span-4">Reps</div>
                        <div className="col-span-4">Weight (lbs)</div>
                        <div className="col-span-2"></div>
                      </div>
                      {exercise.sets.map((set, index) => (
                        <div key={set.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
                          <div className="col-span-2 text-center font-medium text-gray-700">
                            {index + 1}
                          </div>
                          <div className="col-span-4">
                            <input
                              type="number"
                              value={set.reps || ''}
                              onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="number"
                              value={set.weight || ''}
                              onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseInt(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <button
                              onClick={() => deleteSet(exercise.id, set.id)}
                              className="w-full px-2 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => addSet(exercise.id)}
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  >
                    + Add Set
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
