// things related to remodels

const getNextRemodel = $ship =>
  (typeof $ship.api_afterlv === 'number' &&
   $ship.api_afterlv > 0)
    ? {
      afterLv: $ship.api_afterlv,
      afterMstId: parseInt($ship.api_aftershipid,10),
    }
    : null

const computeNextRemodelLevel = ($ships, mstId, curLevel, visited=new Set()) => {
  const $ship = $ships[mstId]
  const nextRemodel = getNextRemodel($ship)

  if (nextRemodel === null)
    return null
  const { afterLv, afterMstId } = nextRemodel
  if (visited.has(afterMstId))
    return null
  visited.add(mstId)
  return afterLv > curLevel
    ? afterLv
    : computeNextRemodelLevel($ships,afterMstId, curLevel, visited)
}

const computeAllRemodelsFromMstId = ($ships, mstId, result=[]) => {
  const next = getNextRemodel($ships[mstId])
  if (next === null)
    return result
  const { afterMstId } = next
  if (result.findIndex(x => x.afterMstId === afterMstId) !== -1)
    return result
  return computeAllRemodelsFromMstId($ships, afterMstId, [...result, next])
}

const remodelToRGoal = ($ships, $shipTypes) => ({afterLv, afterMstId}) => {
  const $ship = $ships[afterMstId]
  const name = $ship.api_name
  const typeName = $shipTypes[$ship.api_stype].api_name

  const reason = {
    type: 'remodel',
    name, typeName,
  }

  return {
    goalLevel: afterLv,
    reason,
  }
}

export {
  computeNextRemodelLevel,
  computeAllRemodelsFromMstId,
  remodelToRGoal,
}
