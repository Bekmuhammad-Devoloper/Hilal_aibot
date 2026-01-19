import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GrammarService } from './grammar.service';
import { SpeechToTextService } from './speech-to-text.service';
import { OcrService } from './ocr.service';
import { GeminiService } from './gemini.service';

@Module({
  imports: [ConfigModule],
  providers: [GrammarService, SpeechToTextService, OcrService, GeminiService],
  exports: [GrammarService, SpeechToTextService, OcrService, GeminiService],
})
export class GrammarModule {}
