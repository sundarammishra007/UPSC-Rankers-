
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Subject, Topic } from "../types";

// Base64 helper methods as required
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateLessonAudio = async (text: string, voice: 'Kore' | 'Puck' | 'Charon' = 'Kore') => {
  try {
    // Always use process.env.API_KEY directly in the constructor
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Explain this UPSC topic clearly and concisely for an aspirant: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data received");

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      audioContext,
      24000,
      1
    );

    return { audioBuffer, audioContext };
  } catch (error) {
    console.error("TTS generation failed:", error);
    throw error;
  }
};

export const analyzePYQ = async (question: string) => {
  // Always use process.env.API_KEY directly in the constructor
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a UPSC mentor, analyze this question and provide a strategic tip: ${question}`,
  });
  return response.text;
};

export const generateStudyPlan = async (
  subjects: Subject[],
  targetDate: string,
  allTopics: Topic[],
  completedTopicIds: string[]
) => {
  // Always use process.env.API_KEY directly in the constructor
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const topicList = allTopics.map(t => ({ id: t.id, title: t.title, subject: t.subject }));
  
  const prompt = `Create a realistic UPSC study plan for the following subjects: ${subjects.join(', ')}.
  The target completion date is ${targetDate}.
  Available topics list: ${JSON.stringify(topicList)}.
  The user has already completed these topic IDs: ${completedTopicIds.join(', ')}.
  Prioritize uncompleted topics. If a topic is completed, mark it as 'Revision' in the focus field.
  Generate a schedule for the next 7 days only, even if the target date is further.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                date: { type: Type.STRING },
                focus: { type: Type.STRING },
                topicIds: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["day", "date", "focus", "topicIds"]
            }
          }
        },
        required: ["schedule"]
      }
    }
  });

  return JSON.parse(response.text);
};
