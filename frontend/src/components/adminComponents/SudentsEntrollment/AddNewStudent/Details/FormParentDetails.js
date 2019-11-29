import React, { Component } from 'react'
import { api } from '../../../../../services/api';

import PropTypes from 'prop-types';
import _ from 'lodash';

import {Button, Icon, Form, Accordion, Search, Grid, Header} from 'semantic-ui-react'

//Search Result Layout
const resultRenderer = ({ SSN, 
                          FirstName, 
                          LastName , 
                          eMail}) => 
                          <>
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
//initialState for search field
const initialState = {
  activeIndex: 1,     //For Accordion
  idP1:"",
  idP2:"",
  p1_value: '',
  p2_value:'',          //For Search: final value   TODO: make another one vor parent2
  isLoading: false,   //For Search: loading icon 
  results: [],        //For Search: filtered data
}

let source = [];



export class FormParentDetails extends Component {
  state = initialState
 
  back = e => {
    e.preventDefault();
    this.props.prevStep();
  }

  confirm = e => {
    e.preventDefault();
    this.props.confirm();
  };

//--Get/Find Possible Prents from back end
  async updateSearchOptions(val) {
//TODO: check quantity of symbols to be > 4 
      const response = await api.admin.searchParentBySSN(val);
      if (response.data) {
         source = response.data
      }
  }
  

  //------START SEARCH STUFF
  handleResultSelect = (e, { result }) => {
    //(e.target.name === "p1_SSN") ? this.setState({idP1: result.ID, p1_value:result.SSN}) : this.setState({idP2: result.ID, p2_value:result.SSN})
     this.setState({ 
      value: result.SSN,
      idP1: result.ID
     }) 
  }
  
  handleSearchChange = (e, { value }) => {

    this.setState({idP1:"", idP2:""});
    this.updateSearchOptions(value);
    

    this.setState({ isLoading: true, p1_value:value })

    setTimeout(() => {
      if (this.state.p1_value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.p1_value), 'i')
      const isMatch = (result) => re.test(result.SSN)

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      })
    }, 300)
  }
  //------END SEARCH STUFF


  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }




    render() {
      //for sharing props with FormStudentDetails state
      const {values, handleChange} = this.props;

      const { isLoading, p1_value, results } = this.state

        return (
            <>
            <h2 className="addStudBlockHeader">
                Parent Data
            </h2>

            <Form>
            <Form.Field>
            <Grid>
              <Grid.Column>
                  <label>SSN</label>
                <Search
                  name="p1_SSN"
                  loading={isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true,
                  })}
                  //minCharacters = "4" //minimum characters to show options
                  results={results}
                  value={p1_value}
                  resultRenderer={resultRenderer}
                  {...this.props}
                />
                

                {(!this.state.idP1.trim() == "") && <p style = {{color:'#68af64' }}><Icon name='check' />Details of this parent are known</p>}
              </Grid.Column>
              

{/* 
--- VISUALIZE MY STATE 
--- NOTE: make prev. grid.column width={6} ----------------------------- 

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
*/}


            </Grid>
            </Form.Field>


            <Form.Group widths='equal'>
              <Form.Input
                label='First Name' placeholder='First Name'
                name='p1_FirstName'
                disabled = {!this.state.idP1.trim() == ""}
                //disabled={this.state.P1exists}
                defaultValue = {values.p1_FirstName}
                onChange={handleChange('p1_FirstName')}
              />
              <Form.Input
                label='Last Name' placeholder='Last Name'
                name='p1_LastName'
                disabled = {!this.state.idP1.trim() == ""}
                //disabled={this.state.P1exists}
                defaultValue = {values.p1_LastName}
                onChange={handleChange('p1_LastName')}
              />
            </Form.Group>
            <Form.Input
                fluid icon='envelope' iconPosition='left' 
                label='E-mail address'type='email'placeholder='E-mail address'
                name="p1_Email"
                disabled = {!this.state.idP1.trim() == ""}
                //disabled={this.state.P1exists}
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
              <Icon name="dropdown"/><Icon name='user plus'/>&nbsp;
              Second Parent Details (Optional)
            </Accordion.Title>

            <Accordion.Content active={this.state.activeIndex === 0}>
                <>
                <Form.Group widths='equal'>
    
{/*                   <Form.Field>
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

                        //onChange={this.handleSSNChange.bind(this)} 
                        //onChange={handleChange('p2_SSN')}
                    />
                 </Form.Field>
 */}

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
