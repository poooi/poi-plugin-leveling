import _ from 'lodash'
import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'
import { Template } from '../../../structs'

import { ViewButtons } from './view-buttons'
import { InfoView } from './info-view'

class TemplateBoxView extends Component {
  static propTypes = {
    template: PTyp.Template.isRequired,
    upAction: PTyp.func,
    downAction: PTyp.func,
    stypes: PTyp.arrayOf(PTyp.number),
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    editing: PTyp.bool.isRequired,
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
    const {stypeInfo, editing, template, stypes} = this.props
    if (template.type === 'main')
      return stypeInfo.map(({id}) => id)

    const currentSTypes = editing ? stypes : template.stypes
    return _.uniq(currentSTypes).sort((x,y) => x-y)
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
      stypeInfo,
      onStartEdit, onFinishEdit,
    } = this.props
    const isMainTemplate = template.type === 'main'
    const isEnabled = Template.isEnabled(template)
    return (
      <div className="template-view">
        <InfoView
          method={template.method}
          stypeInfo={stypeInfo}
          stypes={this.getSTypes()}
        />
        <ViewButtons
          template={template}
          upAction={upAction} downAction={downAction}
          editing={editing}
          shipTargets={shipTargets}
          isMainTemplate={isMainTemplate}
          isEnabled={isEnabled}
          onStartEdit={onStartEdit} onFinishEdit={onFinishEdit}
          onToggleTemplate={this.handleToggleTemplate}
          onApplyTemplate={this.handleApplyTemplate}
        />
      </div>
    )
  }
}

export { TemplateBoxView }
