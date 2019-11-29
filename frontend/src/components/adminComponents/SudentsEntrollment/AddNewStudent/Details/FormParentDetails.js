import React, { Component } from 'react'


import PropTypes from 'prop-types'
import _ from 'lodash'
//import faker from 'faker'

import {Button, Icon,Input, Form, Accordion, Search, Grid, Segment, Label, Header} from 'semantic-ui-react'
import { EventEmitter } from 'events';
 
/////////////////////////START SEARCH STUFF
const source = [
  {
      "ID": "6d361d43-1308-4ac6-95ab-580138de9141",
      "eMail": "giorgio.digiorgio@parentsunited.com",
      "Password": "$2b$12$5x1d5dLKzmkBFJutQ9jdhOLLL.DC2qxTKtuIrwES.BgYa6/WtCiby",
      "FirstName": "Giorgio",
      "LastName": "Di Giorgio",
      "SSN": "PVDZRN27M04G189V",
      "CreatedOn": "2019-11-27T17:26:09.000Z",
      "IsAdminOfficer": 0,
      "IsSysAdmin": 0,
      "IsParent": 1,
      "IsTeacher": 0,
      "IsPrincipal": 0
  },
  {
      "ID": "202db8275d3c06e6ce3fe7a47b30e0fe",
      "eMail": "marco.lorenzini@gmail.com",
      "Password": "$2b$12$7jfwLDVzo/A.iLqkiUZk0uHH8ZHkkOQiOuXHnc0e51/r09w95n6Ne",
      "FirstName": "Marco",
      "LastName": "Lorenzini",
      "SSN": "LRNMRC76A02L219A",
      "CreatedOn": "2019-11-27T17:26:09.000Z",
      "IsAdminOfficer": 0,
      "IsSysAdmin": 0,
      "IsParent": 1,
      "IsTeacher": 0,
      "IsPrincipal": 0
  },
  {
      "ID": "9d64fa59c91d9109b11cd9e05162c675",
      "eMail": "nadia.rossi@gmail.com",
      "Password": "$2b$12$9o/51NyMn6W2bA/UxQUpheRwBiTC13OpRyNc7k6VnCesHKjlz9GQa",
      "FirstName": "Nadia",
      "LastName": "Rossi",
      "SSN": "RSSNDA76A41L219U",
      "CreatedOn": "2019-11-27T17:26:09.000Z",
      "IsAdminOfficer": 0,
      "IsSysAdmin": 0,
      "IsParent": 1,
      "IsTeacher": 0,
      "IsPrincipal": 0
  },
  {
      "ID": "32d905eaa2770b66baf20282dff09191",
      "eMail": "lucia.verdi@gmail.com",
      "Password": "$2b$12$vJfPLV3oGNfbouxAZyEdhuR0ek9nh.Y0pUerBPR1QmRD.xTCwaJ32",
      "FirstName": "Lucia",
      "LastName": "Verdi",
      "SSN": "VRDLCU75A41L219F",
      "CreatedOn": "2019-11-27T17:26:09.000Z",
      "IsAdminOfficer": 0,
      "IsSysAdmin": 0,
      "IsParent": 1,
      "IsTeacher": 0,
      "IsPrincipal": 0
  }
]


console.log(source)
const resultRenderer = ({ SSN }) => <Label content={SSN} />
resultRenderer.propTypes = {
  SSN: PropTypes.string,
  eMail: PropTypes.string,
}
const initialState = { isLoading: false, results: [], value: '' }
/////////////////////END SEARCH STUFF




export class FormParentDetails extends Component {
  /////////////START SEARCH STUFF
  state = initialState
  handleResultSelect = (e, { result }) => this.setState({ value: result.SSN })

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = (result) => re.test(result.SSN)

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      })
    }, 300)
  }
  ////////////END SEARCH STUFF







  
  handleSSNChange = (event) => {
    //send request /find-parents?ssn=<value>
    //update autocomplete library with responce ssn  
    //check if responce array.length==1 && value == response.data[0]["SSN"]  
    //set id = response.data[0]["ID"] and make P1exists:true

    {(event.target.name === "p1_SSN") ? this.setState({P1exists: event.target.value}) : this.setState({typedP2: event.target.value});}
  }

  state = { 
    activeIndex: 1,
    P1exists:true,
    P2exists:false

  }
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
/////////
      const { isLoading, value, results } = this.state
