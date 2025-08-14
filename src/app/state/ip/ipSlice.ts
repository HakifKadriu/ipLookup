import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IpData {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
}

interface IpState {
  data: IpData | null;
  loading: boolean;
  error: string | null;
  recentIps: IpData[];
}

const initialState: IpState = {
  data: null,
  loading: false,
  error: null,
  recentIps: [],
};

export const getIpInformation = createAsyncThunk<IpData, string>(
  "ip/getIpInformation",
  async (ip: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/ipinfo?ip=${ip}`);
      if (!res.ok) {
        const errorMsg = `Inalid Ip Address`;
        if (process.env.NODE_ENV === "development") {
          console.error(errorMsg);
        }
        return rejectWithValue(errorMsg);
      }
      return (await res.json()) as IpData;
    } catch (error) {
      const errorMsg =
        (error as Error).message ||
        "Network error: Failed to fetch IP information";
      if (process.env.NODE_ENV === "development") {
        console.error(errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const ipSlice = createSlice({
  name: "ip",
  initialState,
  reducers: {
    addRecentIp(state, action: PayloadAction<IpData>) {
      if (!state.recentIps.some((ip) => ip.ip === action.payload.ip)) {
        state.recentIps.push(action.payload);
        if (state.recentIps.length > 6) {
          state.recentIps.shift(); // Remove the oldest IP if more than 5
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIpInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getIpInformation.fulfilled,
        (state, action: PayloadAction<IpData>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getIpInformation.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Unknown error occurred";
      });
  },
});

export type { IpData };
export const { addRecentIp } = ipSlice.actions;
export default ipSlice.reducer;
