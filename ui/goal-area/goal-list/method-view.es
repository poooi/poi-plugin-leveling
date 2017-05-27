import React, { Component } from 'react'
import { ThreeRows } from './three-rows'

import { PTyp } from '../../../ptyp'

const prepareMethodText = method => {
  const showExpValue = expValue =>
      expValue.type === "single"
    ? `${expValue.value}`
    : `${expValue.min} ~ ${expValue.max}`
  if (method.type === 'sortie') {
    const { baseExp } = method
    const secondRow =
      baseExp.type === "standard" ? `Sortie ${baseExp.map}`
      : baseExp.type === "custom" ? `Base Exp: ${showExpValue(baseExp.value)}`
      : (console.error("unknown baseExp type",baseExp.type) || "?")

    const strFS =
      method.flagship === "yes" ? "✓"
      : method.flagship === "no" ? "❌"
      : method.flagship === "maybe" ? "✓/❌"
      : (console.error("unknown flagship value",method.flagship) || "?")

    const strMVP =
      method.mvp === "yes" ? "✓"
      : method.mvp === "no" ? "❌"
      : method.mvp === "maybe" ? "✓/❌"
      : (console.error("unknown MVP value",method.mvp) || "?")
    const strRank = method.rank.join("/")
    const thirdRow = `Flagship: ${strFS} MVP: ${strMVP} Rank: ${strRank}`
    return {main: secondRow, second: thirdRow}
  }

  // otherwise method.type === custom
  return {main: `${showExpValue(method.exp)} Exp/sortie`, second: ""}
}

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
