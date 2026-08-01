import { useCallback } from 'react';
import openai from '../lib/openai';

/** Strips markdown code fences if the model wraps its JSON in them, then parses. */
function safeJsonParse(text, fallback) {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}

function formatRecentMessages(conversationMessages, currentUser, friend) {
  return conversationMessages
    .slice(-5)
    .map((m) => {
      const name = m.senderId === currentUser.id ? currentUser.name : friend.name;
      const content = m.type === 'text' ? m.content : `[${m.type}]`;
      return `${name}: ${content}`;
    })
    .join('\n');
}

/**
 * Central hook for every OpenAI call in the app. Always uses gpt-4o-mini
 * and max_tokens: 300 per the assignment spec. Every function throws on
 * failure — callers are responsible for their own loading/error UI (never
 * let an uncaught API error crash the page).
 */
export function useAI() {
  const generatePostContent = useCallback(async (prompt) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content:
            'You are a social media writing assistant. The user will give you a brief idea for their post. Generate an engaging social media post. Return JSON: { "description": "..." }. Keep under 280 characters. Be natural and warm. No hashtags unless requested.',
        },
        { role: 'user', content: prompt },
      ],
    });
    const text = response.choices[0].message.content;
    const parsed = safeJsonParse(text, { description: text });
    return parsed.description || text;
  }, []);

  const generateCommentSuggestion = useCallback(async (postDescription) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: `You are helping a user write a comment on a social media post. The post is: ${postDescription}. Write a short genuine comment (1-2 sentences). Be conversational. Do not use hashtags. Do not be generic like "Great post".`,
        },
        { role: 'user', content: 'Suggest a comment.' },
      ],
    });
    return response.choices[0].message.content.trim();
  }, []);

  const optimizeBio = useCallback(async ({ bio, name, location }) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: `You are a professional profile writer. Current bio: ${bio || '(empty)'}. Name: ${name}. Location: ${location || 'unknown'}. Write an improved bio that is professional, warm and engaging. Keep it under 150 characters. Return only the bio text.`,
        },
        { role: 'user', content: 'Improve this bio.' },
      ],
    });
    return response.choices[0].message.content.trim();
  }, []);

  const getReplySuggestions = useCallback(async ({ currentUser, friend, conversationMessages }) => {
    const recent = formatRecentMessages(conversationMessages, currentUser, friend);
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: `You are ${currentUser.name}'s messaging assistant. You are helping ${currentUser.name} reply to ${friend.name}. Recent conversation: ${recent}. Generate 3 short natural reply options. Return JSON: { "suggestions": ["reply1", "reply2", "reply3"] }. Each suggestion under 100 characters. Match the conversational tone.`,
        },
        { role: 'user', content: 'Suggest replies.' },
      ],
    });
    const text = response.choices[0].message.content;
    const parsed = safeJsonParse(text, { suggestions: [] });
    return parsed.suggestions || [];
  }, []);

  const getAutoReply = useCallback(async ({ currentUser, friend, conversationMessages }) => {
    const recent = formatRecentMessages(conversationMessages, currentUser, friend);
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: `You are replying to ${friend.name} on behalf of ${currentUser.name}. Recent conversation: ${recent}. Reply naturally as ${currentUser.name} would. Keep it short (1-3 sentences max). Do not reveal you are an AI unless directly asked.`,
        },
        { role: 'user', content: 'Reply now.' },
      ],
    });
    return response.choices[0].message.content.trim();
  }, []);

  return {
    generatePostContent,
    generateCommentSuggestion,
    optimizeBio,
    getReplySuggestions,
    getAutoReply,
  };
}

export default useAI;
