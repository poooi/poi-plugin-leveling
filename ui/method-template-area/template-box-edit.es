import React, { Component } from 'react'
import {
  Panel,
  Button,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

import { LevelingMethodPanel } from '../goal-area/goal-list/leveling-method-panel'
import { fillStates } from '../goal-area/goal-list/goal-box-edit'
import { STypeEdit } from './stype-edit'

const { FontAwesome } = window

class TemplateBoxEdit extends Component {
  static propTypes = {
    template: PTyp.Template.isRequired,
    stypes: PTyp.arrayOf(PTyp.number),
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    index: PTyp.number.isRequired,
    onModifySTypes: PTyp.func.isRequired,
  }

  static defaultProps = {
    stypes: [],
  }

  static prepareState = props => {
    const { template } = props
    const { method } = template
    const stypes = template.type === 'main' ? null : template.stypes

    return {
      methodType: method.type,
      ...fillStates(method),
      stypes,
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
          <Button disabled={isMainTemplate}>
            <FontAwesome name="trash" />
          </Button>
          <Button>
            <FontAwesome name="save" />
          </Button>
        </div>
      </div>
    )
  }
}

export { TemplateBoxEdit }
