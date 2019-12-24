import React, { Component } from 'react';
import { api } from '../../services/api';

import { Container, Button, Card, Image, Icon } from 'semantic-ui-react';
import { NoData } from '../NoData/NoData';

import ClassIcon from '../../assets/images/class2.png';


export class TeacherClassesNote extends Component {
    state = {
        classList:[]
    };

    async componentDidMount() {
        const response = await api.teacher.getTeacherClasses();
        if (response) {
          this.setState({ classList: response.data })
        }
    }

    onRecordsClick = (ClassId, ClassName) =>{
        this.props.history.push(`/teacher/classesfornote/${ClassId}/${ClassName}/TeacherNote`)
    }

    render() {
        if(this.state.classList.length){
            return (
                <Container className="contentContainer">
                    <h3 className="contentHeader">
                      <Icon name='bullhorn'/>
                      Note Operation
                    </h3>

                    <Card.Group>
                    {this.state.classList.map((cls, index) =>
                        <Card style = {{border: "1px solid #41648A"}} key={cls.ClassId}>
                            <Card.Content>
                                <Image
                                floated='right'
                                size='mini'
                                src={ClassIcon}
                                />
                                <Card.Header><h1 style ={{color: '#536574'}}>Class: {cls.ClassName}</h1></Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <Button fluid color='orange'
                                onClick={()=>this.onRecordsClick(cls.ClassId, cls.ClassName)}
                                >
                                Operations of Notes 
                                </Button>
                            </Card.Content>
                        </Card>
                    )}
                    </Card.Group>

                </Container>
            );
        }
          return(
            <Container className="contentContainer">
              <h3 className="contentHeader">
                <Icon name='group'/>
                Note Operation
              </h3>
              <NoData/>
            </Container>
          ); 
    }
}

export default TeacherClassesNote
