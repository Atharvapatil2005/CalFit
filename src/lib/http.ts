export class HttpError extends Error {
  status: number;
  body: string;

  constructor(message: string, status: number, body = '') {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

type JsonObject = Record<string, unknown>;

export const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 15000
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: init.signal ?? controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new NetworkError('Request timed out. Please try again.');
    }

    if (error instanceof Error) {
      throw new NetworkError(error.message || 'Network request failed');
    }

    throw new NetworkError('Network request failed');
  } finally {
    clearTimeout(timeoutId);
  }
};

export const readResponsePayload = async (
  response: Response
): Promise<{ json: JsonObject | null; text: string }> => {
  const text = await response.text();

  if (!text) {
    return { json: null, text: '' };
  }

  try {
    return { json: JSON.parse(text) as JsonObject, text };
  } catch {
    return { json: null, text };
  }
};
