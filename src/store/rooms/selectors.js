export const getRoomsList = (state) => state.rooms.rooms;
export const getCurrentRoom = (state) => state.rooms.currentRoom;
export const getCurrentRoomId = (state) => state.rooms.currentRoomId;
export const getRoomUsers = (state) => state.rooms.users;

export const isInRoom = (state) => Boolean(state.rooms.currentRoomId);
export const getRoomByName = (state, roomName) =>
  state.rooms.rooms.find((room) => room.name === roomName);
export const getRoomById = (state, roomId) => state.rooms.rooms.find((room) => room.id === roomId);
