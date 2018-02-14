import { createSelector } from 'reselect'
import { goalPairsSelector } from '../../selectors'

const purgeGoalPair = ({goal,ship}) => ({
  name: ship.name,
  stype: ship.stype,
  rstId: ship.rstId,
  level: ship.level,
  goalLevel: goal.goalLevel,
})

// Ship targets to be applied to
const shipTargetsSelector = createSelector(
  goalPairsSelector,
  goalPairs =>
    goalPairs.filter(pair =>
      pair.ship.level < pair.goal.goalLevel
    ).map(
      purgeGoalPair
    )
)

export { shipTargetsSelector }
