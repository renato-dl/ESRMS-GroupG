import React from 'react';

export const ApplicationStoreContext = React.createContext();

const initialState = {
  isUserAuthenticated: false,
  user: null, // this will be the correct user
  parent: {
    ID: '9d64fa59c91d9109b11cd9e05162c675',
    children: [],
    selectedStudent: null
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

  async componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState);
    console.log(prevProps);
  }

  render() {
    return (
      <ApplicationStoreContext.Provider value={{
        state: this.state,
        setSelectedStudent: this.setSelectedStudent
      }}>
        {this.props.children}
      </ApplicationStoreContext.Provider>
    );
  }
}