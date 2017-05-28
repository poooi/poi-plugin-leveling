import React, { Component } from 'react'
import {
  ListGroup,
  Modal,
  Button,
} from 'react-bootstrap'

import { konst, modifyArray } from '../../utils'
import { PTyp } from '../../ptyp'
import { TemplateBox } from './template-box'

const { _ } = window

class MethodTemplateArea extends Component {
  static propTypes = {
    visible: PTyp.bool.isRequired,
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    config: PTyp.Config.isRequired,

    onModifyConfig: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      // this array should always have the same length as props.config.templates,
      // which indicates whether the template under corresponding index
      // is being editted.
      // TODO: while it is still okay to modify TemplateList by
      // onModifyConfig or onModifyTemplateList, when there are changes
      // that affects array length, we will need to ensure MethodTemplateArea can
      // be aware of the change and keep this array in sync.
      editingStates: props.config.templates.map(konst(false)),
    }
  }

  handleModifyEditingState = index => modifier =>
    this.setState(state => ({
      ...state,
      editingStates: modifyArray(index,modifier)(state.editingStates),
    }))

  handleCloseResetDialog = () =>
    this.setState({showModal: false})

  handleOpenResetDialog = () =>
    this.setState({showModal: true})

  handleConfirmResetDialog = () => {
    this.handleCloseResetDialog()
    // TODO: reset
  }

  // despite being the most flexible modifier function,
  // usage of this function outside of this file should be eliminated.
  // this allows "state.editingStates" to be kept in sync with templates
  handleModifyTemplateList = modifier => {
    const { onModifyConfig } = this.props
    onModifyConfig( config => ({
      ...config,
      templates: modifier(config.templates),
    }))
  }

  handleCreateNewTemplate = () => {
    const mkNew = mainTemplate => ({
      type: 'custom',
      method: mainTemplate.method,
      enabled: true,
      stypes: [],
    })

    this.handleModifyTemplateList( tl =>
      [mkNew(tl[tl.length-1]), ...tl])

    this.setState(state => ({
      ...state,
      editingStates: [true, ...state.editingStates],
    }))
  }

  // remove template at index
  handleRemoveTemplate = index => {
    this.handleModifyTemplateList(tl => {
      const newTl = [...tl]
      _.pullAt(newTl,[index])
      return newTl
    })

    this.setState(state => {
      const newState = {
        ...state,
        editingStates: [...state.editingStates],
      }
      _.pullAt(newState.editingStates,[index])
      return newState
    })
  }

  handleSwapTemplate = (i,j) => () => {
    const l = this.props.config.templates.length
    if (i === l-1 || j === l-1 ||
        typeof this.state.editingStates[i] !== 'boolean' ||
        this.state.editingStates[i] ||
        typeof this.state.editingStates[j] !== 'boolean' ||
        this.state.editingStates[j]) {
      console.error(`index bound error, trying to swap elements at ${i} and ${j}`)
      return
    }

    const swapElem = xs => {
      const newXs = [...xs]
      const [eI,eJ] = [xs[i],xs[j]]
      newXs[i]=eJ
      newXs[j]=eI
      return newXs
    }
    this.handleModifyTemplateList(swapElem)
  }

  // a limited version of handleModifyTemplateList
  // which makes it only possible to modify one of the elements
  // without changing the size of template list
  handleModifyTemplateListElem = index => modifier =>
    this.handleModifyTemplateList(
      modifyArray(index,modifier))

  render() {
    const {
      visible,
      stypeInfo,
      config,
    } = this.props
    const { templates } = config
    return (
      <div
          className="method-template-area"
          style={{display: visible?'initial':'none'}}
      >
        <div className="template-top-btns">
          <Button
              style={{flex: 1}}
              onClick={this.handleOpenResetDialog}>
            Reset To Default
          </Button>
          <Button
              style={{flex: 3}}
              onClick={this.handleCreateNewTemplate}>
            New Template
          </Button>
        </div>
        <ListGroup
            className="template-list"
        >
          {
            /* eslint-disable react/no-array-index-key */

            // we turn this rule off because there is nothing unique about
            // every template except indices - one can have multiple templates
            // that looks exactly the same, and there is nothing stopping users
            // from doing so.
            templates.map( (template,ind) => {
              const isMainTemplate = template.type === 'main'
              const editing = this.state.editingStates[ind]
              // INVARIANT: any template under editing state should never be moved around,
              // nor be any other template allowed of replacing its position
              // - main template is fixed at bottom and cannot be moved
              // - editing template is not allowed to move
              // - top template cannot move up, and second to last template cannot move down
              const upEnabled =
                !isMainTemplate &&
                !editing && ind > 0 &&
                !this.state.editingStates[ind-1]
              const downEnabled =
                !isMainTemplate &&
                !editing &&
                ind < templates.length-2 &&
                !this.state.editingStates[ind+1]
              return (
                <TemplateBox
                    stypeInfo={stypeInfo}
                    key={ind}
                    index={ind}
                    upAction={upEnabled ? this.handleSwapTemplate(ind,ind-1) : null}
                    downAction={downEnabled ? this.handleSwapTemplate(ind,ind+1) : null}
                    editing={editing}
                    onModifyTemplateListElem={this.handleModifyTemplateListElem(ind)}
                    onModifyEditingState={this.handleModifyEditingState(ind)}
                    onRemoveTemplate={this.handleRemoveTemplate}
                    template={template} />
              )
            })
            /* eslint-enable react/no-array-index-key */
          }

        </ListGroup>
        <Modal show={this.state.showModal} onHide={this.handleCloseResetDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Reseting</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure to reset? All your templates will be overwritten.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleCloseResetDialog}>Cancel</Button>
            <Button bsStyle="danger" onClick={this.handleConfirmResetDialog}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export { MethodTemplateArea }