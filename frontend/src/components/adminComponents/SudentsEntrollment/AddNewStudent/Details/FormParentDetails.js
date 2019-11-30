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
  p1_ID:"", 
  p2_ID:"",
  p1_SSN: '',       //For Search: final value for Parent 2
  p2_SSN:'',        //For Search: final value for Parent 2
  isLoading: false,   //For Search: loading icon 
  results: [],        //For Search: filtered data
}

let source = [];



export class FormParentDetails extends Component {
  state = {
    activeIndex: 1, 
    
    p1_SSN:"",
    p1_FirstName:"",
    p1_LastName:"",
    p1_Email:"",

    p2_SSN:"",
    p2_FirstName:"",
    p2_LastName:"",
    p2_Email:""
  };   //For Accordion: not in initialState to not be closed during search
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
    
    e.preventDefault();
    //console.log([e.target.name]);
    if(e.target.name === "P1"){
      this.setState({ 
        p1_SSN: result.SSN,
        p1_ID: result.ID,
        p1_FirstName:"",
        p1_LastName:"",
        p1_Email:""

       }) 
    }else if (e.target.name === "P2"){
      this.setState({ 
        p2_SSN: result.SSN,
        p2_ID: result.ID,
        p1_FirstName:"",
        p1_LastName:"",
        p1_Email:""
       }) 
    }
  }
  
  handleSearchChange = (e, { value }) => {
    e.preventDefault();

    //this.setState({p1_ID:"", p2_ID:""});
    
    this.updateSearchOptions(value);
    
    if(e.target.name === "P1"){
      this.setState({p1_ID:""});
      this.setState({ isLoading: true, p1_SSN:value })
      setTimeout(() => {
        if (this.state.p1_SSN.length < 1) return this.setState(initialState)
        const re = new RegExp(_.escapeRegExp(this.state.p1_SSN), 'i')
        const isMatch = (result) => re.test(result.SSN)
        this.setState({
          isLoading: false,
          results: _.filter(source, isMatch),
      })}, 300)

    }else if(e.target.name === "P2"){
      this.setState({p2_ID:""});
      this.setState({ isLoading: true, p2_SSN:value })
      setTimeout(() => {
        if (this.state.p2_SSN.length < 1) return this.setState(initialState)
        const re = new RegExp(_.escapeRegExp(this.state.p2_SSN), 'i')
        const isMatch = (result) => re.test(result.SSN)
        this.setState({
          isLoading: false,
          results: _.filter(source, isMatch),
      })}, 300) 
    }

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

      const { isLoading, p1_SSN, p2_SSN, results } = this.state

        return (
            <>
            <h2 className="addStudBlockHeader">
                Parent Data
            </h2>

            <Form>
            <Form.Field>
            <Grid>
              <Grid.Column>
                  <label><b>SSN</b></label>
                <Search
                  name="P1"
                  loading={isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true,
                  })}
                  noResultsMessage = "No Parent Found."
                  //minCharacters = "4" //minimum characters to show options
                  results={results}
                  value={p1_SSN}
                  resultRenderer={resultRenderer}
                  {...this.props}
                />
                
                {(!this.state.p1_ID.trim() == "") && <h5 style = {{color:'#68af64' }}><Icon name='check' />Details of this parent are known</h5>}
              </Grid.Column>
            </Grid>
            </Form.Field>


            {(this.state.p1_ID.trim() == '') &&  
            <>
              <Form.Group widths='equal'>
                <Form.Input
                  label='First Name' placeholder='First Name'
                  name='p1_FirstName'
                  //defaultValue = {values.p1_FirstName}
                  defaultValue = {this.state.p1_FirstName}
                  //onChange={handleChange('p1_FirstName')}
                />
                <Form.Input
                  label='Last Name' placeholder='Last Name'
                  name='p1_LastName'
                  //defaultValue = {values.p1_LastName}
                  defaultValue = {this.state.p1_LastName}
                  //onChange={handleChange('p1_LastName')}
                />
              </Form.Group>
              <Form.Input
                  fluid icon='envelope' iconPosition='left' 
                  label='E-mail address'type='email'placeholder='E-mail address'
                  name="p1_Email"
                  //defaultValue = {values.p1_Email}
                  defaultValue = {this.state.p1_Email}
                  //onChange={handleChange('p1_Email')}
              />
            </>
            }


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
                <Form.Field>
                  <Grid>
                    <Grid.Column>
                        <label><b>SSN</b></label>
                      <Search
                        name="P2"
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(this.handleSearchChange, 500, {
                          leading: true,
                        })}
                        noResultsMessage = "No Parent Found."
                        //minCharacters = "4" //minimum characters to show options
                        results={results}
                        value={p2_SSN}
                        resultRenderer={resultRenderer}
                        {...this.props}
                      />
                      
                      {(!this.state.p2_ID.trim() == "") && <h5 style = {{color:'#68af64' }}><Icon name='check' />Details of this parent are known</h5>}
                    </Grid.Column>
                  </Grid>
                  </Form.Field>

              {(this.state.p2_ID.trim() == '') &&  
                <>
                <Form.Group widths='equal'>

                  <Form.Input
                    fluid icon='envelope' iconPosition='left'
                    label='E-mail address'type='email'placeholder='E-mail address'
                    name="p2_Email"
                    defaultValue = {values.p2_Email}
                    onChange={handleChange('p2_Email')}
                  />

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
              }

          
            </></Accordion.Content>
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
