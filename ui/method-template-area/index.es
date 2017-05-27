import React, { Component } from 'react'
import {
  ListGroup,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { TemplateBox } from './template-box'
import { sortedMapKeys } from '../../map-exp'

const getRandomArbitrary = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min

const getRandomInt = (minR, maxR) => {
  const min = Math.ceil(minR)
  const max = Math.floor(maxR)
  return Math.floor(Math.random() * (max - min)) + min
}

const getOneOf = xs => xs[getRandomInt(0,xs.length)]
const genMap = () => getOneOf(sortedMapKeys)
const genTernary = () => getOneOf(['yes','no','maybe'])
const genRank = () => {
  const ret = [];
  ['S','A','B','C','D','E'].map( x => {
    if (getOneOf([true,false]))
      ret.push(x)
  })
  return ret
}
const genExpValue = () => {
  const type = getOneOf(['single','range'])
  if (type === 'single')
    return {
      type,
      value: getRandomArbitrary(1000,3000),
    }
  if (type === 'range') {
    const min = getRandomArbitrary(1000,2000)
    const max = getRandomArbitrary(min+100, 5000)
    return { type, min, max }
  }
}
const genBaseExp = () => {
  const type = getOneOf(['standard','custom'])
  if (type === 'standard') {
    return {
      type, map: genMap(),
    }
  }

  if (type === 'custom') {
    return {
      type, value: genExpValue(),
    }
  }
}

const genMethod = () => {
  const type = getOneOf(['sortie','custom'])
  if (type === 'sortie') {
    return {
      type,
      flagship: genTernary(),
      mvp: genTernary(),
      rank: genRank(),
      baseExp: genBaseExp(),
    }
  }

  if (type === 'custom') {
    return {
      type, exp: genExpValue(),
    }
  }
}

const genStypes = () => {
  const ret = []
  for (let i=1; i<=22; ++i)
    if (getOneOf([true,false]))
      ret.push(i)
  return ret
}

const genTemplateList = () => {
  const len = getRandomInt(5,10+1)
  const tl = []
  for (let i=0; i<len; ++i)
    tl.push( {
      type: 'custom',
      method: genMethod(),
      enabled: getOneOf([true,false]),
      stypes: genStypes(),
    })
  tl.push( {
    type: 'main',
    method: genMethod(),
  })
  return tl
}

const fakedTemplateList = genTemplateList()

class MethodTemplateArea extends Component {
  static propTypes = {
    visible: PTyp.bool.isRequired,
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
  }

  render() {
    const { visible, stypeInfo } = this.props
    return (
      <div
          className="method-template-area"
          style={{display: visible?'initial':'none'}}
      >
        <ListGroup
            className="template-list"
        >
          {
            /* eslint-disable react/no-array-index-key */

            // we turn this rule off because there is nothing unique about
            // every template except indices - one can have multiple templates
            // that looks exactly the same, and there is nothing stopping users
            // from doing so.
            fakedTemplateList.map( (template,ind) => {
              const isMainTemplate = template.type === 'main'
              return (
                <TemplateBox
                    stypeInfo={stypeInfo}
                  key={ind}
                  index={ind}
                  upEnabled={!isMainTemplate && ind > 0}
                  downEnabled={!isMainTemplate && ind < fakedTemplateList.length-2}
                  template={template} />
              )
            })
            /* eslint-enable react/no-array-index-key */
          }

        </ListGroup>
      </div>
    )
  }
}

export { MethodTemplateArea }
