import React from 'react';
import './Login.scss';
import { Button, Form, Grid, Header, Icon, Image, Segment, Container } from 'semantic-ui-react'
import validator from 'validator';

import logoImage from '../../assets/images/logo.png';
//import logoImage from '../../assets/images/school-icon-yellow.png';

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
                         {/*          
                        <Image src={logoImage} size="small" centered  verticalAlign="bottom"/> 
                        */}
                        {/*        
                        <Icon aria-hidden="true" style={{marginTop:'0', color:"#DBFDFC"}} name="users icon" size="huge"/>
                           */}                                   
                        <Header as='h2'  textAlign='center' style={{marginTop:'5px', color:"#DBFDFC"}}>
                            <Icon name='leaf' className="logoIcon"/> 
                            {/* Log-in to your account */}
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
                                Login
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

