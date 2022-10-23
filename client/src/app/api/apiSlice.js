import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// This baseUrl is where we host our server
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
