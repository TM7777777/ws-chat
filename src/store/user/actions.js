import * as types from './actionTypes';

export const setUsername = (username) => ({
  type: types.SET_USERNAME,
  payload: username,
});

export const clearUsername = () => ({
  type: types.CLEAR_USERNAME,
});