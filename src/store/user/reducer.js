import * as types from './actionTypes';

const initialState = {
  username: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USERNAME:
      return {
        ...state,
        username: action.payload,
      };

    case types.CLEAR_USERNAME:
      return {
        ...state,
        username: null,
      };

    default:
      return state;
  }
};

export default userReducer;