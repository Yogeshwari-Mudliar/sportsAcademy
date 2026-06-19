import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PageHeaderState {
  title: string;
  breadcrumb: string[];
}

export interface UiState {
  pageHeader: PageHeaderState;
  sidebarCollapsed: boolean;
}

const initialState: UiState = {
  pageHeader: {
    title: "Dashboard",
    breadcrumb: ["Dashboard"],
  },
  sidebarCollapsed: false,
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
  },
});

export const { setPageHeader, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
