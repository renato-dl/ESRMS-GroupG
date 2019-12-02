import React from 'react';
import './Login.scss';
import { api } from '../../services/api';
import { Button, Form, Grid, Header, Icon, Image, Segment, Container } from 'semantic-ui-react'
import validator from 'validator';


import logoImage from '../../assets/images/logo.png';
import { UserRoleCard } from '../../components/UserRoleCard/UserRoleCard';

export class Login extends React.Component {
    state = {
        email:'',
        password:'',
        errors: {},
        showErrMsg: false,
        roles:[
            {role: "IsAdminOfficer"},
            {role: "IsParent"}, 
            {role: "IsTeacher"},
            {role: "IsPrincipal"},
            {role: "IsSysAdmin"},
        ]
    };
    
    
    handleInputChange = (e, { name, value }) => {
        this.setState({[name]: value});
    };

    validateFields = () => {
        let errors = this.state.errors;
    
        errors['email'] = !validator.isEmail(this.state.email);
        errors['password'] = !this.state.password.length;
        //TODO:Add password validation
        
        const hasErrors = !!Object.keys(errors).filter((e) => errors[e]).length;
        return [hasErrors, errors];
    };


    submitLogin = async () => {
        this.setState({
            showErrMsg:false,
            errors:{}
        });

        const [hasErrors, errors] = this.validateFields();
        //console.log(hasErrors, errors);
        if (hasErrors) {
            this.setState({errors});
            return;
        }

        try{
            const loginData = {
                email:this.state.email,
                password: this.state.password,
            };

            const response = await api.auth.login(loginData);
            // check for error response
            if (response.data.token) {
                localStorage.setItem("token", JSON.stringify(response.data.token));
                // redirect based on the role
                //props.userHasAuthenticated(true);
                this.props.history.push('/parent');
            }

        }catch (e) {
            this.setState({showErrMsg: true});
            console.log("Login: " + e);
            return;
        }
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
                            
                            {this.state.showErrMsg && 
                            <p className="errMsg">
                                <Icon name="exclamation triangle"/>
                                Your login credentials could not be verified, please try again.
                            </p>}

                            <Button fluid size='large' className = "loginBtn" onClick={this.submitLogin}>
                                Sign in 
                            </Button>
                            </Segment>
                        </Form>
                        
                        </Grid.Column>
                        
                    </Grid>



                        <div className = "rolesContainer">
                            {this.state.roles.map((role, index) => (
                            <UserRoleCard
                                key={index}
                                {...role}
                                onClick={() => this.selectPage(role)}
                            />
                            ))}
                        </div>
                    



                </Container>
            </>
        )
    }
}

