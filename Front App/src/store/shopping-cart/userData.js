import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
    name: "userData",
    initialState: { role: null },

    reducers: {

    },
});

export const userDataActions = userDataSlice.actions;
export default userDataSlice;