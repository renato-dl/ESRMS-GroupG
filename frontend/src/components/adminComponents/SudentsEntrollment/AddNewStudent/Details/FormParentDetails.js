import React, { Component } from 'react'
import { api } from '../../../../../services/api';

import PropTypes from 'prop-types';
import _ from 'lodash';

import {Button, Icon,Input, Form, Accordion, Search, Grid, Segment, Label, Header, List} from 'semantic-ui-react'
 
/////////////////////////START SEARCH STUFF
{/* <><Label content={SSN}/><Label color='teal'> <Icon name ='user'/>{FirstName}&nbsp;{LastName}</Label> </> */}
{/* <><Header as='h2'><Icon name='user'/><Header.Content>{SSN}<Header.Subheader>{FirstName}&nbsp;{LastName}</Header.Subheader></Header.Content></Header></> */}

const resultRenderer = ({ SSN, FirstName, LastName , eMail}) => <>
                                                        <Header as='h4' style={{color:"#984d71"}}>
                                                          <Header.Content><Icon name ="user"/>{FirstName}&nbsp;{LastName}
                                                            <Header.Subheader style={{fontSize: "18px", color:"#4D7198"}}>{SSN}</Header.Subheader>
                                                          </Header.Content>
                                                        </Header>
                                                        <p style={{fontSize:"13px", color:"#984d71"}}>{eMail}</p>
                                                        </>
resultRenderer.propTypes = {
  SSN: PropTypes.string,
  eMail: PropTypes.string,
  FirstName: PropTypes.string,
  LastName: PropTypes.string
}

const initialState = { 
  isLoading: false, 
  results: [], 
  value: '', 
  P1exists: false, 
  P2exists:false 
}
/////////////////////END SEARCH STUFF


let source = [];


export class FormParentDetails extends Component {

  async updateSearchOptions(val) {
      const response = await api.admin.searchParentBySSN(val);
      if (response.data) {
         source = response.data
      }

  }
  

  /////////////START SEARCH STUFF
  state = initialState
  handleResultSelect = (e, { result }) => this.setState({ value: result.SSN })
  
  handleSearchChange = (e, { value }) => {
    
    this.updateSearchOptions(value);

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
            <Form.Field>
            <Grid>
              <Grid.Column width={6}>
                  <label>SSN &nbsp; {this.state.P1exists && <p style = {{color:'#68af64' }}><Icon name='check' />
                                    Details of this parent are known</p>} 
                  </label>
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
                 <Header>Options</Header>
                <pre style={{ overflowX: 'auto' }}>
                  {JSON.stringify(source, null, 2)}
                </pre> 
              </Segment>
              </Grid.Column>



            </Grid>
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
