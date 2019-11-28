import React, { Component } from 'react'
import {Button, Icon, LabelDetail,Form} from 'semantic-ui-react'
import DatePicker from "react-datepicker";

export class FormStudentDetails extends Component {
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    render() {
        const {values, handleChange} = this.props;
        
        return (
            <>
            <h2 className="addStudBlockHeader">
                Student Data
            </h2>

            <Form>
                
            <Form.Input
              //error={this.state.errors['stud_SSN']}
              label='SSN' placeholder='SSN'
              name='stud_SSN'
              defaultValue = {values.stud_SSN}
              onChange={handleChange('stud_SSN')}
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
                    //selected = {values.stud_FirstName}
                    /* onChange={handleChange('stud_BirthDate')} */
                />
              </Form.Field>
              <Form.Select
                label="Gender" placeholder="Gender"
                name="stud_Gender"
                options={[
                  { key: '1', text: 'Male', value: 'M' },
                  { key: '2', text: 'Female', value: 'F' },
                ]}
                onChange={handleChange('stud_Gender')}
              />
            </Form.Group>

            <div className="addStudButtonField">
                <Button onClick={this.continue} className="nextBTN">
                    Next <Icon name='right arrow' /> 
                </Button>
            </div>
          </Form>
            </>
        )
    }
}

export default FormStudentDetails
