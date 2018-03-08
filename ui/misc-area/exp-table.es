import _ from 'lodash'
import React, { PureComponent } from 'react'
import { mapIdToStr } from 'subtender/kc'
import { availableMapIds, getMapExpInfo } from '../../map-exp'
import { ExpValue } from '../../structs'

class ExpTable extends PureComponent {
  render() {
    return (
      <div
        style={{
          fontSize: '120%',
          display: 'grid',
          grid: 'auto / 3fr 1fr',
          maxWidth: 600,
        }}
      >
        <div style={{fontWeight: 'bold'}}>Name</div>
        <div style={{fontWeight: 'bold'}}>Base Exp</div>
        {
          _.flatMap(
            availableMapIds,
            (mapId, rowInd) => {
              const {name, baseExp} = getMapExpInfo(mapId)
              const expText = ExpValue.destruct({
                single: v => String(v),
                range: (min,max) => `${min} ~ ${max}`,
              })(baseExp)
              return [
                <div
                  style={{gridArea: `${rowInd+2} / 1 / span 1 / span 1`}}
                >
                  {`${mapIdToStr(mapId)} ${name}`}
                </div>,
                <div
                  style={{gridArea: `${rowInd+2} / 2 / span 1 / span 1`}}
                >
                  {expText}
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
