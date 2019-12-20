import React from 'react';
import { api } from '../../services/api';
import { Button, Form, Grid, Header, Icon, Segment, Container } from 'semantic-ui-react'
import passwordValidator from 'password-validator';

import '../Login/Login.scss';

export class ChangePassword extends React.Component {
    state = {
        loader: false,
        successMsg: false,
        showChangePass: false,
        oldPassword:'',
        newPassword:'',
        newPasswordConfirm:'',
        errors: {},
        showErrMsg: false
    };

    componentDidMount() {
        try {
          const role = localStorage.getItem('role');
          //console.log(role);
    
          if (role) {
            this.setState({ showChangePass: true });
          }else{
            window.location.replace("/login");  
          }
    
        } catch (e) {
          window.location.replace("/login");  
        }
    }

          
    handleInputChange = (e, { name, value }) => {
        this.setState({[name]: value});
    };

    validatePassword(password){
        let schema = new passwordValidator();
        schema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits()                                 // Must have digits
        .has().not().spaces()                           // Should not have spaces
        return schema.validate(password);
    }

    validateFields = () => {
        let errors = this.state.errors;
    
        errors['oldPassword'] = !this.state.oldPassword.length;
        errors['newPassword'] = !this.validatePassword(this.state.newPassword);
        errors['newPasswordConfirm'] = !(this.state.newPasswordConfirm === this.state.newPassword && this.state.newPasswordConfirm.length);

        if (this.state.newPasswordConfirm.length) { errors['weakMsg'] = errors['newPassword']; }
        if (this.state.newPassword.length) {errors['dmatchMsg'] = errors['newPasswordConfirm'];}
        errors['sameMsg'] = (this.state.oldPassword === this.state.newPassword && this.state.oldPassword.length != 0);
        
        const hasErrors = !!Object.keys(errors).filter((e) => errors[e]).length;
        return [hasErrors, errors];
    };
    redirectToLogin = () => {
        this.setState({loader: false})
        localStorage.clear();
        this.setState({successMsg:true})
        //window.location.replace("/login");
    }


    submitPassChange = async () => {
        this.setState({
            showErrMsg:false,
            errors:{},
        });

        const [hasErrors, errors] = this.validateFields();
        if (hasErrors) {
            this.setState({errors});
            return;
        } 

        this.setState({loader: true})
        try{
            const dat = {
                oldPass :this.state.oldPassword,
                newPass: this.state.newPassword,
            };

            const response = await api.auth.changePassword(dat);
            if(response.data.success){
                //showw success message .. fake loading 1-2 sec
                setTimeout(this.redirectToLogin, 500);
            }
            

        }catch (e) {
            this.setState({loader: false, showErrMsg: true});
            console.log("ChangePass: " + e);
            return;
        }
    }

    render() {
        return (
                <>
                <div className="loginBackground"></div>
                <Container>
                {this.state.successMsg &&
                    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                        <Grid.Column >
                    <h2 style={{color:'#008230'}}><Icon name="check circle"/>Your password has been changed successfully!</h2> 
                    <h3><a href="/login"><u>Click here</u></a> to log in with your new password.</h3>
                    </Grid.Column>
                    </Grid>
                }
                {this.state.showChangePass && !this.state.successMsg &&
                    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                        <Grid.Column className="loginContainer" >
                        <Header as='h2'  textAlign='center' className="loginHeader">
                            <Icon name="unlock alternate"/>Change Password 
                        </Header>
                        
                        <Form size='large' loading={this.state.loader}>
                            <Segment stacked>

                            <Form.Input
                                fluid
                                required
                                className="chpwdInput"
                                placeholder='Current password'
                                type='password'
                                error={this.state.errors['oldPassword']}
                                name='oldPassword'
                                value={this.state.oldPassword}
                                onChange={this.handleInputChange}
                            />

                            <Form.Input
                                fluid
                                required
                                className="chpwdInput"
                                placeholder='New password'
                                type='password'
                                error={this.state.errors['newPassword']}
                                name='newPassword'
                                value={this.state.newPassword}
                                onChange={this.handleInputChange}
                            />
                            
                            <Form.Input
                                fluid
                                required
                                className="chpwdInput"
                                placeholder='Retype new password'
                                type='password'
                                error={this.state.errors['newPasswordConfirm']}
                                name='newPasswordConfirm'
                                value={this.state.newPasswordConfirm}
                                onChange={this.handleInputChange}
                            />
                            {this.state.errors['dmatchMsg'] &&  <p className="invMsg">New passwords do not match.</p>}
                            {this.state.errors['weakMsg'] && <p className="invMsg">Please choose a more secure password. <br/> It should be at least 8 characters with uppercase, lowercase lettes and digits. Should not contain spaces.</p>}
                            {this.state.errors['sameMsg'] && <p className="invMsg">You have entered the same current password.</p>}
                            
                            {this.state.showErrMsg && 
                            <p className="invMsg">
                                <Icon name="exclamation triangle"/>
                                Inserted current password is invalid.
                            </p>}

                            <Button fluid size='large' className = "loginBtn" onClick={this.submitPassChange}>
                                Submit Change 
                            </Button>
                            </Segment>
                        </Form>
                        </Grid.Column>
                    </Grid>
                }
                </Container>
            </>
        )
    }
}

export default ChangePassword
