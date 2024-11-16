import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice";
import companySlice from "./CompanySlice";

const Store = configureStore({
  reducer: {
    user: userSlice,
    company: companySlice,
  },
});

export default Store;
