import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      console.log(state.user);
    },
    setUnAuthUser: (state) => {
      state.user = null;
      console.log(state.user);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuthUser, setUnAuthUser } = userSlice.actions;

export default userSlice.reducer;
