import React from 'react';
import './Login.scss';
import { api } from '../../services/api';
import { Button, Form, Grid, Header, Icon, Image, Segment, Container } from 'semantic-ui-react'
import validator from 'validator';

import logoImage from '../../assets/images/logo.png';

export class Login extends React.Component {
    state = {
        email:'',
        password:'',
        errors: {}
    };
    
    
    handleInputChange = (e, { name, value }) => {
        this.setState({[name]: value});
    };

    validateFields = () => {
        let errors = this.state.errors;
    
        errors['email'] = !validator.isEmail(this.state.email);
        //TODO:Add password validation
        const hasErrors = !!Object.keys(errors).filter((e) => errors[e]).length;
        return [hasErrors, errors];
    };


    submitLogin = async () => {
        const [hasErrors, errors] = this.validateFields();
        console.log(hasErrors, errors);
        if (hasErrors) {
            this.setState({errors});
            return;
        }

        const loginData = {
            email:this.state.email,
            password: this.state.password,
        };

        console.log(loginData);
        const response = await api.auth.login(loginData);
        // check for error response
        localStorage.setItem("token", JSON.stringify(response.data.token));
        // redirect based on the role
        this.props.history.push('/parent');
        console.log(response);
        /* await api.auth.login(
            loginData
        ); */
    };


    render() {
        return (
            <>
            <div className="loginBackground"></div>
                <Container>
                    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                        <Grid.Column className="loginContainer" >
                        <Image src={logoImage} size="small" centered disabled verticalAlign="bottom"/>                       
                        <Header as='h2'  textAlign='center' className="loginHeader">
                            Welcome to ESRMS-G
                        </Header>
                        
                        <Form size='large'>
                            <Segment stacked>
                            <Form.Input 
                                fluid icon='user' 
                                iconPosition='left' 
                                placeholder='E-mail address' 
                                error={this.state.errors['email']}
                                name={'email'}
                                value={this.state.email}
                                onChange={this.handleInputChange}
                                
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                error={this.state.errors['password']}
                                name={'password'}
                                value={this.state.password}
                                onChange={this.handleInputChange}
                            />

                            <Button fluid size='large' className = "loginBtn" onClick={this.submitLogin}>
                                Sign in 
                            </Button>
                            </Segment>
                        </Form>
                        </Grid.Column>
                    </Grid>
                </Container>
            </>
        )
    }
}

