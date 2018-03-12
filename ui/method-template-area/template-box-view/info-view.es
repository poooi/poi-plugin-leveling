import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'
import { prepareMethodText } from '../../goal-area/method-view'

const { _, __ } = window

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
    const {name} = stypeInfo.find(x => x.id === stype)
    return (<div className="stype-element" key={stype}>{`${name} (${stype})`}</div>)
  }

  render() {
    const { method, stypes } = this.props
    const methodText = prepareMethodText( method )
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: 5,
        }}
        className="template-info-view"
      >
        <div
          style={{flex: 6}}
          className="stype-col"
        >
          <div className="header">{__('Template.Types')}</div>
          <div className="stype-content content">
            {
              stypes.map(this.interpretSType)
            }
          </div>
        </div>
        <div
          style={{flex: 3}}
          className="method-col"
        >
          <div className="header">{__('EditMethod.Title')}</div>
          <div
            className="content main"
            style={{fontSize: 18, fontWeight: 'bold'}}
          >
            {methodText.main}
          </div>
          <div
            className="content second"
            style={{fontSize: 14}}
          >
            {methodText.second}
          </div>
        </div>
      </div>)
  }
}

export { InfoView }
