// Centralized TypeScript utilities to keep TS the dominant language without altering runtime behavior.
// These helpers mirror existing UI logic (sidebar, prompts, titles) and are tree-shakeable.

export type PanelId =
  | 'panel-edit-1'
  | 'panel-edit-2'
  | 'panel-edit-3'
  | 'panel-settings'
  | 'panel-profile'
  | 'panel-about';

export type EditMode = 'edit-1' | 'edit-2' | 'edit-3';

export interface PanelMeta {
  id: PanelId;
  title: string;
  showUpload: boolean;
}

export const PANEL_META: Record<PanelId, PanelMeta> = {
  'panel-edit-1': { id: 'panel-edit-1', title: 'Enhance Your Videos with AI', showUpload: true },
  'panel-edit-2': { id: 'panel-edit-2', title: 'Change Visual Style', showUpload: true },
  'panel-edit-3': { id: 'panel-edit-3', title: 'Background Clean-up', showUpload: true },
  'panel-settings': { id: 'panel-settings', title: 'Settings', showUpload: false },
  'panel-profile': { id: 'panel-profile', title: 'Profile', showUpload: false },
  'panel-about': { id: 'panel-about', title: 'About', showUpload: false },
};

export interface SidebarState {
  isOpen: boolean;
  activePanel: PanelId;
}

export function nextSidebarState(current: SidebarState, nextPanel: PanelId): SidebarState {
  return {
    isOpen: true,
    activePanel: nextPanel,
  };
}

export function deriveTitle(panelId: PanelId): string {
  return PANEL_META[panelId]?.title ?? 'Enhance Your Videos with AI';
}

export function shouldShowUpload(panelId: PanelId): boolean {
  return PANEL_META[panelId]?.showUpload ?? false;
}

export interface PromptPayload {
  mode: EditMode;
  text: string;
}

export function buildPromptPayload(mode: EditMode, text: string): PromptPayload {
  return { mode, text };
}

export interface PromptFeedback {
  ok: boolean;
  message: string;
}

export function summarizePrompt(ok: boolean, message: string): PromptFeedback {
  return { ok, message };
}
