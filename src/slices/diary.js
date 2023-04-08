import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DiariesDataService from "../services/diary.service";

const initialState = [];

export const createDiaries = createAsyncThunk(
  "diaries/create",
  async ({ title, content }) => {
    const res = await DiariesDataService.create({ title, content });
    return res.data;
  }
);

export const retrieveDiaries = createAsyncThunk(
  "diaries/retrieve",
  async () => {
    const res = await DiariesDataService.getAll();
    return res.data;
  }
);

export const updateDiaries = createAsyncThunk(
  "diaries/update",
  async ({ id, data }) => {
    const res = await DiariesDataService.update(id, data);
    return res.data;
  }
);

export const deleteDiaries = createAsyncThunk(
  "diaries/delete",
  async ({ id }) => {
    await DiariesDataService.remove(id);
    return { id };
  }
);

export const deleteAllDiaries = createAsyncThunk(
  "diaries/deleteAll",
  async () => {
    const res = await DiariesDataService.removeAll();
    return res.data;
  }
);

export const findDiariesByTitle = createAsyncThunk(
  "diaries/findByTitle",
  async ({ title }) => {
    const res = await DiariesDataService.findByTitle(title);
    return res.data;
  }
);

const diariesSlice = createSlice({
  name: "diaries",
  initialState,
  extraReducers: {
    [createDiaries.fulfilled]: (state, action) => {
      state.push(action.payload);
    },
    [retrieveDiaries.fulfilled]: (state, action) => {
      return [...action.payload];
    },
    [updateDiaries.fulfilled]: (state, action) => {
      const index = state.findIndex(tutorial => tutorial.id === action.payload.id);
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
    [deleteDiaries.fulfilled]: (state, action) => {
      let index = state.findIndex(({ id }) => id === action.payload.id);
      state.splice(index, 1);
    },
    [deleteAllDiaries.fulfilled]: (state, action) => {
      return [];
    },
    [findDiariesByTitle.fulfilled]: (state, action) => {
      return [...action.payload];
    },
  },
});

const { reducer } = diariesSlice;
export default reducer;