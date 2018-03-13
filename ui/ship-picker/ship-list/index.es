import _ from 'lodash'
import { modifyObject } from 'subtender'
import React, { PureComponent } from 'react'
import {
  createStructuredSelector,
} from 'reselect'
import { connect } from 'react-redux'
import {
  AutoSizer,
  Table,
  Column,
  SortDirection,
} from 'react-virtualized'

import { PTyp } from '../../../ptyp'
import { mapDispatchToProps } from '../../../store'
import {
  hasGoalFuncSelector,
  shipListSelector,
  sortMethodSelector,
} from '../selectors'

import { RowControls } from './row-controls'
import { NameCell } from './name-cell'

/*

   TODO for RVTable:

   - filters
   - i18n

 */

const mkCellDataGetter = propName =>
  ({rowData}) => rowData[propName]

// this part allows picking ships for leveling
// would include some filters in header and a table
// for showing ship-related info in detail
class ShipListImpl extends PureComponent {
  static propTypes = {
    ships: PTyp.arrayOf(PTyp.Ship).isRequired,
    sortMethod: PTyp.ShipPickerSorter.isRequired,
    hasGoal: PTyp.func.isRequired,

    addShipToGoalTable: PTyp.func.isRequired,
    removeShipFromGoalTable: PTyp.func.isRequired,
    uiModify: PTyp.func.isRequired,
  }

  state = {rmConfirmFlags: {}}

  componentWillReceiveProps = nextProps => {
    // on goal table change
    if (nextProps.hasGoal !== this.props.hasGoal) {
      // removing a goal from anywhere should cause 'rmConfirmFlags' to reset
      const rmConfirmFlags = {...this.state.rmConfirmFlags}
      let modified = false
      _.keys(rmConfirmFlags).map(rstIdStr => {
        const rstId = Number(rstIdStr)
        if (!nextProps.hasGoal(rstId)) {
          delete rmConfirmFlags[rstId]
          modified = true
        }
      })
      if (modified) {
        this.setState({rmConfirmFlags})
      }
    }
  }

  getRmConfirmFlag = rstId =>
    _.get(this.state.rmConfirmFlags, rstId, false)

  modifySortMethod = modifier =>
    this.props.uiModify(
      modifyObject(
        'shipTab',
        modifyObject('sortMethod', modifier)
      )
    )

  renderRowControls = ({cellData}) => {
    const {mode, rstId} = cellData
    const {addShipToGoalTable, removeShipFromGoalTable} = this.props
    return (
      <RowControls
        mode={mode}
        onAddToGoalTable={() => addShipToGoalTable(rstId)}
        onRemoveFromGoalTable={() => removeShipFromGoalTable(rstId)}
        onSwitchToRemovalConfirm={() =>
          this.setState(modifyObject('rmConfirmFlags', modifyObject(rstId, () => true)))
        }
        onCancelRemovalConfirm={() =>
          this.setState(modifyObject('rmConfirmFlags', modifyObject(rstId, () => false)))
        }
      />
    )
  }

  render() {
    const {ships, hasGoal, sortMethod} = this.props
    return (
      <div
        style={{
          flex: 1,
          height: 0,
        }}
      >
        <AutoSizer>
          {
            ({width, height}) => (
              <Table
                width={width}
                height={height}
                headerHeight={24}
                rowCount={ships.length}
                rowGetter={({index}) => ships[index]}
                rowHeight={28}
                rowClassName={({index}) => (index === -1) ? '' : 'color-altering-row'}
                sort={({sortBy, sortDirection}) =>
                  this.modifySortMethod(
                    _oldM => ({
                      method: sortBy,
                      reversed: sortDirection === SortDirection.DESC,
                    })
                  )
                }
                sortBy={sortMethod.method}
                sortDirection={
                  sortMethod.reversed ? SortDirection.DESC : SortDirection.ASC
                }
              >
                <Column
                  label="ID"
                  dataKey="rid"
                  cellDataGetter={mkCellDataGetter('rstId')}
                  width={40}
                  flexGrow={1}
                  defaultSortDirection={SortDirection.DESC}
                />
                <Column
                  label="Type"
                  dataKey="stype"
                  cellDataGetter={mkCellDataGetter('typeName')}
                  width={60}
                  flexGrow={1}
                />
                <Column
                  label="Name"
                  dataKey="name"
                  width={140}
                  flexGrow={4}
                  cellDataGetter={
                    ({rowData}) => {
                      const {name, fleet, locked, rstId} = rowData
                      const goalFlag = hasGoal(rstId)
                      return {name, fleet, locked, goalFlag}
                    }
                  }
                  cellRenderer={({cellData}) => (<NameCell {...cellData} />)}
                />
                <Column
                  label="Level"
                  dataKey="level"
                  width={50}
                  flexGrow={2}
                  headerStyle={{textAlign: 'center'}}
                  style={{textAlign: 'center'}}
                />
                {
                  [
                    {label: 'ASW', dataKey: 'asw'},
                    {label: 'Evasion', dataKey: 'evasion'},
                    {label: 'LoS', dataKey: 'los'},
                  ].map(props => (
                    <Column
                      key={props.dataKey}
                      {...props}
                      width={40}
                      flexGrow={2}
                      headerStyle={{textAlign: 'center'}}
                      style={{textAlign: 'center'}}
                    />
                  ))
                }
                <Column
                  label="Control"
                  disableSort={true}
                  dataKey="control"
                  width={100}
                  flexGrow={1}
                  headerStyle={{textAlign: 'center'}}
                  style={{textAlign: 'center'}}
                  cellDataGetter={
                    ({rowData: {rstId}}) => ({
                      mode:
                        // depending on whether it exists in goals
                        // the set of control button can be in 'add' / 'remove' mode
                        // additionally we have 'remove-confirm'.
                        this.getRmConfirmFlag(rstId) ?
                          'remove-confirm' :
                          hasGoal(rstId) ? 'remove' : 'add',
                      rstId,
                    })
                  }
                  cellRenderer={this.renderRowControls}
                />
              </Table>
            )
          }
        </AutoSizer>
      </div>
    )
  }
}

const ShipList = connect(
  createStructuredSelector({
    hasGoal: hasGoalFuncSelector,
    sortMethod: sortMethodSelector,
    ships: shipListSelector,
  }),
  mapDispatchToProps,
)(ShipListImpl)

export { ShipList }
