import React, { Component } from 'react'
import {
  ListGroup,
  Modal,
  Button,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { TemplateBox } from './template-box'

class MethodTemplateArea extends Component {
  static propTypes = {
    visible: PTyp.bool.isRequired,
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    config: PTyp.Config.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
    }
  }

  handleCloseResetDialog = () =>
    this.setState({showModal: false})

  handleOpenResetDialog = () =>
    this.setState({showModal: true})

  handleConfirmResetDialog = () => {
    this.handleCloseResetDialog()
    // TODO: reset
  }

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
          <Button style={{flex: 1}} onClick={this.handleOpenResetDialog}>
            Reset To Default
          </Button>
          <Button style={{flex: 3}}>New Template</Button>
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
              return (
                <TemplateBox
                    stypeInfo={stypeInfo}
                  key={ind}
                  index={ind}
                  upEnabled={!isMainTemplate && ind > 0}
                  downEnabled={!isMainTemplate && ind < templates.length-2}
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
