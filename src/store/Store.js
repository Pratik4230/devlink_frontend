import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice";

const Store = configureStore({
  reducer: {
    user: userSlice,
  },
});

export default Store;
