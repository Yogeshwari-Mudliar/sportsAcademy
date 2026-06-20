import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getStoredThemeColor, storeThemeColor } from "@/theme";

export interface PageHeaderState {
  title: string;
  breadcrumb: string[];
}

export interface UiState {
  pageHeader: PageHeaderState;
  sidebarCollapsed: boolean;
  themeColor: string;
}

const initialState: UiState = {
  pageHeader: {
    title: "Dashboard",
    breadcrumb: ["Dashboard"],
  },
  sidebarCollapsed: false,
  themeColor: getStoredThemeColor(),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setPageHeader(state, action: PayloadAction<PageHeaderState>) {
      state.pageHeader = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setThemeColor(state, action: PayloadAction<string>) {
      state.themeColor = action.payload;
      storeThemeColor(action.payload);
    },
  },
});

export const { setPageHeader, toggleSidebar, setThemeColor } = uiSlice.actions;
export default uiSlice.reducer;
