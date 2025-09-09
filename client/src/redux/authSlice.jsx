import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Holds user info like { _id, name, email, isAdmin } when logged in
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set user data on login
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    // Action to clear user data on logout
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;