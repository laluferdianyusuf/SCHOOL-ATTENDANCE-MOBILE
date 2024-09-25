import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { NewsResponse, News, NewsState } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// create news
export const createNews = createAsyncThunk<NewsResponse, News>(
  "news/createNews",
  async ({ id, title, description, category, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", title || "");
      formData.append("description", description || "");
      formData.append("category", category || "");
      if (image) {
        const imageUri = image?.uri;
        const imageName = image?.name;

        const file = {
          uri: imageUri,
          name: imageName,
          type: image.type,
        } as unknown as Blob;

        formData.append("image", file);
      }
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${uri}/api/v5/create/news/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

// news list by id
export const listNewsBySchool = createAsyncThunk<NewsResponse, News>(
  "news/list/school",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${uri}/api/v5/read/news/school/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

// update news
export const updateNews = createAsyncThunk<NewsResponse, News>(
  "news/update",
  async ({ id, title, description, category, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", title || "");
      formData.append("description", description || "");
      formData.append("category", category || "");
      if (image) {
        const imageUri = image?.uri;
        const imageName = image?.name;

        const file = {
          uri: imageUri,
          name: imageName,
          type: image.type,
        } as unknown as Blob;

        formData.append("image", file);
      }
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `${uri}/api/v5/update/news/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

// delete news
export const deleteNews = createAsyncThunk<NewsResponse, News>(
  "news/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(
        `${uri}/api/v5/delete/news/${id}`,

        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

// get news by id
export const getNewsById = createAsyncThunk<NewsResponse, News>(
  "news/read/id",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${uri}/api/v5/read/news/${id}`,

        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

// get news by category
export const getNewsByCategory = createAsyncThunk<NewsResponse, News>(
  "news/query-category",
  async ({ category }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${uri}/api/v5/query/news`,

        {
          params: {
            category: category,
          },
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

const initialState: NewsState = {
  news: [],
  loading: false,
  error: null,
};

const NewsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create news states
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.data || [];
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // list news by school states
      .addCase(listNewsBySchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listNewsBySchool.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.data || [];
      })
      .addCase(listNewsBySchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // update news states
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.data || [];
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // delete news states
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.data || [];
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // get news by id states
      .addCase(getNewsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNewsById.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.data || [];
      })
      .addCase(getNewsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // get news by category states
      .addCase(getNewsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNewsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.data || [];
      })
      .addCase(getNewsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default NewsSlice.reducer;
