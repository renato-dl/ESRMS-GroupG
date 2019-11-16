import React from 'react';
//import { api } from '../../services/api';
import "./Marks.scss"

import _ from 'lodash';
import {Icon, Table, Header, Grid, Image} from 'semantic-ui-react';


const columns = _.times(16, (i) => (
  <Grid.Column key={i}>
    <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
  </Grid.Column>
))


export class Marks extends React.Component{
    constructor(props)
    {
      super(props)
      this.state={
      Marks:[
        {subject:"subj1",marks:"100"},
        {subject:"subj2",marks:"90"},
        {subject:"subj3",marks:"80"}
      ]
      }
    }
    // async componentDidMount(){
    //     const responce=await api.marks.getMarks(1);
    //     if(responce){
    //         this.setState({Marks:responce.data})
    //     }
    // }

    // selectMarks=async(studentID)=>{
    //     console.log(studentID);
    //     this.props.history.push('/marks')
    // }
      render(){
        return (
          <>
            <h3 className="contentHeader"> 
                <Icon name='sort numeric up' /> Grades of Nume Surname 2019-2020
              </h3>
            <div className="Marks-container">
              <div className="tableContainer">
              <Table basic='very' celled collapsing>
                <Table.Header>
                  <Table.Row>
                  <Table.HeaderCell><Icon name='book' />SUBJECT</Table.HeaderCell>
                  <Table.HeaderCell><Icon name='sort numeric up' />GRADE</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {this.state.Marks.map((mark, index)=>
                  
                  <Table.Row  key = {index}>
                    <Table.Cell >
                      <Header as='h4' image>
                       {/* <Icon name='angle right' size=" small"/> */}
                        <Header.Content>
                          {mark.subject}
                          {/* <Header.Subheader>Human Resources</Header.Subheader> */}
                        </Header.Content>
                      </Header>
                    </Table.Cell>
                    <Table.Cell positive>
                      {mark.marks}
                      </Table.Cell>
                  </Table.Row>

                  )}

                </Table.Body>
              </Table>
              </div>

{/* 
            <h2 className="title">Student{this.props.match.params.studentID}'s score:</h2>
            {this.state.Marks.map((mark, index)=>
            <p key={index}>
              subject:{mark.subject},
              marks:{mark.marks}
            </p>
              )}
 */}

            </div>



            
            <Grid>{columns}</Grid>



          </>
        )
    }
    }