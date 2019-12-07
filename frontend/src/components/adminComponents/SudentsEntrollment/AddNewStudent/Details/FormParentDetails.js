import React, { Component } from 'react'
import { api } from '../../../../../services/api';
import PropTypes from 'prop-types';
import _ from 'lodash';
import '../AddNewStudent.scss'
import {SSNRegexp} from '../../../../../utils';
import validator from 'validator';

import {Button, Icon, Form, Accordion, Search, Grid, Header} from 'semantic-ui-react'

//Search Result Layout
const resultRenderer = ({
  SSN, 
  FirstName, 
  LastName, 
  eMail
}, parent) => (
  <div key={parent} id={parent}>
    <Header as='h4' style={{color:"#984d71"}}>
      <Header.Content><Icon name ="user"/>{FirstName}&nbsp;{LastName}
        <Header.Subheader style={{fontSize: "18px", color:"#4D7198"}}>{SSN}</Header.Subheader>
      </Header.Content>
    </Header>
    <p style={{fontSize:"13px", color:"#984d71"}}>{eMail}</p>
  </div>
);

resultRenderer.propTypes = {
  SSN: PropTypes.string,
  eMail: PropTypes.string,
  FirstName: PropTypes.string,
  LastName: PropTypes.string
}
//initialState for search fields
const initialState_P1 = {
  p1_ID:"",
  p1_SSN: '',        
  isLoading_P1: false,
  results_P1: [],       
}

const initialState_P2 = {
  p2_ID:"",
  p2_SSN:'',        
  isLoading_P2:false,
  results_P2: [],      
}

let source = [];



export class FormParentDetails extends Component {
  state = { 
    ...this.props.values,
    currentSSNSearch: 1
  }
 
  isEmptyStr(str) {
    return (!str || 0 === str.length || str === undefined);
  }

  back = e => {
    e.preventDefault();
    this.props.prevstep('a');
  }

  nextConfirm = e => {
    e.preventDefault();
    const [hasErrorsParent, parent_errors] = this.validateFields();
    console.log(hasErrorsParent, parent_errors);
    if (hasErrorsParent) {
      this.setState({parent_errors});
      return;
    }
    this.props.nextconfirm('a');
  };

  validateFields = () => {
    let parent_errors = this.state.parent_errors;

    parent_errors['p1_SSN'] = (this.isEmptyStr(this.state.p1_ID) ? !SSNRegexp.test(this.state.p1_SSN.trim()) : false);
    parent_errors['p1_Email'] = (this.isEmptyStr(this.state.p1_ID) ? !validator.isEmail(this.state.p1_Email) : false);
    

    parent_errors['p2_SSN'] = (this.state.activeIndex===1 && this.isEmptyStr(this.state.p2_ID) ? !SSNRegexp.test(this.state.p2_SSN.trim()) : false);
    parent_errors['p2_Email'] = (this.state.activeIndex===1 && this.isEmptyStr(this.state.p2_ID) ? !validator.isEmail(this.state.p2_Email) : false);

    parent_errors['p2_FirstName'] = (this.state.activeIndex===1 && this.isEmptyStr(this.state.p2_ID) ? this.isEmptyStr(this.state.p2_FirstName) : false); 
    parent_errors['p2_LastName'] = (this.state.activeIndex===1 && this.isEmptyStr(this.state.p2_ID) ? this.isEmptyStr(this.state.p2_LastName) : false); 
    
    const hasErrorsParent = !!Object.keys(parent_errors).filter((e) => parent_errors[e]).length;
    return [hasErrorsParent, parent_errors];
  };  

//--Get/Find Possible Prents from back end
  async updateSearchOptions(val) {
//TODO: check quantity of symbols to be > 4 
      const response = await api.admin.searchParentBySSN(val);
      if (response.data) {
        source = response.data
      }
  }

