import React, { Component } from 'react'
import {
  Button,
  DropdownButton, MenuItem,
  ButtonGroup,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { Template } from '../../structs'

import { prepareMethodText } from '../goal-area/goal-list/method-view'

const { _, FontAwesome } = window

class TemplateBoxView extends Component {
  static propTypes = {
    template: PTyp.Template.isRequired,
    upAction: PTyp.func,
    downAction: PTyp.func,
    stypes: PTyp.arrayOf(PTyp.number),
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    editing: PTyp.bool.isRequired,
    index: PTyp.number.isRequired,
    shipTargets: PTyp.arrayOf(PTyp.TemplateAreaShipTarget).isRequired,

    onStartEdit: PTyp.func.isRequired,
    onFinishEdit: PTyp.func.isRequired,
    onModifyTemplateListElem: PTyp.func.isRequired,
    onModifyGoalTable: PTyp.func.isRequired,
  }

  static defaultProps = {
    stypes: [],
    upAction: null,
    downAction: null,
  }

  // get list of **sorted** ship types depending on the situation:
  // - when we are looking at the main template, the full ship type is returned
  // - otherwise we show either template settings, or template editing the state.
  getSTypes = () => {
    const { stypeInfo, editing, template, stypes } = this.props
    if (template.type === 'main')
      return stypeInfo.map(({id}) => id)

    const currentSTypes = editing ? stypes : template.stypes
    return _.uniq(currentSTypes).sort((x,y) => x-y)
  }

  interpretSType = stype => {
    const { stypeInfo } = this.props
    const name = stypeInfo.find(x => x.id === stype).name
    return (<div className="stype-element" key={stype}>{`${name} (${stype})`}</div>)
  }

  handleToggleTemplate = () => {
    const { template, onModifyTemplateListElem } = this.props
    Template.destruct({
      custom: () =>
        onModifyTemplateListElem(tmpl => ({
          ...tmpl,
          enabled: !tmpl.enabled,
        })),
      main: () =>
        console.error('Main Template does not have an enabled field'),
    })(template)
  }

  handleApplyTemplate = target => {
    const { onModifyGoalTable, shipTargets, template } = this.props
    const targets = target === 'all'
      ? shipTargets.map(s => s.rstId)
      : [target]

    onModifyGoalTable(gt =>
      targets.reduce((curGt,rstId) => {
        const goal = curGt[rstId]
        const newGoal = {
          ...goal,
          method: template.method,
        }
        return { ...curGt, [rstId]: newGoal }
      }, gt))
  }

  render() {
    const {
      template,
      upAction, downAction,
      editing, shipTargets,
      index,
      onStartEdit, onFinishEdit,
    } = this.props
    const isMainTemplate = template.type === 'main'
    const isEnabled = isMainTemplate || template.enabled
    const methodText = prepareMethodText( template.method )
    return (
      <div className="template-view">
        <div className="template-info-view">
          <div className="stype-col">
            <div className="header">Types</div>
            <div className="stype-content content">
              {
                this.getSTypes().map(this.interpretSType)
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
              disabled={typeof upAction !== 'function'}
              onClick={upAction}
              style={{flex: 1}} >
            <FontAwesome name="angle-up" />
          </Button>
          <Button
              disabled={typeof downAction !== 'function'}
              onClick={downAction}
              style={{flex: 1}} >
            <FontAwesome name="angle-down" />
          </Button>
          <ButtonGroup
              className="dropdown-apply-to"
              style={{flex: 4}}
              justified>
            <DropdownButton
                id={`tb-view-dd-apply-${index}`}
                disabled={editing || shipTargets.length === 0}
                onSelect={this.handleApplyTemplate}
                title="Apply to">
              {
                shipTargets.map( shipTarget => {
                  const { name, rstId, level, goalLevel } = shipTarget
                  const content = `${name} (${rstId}) Lv. ${level} ⇒ Lv.${goalLevel}`
                  return (
                    <MenuItem key={rstId} eventKey={rstId}>
                      {content}
                    </MenuItem>
                  )
                })
              }
              <MenuItem divider />
              <MenuItem key="all" eventKey="all">All Goals Above</MenuItem>
            </DropdownButton>
          </ButtonGroup>
          <Button
              bsStyle={isEnabled ? "success" : "danger"}
              onClick={this.handleToggleTemplate}
              disabled={isMainTemplate || editing}
              style={{flex: 2}}
          >
            <FontAwesome name={isEnabled ? "check-square-o" : "square-o"} />
          </Button>
          <Button onClick={editing ? onFinishEdit : onStartEdit} style={{flex: 1}}>
            <FontAwesome name={editing ? "undo" : "pencil"} />
          </Button>
        </ButtonGroup>
      </div>
    )
  }
}

export { TemplateBoxView }
