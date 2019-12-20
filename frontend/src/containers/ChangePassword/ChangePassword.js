import React from 'react';
import { api } from '../../services/api';
import { Button, Form, Grid, Header, Icon, Dimmer, Loader, Segment, Container } from 'semantic-ui-react'
import validator from 'validator';

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
          console.log(role);
    
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


    validateFields = () => {
        let errors = this.state.errors;
    
        errors['oldPassword'] = !this.state.oldPassword.length;
        errors['newPassword'] = !this.state.newPassword.length;
        errors['newPasswordConfirm'] = !this.state.newPasswordConfirm.length;
        
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
            errors:{}
        });

       // const [hasErrors, errors] = this.validateFields();
        /* if (hasErrors) {
            this.setState({errors});
            return;
        } */

        try{
            const dat = {
                oldPass :this.state.oldPassword,
                newPass: this.state.newPassword,
            };

            const response = await api.auth.changePassword(dat);
            console.log(response);
            if(response.data.success){
                //showw success message .. fake loading 1-2 sec
                this.setState({loader: 'true'})
                setTimeout(this.redirectToLogin, 1000);
            }
            

        }catch (e) {
            this.setState({showErrMsg: true});
            console.log("Login: " + e);
            return;
        }
    }

    render() {
        return (
                <>
                <Dimmer active={this.state.loader}>
                    <>
                    <Loader size='middle' style={{color:'#f7f7f7'}}>
                        <h3 style={{color:'#f7f7f7'}}>Updating password...</h3>
                    </Loader>
                    </>
                </Dimmer>
                <Dimmer active={this.state.successMsg}>
                    <>
                    <h2 style={{color:'#008230'}}><Icon name="check circle"/>Your password has been changed successfully!</h2> 
                    <h3 style={{color:'#f7f7f7'}}>Click here to <a href="/login"><u>Log in with your new password.</u></a></h3>
                    </>
                </Dimmer>
                
                <div className="loginBackground"></div>
                <Container>
                {this.state.showChangePass && !this.state.loader && !this.state.successMsg &&
                    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                        <Grid.Column className="loginContainer" >
                        <Header as='h2'  textAlign='center' className="loginHeader">
                            <Icon name="unlock alternate"/>Change Password 
                        </Header>
                        
                        <Form size='large'>
                            <Segment stacked>

                            <Form.Input
                                fluid
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
                                className="chpwdInput"
                                placeholder='Retype new password'
                                type='password'
                                error={this.state.errors['newPasswordConfirm']}
                                name='newPasswordConfirm'
                                value={this.state.newPasswordConfirm}
                                onChange={this.handleInputChange}
                            />
                            
                            {this.state.showErrMsg && 
                            <p className="errMsg">
                                <Icon name="exclamation triangle"/>
                                Credentials are invalid.
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
