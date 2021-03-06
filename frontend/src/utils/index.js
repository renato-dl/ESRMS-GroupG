export const SSNRegexp = /^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$/;

export const getRouterPropsForTest = () => {
  return {
    history: {
      match: {
        params: {}
      },
      location: {
        search: ''
      }
    },
    match: {
      params: {}
    },
    location: {
      search: ''
    }
  }
};
