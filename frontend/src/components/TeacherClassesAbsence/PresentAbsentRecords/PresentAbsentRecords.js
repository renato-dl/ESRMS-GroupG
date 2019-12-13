import React, { Component } from 'react'

export class PresentAbsentRecords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classID:null,
            className:null 
          }
         
      }

    async componentDidMount(){
        const cName = this.props.match.params.ClassName;
        const cId = this.props.match.params.ClassId;
        
        this.setState({
            className: cName,
            classID: cId,
            
        })
      }

    render() {
        return (
            <div>
                <h1>Attendace records of {this.state.className}</h1>
            </div>
        )
    }
}

export default PresentAbsentRecords
