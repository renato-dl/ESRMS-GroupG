import React from 'react';

export const ApplicationStoreContext = React.createContext();

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
  state = {
    ...initialState
  };

  setSelectedStudent = (studentData) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        parent: {
          ...prevState.parent,
          selectedStudent: studentData
        }
      }
    });
  };

  setAuthentication = (authenticated) => {
    this.setState({ isUserAuthenticated: authenticated });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState);
    console.log(prevProps);
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