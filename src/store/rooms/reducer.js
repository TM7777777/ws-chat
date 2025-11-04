import * as types from './actionTypes';

const initialState = {
  rooms: [],
  currentRoom: null,
  currentRoomId: null,
  users: [],
};

const roomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ROOMS_LIST_RECEIVED:
      return {
        ...state,
        rooms: action.payload,
      };

    case types.ROOM_JOINED:
      return {
        ...state,
        currentRoom: action.payload.roomName,
        currentRoomId: action.payload.roomId,
        users: action.payload.users || [],
      };

    case types.ROOM_LEFT:
    case types.LEAVE_ROOM:
      return {
        ...state,
        currentRoom: null,
        currentRoomId: null,
        users: [],
      };

    case types.SET_CURRENT_ROOM:
      return {
        ...state,
        currentRoomId: action.payload,
      };

    case types.USER_JOINED_ROOM:
      return {
        ...state,
        users: [...state.users, action.payload],
      };

    case types.USER_LEFT_ROOM:
      return {
        ...state,
        users: state.users.filter((user) => user !== action.payload),
      };

    default:
      return state;
  }
};

export default roomsReducer;