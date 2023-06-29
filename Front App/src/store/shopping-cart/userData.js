import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
    name: "userData",
    initialState: { role: null },

    reducers: {
        updateRole(state, action) {
            state.role = action.payload;
        },
    },
});

export const userDataActions = userDataSlice.actions;
export default userDataSlice;