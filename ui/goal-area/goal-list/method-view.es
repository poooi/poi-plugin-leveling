import React, { Component } from 'react'
import { ThreeRows } from './three-rows'

import { PTyp } from '../../../ptyp'
import {
  ExpValue,
  BaseExp,
  Method,
  Ternary,
  Rank,
} from '../../../structs'

const prepareMethodText = Method.destruct({
  sortie: (flagship, mvp, rank, baseExp) => {
    const secondRow = BaseExp.destruct({
      standard: map => `Sortie ${map}`,
      custom: value => `Base Exp: ${ExpValue.toString(value)}`,
    })(baseExp)
    const strFS = Ternary.toString(flagship)
    const strMVP = Ternary.toString(mvp)
    const strRank = Rank.normalize(rank).join("/")
    const thirdRow = `Flagship: ${strFS} MVP: ${strMVP} Rank: ${strRank}`
    return {main: secondRow, second: thirdRow}
  },
  custom: exp => ({main: `${ExpValue.toString(exp)} Exp/sortie`, second: ""}),
})

class MethodView extends Component {
  static propTypes = {
    method: PTyp.Method.isRequired,
    style: PTyp.style,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const { method, style } = this.props
    const methodText = prepareMethodText(method)
    return (
      <ThreeRows
          style={{...style}}
          first="Method"
          second={methodText.main}
          third={methodText.second}
      />)
  }
}

export { MethodView, prepareMethodText }
