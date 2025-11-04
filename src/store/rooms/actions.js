import * as types from './actionTypes';

export const getRooms = () => ({
  type: types.GET_ROOMS,
});

export const createRoom = (name, description) => ({
  type: types.CREATE_ROOM,
  payload: { name, description },
});

export const joinRoom = (roomId, username) => ({
  type: types.JOIN_ROOM,
  payload: { roomId, username },
});

export const leaveRoom = () => ({
  type: types.LEAVE_ROOM,
});

export const roomsListReceived = (rooms) => ({
  type: types.ROOMS_LIST_RECEIVED,
  payload: rooms,
});

export const roomJoined = (room) => ({
  type: types.ROOM_JOINED,
  payload: room,
});

export const roomLeft = () => ({
  type: types.ROOM_LEFT,
});

export const setCurrentRoom = (roomId) => ({
  type: types.SET_CURRENT_ROOM,
  payload: roomId,
});

export const userJoinedRoom = (username) => ({
  type: types.USER_JOINED_ROOM,
  payload: username,
});

export const userLeftRoom = (username) => ({
  type: types.USER_LEFT_ROOM,
  payload: username,
});
