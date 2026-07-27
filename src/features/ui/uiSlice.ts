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
  sidebarCollapsed:
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 1024px)").matches
      : false,
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
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setThemeColor(state, action: PayloadAction<string>) {
      state.themeColor = action.payload;
      storeThemeColor(action.payload);
    },
  },
});

export const { setPageHeader, toggleSidebar, setSidebarCollapsed, setThemeColor } = uiSlice.actions;
export default uiSlice.reducer;
