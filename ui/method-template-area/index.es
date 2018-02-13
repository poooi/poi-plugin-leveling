import React, { Component } from 'react'
import {
  ListGroup,
  Modal,
  Button,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { modifyObject, modifyArray } from 'subtender'
import { PTyp } from '../../ptyp'
import { recommended as recommendedTL } from '../../default-template-list'
import { TemplateBox } from './template-box'
import * as structs from '../../structs'
import {
  mapDispatchToProps,
} from '../../store'
import {
  methodTemplateUISelector,
} from '../../selectors'

const { _, __ } = window

class MethodTemplateAreaImpl extends Component {
  static propTypes = {
    stypeInfo: PTyp.ShipTypeInfo.isRequired,
    // config: PTyp.Config.isRequired,
    shipTargets: PTyp.arrayOf(PTyp.TemplateAreaShipTarget).isRequired,
    // onModifyConfig: PTyp.func.isRequired,
    modifyTemplateList: PTyp.func.isRequired,
    modifyGoalTable: PTyp.func.isRequired,
    // TODO: remove
    config: PTyp.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      // this array should always have the same length as props.config.templates,
      // which indicates whether the template under corresponding index
      // is being editted.
      // while it is still okay to modify TemplateList by
      // onModifyConfig or onModifyTemplateList, when there are changes
      // that affects array length, we need to ensure MethodTemplateArea can
      // be aware of the change and keep this array in sync.
      editingStates: {},
    }
  }

  getEditingState = tId =>
    (tId in this.state.editingStates) ? this.state.editingStates[tId] : false

  handleModifyEditingState = templateId => modifier =>
    this.setState(
      modifyObject(
        'editingStates',
        modifyObject(
          templateId,
          (x = false) => modifier(x)
        )
      )
    )

  handleCloseResetDialog = () =>
    this.setState({showModal: false})

  handleOpenResetDialog = () =>
    this.setState({showModal: true})

  handleConfirmResetDialog = () => {
    this.handleCloseResetDialog()
    this.props.modifyTemplateList(() => recommendedTL)
    this.setState({editingStates: {}})
  }

  // despite being the most flexible modifier function,
  // usage of this function outside of this file should be eliminated.
  // this allows "state.editingStates" to be kept in sync with templates
  handleModifyTemplateList = modifier =>
    this.props.modifyTemplateList(modifier)

  handleCreateNewTemplate = () => {
    let newId
    this.handleModifyTemplateList(tl => {
      const [customTemplates, mainTemplate] = [_.initial(tl), _.last(tl)]
      const maxId = _.max(customTemplates.map(x => x.id))
      newId = (_.isInteger(maxId) ? maxId : 0) + 1
      const newTemplate = ({
        type: 'custom',
        method: mainTemplate.method,
        enabled: true,
        stypes: [],
        id: newId,
      })

      return [newTemplate, ...tl]
    })

    this.setState(modifyObject('editingStates', modifyObject(newId, () => true)))
  }

  // remove template at index
  handleRemoveTemplate = id => () =>
    this.handleModifyTemplateList(tl =>
      tl.filter(x => x.id !== id)
    )

  handleSwapTemplate = (idX,idY) => () => {
    const {templates} = this.props.config
    const indX = templates.findIndex(t => t.id === idX)
    const indY = templates.findIndex(t => t.id === idY)
    if (indX === -1 || indY === -1)
      return

    this.handleModifyTemplateList(ts => {
      const newTs = [...ts]
      newTs[indX] = ts[indY]
      newTs[indY] = ts[indX]
      return newTs
    })
  }

  // a limited version of handleModifyTemplateList
  // which makes it only possible to modify one of the elements
  // without changing the size of template list
  handleModifyTemplateListElem = tId => modifier =>
    this.handleModifyTemplateList(ts => {
      const tInd = ts.findIndex(t => t.id === tId)
      if (tInd !== -1) {
        return modifyArray(tInd, modifier)(ts)
      } else {
        return ts
      }
    })

  render() {
    const {
      stypeInfo,
      shipTargets,
      config,
      modifyGoalTable,
    } = this.props
    const { templates } = config
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
          }}
        >
          <Button
            style={{
              flex: 1,
              marginTop: 0,
              marginBottom: 8,
              marginRight: 10,
            }}
            onClick={this.handleOpenResetDialog}>
            {__('Template.ResetToDefault')}
          </Button>
          <Button
            style={{
              flex: 3,
              marginTop: 0,
              marginBottom: 8,
            }}
            onClick={this.handleCreateNewTemplate}>
            {__('Template.NewTemplate')}
          </Button>
        </div>
        <ListGroup
          style={{
            flex: 1,
            height: 0,
            overflowY: 'auto',
          }}
          className="template-list"
        >
          {
            templates.map((template,ind) => {
              const isMainTemplate = template.type === 'main'
              const editing = this.state.editingStates[template.id]
              // INVARIANT: any template under editing state should never be moved around,
              // nor be any other template allowed of replacing its position
              // - main template is fixed at bottom and cannot be moved
              // - editing template is not allowed to move
              // - top template cannot move up, and second to last template cannot move down
              const templatePrev = ind-1 >= 0 ? templates[ind-1] : null
              const templateNext = ind+1 < templates.length ? templates[ind+1] : null
              const upEnabled =
                !isMainTemplate &&
                !editing && ind > 0 && templatePrev &&
                !this.state.editingStates[templatePrev.id]
              const downEnabled =
                !isMainTemplate &&
                !editing && ind < templates.length-2 && templateNext &&
                !this.state.editingStates[templateNext.id]
              const match = structs.Template.match(template)
              const applicableShips =
                shipTargets
                  .filter(s => match(s.stype))
                  .sort((x,y) => x.rstId - y.rstId)
              return (
                <TemplateBox
                  stypeInfo={stypeInfo}
                  shipTargets={applicableShips}
                  key={template.id}
                  upAction={
                    upEnabled ?
                      this.handleSwapTemplate(template.id,templatePrev.id) : null
                  }
                  downAction={
                    downEnabled ?
                      this.handleSwapTemplate(template.id,templateNext.id) : null
                  }
                  editing={editing}
                  onModifyGoalTable={modifyGoalTable}
                  onModifyTemplateListElem={this.handleModifyTemplateListElem(template.id)}
                  onModifyEditingState={this.handleModifyEditingState(template.id)}
                  onRemoveTemplate={this.handleRemoveTemplate(template.id)}
                  template={template} />
              )
            })
          }

        </ListGroup>
        <Modal show={this.state.showModal} onHide={this.handleCloseResetDialog}>
          <Modal.Header closeButton>
            <Modal.Title>{__('Template.ConfirmResetting')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{__('Template.AreYouSureContent')}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleCloseResetDialog}>
              {__('Template.Cancel')}
            </Button>
            <Button bsStyle="danger" onClick={this.handleConfirmResetDialog}>
              {__('Template.Confirm')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

const MethodTemplateArea = connect(
  methodTemplateUISelector,
  mapDispatchToProps,
)(MethodTemplateAreaImpl)

export { MethodTemplateArea }
