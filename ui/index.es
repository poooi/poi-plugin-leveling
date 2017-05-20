import React, { Component } from "react"
import ReactDOM from "react-dom"

import { Provider } from "react-redux"
import { store } from "views/create-store"

// const { _, __, $, remote } = window
const { $ } = window

window.store = store

$("#fontawesome-css")
  .setAttribute("href", require.resolve("font-awesome/css/font-awesome.css"))

class Main extends Component {
  render() {
    return (
      <div>
        Leveling
      </div>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  $("#content-root"))
