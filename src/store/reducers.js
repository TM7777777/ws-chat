import { combineReducers } from 'redux';
import chatReducer from './chat/reducer';
import roomsReducer from './rooms/reducer';
import userReducer from './user/reducer';

const rootReducer = combineReducers({
  chat: chatReducer,
  rooms: roomsReducer,
  user: userReducer,
});

export default rootReducer;
