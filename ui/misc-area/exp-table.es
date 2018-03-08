import _ from 'lodash'
import React, { PureComponent } from 'react'
import { mapIdToStr } from 'subtender/kc'
import { availableMapIds, getMapExpInfo } from '../../map-exp'

class ExpTable extends PureComponent {
  render() {
    return (
      <div
        style={{
          display: 'grid',
          grid: 'auto / 3fr 1fr',
        }}
      >
        {
          _.flatMap(
            availableMapIds,
            (mapId, rowInd) => {
              const {name, baseExp} = getMapExpInfo(mapId)
              return [
                <div
                  style={{gridArea: `${rowInd+1} / 1 / span 1 / span 1`}}
                >
                  {`${mapIdToStr(mapId)} ${name}`}
                </div>,
                <div
                  style={{gridArea: `${rowInd+1} / 2 / span 1 / span 1`}}
                >
                  {JSON.stringify(baseExp)}
                </div>,
              ]
            }
          )
        }
      </div>
    )
  }
}

export { ExpTable }
