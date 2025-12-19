// TypeScript version of the prompt submission logic
// (kept separate to increase TS footprint without altering existing runtime)

export type PromptMode = 'edit-1' | 'edit-2' | 'edit-3';

export interface PromptRequestBody {
  mode: PromptMode;
  text: string;
  apiKey: string;
}

export interface PromptChoiceMessage {
  role: 'system' | 'user';
  content: string;
}

export interface PromptResponseChoice {
  message: {
    content: string;
  };
}

export interface PromptResponse {
  choices?: PromptResponseChoice[];
  detail?: string;
}

export interface PromptResult {
  ok: boolean;
  message: string;
}

const SYSTEM_PROMPT =
  'You help turn casual wishes about how to edit a video or frames into short, concrete instructions. Keep answers concise and practical.';

export function buildMessages(mode: PromptMode, text: string): PromptChoiceMessage[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Edit mode: ${mode}\nUser description: ${text}\n\nReturn 2-3 short sentences describing how the video should be edited.`,
    },
  ];
}

export async function sendPrompt(body: PromptRequestBody): Promise<PromptResult> {
  if (!body.apiKey) {
    return { ok: false, message: 'Missing OpenAI API key.' };
  }
  if (!body.text.trim()) {
    return { ok: false, message: 'Prompt cannot be empty.' };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${body.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: buildMessages(body.mode, body.text),
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const data: PromptResponse = await response.json().catch(() => ({}));
      return { ok: false, message: data.detail || 'Failed to get a response from AI.' };
    }

    const data: PromptResponse = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim();
    return { ok: true, message: message || 'AI responded, but no suggestion was provided.' };
  } catch (err) {
    return { ok: false, message: 'Network error while contacting OpenAI API.' };
  }
}
