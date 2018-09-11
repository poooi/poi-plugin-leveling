import React, { Component } from 'react'
import { mapIdToStr } from 'subtender/kc'
import { ThreeRows } from './three-rows'

import { PTyp } from '../../ptyp'
import {
  ExpValue,
  BaseExp,
  Method,
  Ternary,
  Rank,
} from '../../structs'

const { __ } = window.i18n["poi-plugin-leveling"]

const prepareMethodText = Method.destruct({
  sortie: (flagship, mvp, rank, baseExp) => {
    const secondRow = BaseExp.destruct({
      standard: mapId => `${__('Method.Sortie')} ${mapIdToStr(mapId)}`,
      custom: value => `${__('Method.BaseExp')}: ${ExpValue.toString(value)}`,
    })(baseExp)
    const strFS = Ternary.toString(flagship)
    const strMVP = Ternary.toString(mvp)
    const strRank = Rank.normalize(rank).join("/")
    const thirdRow =
      `${__('Method.Flagship')}: ${strFS} ` +
      `MVP: ${strMVP} ` +
      `${__('Method.Rank')}: ${strRank}`
    return {main: secondRow, second: thirdRow}
  },
  custom: exp => ({
    main:
      `${ExpValue.toString(exp)} `+
      `${__('Method.ExpPerSortie')}`,
    second: ""}),
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
        first={__('GoalBox.Method')}
        second={methodText.main}
        third={methodText.second}
      />)
  }
}

export { MethodView, prepareMethodText }
