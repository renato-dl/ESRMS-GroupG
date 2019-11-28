import React, { Component } from 'react'

import {Button, Icon, Form,Accordion} from 'semantic-ui-react'



export class FormParentDetails extends Component {

  state = { activeIndex: 1 }
  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }


    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    confirm = e => {
      e.preventDefault();
      this.props.confirm();
    };

    render() {
      const {values, handleChange} = this.props;
        return (
            <>
            <h2 className="addStudBlockHeader">
                Parent Data
            </h2>

            <Form>
                
            <Form.Input
              //error={this.state.errors['p1_SSN']}
              label='SSN' placeholder='SSN'
              name='p1_SSN'
              defaultValue = {values.p1_SSN}
              onChange={handleChange('p1_SSN')}
            />
            
            <Form.Group widths='equal'>
              <Form.Input
                label='First Name' placeholder='First Name'
                name='p1_FirstName'
                defaultValue = {values.p1_FirstName}
                onChange={handleChange('p1_FirstName')}
              />
              <Form.Input
                label='Last Name' placeholder='Last Name'
                name='p1_LastName'
                defaultValue = {values.p1_LastName}
                onChange={handleChange('p1_LastName')}
              />
            </Form.Group>
            <Form.Input
                fluid icon='envelope' iconPosition='left' 
                label='E-mail address'type='email'placeholder='E-mail address'
                name="p1_Email"
                defaultValue = {values.p1_Email}
                onChange={handleChange('p1_Email')}
            />

{/*--SECOND PARENT----------------------------------------------------------------------------*/}
            <Accordion as={Form.Field}  >
            <Accordion.Title
                active={this.state.activeIndex === 0}
                index={0}
                onClick={this.handleAccordionClick}
                className="optionalField"
             >
              <Icon name="dropdown"/>
              <Icon name='user plus' />
              &nbsp;Second Parent Details (Optional)
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === 0}>
            <>
                <Form.Group widths='equal'>
                  <Form.Input
                    //error={this.state.errors['p2_SSN']}
                    label='SSN' placeholder='SSN'
                    name='p2_SSN'
                    defaultValue = {values.p2_SSN}
                    onChange={handleChange('p2_SSN')}
                  />
                  <Form.Input
                    fluid icon='envelope' iconPosition='left'
                    label='E-mail address'type='email'placeholder='E-mail address'
                    name="p2_Email"
                    defaultValue = {values.p2_Email}
                    onChange={handleChange('p2_Email')}
                  />
                </Form.Group>

                <Form.Group widths='equal'>
                  <Form.Input
                    label='First Name' placeholder='First Name'
                    name='p2_FirstName'
                    defaultValue = {values.p2_FirstName}
                    onChange={handleChange('p2_FirstName')}
                  />
                  <Form.Input
                    label='Last Name' placeholder='Last Name'
                    name='p2_LastName'
                    defaultValue = {values.p2_LastName}
                    onChange={handleChange('p2_LastName')}
                  />
                </Form.Group>
                </>
            </Accordion.Content>
            </Accordion>

            <div className="addStudButtonField">
                <Button onClick={this.back} className="nextBTN">
                    <Icon name='left arrow' />Back 
                </Button>
                <Button  onClick={this.confirm} className="confirmBTN">
                    <Icon name='checkmark' />Submit
                </Button>
            </div>
          </Form>
          </>
        )
    }
}

export default FormParentDetails
