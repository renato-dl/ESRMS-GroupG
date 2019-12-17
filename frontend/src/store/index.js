import React from 'react';

export const ApplicationStoreContext = React.createContext();

const deserializedState = localStorage.getItem('serializedState') ? JSON.parse(localStorage.getItem('serializedState')) : null 

const initialState = {
  isUserAuthenticated: false,
  parent: {
    ID: null,
    children: [],
    selectedStudent: []
  }
};

export class ApplicationStore extends React.Component {
  // STORE here all the global state
  state = deserializedState ? {...deserializedState} : {...initialState};

  setSelectedStudent = (studentData) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        parent: {
          ...prevState.parent,
          selectedStudent: studentData
        }
      }
    }, () => {
      localStorage.setItem('serializedState', JSON.stringify(this.state));
    });
  };

  setAuthentication = (authenticated) => {
    this.setState({ isUserAuthenticated: authenticated });
    localStorage.setItem('serializedState', JSON.stringify(this.state));
  }

  render() {
    return (
      <ApplicationStoreContext.Provider value={{
        state: this.state,
        setSelectedStudent: this.setSelectedStudent,
        setAuthentication: this.setAuthentication
      }}>
        {this.props.children}
      </ApplicationStoreContext.Provider>
    );
  }
}