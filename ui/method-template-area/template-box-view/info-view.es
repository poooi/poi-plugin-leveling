import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'

import { prepareMethodText } from '../../goal-area/goal-list/method-view'

const { _ } = window

class InfoView extends Component {
  static propTypes = {
    method: PTyp.Method.isRequired,
    stypes: PTyp.arrayOf(PTyp.number).isRequired,
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.method !== nextProps.method ||
      ! _.isEqual(this.props.stypes,nextProps.stypes) ||
      this.props.stypeInfo.length !== nextProps.stypeInfo.length
  }

  interpretSType = stype => {
    const { stypeInfo } = this.props
    const name = stypeInfo.find(x => x.id === stype).name
    return (<div className="stype-element" key={stype}>{`${name} (${stype})`}</div>)
  }

  render() {
    const { method, stypes } = this.props
    const methodText = prepareMethodText( method )
    return (
      <div className="template-info-view">
        <div className="stype-col">
          <div className="header">Types</div>
          <div className="stype-content content">
            {
              stypes.map(this.interpretSType)
            }
          </div>
        </div>
        <div className="method-col">
          <div className="header">Method</div>
          <div className="content main">{methodText.main}</div>
          <div className="content second">{methodText.second}</div>
        </div>
      </div>)
  }
}

export { InfoView }
