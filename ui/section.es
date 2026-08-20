import React from 'react'
import { Card, H6 } from '@blueprintjs/core'

import { PTyp } from '../ptyp'

// react-bootstrap's Panel / Panel.Heading / Panel.Body replacement
const Section = ({title, style, children}) => (
  <Card style={{padding: 8, ...style}}>
    {
      title !== null && (
        <H6 style={{marginTop: 0, marginBottom: 5}}>
          {title}
        </H6>
      )
    }
    {children}
  </Card>
)

Section.propTypes = {
  title: PTyp.node,
  style: PTyp.object,
  children: PTyp.node,
}

Section.defaultProps = {
  title: null,
  style: {},
  children: null,
}

export { Section }
