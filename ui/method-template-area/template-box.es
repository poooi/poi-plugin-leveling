import React, { Component } from 'react'
import {
  ListGroupItem,
  Collapse,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

import { TemplateBoxView } from './template-box-view'
import { TemplateBoxEdit } from './template-box-edit'

const getSTypes = template =>
    template.type === 'main' ? null
  : template.stypes

class TemplateBox extends Component {
  static propTypes = {
    template: PTyp.Template.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      // template box maintains its own stypes array.
      // when editing, state.stypes is used, otherwise
      // we use stypes from props.template
      stypes: getSTypes(props.template),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({stypes: getSTypes(nextProps.template)})
  }

  handleStartEdit = () =>
    this.setState({editing: true})

  handleFinishEdit = () =>
    this.setState({editing: false})

  handleModifySTypes = modifier =>
    this.setState( state => ({
      ...state,
      stypes: modifier(state.stypes),
    }))

  render() {
    return (
      <ListGroupItem className="template-box">
        <TemplateBoxView
            onStartEdit={this.handleStartEdit}
            onFinishEdit={this.handleFinishEdit}
            editing={this.state.editing}
            {...this.props}
        />
        <Collapse in={this.state.editing}>
          <div>
            <TemplateBoxEdit
                onModifySTypes={this.handleModifySTypes}
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
