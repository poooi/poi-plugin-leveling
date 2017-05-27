import React, { Component } from 'react'
import {
  ListGroupItem,
  Button,
  DropdownButton, MenuItem,
  ButtonGroup,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { enumFromTo } from '../utils'

import { prepareMethodText } from './goal-area/goal-list/method-view'

const { FontAwesome } = window

class TemplateBox extends Component {
  static propTypes = {
    template: PTyp.Template.isRequired,
    upEnabled: PTyp.bool.isRequired,
    downEnabled: PTyp.bool.isRequired,
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
  }

  interpretSType = stype => {
    const { stypeInfo } = this.props
    const name = stypeInfo.find(x => x.id === stype).name
    return (<div className="stype-element" key={stype}>{`${name} (${stype})`}</div>)
  }

  render() {
    const { template, upEnabled, downEnabled } = this.props
    const isMainTemplate = template.type === 'main'
    const isEnabled = isMainTemplate || template.enabled
    const methodText = prepareMethodText( template.method )
    return (
      <ListGroupItem className="template-box">
        <div className="template-view">
          <div className="template-info-view">
            <div className="stype-col">
              <div className="header">Type</div>
              <div className="stype-content content">
                {
                  (template.type === 'main' ? enumFromTo(1,22) : template.stypes)
                    .map(this.interpretSType)
                }
              </div>
            </div>
            <div className="method-col">
              <div className="header">Method</div>
              <div className="content main">{methodText.main}</div>
              <div className="content second">{methodText.second}</div>
            </div>
          </div>
          <ButtonGroup className="template-controls">
            <Button
                disabled={!upEnabled}
                style={{flex: 1}} >
              <FontAwesome name="angle-up" />
            </Button>
            <Button
                disabled={!downEnabled}
                style={{flex: 1}} >
              <FontAwesome name="angle-down" />
            </Button>
            <ButtonGroup
                className="dropdown-apply-to"
                style={{flex: 4}}
                justified>
              <DropdownButton
                  title="Apply to">
                <MenuItem eventKey="1">All applicable current goals</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey="g-1">Goal 1</MenuItem>
                <MenuItem eventKey="g-2">Goal 2</MenuItem>
                <MenuItem eventKey="g-3">Goal 3</MenuItem>
                <MenuItem eventKey="g-4">Goal 4</MenuItem>
              </DropdownButton>
            </ButtonGroup>
            <Button
                bsStyle={isEnabled ? "success" : "danger"}
                disabled={isMainTemplate}
                style={{flex: 2}}
            >
              <FontAwesome name={isEnabled ? "check-square-o" : "square-o"} />
            </Button>
            <Button style={{flex: 1}}>
              <FontAwesome name="pencil" />
            </Button>
          </ButtonGroup>
        </div>
      </ListGroupItem>
    )
  }
}

export { TemplateBox }
