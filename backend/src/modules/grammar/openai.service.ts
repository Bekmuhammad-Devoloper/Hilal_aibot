import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface OpenAIResult {
  originalText: string;
  correctedText: string;
  errorsCount: number;
  errors: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
}

@Injectable()
export class OpenAIService {
  private apiKey: string;
  private model: string = 'gpt-4o';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('OPENAI_API_KEY', '');
    
    if (!this.apiKey) {
      console.warn('[OpenAI] Warning: OPENAI_API_KEY not configured');
    } else {
      console.log('[OpenAI] Service initialized with GPT-4o');
    }
  }

  async correctGrammar(text: string, language: string = 'uz'): Promise<OpenAIResult> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const langNames: { [key: string]: string } = {
      uz: "O'zbek",
      ru: 'Русский',
      en: 'English',
      tr: 'Türkçe',
    };

    const langName = langNames[language] || "O'zbek";

    const systemPrompt = `Sen professional ${langName} tili grammatika tekshiruvchisi va muharririsisan. 
Sening vazifang:
1. Matnni grammatik xatolar, imlo xatolari, tinish belgilari va uslubiy xatolar uchun tekshirish
2. Xatolarni tuzatish va har bir xato uchun qisqa tushuntirish berish
3. To'g'rilangan matnni qaytarish

MUHIM: Javobingni faqat quyidagi JSON formatida ber, boshqa hech narsa yozma:
{
  "correctedText": "to'g'rilangan matn",
  "errors": [
    {
      "original": "noto'g'ri so'z yoki ibora",
      "corrected": "to'g'ri variant",
      "explanation": "qisqa tushuntirish"
    }
  ]
}

Agar matnda xato bo'lmasa, errors massivini bo'sh qoldir.`;

    const userPrompt = `Quyidagi ${langName} tilidagi matnni tekshir va xatolarini to'g'rila:\n\n"${text}"`;

    try {
      console.log('[OpenAI] Sending request to GPT-4o...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[OpenAI] API error:', response.status, errorData);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No response from OpenAI');
      }

      console.log('[OpenAI] Response received, parsing...');

      // JSON ni parse qilish
      let result;
      try {
        // JSON ni topish (ba'zan markdown code block ichida bo'lishi mumkin)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('[OpenAI] JSON parse error:', parseError);
        // Fallback - original text qaytarish
        return {
          originalText: text,
          correctedText: text,
          errorsCount: 0,
          errors: [],
        };
      }

      const errors = result.errors || [];
      
      console.log('[OpenAI] Grammar check completed. Errors found:', errors.length);

      return {
        originalText: text,
        correctedText: result.correctedText || text,
        errorsCount: errors.length,
        errors: errors,
      };
    } catch (error: any) {
      console.error('[OpenAI] Error:', error.message);
      throw error;
    }
  }

  // GPT-4o Vision - rasmdan matn o'qish va grammatik tekshirish (qo'lyozma ham!)
  async analyzeImage(imageUrl: string, language: string = 'uz'): Promise<OpenAIResult> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const langNames: { [key: string]: string } = {
      uz: "O'zbek",
      ru: 'Русский',
      en: 'English',
      tr: 'Türkçe',
    };

    const langName = langNames[language] || "O'zbek";

    const systemPrompt = `Sen professional ${langName} tili bo'yicha matn tanuvchi va grammatika tekshiruvchisisisan.

Sening vazifang:
1. Rasmdagi matnni (bosma yoki QO'LYOZMA) diqqat bilan o'qish
2. Matnni grammatik xatolar uchun tekshirish
3. Xatolarni tuzatish va tushuntirish

MUHIM: Javobingni FAQAT quyidagi JSON formatida ber:
{
  "extractedText": "rasmdan o'qilgan asl matn",
  "correctedText": "grammatik jihatdan to'g'rilangan matn",
  "errors": [
    {
      "original": "xato so'z",
      "corrected": "to'g'ri variant",
      "explanation": "qisqa tushuntirish"
    }
  ]
}

Eslatma: Qo'lyozma bo'lsa ham har bir so'zni diqqat bilan o'qi!`;

    try {
      console.log('[OpenAI Vision] Analyzing image...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: [
                { 
                  type: 'text', 
                  text: `Bu rasmdagi ${langName} tilidagi matnni o'qi va grammatik tekshir. Qo'lyozma bo'lsa ham diqqat bilan o'qi.` 
                },
                { 
                  type: 'image_url', 
                  image_url: { url: imageUrl } 
                }
              ]
            }
          ],
          temperature: 0.3,
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[OpenAI Vision] API error:', response.status, errorData);
        throw new Error(`OpenAI Vision API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No response from OpenAI Vision');
      }

      console.log('[OpenAI Vision] Response received, parsing...');

      // JSON ni parse qilish
      let result;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('[OpenAI Vision] JSON parse error, returning raw text');
        // Agar JSON parse bo'lmasa, matnni qaytarish
        return {
          originalText: content,
          correctedText: content,
          errorsCount: 0,
          errors: [],
        };
      }

      const errors = result.errors || [];
      const extractedText = result.extractedText || '';
      
      console.log('[OpenAI Vision] Image analysis completed. Text length:', extractedText.length, 'Errors:', errors.length);

      return {
        originalText: extractedText,
        correctedText: result.correctedText || extractedText,
        errorsCount: errors.length,
        errors: errors,
      };
    } catch (error: any) {
      console.error('[OpenAI Vision] Error:', error.message);
      throw error;
    }
  }

  // Audio dan kelgan matnni tekshirish
  async correctSpeechText(speechText: string, language: string = 'uz'): Promise<OpenAIResult> {
    return this.correctGrammar(speechText, language);
  }

  // OpenAI Whisper - ovozdan matnga (eng aniq!)
  async transcribeAudio(audioBuffer: Buffer, language: string = 'uz'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Til kodlari Whisper uchun
    const whisperLangCodes: { [key: string]: string } = {
      uz: 'uz',
      ru: 'ru',
      en: 'en',
      tr: 'tr',
    };

    const langCode = whisperLangCodes[language] || 'uz';

    try {
      console.log('[OpenAI Whisper] Starting transcription, audio size:', audioBuffer.length, 'bytes');
      
      // FormData yaratish
      const formData = new FormData();
      
      // Audio file ni Uint8Array ga convert qilib blob yaratish
      const uint8Array = new Uint8Array(audioBuffer.buffer, audioBuffer.byteOffset, audioBuffer.length);
      const audioBlob = new Blob([uint8Array], { type: 'audio/ogg' });
      formData.append('file', audioBlob, 'audio.ogg');
      formData.append('model', 'whisper-1');
      formData.append('language', langCode);
      formData.append('response_format', 'text');
      // Prompt - tilga qarab yaxshiroq tanib olish uchun
      const prompts: { [key: string]: string } = {
        uz: "Bu o'zbek tilidagi ovozli xabar. Tinish belgilarini to'g'ri qo'y.",
        ru: "Это голосовое сообщение на русском языке. Расставь знаки препинания правильно.",
        en: "This is an English voice message. Add proper punctuation.",
        tr: "Bu Türkçe bir sesli mesaj. Noktalama işaretlerini doğru koy.",
      };
      formData.append('prompt', prompts[langCode] || prompts['uz']);

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[OpenAI Whisper] API error:', response.status, errorData);
        throw new Error(`Whisper API error: ${response.status}`);
      }

      const text = await response.text();
      console.log('[OpenAI Whisper] Transcription completed:', text.substring(0, 100) + '...');
      
      return text.trim();
    } catch (error: any) {
      console.error('[OpenAI Whisper] Error:', error.message);
      throw error;
    }
  }

  // URL dan audio yuklab Whisper ga yuborish
  async transcribeAudioFromUrl(audioUrl: string, language: string = 'uz'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      console.log('[OpenAI Whisper] Downloading audio from URL...');
      
      // Audio faylni yuklash
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`Failed to download audio: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = Buffer.from(arrayBuffer);
      
      console.log('[OpenAI Whisper] Audio downloaded, size:', audioBuffer.length, 'bytes');
      
      return this.transcribeAudio(audioBuffer, language);
    } catch (error: any) {
      console.error('[OpenAI Whisper] URL transcribe error:', error.message);
      throw error;
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}
