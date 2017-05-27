import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { store, extendReducer } from 'views/create-store'

import { reducer, mapDispatchToProps } from '../reducer'
import {
  mainUISelector,
} from '../selector'

import { GoalArea } from './goal-area'

const { $ } = window

window.store = store

$('#fontawesome-css')
  .setAttribute('href', require.resolve('font-awesome/css/font-awesome.css'))

const GoalAreaInst = connect(
  mainUISelector,
  mapDispatchToProps,
)(GoalArea)

class LevelingMain extends Component {
  render() {
    return (
      <div>
        <GoalAreaInst />
      </div>
    )
  }
}

extendReducer('poi-plugin-leveling', reducer)

ReactDOM.render(
  <Provider store={store}>
    <LevelingMain />
  </Provider>,
  $("#content-root"))
