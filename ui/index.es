import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { createSelector } from 'reselect'

import { store } from 'views/create-store'
import {
  shipsSelector,
  constSelector,
  fleetsSelector,
} from 'views/utils/selectors'

import { ShipPicker } from './ship-picker'

const { $ } = window

window.store = store

$('#fontawesome-css')
  .setAttribute('href', require.resolve('font-awesome/css/font-awesome.css'))

const shipsInfoSelector = createSelector(
  shipsSelector,
  constSelector,
  fleetsSelector,
  (rawShips, rawConst, fleets) => {
    const { $ships, $shipTypes } = rawConst
    return Object.keys(rawShips).map( rstIdStr => {
      const rstId = parseInt(rstIdStr,10)
      const ship = rawShips[rstIdStr]
      const mstId = ship.api_ship_id
      const $ship = $ships[mstId]
      const name = $ship.api_name
      const typeName = $shipTypes[$ship.api_stype].api_name
      const level = ship.api_lv
      const [evasion, asw, los] = [ship.api_kaihi[0],ship.api_taisen[0],ship.api_sakuteki[0]]
      const locked = ship.api_locked !== 0
      const fleetInd = fleets.findIndex( fleet => fleet.api_ship.indexOf(rstId) !== -1)
      const fleet = fleetInd === -1 ? null : fleets[fleetInd].api_id
      return {
        rstId,
        typeName,
        name,
        level,
        fleet,
        evasion,
        asw,
        los,
        locked,
      }
    })
  })

class Main extends Component {
  render() {
    return (
      <div>
        <ShipPicker ships={this.props.ships} />
      </div>
    )
  }
}

const MainInst = connect(
  state => {
    const ships = shipsInfoSelector(state)
    return { ships }
  }
)(Main)

ReactDOM.render(
  <Provider store={store}>
    <MainInst />
  </Provider>,
  $("#content-root"))
