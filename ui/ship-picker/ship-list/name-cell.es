import React, { PureComponent } from 'react'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../../ptyp'

class NameCell extends PureComponent {
  static propTypes = {
    name: PTyp.string.isRequired,
    fleet: PTyp.number,
    locked: PTyp.bool.isRequired,
    goalFlag: PTyp.bool.isRequired,
  }

  static defaultProps = {
    fleet: null,
  }

  render() {
    const {name, fleet, locked, goalFlag} = this.props
    const iconStyle = {
      marginLeft: 2,
      width: 16, height: 16,
    }

    return (
      <div
        className={goalFlag ? 'text-primary' : ''}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flex: '1 0 0',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}>
          {name}
        </div>
        {
          fleet !== null && (
            <div
              style={{
                ...iconStyle,
                fontWeight: 'bolder',
                color: 'white',
                fontFamily: 'serif',
                textShadow: [
                  '-1px -1px 0 lightseagreen',
                  '1px -1px 0 lightseagreen',
                  '-1px 1px 0 lightseagreen',
                  '1px 1px 0 lightseagreen',
                ].join(','),
                WebkitFontSmoothing: 'antialiased',
                textAlign: 'center',
              }}
            >
              {fleet}
            </div>
          )
        }
        {
          locked && (
            <FontAwesome
              style={iconStyle}
              name="lock"
            />
          )
        }
      </div>
    )
  }
}

export { NameCell }
