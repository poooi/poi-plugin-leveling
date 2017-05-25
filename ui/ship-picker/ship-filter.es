import React, { Component } from 'react'
import { Table, Button, DropdownButton, MenuItem } from 'react-bootstrap'

class ShipFilter extends Component {
  static filters = [
    {
      titlePrefix: "Type",
      id: "type",
      options: ["All", "typ1", "typ2"],
    },
    {
      titlePrefix: "Level",
      id: "level",
      options: [
        "All",
        "Lv. >= 100",
        "Lv. < 100",
        "Under next remodel Level",
        "Under final remodel Level",
      ],
    },
    {
      titlePrefix: "Fleet",
      id: "fleet",
      options: [
        "All",
        "Fleet 1",
        "Fleet 2",
        "Fleet 3",
        "Fleet 4",
      ],
    },
    {
      titlePrefix: "Lock",
      id: "lock",
      options: [
        "All",
        "Locked",
        "Unlocked",
      ],
    },
  ]

  render() {
    const mkDropdown = filterInfo => {
      const { titlePrefix, id, options } = filterInfo
      return (
        <DropdownButton
            title={`${titlePrefix}: All`}
            id={`ship-filter-${id}`}
            key={`ship-filter-${id}`}>
          {
            options.map( (x,ind) => (
              <MenuItem key={`s-f-i-${x}`} eventKey={ind}>
                {x}
              </MenuItem>
            ))
          }
        </DropdownButton>
      )
    }

    return (
      <div>
        { ShipFilter.filters.map( mkDropdown ) }
      </div>
    )
  }
}

export { ShipFilter }
