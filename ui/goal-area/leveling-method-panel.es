import React, { Component } from 'react'
import {
  Nav, NavItem,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { Section } from '../section'

import { MethodSortieEdit } from './method-sortie-edit'
import { MethodCustomEdit } from './method-custom-edit'

const { __ } = window.i18n["poi-plugin-leveling"]

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

    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const {
      style,
      methodType,
      sortieInput,
      customInput,
      onMethodTypeSelect,
      onSortieInputChange,
      onCustomInputChange,
    } = this.props
    return (
      <Section
        title={__('EditMethod.Title')}
        style={style}
      >
        <div
          style={{display: 'flex'}}
        >
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
      </Section>
    )
  }
}

export { LevelingMethodPanel }
