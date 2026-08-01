import OpenAI from 'openai';

// Single OpenAI client instance, imported by every AI feature file.
// dangerouslyAllowBrowser is required because this is a frontend-only app
// with no backend proxy — acceptable only because this is a learning
// project with a personal API key, never do this with a real production key.
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default openai;