////////
        return (
            <>
            <h2 className="addStudBlockHeader">
                Parent Data
            </h2>

            <Form>
            
            {/* <Form.Input
              //error={this.state.errors['p1_SSN']}
              label='SSN' placeholder='SSN'
              name='p1_SSN'
              defaultValue = {values.p1_SSN}
              onChange={handleChange('p1_SSN')}
              onChange={this.handleP1ssnChange.bind(this)}

            /> */}

            <Form.Field>
            <Grid>
              <Grid.Column width={6}>
                  <label>SSN &nbsp; {this.state.P1exists && <Icon name='check' style = {{color:'#68af64' }}/>}</label>
                <Search
                  loading={isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true,
                  })}
                  results={results}
                  value={value}
                  resultRenderer={resultRenderer}
                  {...this.props}
                />
              </Grid.Column>
              

              
              <Grid.Column width={10}>
              <Segment>
                <Header>State</Header>
                <pre style={{ overflowX: 'auto' }}>
                  {JSON.stringify(this.state, null, 2)}
                </pre>
                {/* <Header>Options</Header>
                <pre style={{ overflowX: 'auto' }}>
                  {JSON.stringify(source, null, 2)}
                </pre> */}
              </Segment>
              </Grid.Column>



            </Grid>
            </Form.Field>



            <Form.Field>
              <label> 
                  SSN &nbsp; {this.state.P1exists && <span style = {{color:'#68af64' }}>
                    <Icon name='check'/>Details of this parent are known.</span>}
              </label>
              <Input 
                  type='text'
                  placeholder='SSN' 
                  name='p1_SSN'
                  id="p1"
                  defaultValue = {values.p1_SSN}

                  onChange={this.handleSSNChange.bind(this)} 
                  //onChange={handleChange('p1_SSN')}
              />
            </Form.Field>

            <Form.Group widths='equal'>
              <Form.Input
                label='First Name' placeholder='First Name'
                name='p1_FirstName'
                disabled={this.state.P1exists}
                defaultValue = {values.p1_FirstName}
                onChange={handleChange('p1_FirstName')}
              />
              <Form.Input
                label='Last Name' placeholder='Last Name'
                name='p1_LastName'
                disabled={this.state.P1exists}
                defaultValue = {values.p1_LastName}
                onChange={handleChange('p1_LastName')}
              />
            </Form.Group>
            <Form.Input
                fluid icon='envelope' iconPosition='left' 
                label='E-mail address'type='email'placeholder='E-mail address'
                name="p1_Email"
                disabled={this.state.P1exists}
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
                  {/* <Form.Input
                    //error={this.state.errors['p2_SSN']}
                    label='SSN' placeholder='SSN'
                    name='p2_SSN'
                    defaultValue = {values.p2_SSN}
                    onChange={handleChange('p2_SSN')}
                  /> */}

                  <Form.Field>
                    <label> 
                        SSN &nbsp; {this.state.P2exists && <span style = {{color:'#68af64' }}>
                          <Icon name='check'/>Details of this parent are known.</span>}
                    </label>
                    <Input 
                        type='text'
                        placeholder='SSN' 
                        name='p2_SSN'
                        id="p2"
                        defaultValue = {values.p2_SSN}

                        onChange={this.handleSSNChange.bind(this)} 
                        //onChange={handleChange('p2_SSN')}
                    />
                 </Form.Field>

                  <Form.Input
                    fluid icon='envelope' iconPosition='left'
                    label='E-mail address'type='email'placeholder='E-mail address'
                    disabled={this.state.P2exists}
                    name="p2_Email"
                    defaultValue = {values.p2_Email}
                    onChange={handleChange('p2_Email')}
                  />
                </Form.Group>

                <Form.Group widths='equal'>
                  <Form.Input
                    label='First Name' placeholder='First Name'
                    name='p2_FirstName'
                    disabled={this.state.P2exists}
                    defaultValue = {values.p2_FirstName}
                    onChange={handleChange('p2_FirstName')}
                  />
                  <Form.Input
                    label='Last Name' placeholder='Last Name'
                    name='p2_LastName'
                    disabled={this.state.P2exists}
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
