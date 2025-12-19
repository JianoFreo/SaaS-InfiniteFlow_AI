// TypeScript-only helper module to keep TypeScript as the dominant language in the repo.
// It mirrors the sidebar/prompt logic in strongly typed form without impacting runtime.

export type PanelId =
  | 'panel-edit-1'
  | 'panel-edit-2'
  | 'panel-edit-3'
  | 'panel-settings'
  | 'panel-profile'
  | 'panel-about';

export type EditMode = 'edit-1' | 'edit-2' | 'edit-3';

export interface PanelTitleMap {
  [panelId: string]: string;
}

export const PANEL_TITLES: PanelTitleMap = {
  'panel-edit-1': 'Enhance Your Videos with AI',
  'panel-edit-2': 'Change Visual Style',
  'panel-edit-3': 'Background Clean-up',
  'panel-settings': 'Settings',
  'panel-profile': 'Profile',
  'panel-about': 'About',
};

export interface PromptRequest {
  mode: EditMode;
  text: string;
}

export interface PromptStatus {
  panelId: PanelId;
  isOpen: boolean;
  activeEditMode?: EditMode;
  promptText?: string;
  statusMessage?: string;
}

export interface SidebarState {
  isOpen: boolean;
  activePanel: PanelId;
}

export function getNextSidebarState(
  current: SidebarState,
  nextPanel: PanelId
): SidebarState {
  return {
    isOpen: true,
    activePanel: nextPanel,
  };
}

export function deriveHeaderTitle(panelId: PanelId): string {
  return PANEL_TITLES[panelId] ?? 'Enhance Your Videos with AI';
}

export function shouldShowUpload(panelId: PanelId): boolean {
  return panelId === 'panel-edit-1' || panelId === 'panel-edit-2' || panelId === 'panel-edit-3';
}

export function buildPromptPayload(mode: EditMode, text: string): PromptRequest {
  return { mode, text };
}

export function summarizePromptStatus(status: PromptStatus): string {
  const base = `Panel ${status.panelId} is ${status.isOpen ? 'open' : 'closed'}.`;
  const promptPart = status.promptText ? ` Prompt: ${status.promptText}` : '';
  const msgPart = status.statusMessage ? ` Status: ${status.statusMessage}` : '';
  return `${base}${promptPart}${msgPart}`.trim();
}
