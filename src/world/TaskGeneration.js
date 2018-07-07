import shuffleArray from 'shuffle-array'
import { pipe, slice, values, reduce, pickBy, drop } from 'ramda'
import { allKeys, taskCategories } from 'scenes/GameScene/proto/protoTasks'

const generateTaskIdsRange = () => [...Array(20)].map((_, i) => i)

const getTaskTimer = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const generateTaskPools = (randomIds, categories) => {
  const activePool = pickBy(
    (_, key) => randomIds.includes(Number(key)),
    categories,
  )
  const possibleTasks = pickBy(
    (_, key) => !randomIds.includes(Number(key)),
    categories,
  )

  return {
    activePool,
    possibleTasks,
  }
}

const distributeKeys = (selectedTasks, keysPool) => {
  const result = reduce(
    (acc, value) => ({
      currentTasks: {
        ...acc.currentTasks,
        [acc.unusedKeys[0]]: {
          key: acc.unusedKeys[0],
          label: `${acc.unusedKeys[0].toUpperCase()} - ${value.taskName}`,
          taskCount: 0,
          timer: getTaskTimer(30, 120),
        },
      },
      usedKeys: [...acc.usedKeys, acc.unusedKeys[0]],
      unusedKeys: drop(1, acc.unusedKeys),
    }),
    {
      currentTasks: {},
      usedKeys: [],
      unusedKeys: [...keysPool],
    },
    values(selectedTasks),
  )
  return result
}

const generateStartingState = () => {
  const randomTaskIds = pipe(shuffleArray, slice(0, 8), shuffleArray)(
    generateTaskIdsRange(),
  )
  const { activePool, possibleTasks } = generateTaskPools(
    randomTaskIds,
    taskCategories,
  )
  const { usedKeys, unusedKeys, currentTasks } = distributeKeys(
    activePool,
    allKeys,
  )

  return {
    possibleTasks,
    usedKeys,
    unusedKeys,
    currentTaskIds: randomTaskIds,
    currentTasks,
  }
}

export default generateStartingState
