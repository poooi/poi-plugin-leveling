import React, { Component } from 'react'
import {
  Panel,
  Button,
} from 'react-bootstrap'

import { modifyArray } from '../../utils'
import { PTyp } from '../../ptyp'

import { LevelingMethodPanel } from '../goal-area/goal-list/leveling-method-panel'
import { fillStates, stateToMethod } from '../goal-area/goal-list/goal-box-edit'
import { STypeEdit } from './stype-edit'

const { FontAwesome } = window

class TemplateBoxEdit extends Component {
  static propTypes = {
    template: PTyp.Template.isRequired,
    stypes: PTyp.arrayOf(PTyp.number),
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    index: PTyp.number.isRequired,

    onModifySTypes: PTyp.func.isRequired,
    onModifyTemplateListAtIndex: PTyp.func.isRequired,
    onRemoveTemplate: PTyp.func.isRequired,
    onFinishEdit: PTyp.func.isRequired,
  }

  static defaultProps = {
    stypes: [],
  }

  static prepareState = props => {
    const { template } = props
    const { method } = template
    return {
      methodType: method.type,
      ...fillStates(method),
    }
  }

  constructor(props) {
    super(props)
    this.state = TemplateBoxEdit.prepareState(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(TemplateBoxEdit.prepareState(nextProps))
  }

  handleMethodTypeSelect = e => {
    this.setState({methodType: e})
  }

  handleSortieInputChange = newValue =>
    this.setState({sortieInput: newValue})

  handleCustomInputChange = newValue => {
    this.setState({customInput: newValue})
  }

  handleSaveTemplate = () => {
    const method = stateToMethod(this.state)
    const {
      index,
      template,
      onModifyTemplateListAtIndex,
      onFinishEdit,
    } = this.props

    if (template.type === 'main') {
      onModifyTemplateListAtIndex(index, tmpl => ({
        ...tmpl,
        method,
      }))
    } else if (template.type === 'custom') {
      const { stypes } = this.props
      onModifyTemplateListAtIndex(index, tmpl => ({
        ...tmpl,
        method,
        stypes,
      }))
    } else {
      console.error(`Unknown template type: ${template.type}`)
    }
    onFinishEdit()
  }

  handleRemoveTemplate = () => {
    const {
      index,
      template,
      onRemoveTemplate,
    } = this.props

    if (template.type === 'custom') {
      onRemoveTemplate(index)
    } else {
      console.error(`Invalid operation on template type: ${template.type}`)
    }
  }

  render() {
    const {
      methodType,
      sortieInput,
      customInput,
    } = this.state
    const {
      index,
      template,
      stypes,
      stypeInfo,
      onModifySTypes,
    } = this.props
    const isMainTemplate = template.type === 'main'

    return (
      <div className="template-box-edit">
        <div className="panels">
          <STypeEdit
              index={index}
              stypeInfo={stypeInfo}
              stypes={stypes}
              disabled={isMainTemplate}
              onModifySTypes={onModifySTypes}
          />
          <LevelingMethodPanel
              methodType={methodType}
              sortieInput={sortieInput}
              customInput={customInput}
              onMethodTypeSelect={this.handleMethodTypeSelect}
              onSortieInputChange={this.handleSortieInputChange}
              onCustomInputChange={this.handleCustomInputChange}
          />
        </div>
        <div className="edit-control">
          <Button
              onClick={this.handleRemoveTemplate}
              disabled={isMainTemplate}>
            <FontAwesome name="trash" />
          </Button>
          <Button onClick={this.handleSaveTemplate} >
            <FontAwesome name="save" />
          </Button>
        </div>
      </div>
    )
  }
}

export { TemplateBoxEdit }