  handleChngeBothStates = (e, {name, value}) => {
      this.setState({[name]:value});
      this.props.handleChange(name)(e);
  }
  
//----Wrong but fast :D
  onSSNandIDChange = (e, onresult) => {
    const empty = {target:{value:""}};
    if (onresult){
      const idData = {target:{value: onresult.ID}};
      const ssnData = {target:{value: onresult.SSN}};

      if(this.state.currentSSNSearch === 1){
        this.props.handleChange('p1_SSN')(ssnData); 
        this.props.handleChange('p1_ID')(idData);
        this.props.handleChange('p1_FirstName')(empty);
        this.props.handleChange('p1_LastName')(empty);
        this.props.handleChange('p1_Email')(empty);

      }else if(this.state.currentSSNSearch === 2){
        this.props.handleChange('p2_SSN')(ssnData); 
        this.props.handleChange('p2_ID')(idData);
        this.props.handleChange('p2_FirstName')(empty);
        this.props.handleChange('p2_LastName')(empty);
        this.props.handleChange('p2_Email')(empty);
      }
    }else{

      if(this.state.currentSSNSearch === 1){
        this.props.handleChange('p1_SSN')(e); 
        this.props.handleChange('p1_ID')(empty);

      }else if(this.state.currentSSNSearch === 2){
        this.props.handleChange('p2_SSN')(e); 
        this.props.handleChange('p2_ID')(empty);
      }
    }
  }
  

  //------START SEARCH STUFF
  handleResultSelect = (e, { result }) => {
    console.log(e, result);
    //e.preventDefault();
    //console.log([e.target.name]);
    
    this.onSSNandIDChange(e, result); //wrong but fast :D
    if(this.state.currentSSNSearch === 1) {
      this.setState({ 
        p1_SSN: result.SSN,
        p1_ID: result.ID,
        p1_FirstName:"",
        p1_LastName:"",
        p1_Email:""
      }) 
    } else if (this.state.currentSSNSearch === 2) {
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
    
    this.onSSNandIDChange(e, false); //wrong but fast :D
    this.updateSearchOptions(value);
    
    if(e.target.name === "P1"){

      this.setState({p1_ID:""});
      this.setState({ isLoading_P1: true, p1_SSN:value })

      setTimeout(() => {
        if (this.state.p1_SSN.length < 1) return this.setState(initialState_P1)
        const re = new RegExp(_.escapeRegExp(this.state.p1_SSN), 'i')
        const isMatch = (result) => re.test(result.SSN)
        this.setState({
          isLoading_P1: false,
          results_P1: _.filter(source, isMatch),
      })}, 300)

    }else if(e.target.name === "P2"){

      this.setState({p2_ID:""});
      this.setState({ isLoading_P2: true, p2_SSN:value })

      setTimeout(() => {
        if (this.state.p2_SSN.length < 1) return this.setState(initialState_P2)
        const re = new RegExp(_.escapeRegExp(this.state.p2_SSN), 'i')
        const isMatch = (result) => re.test(result.SSN)
        this.setState({
          isLoading_P2: false,
          results_P2: _.filter(source, isMatch),
      })}, 300) 
    }

  }
  //------END SEARCH STUFF


  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? 0 : index
    this.setState({ activeIndex: newIndex })

    //wrong but fast :D
    const activeIndexChange={target:{value: newIndex}} 
    this.props.handleChange('activeIndex')(activeIndexChange);
  }




    render() {
      //for sharing props with FormStudentDetails state
      const {values} = this.props;

      const { isLoading_P1, isLoading_P2, p1_SSN, p2_SSN, results_P1, results_P2 } = this.state

        return (
            <>
            <h2 className="addStudBlockHeader">
                Parent Data
            </h2>

            <Form>
            <Form.Field>
            <Grid>
              <Grid.Column>
                  {!this.state.parent_errors['p1_SSN'] && <label><b>SSN</b></label>}
                  {this.state.parent_errors['p1_SSN'] &&<p className="error"><b>SSN</b></p>}

                <Search
                  className = {!this.state.parent_errors['p1_SSN'] ? "" : 'errorSNN'}
                  error={this.state.parent_errors['p1_SSN']}
                  name="P1"
                  onFocus={(e, data) => {this.setState({currentSSNSearch: 1})}}
                  loading={isLoading_P1}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, {leading: true})}
                  noResultsMessage = "No Parent Found."
                  results={results_P1}
                  value={p1_SSN}
                  resultRenderer={(obj) => resultRenderer(obj, 1)}
                  {...this.props}
                />
                
                { !this.isEmptyStr(this.state.p1_ID)  && <h5 className = "knownDetails"><Icon name='check' />Details of this parent are known</h5>}
              </Grid.Column>
            </Grid>
            </Form.Field>


