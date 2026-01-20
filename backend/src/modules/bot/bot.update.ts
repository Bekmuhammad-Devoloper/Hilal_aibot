import { Update, Ctx, Start, Help, On, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { BotService } from './bot.service';
import { GrammarService } from '../grammar/grammar.service';
import { SpeechToTextService } from '../grammar/speech-to-text.service';
import { OcrService } from '../grammar/ocr.service';
import { GeminiService } from '../grammar/gemini.service';
import { ChannelsService } from '../channels/channels.service';
import { StatsService } from '../stats/stats.service';
import { AuthService } from '../auth/auth.service';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { t, langNames } from './i18n';

@Update()
export class BotUpdate {
  constructor(
    private botService: BotService,
    private grammarService: GrammarService,
    private speechToTextService: SpeechToTextService,
    private ocrService: OcrService,
    private geminiService: GeminiService,
    private channelsService: ChannelsService,
    private statsService: StatsService,
    private authService: AuthService,
    private configService: ConfigService,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}

  private async getUserLang(userId: string): Promise<string> {
    return await this.botService.getUserLanguage(userId);
  }

  private isAdmin(userId: number): boolean {
    // To'g'ridan-to'g'ri process.env dan o'qiymiz
    const adminIdsEnv: string = process.env.ADMIN_IDS || this.configService.get('ADMIN_IDS') || '';
    const adminIds = adminIdsEnv.split(',').map((id: string) => id.trim());
    console.log('ADMIN_IDS:', adminIdsEnv, '| User ID:', userId, '| Is Admin:', adminIds.includes(String(userId)));
    return adminIds.includes(String(userId));
  }

  @Command('admin')
  async onAdmin(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    const lang = await this.getUserLang(String(user.id));

    // Check if user is admin
    if (!this.isAdmin(user.id)) {
      await ctx.reply('⛔ Sizda admin huquqlari yo\'q / You are not an admin');
      return;
    }

    const adminPanelUrl = this.configService.get('ADMIN_PANEL_URL', 'http://localhost:3001');
    
    // Generate auto-login code for admin
    const loginCode = await this.authService.generateTelegramLoginCode(String(user.id));
    const autoLoginUrl = `${adminPanelUrl}/telegram-login?code=${loginCode}`;
    
    const keyboard = {
      inline_keyboard: [
        [
          { text: '🖥 Admin Panelga Kirish', url: autoLoginUrl },
        ],
        [
          { text: '📊 Statistika', callback_data: 'admin_stats' },
          { text: '👥 Foydalanuvchilar', callback_data: 'admin_users' },
        ],
        [
          { text: '📢 Xabar yuborish', callback_data: 'admin_broadcast' },
        ],
      ],
    };

    const stats = await this.statsService.getDashboardStats();
    
    const message = `
🔐 *Admin Panel*

📊 *Statistika:*
👥 Jami foydalanuvchilar: ${stats.totalUsers}
📝 Jami so'rovlar: ${stats.totalRequests}
📅 Bugun: ${stats.todayRequests}

🔗 Admin panelga kirish uchun pastdagi tugmani bosing.
⏱ Link 5 daqiqa amal qiladi.
`;

    await ctx.replyWithMarkdown(message, { reply_markup: keyboard });
  }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    await this.botService.getOrCreateUser(user);
    const lang = await this.getUserLang(String(user.id));

    // Check mandatory channel subscription
    const isSubscribed = await this.checkMandatoryChannel(ctx, lang);
    if (!isSubscribed) return;

    await ctx.replyWithMarkdown(t(lang, 'welcome', user.first_name));
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    const lang = await this.getUserLang(String(user.id));
    await ctx.replyWithMarkdown(t(lang, 'help'));
  }

  @Command('language')
  async onLanguage(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    const lang = await this.getUserLang(String(user.id));
    
    const keyboard = {
      inline_keyboard: [
        [
          { text: '🇺🇿 O\'zbek', callback_data: 'lang_uz' },
          { text: '🇷🇺 Русский', callback_data: 'lang_ru' },
        ],
        [
          { text: '🇬🇧 English', callback_data: 'lang_en' },
          { text: '🇹🇷 Türkçe', callback_data: 'lang_tr' },
        ],
      ],
    };

    await ctx.reply(t(lang, 'selectLanguage'), { reply_markup: keyboard });
  }

  @Command('stats')
  async onStats(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    const lang = await this.getUserLang(String(user.id));
    const botUser = await this.botService.getOrCreateUser(user);

    const statsData = {
      totalRequests: botUser.totalRequests,
      textRequests: botUser.textRequests,
      voiceRequests: botUser.voiceRequests,
      imageRequests: botUser.imageRequests,
      createdAt: botUser.createdAt.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ'),
    };

    await ctx.replyWithMarkdown(t(lang, 'stats', statsData));
  }

  @On('callback_query')
  async onCallbackQuery(@Ctx() ctx: Context) {
    const callbackQuery = ctx.callbackQuery as any;
    const data = callbackQuery?.data;
    const user = ctx.from;

    if (!data || !user) return;

    // Ensure user exists in database
    await this.botService.getOrCreateUser(user);

    if (data.startsWith('lang_')) {
      const language = data.replace('lang_', '');
      await this.botService.setUserLanguage(String(user.id), language);

      await ctx.answerCbQuery(t(language, 'languageChanged', langNames[language]));
      await ctx.editMessageText(t(language, 'languageChanged', langNames[language]));
    }

    if (data === 'check_subscription') {
      const lang = await this.getUserLang(String(user.id));
      const isSubscribed = await this.checkMandatoryChannel(ctx, lang, true);
      if (isSubscribed) {
        await ctx.answerCbQuery(t(lang, 'subscriptionConfirmed'));
        await this.onStart(ctx);
      } else {
        await ctx.answerCbQuery(t(lang, 'notSubscribed'), { show_alert: true });
      }
    }

    // Admin callbacks
    if (data.startsWith('admin_') && this.isAdmin(user.id)) {
      if (data === 'admin_stats') {
        const stats = await this.statsService.getDashboardStats();
        const message = `
📊 *Batafsil Statistika*

👥 Jami foydalanuvchilar: ${stats.totalUsers}
📝 Jami so'rovlar: ${stats.totalRequests}

📅 *Bugungi statistika:*
• So'rovlar: ${stats.todayRequests}

📈 *So'rov turlari:*
• Matn: ${stats.textRequests || 0}
• Ovoz: ${stats.voiceRequests || 0}
• Rasm: ${stats.imageRequests || 0}
`;
        await ctx.answerCbQuery();
        await ctx.reply(message, { parse_mode: 'Markdown' });
      }

      if (data === 'admin_users') {
        const topUsers = await this.statsService.getTopUsers(10);
        let message = '👥 *Top 10 Foydalanuvchilar:*\n\n';
        topUsers.forEach((u: any, i: number) => {
          message += `${i + 1}. ${u.firstName || 'User'} - ${u.totalRequests} so'rov\n`;
        });
        await ctx.answerCbQuery();
        await ctx.reply(message, { parse_mode: 'Markdown' });
      }

      if (data === 'admin_broadcast') {
        await ctx.answerCbQuery();
        await ctx.reply('📢 Xabar yuborish uchun admin paneldan foydalaning:\n\n' + 
          this.configService.get('ADMIN_PANEL_URL', 'http://localhost:3001') + '/dashboard/posts');
      }
    }
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    const user = ctx.from;
    const text = message?.text;

    if (!user || !text || text.startsWith('/')) return;

    const lang = await this.getUserLang(String(user.id));

    // Check mandatory channel subscription
    const isSubscribed = await this.checkMandatoryChannel(ctx, lang);
    if (!isSubscribed) return;

    const processingMsg = await ctx.reply(t(lang, 'processing'));

    try {
      const startTime = Date.now();
      
      // Gemini orqali grammatik tekshirish, agar ishlamasa GrammarService ga fallback
      let result;
      try {
        result = await this.geminiService.correctGrammar(text, lang);
      } catch (geminiError) {
        console.log('Gemini failed, using GrammarService fallback');
        result = await this.grammarService.correctGrammar(text, lang);
      }

      await this.botService.incrementRequestCount(String(user.id), 'text');

      // Log request
      await this.statsService.logRequest({
        telegramId: String(user.id),
        type: 'text',
        originalText: text,
        correctedText: result.correctedText,
        errorsCount: result.errorsCount,
        processingTime: Date.now() - startTime,
      });

      // Delete processing message
      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}

      const resultData = {
        hasErrors: result.errorsCount > 0,
        errorsCount: result.errorsCount,
        original: text,
        corrected: result.correctedText,
      };

      await ctx.replyWithMarkdown(t(lang, 'result', resultData));
    } catch (error) {
      console.error('Text processing error:', error);
      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}
      await ctx.reply(t(lang, 'errorProcessing'));
    }
  }

  @On('voice')
  async onVoice(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    const user = ctx.from;
    const voice = message?.voice;

    if (!user || !voice) return;

    const lang = await this.getUserLang(String(user.id));

    // Check mandatory channel subscription
    const isSubscribed = await this.checkMandatoryChannel(ctx, lang);
    if (!isSubscribed) return;

    const processingMsg = await ctx.reply(t(lang, 'processingVoice'));

    try {
      const startTime = Date.now();
      
      // Get file
      const fileLink = await ctx.telegram.getFileLink(voice.file_id);
      
      // SpeechToText orqali ovozni matnga
      const text = await this.speechToTextService.transcribe(fileLink.href, lang);

      if (!text) {
        await ctx.deleteMessage(processingMsg.message_id);
        await ctx.reply(t(lang, 'errorVoice'));
        return;
      }

      // Gemini orqali grammatik tekshirish, fallback GrammarService
      let result;
      try {
        result = await this.geminiService.correctGrammar(text, lang);
      } catch (geminiError) {
        console.log('Gemini failed for voice, using GrammarService fallback');
        result = await this.grammarService.correctGrammar(text, lang);
      }

      await this.botService.incrementRequestCount(String(user.id), 'voice');

      await this.statsService.logRequest({
        telegramId: String(user.id),
        type: 'voice',
        originalText: text,
        correctedText: result.correctedText,
        errorsCount: result.errorsCount,
        processingTime: Date.now() - startTime,
      });

      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}

      const resultData = {
        hasErrors: result.errorsCount > 0,
        errorsCount: result.errorsCount,
        original: text,
        corrected: result.correctedText,
      };

      await ctx.replyWithMarkdown(t(lang, 'result', resultData));
    } catch (error) {
      console.error('Voice processing error:', error);
      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}
      await ctx.reply(t(lang, 'errorVoice'));
    }
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    const user = ctx.from;
    const photos = message?.photo;

    if (!user || !photos || photos.length === 0) return;

    const lang = await this.getUserLang(String(user.id));

    // Check mandatory channel subscription
    const isSubscribed = await this.checkMandatoryChannel(ctx, lang);
    if (!isSubscribed) return;

    const processingMsg = await ctx.reply(t(lang, 'processingImage'));

    let filePath: string | null = null;

    try {
      const startTime = Date.now();
      
      // Get largest photo
      const photo = photos[photos.length - 1];
      const fileLink = await ctx.telegram.getFileLink(photo.file_id);

      // OCR orqali rasmdan matn
      filePath = await this.ocrService.downloadImage(fileLink.href);
      const text = await this.ocrService.extractText(filePath, lang);

      if (!text || text.trim().length === 0) {
        await ctx.deleteMessage(processingMsg.message_id);
        await ctx.reply(t(lang, 'errorNoText'));
        return;
      }

      // Gemini orqali grammatik tekshirish, fallback GrammarService
      let result;
      try {
        result = await this.geminiService.correctGrammar(text, lang);
      } catch (geminiError) {
        console.log('Gemini failed for image, using GrammarService fallback');
        result = await this.grammarService.correctGrammar(text, lang);
      }

      await this.botService.incrementRequestCount(String(user.id), 'image');

      await this.statsService.logRequest({
        telegramId: String(user.id),
        type: 'image',
        originalText: text,
        correctedText: result.correctedText,
        errorsCount: result.errorsCount,
        processingTime: Date.now() - startTime,
      });

      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}

      const resultData = {
        hasErrors: result.errorsCount > 0,
        errorsCount: result.errorsCount,
        original: text,
        corrected: result.correctedText,
      };

      await ctx.replyWithMarkdown(t(lang, 'result', resultData));
    } catch (error) {
      console.error('Image processing error:', error);
      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}
      await ctx.reply(t(lang, 'errorImage'));
    } finally {
      if (filePath) {
        this.ocrService.cleanup(filePath);
      }
    }
  }

  @On('video')
  async onVideo(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    const user = ctx.from;
    const video = message?.video;

    if (!user || !video) return;

    const lang = await this.getUserLang(String(user.id));

    // Check mandatory channel subscription
    const isSubscribed = await this.checkMandatoryChannel(ctx, lang);
    if (!isSubscribed) return;

    const processingMsg = await ctx.reply(t(lang, 'processingVideo'));

    try {
      const startTime = Date.now();
      
      // Get file
      const fileLink = await ctx.telegram.getFileLink(video.file_id);
      
      // SpeechToTextService orqali video dan matnga
      const text = await this.speechToTextService.transcribeVideo(fileLink.href, lang);

      if (!text) {
        await ctx.deleteMessage(processingMsg.message_id);
        await ctx.reply(t(lang, 'errorVideo'));
        return;
      }

      // Gemini orqali grammatik tekshirish, fallback GrammarService
      let result;
      try {
        result = await this.geminiService.correctGrammar(text, lang);
      } catch (geminiError) {
        console.log('Gemini failed for video, using GrammarService fallback');
        result = await this.grammarService.correctGrammar(text, lang);
      }

      await this.botService.incrementRequestCount(String(user.id), 'voice');

      await this.statsService.logRequest({
        telegramId: String(user.id),
        type: 'video',
        originalText: text,
        correctedText: result.correctedText,
        errorsCount: result.errorsCount,
        processingTime: Date.now() - startTime,
      });

      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}

      const resultData = {
        hasErrors: result.errorsCount > 0,
        errorsCount: result.errorsCount,
        original: text,
        corrected: result.correctedText,
      };

      await ctx.replyWithMarkdown(t(lang, 'result', resultData));
    } catch (error) {
      console.error('Video processing error:', error);
      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}
      await ctx.reply(t(lang, 'errorVideo'));
    }
  }

  @On('video_note')
  async onVideoNote(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    const user = ctx.from;
    const videoNote = message?.video_note;

    if (!user || !videoNote) return;

    const lang = await this.getUserLang(String(user.id));

    // Check mandatory channel subscription
    const isSubscribed = await this.checkMandatoryChannel(ctx, lang);
    if (!isSubscribed) return;

    const processingMsg = await ctx.reply(t(lang, 'processingVideo'));

    try {
      const startTime = Date.now();
      
      // Get file
      const fileLink = await ctx.telegram.getFileLink(videoNote.file_id);
      
      // SpeechToTextService orqali video_note dan matnga
      const text = await this.speechToTextService.transcribeVideo(fileLink.href, lang);

      if (!text) {
        await ctx.deleteMessage(processingMsg.message_id);
        await ctx.reply(t(lang, 'errorVideo'));
        return;
      }

      // Gemini orqali grammatik tekshirish, fallback GrammarService
      let result;
      try {
        result = await this.geminiService.correctGrammar(text, lang);
      } catch (geminiError) {
        console.log('Gemini failed for video_note, using GrammarService fallback');
        result = await this.grammarService.correctGrammar(text, lang);
      }

      await this.botService.incrementRequestCount(String(user.id), 'voice');

      await this.statsService.logRequest({
        telegramId: String(user.id),
        type: 'video_note',
        originalText: text,
        correctedText: result.correctedText,
        errorsCount: result.errorsCount,
        processingTime: Date.now() - startTime,
      });

      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}

      const resultData = {
        hasErrors: result.errorsCount > 0,
        errorsCount: result.errorsCount,
        original: text,
        corrected: result.correctedText,
      };

      await ctx.replyWithMarkdown(t(lang, 'result', resultData));
    } catch (error) {
      console.error('Video note processing error:', error);
      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}
      await ctx.reply(t(lang, 'errorVideo'));
    }
  }

  @On('audio')
  async onAudio(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    const user = ctx.from;
    const audio = message?.audio;

    if (!user || !audio) return;

    const lang = await this.getUserLang(String(user.id));

    // Check mandatory channel subscription
    const isSubscribed = await this.checkMandatoryChannel(ctx, lang);
    if (!isSubscribed) return;

    const processingMsg = await ctx.reply(t(lang, 'processingVoice'));

    try {
      const startTime = Date.now();
      
      // Get file
      const fileLink = await ctx.telegram.getFileLink(audio.file_id);
      
      // SpeechToTextService orqali speech-to-text
      const text = await this.speechToTextService.transcribe(fileLink.href, lang);

      if (!text) {
        await ctx.deleteMessage(processingMsg.message_id);
        await ctx.reply(t(lang, 'errorVoice'));
        return;
      }

      // Gemini orqali grammatik tekshirish, fallback GrammarService
      let result;
      try {
        result = await this.geminiService.correctGrammar(text, lang);
      } catch (geminiError) {
        console.log('Gemini failed for audio, using GrammarService fallback');
        result = await this.grammarService.correctGrammar(text, lang);
      }

      await this.botService.incrementRequestCount(String(user.id), 'voice');

      await this.statsService.logRequest({
        telegramId: String(user.id),
        type: 'audio',
        originalText: text,
        correctedText: result.correctedText,
        errorsCount: result.errorsCount,
        processingTime: Date.now() - startTime,
      });

      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}

      const resultData = {
        hasErrors: result.errorsCount > 0,
        errorsCount: result.errorsCount,
        original: text,
        corrected: result.correctedText,
      };

      await ctx.replyWithMarkdown(t(lang, 'result', resultData));
    } catch (error) {
      console.error('Audio processing error:', error);
      try {
        await ctx.deleteMessage(processingMsg.message_id);
      } catch {}
      await ctx.reply(t(lang, 'errorVoice'));
    }
  }

  private async checkMandatoryChannel(ctx: Context, lang: string, skipMessage: boolean = false): Promise<boolean> {
    const user = ctx.from;
    if (!user) return false;

    const mandatoryChannels = await this.channelsService.getMandatoryChannels();
    if (mandatoryChannels.length === 0) return true;

    for (const channel of mandatoryChannels) {
      const isMember = await this.botService.checkChannelMembership(user.id, channel.channelId);
      if (!isMember) {
        if (!skipMessage) {
          const keyboard = {
            inline_keyboard: [
              ...mandatoryChannels.map(ch => ([
                { text: `📢 ${ch.title}`, url: `https://t.me/${ch.channelUsername}` }
              ])),
              [{ text: t(lang, 'checkSubscription'), callback_data: 'check_subscription' }],
            ],
          };

          await ctx.reply(t(lang, 'subscribeFirst'), { reply_markup: keyboard });
        }
        return false;
      }
    }

    return true;
  }

  @Command('adminstats')
  async onAdminStats(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    const lang = await this.getUserLang(String(user.id));

    if (!this.isAdmin(user.id)) {
      await ctx.reply(t(lang, 'adminOnly'));
      return;
    }

    const stats = await this.statsService.getDashboardStats();
    await ctx.replyWithMarkdown(t(lang, 'adminStats', stats));
  }

  @Command('channels')
  async onChannels(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    const lang = await this.getUserLang(String(user.id));

    if (!this.isAdmin(user.id)) {
      await ctx.reply(t(lang, 'adminOnly'));
      return;
    }

    const channels = await this.channelsService.getMandatoryChannels();
    
    if (channels.length === 0) {
      await ctx.reply(t(lang, 'noChannels'));
      return;
    }

    let message = '📢 *Channels:*\n\n';
    channels.forEach((ch, i) => {
      message += `${i + 1}. ${ch.title}\n   ID: \`${ch.channelId}\`\n   @${ch.channelUsername}\n\n`;
    });

    await ctx.replyWithMarkdown(message);
  }

  @Command('broadcast')
  async onBroadcast(@Ctx() ctx: Context) {
    const user = ctx.from;
    const message = ctx.message as any;
    if (!user) return;

    const lang = await this.getUserLang(String(user.id));

    if (!this.isAdmin(user.id)) {
      await ctx.reply(t(lang, 'adminOnly'));
      return;
    }

    const text = message?.text?.replace('/broadcast', '').trim();
    if (!text) {
      await ctx.reply(t(lang, 'broadcastNoText'));
      return;
    }

    await ctx.reply(t(lang, 'broadcastSending'));
    
    const result = await this.botService.broadcastMessage(text);
    
    await ctx.reply(t(lang, 'broadcastResult', result.sent, result.failed));
  }

  @Command('logincode')
  async onLoginCode(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    const lang = await this.getUserLang(String(user.id));

    if (!this.isAdmin(user.id)) {
      await ctx.reply(t(lang, 'adminOnly'));
      return;
    }

    // Login kodi yaratish
    const code = this.authService.generateTelegramLoginCode(String(user.id));

    const message = lang === 'uz' 
      ? `🔐 *Admin Panel Login Kodi*\n\n📱 Kod: \`${code}\`\n\n⏰ Kod 5 daqiqa amal qiladi.\n\n🌐 Admin panelga kiring: http://localhost:3001\n\nLogin sahifasida "Telegram orqali kirish" tugmasini bosing va bu kodni kiriting.`
      : lang === 'ru'
      ? `🔐 *Код для входа в панель*\n\n📱 Код: \`${code}\`\n\n⏰ Код действует 5 минут.\n\n🌐 Перейдите: http://localhost:3001\n\nНажмите "Войти через Telegram" и введите код.`
      : lang === 'tr'
      ? `🔐 *Admin Panel Giriş Kodu*\n\n📱 Kod: \`${code}\`\n\n⏰ Kod 5 dakika geçerli.\n\n🌐 Panele gidin: http://localhost:3001\n\n"Telegram ile giriş" butonuna tıklayın ve kodu girin.`
      : `🔐 *Admin Panel Login Code*\n\n📱 Code: \`${code}\`\n\n⏰ Code valid for 5 minutes.\n\n🌐 Go to: http://localhost:3001\n\nClick "Login with Telegram" and enter this code.`;

    await ctx.replyWithMarkdown(message);
  }
}
