// Strongly typed panel controller mirroring the sidebar logic.

import { PANEL_META, type PanelId } from './uiState';

export interface PanelControllerState {
  activePanel: PanelId;
  sidebarOpen: boolean;
}

export interface PanelControllerActions {
  setPanel: (panel: PanelId) => PanelControllerState;
  closeSidebar: () => PanelControllerState;
  openSidebar: () => PanelControllerState;
}

export function createPanelController(initial: PanelControllerState): PanelControllerActions {
  let state = initial;

  function setPanel(panel: PanelId): PanelControllerState {
    state = { activePanel: panel, sidebarOpen: true };
    return state;
  }

  function closeSidebar(): PanelControllerState {
    state = { ...state, sidebarOpen: false };
    return state;
  }

  function openSidebar(): PanelControllerState {
    state = { ...state, sidebarOpen: true };
    return state;
  }

  return { setPanel, closeSidebar, openSidebar };
}

export function getPanelTitle(panel: PanelId): string {
  return PANEL_META[panel]?.title ?? 'Enhance Your Videos with AI';
}

export function shouldShowUpload(panel: PanelId): boolean {
  return PANEL_META[panel]?.showUpload ?? false;
}

export function listPanels(): PanelId[] {
  return Object.keys(PANEL_META) as PanelId[];
}
