// Internationalization - Ko'p tilli qo'llab-quvvatlash

export const messages = {
  uz: {
    welcome: (name: string) => `Merhaba.....

Men Hilal Edu turk tili markazining yordamchi assistant botiman!

Grammatik xatolarni tekshiraman.

*Quyidagilarni yuboring:*
- Matn - grammatik xatolarni tekshiraman
- Ovozli xabar - matnga aylantirib tekshiraman
- Rasm - rasmdagi matnni oqib tekshiraman

*Til tanlash:* /language

*Qollanma:* /help`,

    help: `*Yordam*

*Bot imkoniyatlari:*

1️⃣ *Matn tekshirish*
Oddiy matn yuboring, bot grammatik xatolarni topib, to'g'risini ko'rsatadi.

2️⃣ *Ovozli xabar*
Ovozli xabar yuboring, bot uni matnga aylantirib tekshiradi.

3️⃣ *Rasm*
Matnli rasm yuboring, bot rasmdagi matnni o'qib tekshiradi.

*Komandalar:*
/start - Botni boshlash
/language - Til tanlash
/stats - Statistikangiz
/help - Yordam`,

    selectLanguage: '🌐 Tilni tanlang:',
    languageChanged: (lang: string) => `✅ Til muvaffaqiyatli o'zgartirildi: ${lang}`,
    
    stats: (data: any) => `📊 *Sizning statistikangiz*

📝 Jami so'rovlar: ${data.totalRequests}
✍️ Matn: ${data.textRequests}
🎤 Ovoz: ${data.voiceRequests}
🖼 Rasmlar: ${data.imageRequests}

📅 Ro'yxatdan o'tgan: ${data.createdAt}`,

    processing: '⏳ Tekshirilmoqda...',
    processingVoice: '🎤 Ovozli xabar qayta ishlanmoqda...',
    processingImage: '🖼 Rasm qayta ishlanmoqda...',
    processingVideo: '🎬 Video qayta ishlanmoqda...',
    
    noErrors: '✅ Grammatik xatolar topilmadi! Matn to\'g\'ri yozilgan.',
    
    result: (data: any) => `📝 *Natija*

${data.hasErrors ? `❌ *${data.errorsCount} ta xato topildi*` : '✅ *Xatolar topilmadi*'}

${data.hasErrors ? `*Asl matn:*\n${data.original}\n\n*To'g'rilangan:*\n${data.corrected}` : `*Matn:*\n${data.original}`}`,

    errorProcessing: '❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.',
    errorVoice: '❌ Ovozli xabarni qayta ishlashda xatolik.',
    errorImage: '❌ Rasmni qayta ishlashda xatolik.',
    errorVideo: '❌ Videoni qayta ishlashda xatolik.',
    errorNoText: '❌ Rasmdan matn topilmadi.',
    
    subscribeFirst: '⚠️ Botdan foydalanish uchun quyidagi kanallarga obuna bo\'ling:',
    checkSubscription: '✅ Obunani tekshirish',
    subscriptionConfirmed: '✅ Obuna tasdiqlandi!',
    notSubscribed: '❌ Siz hali obuna bo\'lmagansiz!',

    // Admin
    adminOnly: '❌ Bu komanda faqat adminlar uchun.',
    adminPanel: `🔐 *Admin Panel*

Siz admin sifatida ro'yxatdan o'tgansiz!

*Mavjud komandalar:*
• /admin - Admin panel
• /broadcast [xabar] - Xabar yuborish
• /adminstats - Bot statistikasi
• /channels - Kanallar ro'yxati`,

    adminStats: (data: any) => `📊 *Bot Statistikasi*

👥 *Foydalanuvchilar:*
• Jami: ${data.totalUsers}
• Bugun: ${data.todayUsers}
• Faol (7 kun): ${data.activeUsers}

📝 *So'rovlar:*
• Jami: ${data.totalRequests}
• Matn: ${data.textRequests}
• Ovoz: ${data.voiceRequests}
• Rasm: ${data.imageRequests}`,

    noChannels: '📢 Majburiy kanallar yo\'q.',
    broadcastNoText: '❌ Xabar matnini kiriting.\n\nMisol: /broadcast Salom!',
    broadcastSending: '📤 Xabar yuborilmoqda...',
    broadcastResult: (sent: number, failed: number) => `✅ Xabar yuborildi!\n\n📊 Yuborildi: ${sent}\n❌ Xatolik: ${failed}`,
  },

  ru: {
    welcome: (name: string) => `Merhaba.....

Men Hilal Edu turk tili markazining yordamchi assistant botiman!

Grammatik xatolarni tekshiraman.

*Quyidagilarni yuboring:*
- Matn - grammatik xatolarni tekshiraman
- Ovozli xabar - matnga aylantirib tekshiraman
- Rasm - rasmdagi matnni oqib tekshiraman

*Til tanlash:* /language

*Qollanma:* /help`,

    help: `📖 *Помощь*

*Возможности бота:*

1️⃣ *Проверка текста*
Отправьте текст, бот найдёт и исправит ошибки.

2️⃣ *Голосовое сообщение*
Отправьте голосовое, бот переведёт в текст и проверит.

3️⃣ *Изображение*
Отправьте фото с текстом, бот распознает и проверит.

*Команды:*
/start - Запуск бота
/language - Выбор языка
/stats - Ваша статистика
/help - Помощь`,

    selectLanguage: '🌐 Выберите язык:',
    languageChanged: (lang: string) => `✅ Язык успешно изменён: ${lang}`,
    
    stats: (data: any) => `📊 *Ваша статистика*

📝 Всего запросов: ${data.totalRequests}
✍️ Текст: ${data.textRequests}
🎤 Голос: ${data.voiceRequests}
🖼 Изображения: ${data.imageRequests}

📅 Регистрация: ${data.createdAt}`,

    processing: '⏳ Проверяю...',
    processingVoice: '🎤 Обрабатываю голосовое сообщение...',
    processingImage: '🖼 Обрабатываю изображение...',
    processingVideo: '🎬 Обрабатываю видео...',
    
    noErrors: '✅ Грамматических ошибок не найдено! Текст написан правильно.',
    
    result: (data: any) => `📝 *Результат*

${data.hasErrors ? `❌ *Найдено ${data.errorsCount} ошибок*` : '✅ *Ошибок не найдено*'}

${data.hasErrors ? `*Исходный текст:*\n${data.original}\n\n*Исправленный:*\n${data.corrected}` : `*Текст:*\n${data.original}`}`,

    errorProcessing: '❌ Произошла ошибка. Попробуйте ещё раз.',
    errorVoice: '❌ Ошибка обработки голосового сообщения.',
    errorImage: '❌ Ошибка обработки изображения.',
    errorVideo: '❌ Ошибка обработки видео.',
    errorNoText: '❌ Текст на изображении не найден.',
    
    subscribeFirst: '⚠️ Для использования бота подпишитесь на каналы:',
    checkSubscription: '✅ Проверить подписку',
    subscriptionConfirmed: '✅ Подписка подтверждена!',
    notSubscribed: '❌ Вы ещё не подписаны!',

    // Admin
    adminOnly: '❌ Эта команда только для администраторов.',
    adminPanel: `🔐 *Панель администратора*

Вы авторизованы как администратор!

*Доступные команды:*
• /admin - Панель админа
• /broadcast [сообщение] - Рассылка
• /adminstats - Статистика бота
• /channels - Список каналов`,

    adminStats: (data: any) => `📊 *Статистика бота*

👥 *Пользователи:*
• Всего: ${data.totalUsers}
• Сегодня: ${data.todayUsers}
• Активных (7 дней): ${data.activeUsers}

📝 *Запросы:*
• Всего: ${data.totalRequests}
• Текст: ${data.textRequests}
• Голос: ${data.voiceRequests}
• Изображения: ${data.imageRequests}`,

    noChannels: '📢 Обязательных каналов нет.',
    broadcastNoText: '❌ Введите текст сообщения.\n\nПример: /broadcast Привет!',
    broadcastSending: '📤 Отправляю сообщение...',
    broadcastResult: (sent: number, failed: number) => `✅ Сообщение отправлено!\n\n📊 Отправлено: ${sent}\n❌ Ошибок: ${failed}`,
  },

  en: {
    welcome: (name: string) => `Merhaba.....

Men Hilal Edu turk tili markazining yordamchi assistant botiman!

Grammatik xatolarni tekshiraman.

*Quyidagilarni yuboring:*
- Matn - grammatik xatolarni tekshiraman
- Ovozli xabar - matnga aylantirib tekshiraman
- Rasm - rasmdagi matnni oqib tekshiraman

*Til tanlash:* /language

*Qollanma:* /help`,

    help: `📖 *Help*

*Bot features:*

1️⃣ *Text checking*
Send text, the bot will find and correct errors.

2️⃣ *Voice message*
Send a voice message, the bot will convert and check.

3️⃣ *Image*
Send an image with text, the bot will recognize and check.

*Commands:*
/start - Start bot
/language - Select language
/stats - Your statistics
/help - Help`,

    selectLanguage: '🌐 Select language:',
    languageChanged: (lang: string) => `✅ Language changed: ${lang}`,
    
    stats: (data: any) => `📊 *Your Statistics*

📝 Total requests: ${data.totalRequests}
✍️ Text: ${data.textRequests}
🎤 Voice: ${data.voiceRequests}
🖼 Images: ${data.imageRequests}

📅 Registered: ${data.createdAt}`,

    processing: '⏳ Checking...',
    processingVoice: '🎤 Processing voice message...',
    processingImage: '🖼 Processing image...',
    processingVideo: '🎬 Processing video...',
    
    noErrors: '✅ No grammar errors found! Text is correct.',
    
    result: (data: any) => `📝 *Result*

${data.hasErrors ? `❌ *Found ${data.errorsCount} errors*` : '✅ *No errors found*'}

${data.hasErrors ? `*Original text:*\n${data.original}\n\n*Corrected:*\n${data.corrected}` : `*Text:*\n${data.original}`}`,

    errorProcessing: '❌ An error occurred. Please try again.',
    errorVoice: '❌ Error processing voice message.',
    errorImage: '❌ Error processing image.',
    errorVideo: '❌ Error processing video.',
    errorNoText: '❌ No text found in image.',
    
    subscribeFirst: '⚠️ Please subscribe to use the bot:',
    checkSubscription: '✅ Check subscription',
    subscriptionConfirmed: '✅ Subscription confirmed!',
    notSubscribed: '❌ You are not subscribed yet!',

    // Admin
    adminOnly: '❌ This command is for admins only.',
    adminPanel: `🔐 *Admin Panel*

You are authorized as an administrator!

*Available commands:*
• /admin - Admin panel
• /broadcast [message] - Broadcast
• /adminstats - Bot statistics
• /channels - Channel list`,

    adminStats: (data: any) => `📊 *Bot Statistics*

👥 *Users:*
• Total: ${data.totalUsers}
• Today: ${data.todayUsers}
• Active (7 days): ${data.activeUsers}

📝 *Requests:*
• Total: ${data.totalRequests}
• Text: ${data.textRequests}
• Voice: ${data.voiceRequests}
• Images: ${data.imageRequests}`,

    noChannels: '📢 No mandatory channels.',
    broadcastNoText: '❌ Enter message text.\n\nExample: /broadcast Hello!',
    broadcastSending: '📤 Sending message...',
    broadcastResult: (sent: number, failed: number) => `✅ Message sent!\n\n📊 Sent: ${sent}\n❌ Failed: ${failed}`,
  },

  tr: {
    welcome: (name: string) => `Merhaba.....

Men Hilal Edu turk tili markazining yordamchi assistant botiman!

Grammatik xatolarni tekshiraman.

*Quyidagilarni yuboring:*
- Matn - grammatik xatolarni tekshiraman
- Ovozli xabar - matnga aylantirib tekshiraman
- Rasm - rasmdagi matnni oqib tekshiraman

*Til tanlash:* /language

*Qollanma:* /help`,

    help: `*Yardim*

*Bot özellikleri:*

1️⃣ *Metin kontrolü*
Metin gönderin, bot hataları bulup düzeltir.

2️⃣ *Sesli mesaj*
Sesli mesaj gönderin, bot çevirip kontrol eder.

3️⃣ *Görsel*
Metinli görsel gönderin, bot okuyup kontrol eder.

*Komutlar:*
/start - Botu başlat
/language - Dil seç
/stats - İstatistikleriniz
/help - Yardım`,

    selectLanguage: '🌐 Dil seçin:',
    languageChanged: (lang: string) => `✅ Dil değiştirildi: ${lang}`,
    
    stats: (data: any) => `📊 *İstatistikleriniz*

📝 Toplam istek: ${data.totalRequests}
✍️ Metin: ${data.textRequests}
🎤 Ses: ${data.voiceRequests}
🖼 Görsel: ${data.imageRequests}

📅 Kayıt: ${data.createdAt}`,

    processing: '⏳ Kontrol ediliyor...',
    processingVoice: '🎤 Sesli mesaj işleniyor...',
    processingImage: '🖼 Görsel işleniyor...',
    processingVideo: '🎬 Video işleniyor...',
    
    noErrors: '✅ Dilbilgisi hatası bulunamadı! Metin doğru.',
    
    result: (data: any) => `📝 *Sonuç*

${data.hasErrors ? `❌ *${data.errorsCount} hata bulundu*` : '✅ *Hata bulunamadı*'}

${data.hasErrors ? `*Orijinal metin:*\n${data.original}\n\n*Düzeltilmiş:*\n${data.corrected}` : `*Metin:*\n${data.original}`}`,

    errorProcessing: '❌ Bir hata oluştu. Tekrar deneyin.',
    errorVoice: '❌ Sesli mesaj işleme hatası.',
    errorImage: '❌ Görsel işleme hatası.',
    errorVideo: '❌ Video işleme hatası.',
    errorNoText: '❌ Görselde metin bulunamadı.',
    
    subscribeFirst: '⚠️ Botu kullanmak için kanallara abone olun:',
    checkSubscription: '✅ Aboneliği kontrol et',
    subscriptionConfirmed: '✅ Abonelik onaylandı!',
    notSubscribed: '❌ Henüz abone değilsiniz!',

    // Admin
    adminOnly: '❌ Bu komut sadece yöneticiler için.',
    adminPanel: `🔐 *Yönetici Paneli*

Yönetici olarak yetkilendiniz!

*Mevcut komutlar:*
• /admin - Yönetici paneli
• /broadcast [mesaj] - Toplu mesaj
• /adminstats - Bot istatistikleri
• /channels - Kanal listesi`,

    adminStats: (data: any) => `📊 *Bot İstatistikleri*

👥 *Kullanıcılar:*
• Toplam: ${data.totalUsers}
• Bugün: ${data.todayUsers}
• Aktif (7 gün): ${data.activeUsers}

📝 *İstekler:*
• Toplam: ${data.totalRequests}
• Metin: ${data.textRequests}
• Ses: ${data.voiceRequests}
• Görsel: ${data.imageRequests}`,

    noChannels: '📢 Zorunlu kanal yok.',
    broadcastNoText: '❌ Mesaj metnini girin.\n\nÖrnek: /broadcast Merhaba!',
    broadcastSending: '📤 Mesaj gönderiliyor...',
    broadcastResult: (sent: number, failed: number) => `✅ Mesaj gönderildi!\n\n📊 Gönderildi: ${sent}\n❌ Başarısız: ${failed}`,
  },
};

export type Language = 'uz' | 'ru' | 'en' | 'tr';
export type Messages = typeof messages.uz;

export function t(lang: string, key: keyof Messages, ...args: any[]): string {
  const language = (lang || 'uz') as Language;
  const msgs = messages[language] || messages.uz;
  const message = msgs[key];
  
  if (typeof message === 'function') {
    return (message as Function)(...args);
  }
  return message as string;
}

export const langNames: Record<string, string> = {
  uz: "O'zbek",
  ru: 'Русский',
  en: 'English',
  tr: 'Türkçe',
};
