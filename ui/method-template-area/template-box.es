import React, { Component } from 'react'
import {
  ListGroupItem,
  Collapse,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

import { TemplateBoxView } from './template-box-view'
import { TemplateBoxEdit } from './template-box-edit'

const getSTypes = template =>
  template.type === 'main' ? null : template.stypes

class TemplateBox extends Component {
  static propTypes = {
    template: PTyp.Template.isRequired,
    editing: PTyp.bool.isRequired,
    onModifyTemplateListElem: PTyp.func.isRequired,
    onModifyEditingState: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      // template box maintains its own stypes array.
      // when editing, state.stypes is used, otherwise
      // we use stypes from props.template
      stypes: getSTypes(props.template),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({stypes: getSTypes(nextProps.template)})
  }

  handleStartEdit = () => {
    const { onModifyEditingState } = this.props
    onModifyEditingState(() => true)
    this.setState({
      stypes: getSTypes(this.props.template),
    })
  }

  handleFinishEdit = () => {
    const { onModifyEditingState } = this.props
    onModifyEditingState(() => false)
  }

  handleModifySTypes = modifier =>
    this.setState( state => ({
      ...state,
      stypes: modifier(state.stypes),
    }))

  render() {
    return (
      <ListGroupItem className="template-box">
        <TemplateBoxView
          stypes={this.state.stypes}
          onStartEdit={this.handleStartEdit}
          onFinishEdit={this.handleFinishEdit}
          editing={this.props.editing}
          {...this.props}
        />
        <Collapse in={this.props.editing}>
          <div>
            <TemplateBoxEdit
              onModifySTypes={this.handleModifySTypes}
              onModifyTemplateListElem={this.props.onModifyTemplateListElem}
              onFinishEdit={this.handleFinishEdit}
              stypes={this.state.stypes}
              {...this.props}
            />
          </div>
        </Collapse>
      </ListGroupItem>
    )
  }
}

export { TemplateBox }
