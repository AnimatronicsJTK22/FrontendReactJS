import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DiaryDataService from "../services/diary.service";

const initialState = [];

export const createDiary = createAsyncThunk(
  "diary/create",
  async ({ title, content }) => {
    const res = await DiaryDataService.create({ title, content });
    return res.data;
  }
);

export const retrieveDiary = createAsyncThunk(
  "diary/retrieve",
  async () => {
    const res = await DiaryDataService.getAll();
    return res.data;
  }
);

export const updateDiary = createAsyncThunk(
  "diary/update",
  async ({ id, data }) => {
    const res = await DiaryDataService.update(id, data);
    return res.data;
  }
);

export const deleteDiary = createAsyncThunk(
  "diary/delete",
  async ({ id }) => {
    await DiaryDataService.delete(id);
    return { id };
  }
);

export const deleteAllDiary = createAsyncThunk(
  "diary/deleteAll",
  async () => {
    const res = await DiaryDataService.deleteAll();
    return res.data;
  }
);

export const findDiaryByTitle = createAsyncThunk(
  "diary/findByTitle",
  async ({ title }) => {
    const res = await DiaryDataService.findByTitle(title);
    return res.data;
  }
);

const diarySlice = createSlice({
  name: "diary",
  initialState,
  extraReducers: {
    [createDiary.fulfilled]: (state, action) => {
      state.push(action.payload);
    },
    [retrieveDiary.fulfilled]: (state, action) => {
      return [...action.payload];
    },
    [updateDiary.fulfilled]: (state, action) => {
      const index = state.findIndex(diary => diary.id === action.payload.id);
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
    [deleteDiary.fulfilled]: (state, action) => {
      let index = state.findIndex(({ id }) => id === action.payload.id);
      state.splice(index, 1);
    },
    [deleteAllDiary.fulfilled]: (state, action) => {
      return [];
    },
    [findDiaryByTitle.fulfilled]: (state, action) => {
      return [...action.payload];
    },
  },
});

const { reducer } = diarySlice;
export default reducer;
