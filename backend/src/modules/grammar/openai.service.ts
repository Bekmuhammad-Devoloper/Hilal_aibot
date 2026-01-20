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

  // OCR dan kelgan rasmni tekshirish
  async correctImageText(imageText: string, language: string = 'uz'): Promise<OpenAIResult> {
    return this.correctGrammar(imageText, language);
  }

  // Audio dan kelgan matnni tekshirish
  async correctSpeechText(speechText: string, language: string = 'uz'): Promise<OpenAIResult> {
    return this.correctGrammar(speechText, language);
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}
