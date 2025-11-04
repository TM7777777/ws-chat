export const getUsername = (state) => state.user.username;

export const isAuthenticated = (state) => Boolean(state.user.username);
