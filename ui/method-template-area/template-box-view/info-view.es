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

  renderSType = stype => {
    const {stypeInfo} = this.props
    const {name} = stypeInfo.find(x => x.id === stype)
    return (
      <div
        style={{marginRight: '1em'}}
        key={stype}
      >
        {`${name} (${stype})`}
      </div>
    )
  }

  render() {
    const {method, stypes} = this.props
    const methodText = prepareMethodText(method)
    const contentStyle = {marginLeft: 5}
    const headerStyle = {fontSize: 14}
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: 5,
        }}
      >
        <div
          style={{flex: 6}}
        >
          <div
            style={headerStyle}
          >
            {__('Template.Types')}
          </div>
          <div
            style={{
              ...contentStyle,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {
              stypes.map(this.renderSType)
            }
          </div>
        </div>
        <div
          style={{flex: 3}}
        >
          <div
            style={headerStyle}
          >
            {__('EditMethod.Title')}
          </div>
          <div
            style={{
              ...contentStyle,
              fontSize: 18, fontWeight: 'bold',
            }}
          >
            {methodText.main}
          </div>
          <div
            style={{
              ...contentStyle,
              fontSize: 14,
            }}
          >
            {methodText.second}
          </div>
        </div>
      </div>)
  }
}

export { InfoView }
