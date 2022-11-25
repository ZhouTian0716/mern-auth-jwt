import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    logOut: (state, action) => {
      state.token = null;
    },
  },
});

// export for store
export default authSlice.reducer;

// export for component to useDispatch
export const { setCredentials, logOut } = authSlice.actions;

// export for component to useSelector
// 笔记，state.auth here auth is the name in line 4
export const selectCurrentToken = (state) => state.auth.token;
