import React, { Component } from 'react'
import {Button, Icon, LabelDetail,Form} from 'semantic-ui-react'
import DatePicker from "react-datepicker";

import {SSNRegexp} from '../../../../../utils';

export class FormStudentDetails extends Component {
    state = this.props.values;

    continue = e => {
        const [hasErrors, errors] = this.validateFields();
        if (hasErrors) {
          this.setState({errors});
          return;
        }
        this.props.nextStep();
    }

    onSelectChange = (e, data) => {
      data.target = {value: data.value};
      this.props.handleChange('stud_Gender')(data)
    }

//added to be able to validate SSN before next step 
    onSSNCHange = (e) => {
      this.setState({stud_SSN: e.target.value})
      this.props.handleChange('stud_SSN')(e);
    }
    
    validateFields = () => {
      let errors = this.state.errors;

      errors['stud_SSN'] = !SSNRegexp.test(this.state.stud_SSN);
  
      const hasErrors = !!Object.keys(errors).filter((e) => errors[e]).length;
      return [hasErrors, errors];
    };

    render() {
        const {values, handleChange} = this.props;
        return (
            <>
            <h2 className="addStudBlockHeader">
                Student Data
            </h2>

            <Form>
                
            <Form.Input
              error={this.state.errors['stud_SSN']}
              label='SSN' placeholder='SSN'
              name='stud_SSN'
              //defaultValue = {this.state.stud_SSN}
              defaultValue = {values.stud_SSN}
              //onChange={handleChange('stud_SSN')}
              onChange={this.onSSNCHange}
            />
            <Form.Group widths='equal'>
              <Form.Input
                label='First Name' placeholder='First Name'
                name='stud_FirstName'
                defaultValue = {values.stud_FirstName}
                onChange={handleChange('stud_FirstName')}
              />
              <Form.Input
                label='Last Name'placeholder='Last Name'
                name='stud_LastName'
                defaultValue = {values.stud_LastName}
                onChange={handleChange('stud_LastName')}
              />
            </Form.Group>
            
            <Form.Group widths='equal'>
              <Form.Field>
                <LabelDetail><Icon name="birthday cake"/>Birth Date</LabelDetail>
                <DatePicker
                    selected={new Date(values.stud_BirthDate || Date.now())}
                    onChange={(e) => handleChange('stud_BirthDate')({target: {value: e}})}
                />
              </Form.Field>

              <Form.Select
                label="Gender" placeholder="Gender"
                name="stud_Gender"
                defaultValue = {values.stud_Gender}
                options={[
                  { key: '1', text: 'Male', value: 'M' },
                  { key: '2', text: 'Female', value: 'F' },
                ]}
                onChange={this.onSelectChange}
              />
            </Form.Group>

            <div className="addStudButtonField">
                <Button onClick={this.continue} className="nextBTN"
                disabled={!values.stud_FirstName || !values.stud_LastName || !values.stud_BirthDate || !values.stud_Gender || !values.stud_SSN}
                >
                    Next <Icon name='right arrow' /> 
                </Button>
            </div>
          </Form>
            </>
        )
    }
}

export default FormStudentDetails
