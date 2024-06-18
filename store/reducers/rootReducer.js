// reducers/rootReducer.js
import { combineReducers } from 'redux';

// Create a fake reducer
const fakeReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  fake: fakeReducer,
});

export default rootReducer;
