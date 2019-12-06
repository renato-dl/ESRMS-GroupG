import React from 'react'
import { Popup } from 'semantic-ui-react'

const Tooltip = (props) => (
  <Popup size="tiny" position="top center" content={props.text} trigger={props.trigger} />
);

export default Tooltip;