            { this.isEmptyStr(this.state.p1_ID) &&
            <>
              <Form.Group widths='equal'>
                <Form.Input
                  label='First Name' placeholder='First Name'
                  name='p1_FirstName'
                  defaultValue = {values.p1_FirstName}
                  //defaultValue = {this.state.p1_FirstName}
                  //onChange={handleChange('p1_FirstName')}
                  onChange={this.handleChngeBothStates}
                />
                <Form.Input
                  label='Last Name' placeholder='Last Name'
                  name='p1_LastName'
                  defaultValue = {values.p1_LastName}
                  //defaultValue = {this.state.p1_LastName}
                  //onChange={handleChange('p1_LastName')}
                  onChange={this.handleChngeBothStates}
                />
              </Form.Group>
              <Form.Input
                  fluid icon='envelope' iconPosition='left' 
                  label='E-mail address'type='email'placeholder='E-mail address'
                  name="p1_Email"
                  error={this.state.parent_errors['p1_Email']}
                  defaultValue = {values.p1_Email}
                  //defaultValue = {this.state.p1_Email}
                  //onChange={handleChange('p1_Email')}
                  onChange={this.handleChngeBothStates}
              />
            </>
            }


{/*--SECOND PARENT----------------------------------------------------------------------------*/}
            <Accordion as={Form.Field} activeIndex = {values.activeIndex} >
            <Accordion.Title
                active={values.activeIndex === 1}
                index={1}
                onClick={this.handleAccordionClick}
                className="optionalField"
             >
              <Icon name="dropdown"/><Icon name='user plus'/>&nbsp;
              Add Second Parent Details (Optional)
            </Accordion.Title>

            <Accordion.Content active={values.activeIndex === 1}>
                <>
                <Form.Field>
                  <p className="infoText"><Icon name="info"/> Please keep closed this field if you don't want to insert Second Parent data.</p>
                  <Grid>
                    <Grid.Column>
                        {/* <label><b>SSN</b></label> */}
                        {!this.state.parent_errors['p2_SSN'] && <label><b>SSN</b></label>}
                        {this.state.parent_errors['p2_SSN'] && <p className="error"><b>SSN</b></p>}
                        
                      <Search
                        className = {!this.state.parent_errors['p2_SSN'] ? "" : 'errorSNN'}
                        name="P2"
                        loading={isLoading_P2}
                        onFocus={(e, data) => {this.setState({currentSSNSearch: 2})}}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(this.handleSearchChange, 500, {
                          leading: true,
                        })}
                        noResultsMessage = "No Parent Found."
                        //minCharacters = "4" //minimum characters to show options
                        results={results_P2}
                        value={p2_SSN}
                        resultRenderer={(obj) => resultRenderer(obj, 2)}
                        //{...this.props} 
                      />
                      
                      {!this.isEmptyStr(this.state.p2_ID) && <h5 className = "knownDetails"><Icon name='check' />Details of this parent are known</h5>}
                    </Grid.Column>
                  </Grid>
                  </Form.Field>

              {this.isEmptyStr(this.state.p2_ID) &&  
                <>
                <Form.Group widths='equal'>

                  <Form.Input
                    fluid icon='envelope' iconPosition='left'
                    label='E-mail address'type='email'placeholder='E-mail address'
                    error={this.state.parent_errors['p2_Email']}
                    name="p2_Email"
                    defaultValue = {values.p2_Email}
                    //onChange={handleChange('p2_Email')}
                    onChange={this.handleChngeBothStates}
                  />

                  <Form.Input
                    label='First Name' placeholder='First Name'
                    error={this.state.parent_errors['p2_FirstName']}
                    name='p2_FirstName'
                    defaultValue = {values.p2_FirstName}
                    //onChange={handleChange('p2_FirstName')}
                    onChange={this.handleChngeBothStates}
                  />
                  <Form.Input
                    label='Last Name' placeholder='Last Name'
                    error={this.state.parent_errors['p2_LastName']}
                    name='p2_LastName'
                    defaultValue = {values.p2_LastName}
                    //onChange={handleChange('p2_LastName')}
                    onChange={this.handleChngeBothStates}
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
                <Button  onClick={this.nextConfirm} className="confirmBTN"
                  disabled = {values.p1_ID ?  false : (!values.p1_FirstName || !values.p1_LastName || !values.p1_Email || !values.p1_SSN)}
                >
                    <Icon name='checkmark' />Submit
                </Button>
            </div>
          </Form>
          </>
        )
    }
}

export default FormParentDetails
