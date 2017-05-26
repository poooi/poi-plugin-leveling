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

export { computeNextRemodelLevel }
