import React, { Component } from 'react'
import {
  Panel,
  Nav, NavItem,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'

import { MethodSortieEdit } from './method-sortie-edit'
import { MethodCustomEdit } from './method-custom-edit'

const { __ } = window

class LevelingMethodPanel extends Component {
  // eslint fails to see that it's already been required.
  static propTypes = {
    methodType: PTyp.oneOf(['sortie','custom']).isRequired,
    // eslint-disable-next-line react/require-default-props
    sortieInput: MethodSortieEdit.propTypes.sortieInput,
    // eslint-disable-next-line react/require-default-props
    customInput: MethodCustomEdit.propTypes.customInput,
    onMethodTypeSelect: PTyp.func.isRequired,
    onSortieInputChange: PTyp.func.isRequired,
    onCustomInputChange: PTyp.func.isRequired,
  }

  render() {
    const {
      methodType,
      sortieInput,
      customInput,
      onMethodTypeSelect,
      onSortieInputChange,
      onCustomInputChange,
    } = this.props
    return (
      <Panel
          className="lvl-method"
          header={__('EditMethod.Title')}>
        <div className="lvl-method-input">
          <Nav
              onSelect={onMethodTypeSelect}
              bsStyle="tabs" stacked activeKey={methodType}>
            <NavItem eventKey="sortie">{__('Method.Sortie')}</NavItem>
            <NavItem eventKey="custom">{__('EditMethod.Custom')}</NavItem>
          </Nav>
          <div style={{flex: 1}}>
            <MethodSortieEdit
                sortieInput={sortieInput}
                onSortieInputChange={onSortieInputChange}
                visible={methodType === 'sortie'} />
            <MethodCustomEdit
                customInput={customInput}
                onCustomInputChange={onCustomInputChange}
                visible={methodType === 'custom'} />
          </div>
        </div>
      </Panel>
    )
  }
}

export { LevelingMethodPanel }
