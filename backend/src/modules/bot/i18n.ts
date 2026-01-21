export type Language = 'tr';// Turkish only - simple i18n// Faqat Turkcha - Hilal Edu Turk Tili Markazi// Faqat Turkcha - Hilal Edu Turk Tili Markazi// Internationalization - Ko'p tilli qo'llab-quvvatlash



export const defaultLanguage: Language = 'tr';export type Language = 'tr';



const messages = {

  tr: {

    welcome: (name: string) => `Merhaba.....const messages = {



Men Hilal Edu turk tili markazining yordamchi assistant botiman!`,  tr: {export const messages = {



    help: `*Yardim*    welcome: (name: string) => `Merhaba.....



Metin gonderin, dilbilgisi hatalarini kontrol ederim.  tr: {



*Komutlar:*Men Hilal Edu turk tili markazining yordamchi assistant botiman!`,

/start - Baslat

/stats - Istatistikler    welcome: (name: string) => `Merhaba.....export const messages = {export const messages = {

/help - Yardim`,

    help: `*Yardim*

    processing: 'Kontrol ediliyor...',

    processingVoice: 'Sesli mesaj isleniyor...',

    processingImage: 'Resim isleniyor...',

    processingVideo: 'Video isleniyor...',Metin gonderin, dilbilgisi hatalarini kontrol ederim.



    noErrors: 'Dilbilgisi hatasi bulunamadi! Metin dogru.',Men Hilal Edu turk tili markazining yordamchi assistant botiman!`,  tr: {  uz: {



    result: (data: any) => `*Sonuc**Desteklenen formatlar:*



${data.hasErrors ? `*Orijinal:*\n${data.original}\n\n*Duzeltilmis:*\n${data.corrected}` : `*Metin:*\n${data.original}`}`,- Metin mesaji



    stats: (data: any) => `*Istatistikleriniz*- Sesli mesaj



Metin: ${data.textRequests}- Resim (el yazisi dahil)    help: `*Yardim*    welcome: (name: string) => `Merhaba.....    welcome: (name: string) => `Merhaba.....

Ses: ${data.voiceRequests}

Resimler: ${data.imageRequests}



Kayit: ${data.createdAt}`,*Komutlar:*



    errorProcessing: 'Bir hata olustu. Tekrar deneyin.',/start - Baslat

    errorVoice: 'Sesli mesaj isleme hatasi.',

    errorImage: 'Resim isleme hatasi.',/stats - Istatistikler*Bot ozellikleri:*

    errorVideo: 'Video isleme hatasi.',

    errorNoText: 'Resimde metin bulunamadi.',/help - Yardim`,



    subscribeFirst: 'Botu kullanmak icin kanallara abone olun:',

    checkSubscription: 'Aboneligi kontrol et',

    subscriptionConfirmed: 'Abonelik onaylandi!',    processing: 'Kontrol ediliyor...',

    notSubscribed: 'Henuz abone olmamissiniz!',

    processingVoice: 'Sesli mesaj isleniyor...',1. *Metin kontrolu*Ben Hilal Edu Turk dili merkezinin yardimci asistaniyim!Men Hilal Edu turk tili markazining yordamchi assistant botiman!

    adminOnly: 'Bu komut sadece yoneticiler icindir.',

    adminPanel: `*Admin Paneli*    processingImage: 'Resim isleniyor...',



Yonetici olarak giris yaptiniz!    processingVideo: 'Video isleniyor...',Metin gonderin, bot dilbilgisi hatalarini bulup duzeltir.



*Komutlar:*

/admin - Admin paneli

/broadcast [mesaj] - Mesaj gonder    noErrors: 'Dilbilgisi hatasi bulunamadi! Metin dogru.',

/adminstats - Bot istatistikleri

/channels - Kanal listesi`,



    adminStats: (data: any) => `*Bot Istatistikleri*    result: (data: any) => `*Sonuc*2. *Sesli mesaj*



*Kullanicilar:*

Toplam: ${data.totalUsers}

Bugun: ${data.todayUsers}${data.hasErrors ? `*${data.errorsCount} hata bulundu*` : '*Hata bulunamadi*'}Sesli mesaj gonderin, bot metne cevirip kontrol eder.Dilbilgisi hatalarini kontrol ediyorum.Grammatik xatolarni tekshiraman.

Aktif (7 gun): ${data.activeUsers}



*Istekler:*

Toplam: ${data.totalRequests}${data.hasErrors ? `*Orijinal:*\n${data.original}\n\n*Duzeltilmis:*\n${data.corrected}` : `*Metin:*\n${data.original}`}`,

Metin: ${data.textRequests}

Ses: ${data.voiceRequests}

Resim: ${data.imageRequests}`,

    stats: (data: any) => `*Istatistikleriniz*3. *Resim*

    noChannels: 'Zorunlu kanal yok.',

    broadcastNoText: 'Mesaj metnini girin.\n\nOrnek: /broadcast Merhaba!',

    broadcastSending: 'Mesaj gonderiliyor...',

    broadcastResult: (sent: number, failed: number) => `Mesaj gonderildi!\n\nGonderildi: ${sent}\nHata: ${failed}`,Toplam: ${data.totalRequests}Metinli resim gonderin, bot resimdeki metni okuyup kontrol eder.

  },

};Metin: ${data.textRequests}



export function t(key: string, data?: any): string {Ses: ${data.voiceRequests}*Bana gonderin:**Quyidagilarni yuboring:*

  const message = (messages.tr as any)[key];

Resim: ${data.imageRequests}

  if (!message) {

    console.warn(`Translation missing: ${key}`);*Komutlar:*

    return key;

  }Kayit: ${data.createdAt}`,



  if (typeof message === 'function') {/start - Botu baslat- Metin - dilbilgisi hatalarini kontrol ederim- Matn - grammatik xatolarni tekshiraman

    return message(data);

  }    errorProcessing: 'Bir hata olustu. Tekrar deneyin.',



  return message;    errorVoice: 'Sesli mesaj isleme hatasi.',/stats - Istatistikleriniz

}

    errorImage: 'Resim isleme hatasi.',

    errorVideo: 'Video isleme hatasi.',/help - Yardim`,- Sesli mesaj - metne cevirip kontrol ederim- Ovozli xabar - matnga aylantirib tekshiraman

    errorNoText: 'Resimde metin bulunamadi.',



    subscribeFirst: 'Botu kullanmak icin kanallara abone olun:',

    checkSubscription: 'Aboneligi kontrol et',    stats: (data: any) => `*Istatistikleriniz*- Resim - resimdeki metni okuyup kontrol ederim- Rasm - rasmdagi matnni oqib tekshiraman

    subscriptionConfirmed: 'Abonelik onaylandi!',

    notSubscribed: 'Henuz abone olmamissiniz!',



    adminOnly: 'Bu komut sadece yoneticiler icindir.',Toplam istekler: ${data.totalRequests}

    adminPanel: `*Admin Paneli*

Metin: ${data.textRequests}

Yonetici olarak giris yaptiniz!

Ses: ${data.voiceRequests}*Yardim:* /help`,*Til tanlash:* /language

*Komutlar:*

/admin - Admin paneliResimler: ${data.imageRequests}

/adminstats - Bot istatistikleri

/broadcast [mesaj] - Mesaj gonder

/channels - Kanal listesi`,

Kayit tarihi: ${data.createdAt}`,

    adminStats: (data: any) => `*Bot Istatistikleri*

    help: `*Yardim**Qollanma:* /help`,

*Kullanicilar:*

Toplam: ${data.totalUsers}    processing: 'Kontrol ediliyor...',

Bugun: ${data.todayUsers}

Aktif (7 gun): ${data.activeUsers}    processingVoice: 'Sesli mesaj isleniyor...',



*Istekler:*    processingImage: 'Resim isleniyor...',

Toplam: ${data.totalRequests}

Metin: ${data.textRequests}    processingVideo: 'Video isleniyor...',*Bot ozellikleri:*    help: `*Yordam*

Ses: ${data.voiceRequests}

Resim: ${data.imageRequests}`,    



    noChannels: 'Zorunlu kanal yok.',    noErrors: 'Dilbilgisi hatasi bulunamadi! Metin dogru yazilmis.',

    broadcastNoText: 'Mesaj metnini girin.\n\nOrnek: /broadcast Merhaba!',

    broadcastSending: 'Mesaj gonderiliyor...',    

    broadcastResult: (sent: number, failed: number) => `Mesaj gonderildi!\n\nGonderildi: ${sent}\nHata: ${failed}`,

  },    result: (data: any) => `*Sonuc*1. *Metin kontrolu**Bot imkoniyatlari:*

};



export type Messages = typeof messages.tr;

export const defaultLanguage: Language = 'tr';${data.hasErrors ? `*${data.errorsCount} hata bulundu*` : '*Hata bulunamadi*'}Metin gonderin, bot dilbilgisi hatalarini bulup duzeltir.



export function t(key: keyof Messages, _language?: Language, data?: any): string {

  const message = (messages.tr as any)[key];

${data.hasErrors ? `*Orijinal metin:*\n${data.original}\n\n*Duzeltilmis:*\n${data.corrected}` : `*Metin:*\n${data.original}`}`,1️⃣ *Matn tekshirish*

  if (!message) {

    console.warn(`Translation missing: ${key}`);

    return key;

  }    errorProcessing: 'Bir hata olustu. Lutfen tekrar deneyin.',2. *Sesli mesaj*Oddiy matn yuboring, bot grammatik xatolarni topib, to'g'risini ko'rsatadi.



  if (typeof message === 'function') {    errorVoice: 'Sesli mesaj islenirken hata olustu.',

    return message(data);

  }    errorImage: 'Resim islenirken hata olustu.',Sesli mesaj gonderin, bot metne cevirip kontrol eder.



  return message;    errorVideo: 'Video islenirken hata olustu.',

}

    errorNoText: 'Resimde metin bulunamadi.',2️⃣ *Ovozli xabar*

    

    subscribeFirst: 'Botu kullanmak icin asagidaki kanallara abone olun:',3. *Resim*Ovozli xabar yuboring, bot uni matnga aylantirib tekshiradi.

    checkSubscription: 'Aboneligi kontrol et',

    subscriptionConfirmed: 'Abonelik onaylandi!',Metinli resim gonderin, bot resimdeki metni okuyup kontrol eder.

    notSubscribed: 'Henuz abone olmamissiniz!',

3️⃣ *Rasm*

    // Admin

    adminOnly: 'Bu komut sadece yoneticiler icindir.',*Komutlar:*Matnli rasm yuboring, bot rasmdagi matnni o'qib tekshiradi.

    adminPanel: `*Admin Paneli*

/start - Botu baslat

Yonetici olarak giris yaptiniz!

/stats - Istatistikleriniz*Komandalar:*

*Mevcut komutlar:*

- /admin - Admin paneli/help - Yardim`,/start - Botni boshlash

- /broadcast [mesaj] - Mesaj gonder

- /adminstats - Bot istatistikleri/language - Til tanlash

- /channels - Kanal listesi`,

    stats: (data: any) => `*Istatistikleriniz*/stats - Statistikangiz

    adminStats: (data: any) => `*Bot Istatistikleri*

/help - Yordam`,

*Kullanicilar:*

- Toplam: ${data.totalUsers}Toplam istekler: ${data.totalRequests}

- Bugun: ${data.todayUsers}

- Aktif (7 gun): ${data.activeUsers}Metin: ${data.textRequests}    selectLanguage: '🌐 Tilni tanlang:',



*Istekler:*Ses: ${data.voiceRequests}    languageChanged: (lang: string) => `✅ Til muvaffaqiyatli o'zgartirildi: ${lang}`,

- Toplam: ${data.totalRequests}

- Metin: ${data.textRequests}Resimler: ${data.imageRequests}    

- Ses: ${data.voiceRequests}

- Resim: ${data.imageRequests}`,    stats: (data: any) => `📊 *Sizning statistikangiz*



    noChannels: 'Zorunlu kanal yok.',Kayit tarihi: ${data.createdAt}`,

    broadcastNoText: 'Mesaj metnini girin.\n\nOrnek: /broadcast Merhaba!',

    broadcastSending: 'Mesaj gonderiliyor...',📝 Jami so'rovlar: ${data.totalRequests}

    broadcastResult: (sent: number, failed: number) => `Mesaj gonderildi!\n\nGonderildi: ${sent}\nHata: ${failed}`,

  },    processing: 'Kontrol ediliyor...',✍️ Matn: ${data.textRequests}

};

    processingVoice: 'Sesli mesaj isleniyor...',🎤 Ovoz: ${data.voiceRequests}

export type Language = 'tr';

export const defaultLanguage: Language = 'tr';    processingImage: 'Resim isleniyor...',🖼 Rasmlar: ${data.imageRequests}



export function t(lang: string, key: string, data?: any): string {    processingVideo: 'Video isleniyor...',

  const message = (messages.tr as any)[key];

      📅 Ro'yxatdan o'tgan: ${data.createdAt}`,

  if (!message) {

    console.warn(`Translation missing: ${key}`);    noErrors: 'Dilbilgisi hatasi bulunamadi! Metin dogru yazilmis.',

    return key;

  }        processing: '⏳ Tekshirilmoqda...',

  

  if (typeof message === 'function') {    result: (data: any) => `*Sonuc*    processingVoice: '🎤 Ovozli xabar qayta ishlanmoqda...',

    return message(data);

  }    processingImage: '🖼 Rasm qayta ishlanmoqda...',

  

  return message;${data.hasErrors ? `*${data.errorsCount} hata bulundu*` : '*Hata bulunamadi*'}    processingVideo: '🎬 Video qayta ishlanmoqda...',

}

    

${data.hasErrors ? `*Orijinal metin:*\n${data.original}\n\n*Duzeltilmis:*\n${data.corrected}` : `*Metin:*\n${data.original}`}`,    noErrors: '✅ Grammatik xatolar topilmadi! Matn to\'g\'ri yozilgan.',

    

    errorProcessing: 'Bir hata olustu. Lutfen tekrar deneyin.',    result: (data: any) => `📝 *Natija*

    errorVoice: 'Sesli mesaj islenirken hata olustu.',

    errorImage: 'Resim islenirken hata olustu.',${data.hasErrors ? `❌ *${data.errorsCount} ta xato topildi*` : '✅ *Xatolar topilmadi*'}

    errorVideo: 'Video islenirken hata olustu.',

    errorNoText: 'Resimde metin bulunamadi.',${data.hasErrors ? `*Asl matn:*\n${data.original}\n\n*To'g'rilangan:*\n${data.corrected}` : `*Matn:*\n${data.original}`}`,

    

    subscribeFirst: 'Botu kullanmak icin asagidaki kanallara abone olun:',    errorProcessing: '❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.',

    checkSubscription: 'Aboneligi kontrol et',    errorVoice: '❌ Ovozli xabarni qayta ishlashda xatolik.',

    subscriptionConfirmed: 'Abonelik onaylandi!',    errorImage: '❌ Rasmni qayta ishlashda xatolik.',

    notSubscribed: 'Henuz abone olmamissiniz!',    errorVideo: '❌ Videoni qayta ishlashda xatolik.',

    errorNoText: '❌ Rasmdan matn topilmadi.',

    // Admin    

    adminOnly: 'Bu komut sadece yoneticiler icindir.',    subscribeFirst: '⚠️ Botdan foydalanish uchun quyidagi kanallarga obuna bo\'ling:',

    adminPanel: `*Admin Paneli*    checkSubscription: '✅ Obunani tekshirish',

    subscriptionConfirmed: '✅ Obuna tasdiqlandi!',

Yonetici olarak giris yaptiniz!    notSubscribed: '❌ Siz hali obuna bo\'lmagansiz!',



*Mevcut komutlar:*    // Admin

- /admin - Admin paneli    adminOnly: '❌ Bu komanda faqat adminlar uchun.',

- /broadcast [mesaj] - Mesaj gonder    adminPanel: `🔐 *Admin Panel*

- /adminstats - Bot istatistikleri

- /channels - Kanal listesi`,Siz admin sifatida ro'yxatdan o'tgansiz!



    adminStats: (data: any) => `*Bot Istatistikleri**Mavjud komandalar:*

• /admin - Admin panel

*Kullanicilar:*• /broadcast [xabar] - Xabar yuborish

- Toplam: ${data.totalUsers}• /adminstats - Bot statistikasi

- Bugun: ${data.todayUsers}• /channels - Kanallar ro'yxati`,

- Aktif (7 gun): ${data.activeUsers}

    adminStats: (data: any) => `📊 *Bot Statistikasi*

*Istekler:*

- Toplam: ${data.totalRequests}👥 *Foydalanuvchilar:*

- Metin: ${data.textRequests}• Jami: ${data.totalUsers}

- Ses: ${data.voiceRequests}• Bugun: ${data.todayUsers}

- Resim: ${data.imageRequests}`,• Faol (7 kun): ${data.activeUsers}



    noChannels: 'Zorunlu kanal yok.',📝 *So'rovlar:*

    broadcastNoText: 'Mesaj metnini girin.\n\nOrnek: /broadcast Merhaba!',• Jami: ${data.totalRequests}

    broadcastSending: 'Mesaj gonderiliyor...',• Matn: ${data.textRequests}

    broadcastResult: (sent: number, failed: number) => `Mesaj gonderildi!\n\nGonderildi: ${sent}\nHata: ${failed}`,• Ovoz: ${data.voiceRequests}

  },• Rasm: ${data.imageRequests}`,

};

    noChannels: '📢 Majburiy kanallar yo\'q.',

// Varsayilan dil Turkce    broadcastNoText: '❌ Xabar matnini kiriting.\n\nMisol: /broadcast Salom!',

export type Language = 'tr';    broadcastSending: '📤 Xabar yuborilmoqda...',

export const defaultLanguage: Language = 'tr';    broadcastResult: (sent: number, failed: number) => `✅ Xabar yuborildi!\n\n📊 Yuborildi: ${sent}\n❌ Xatolik: ${failed}`,

  },

export function t(lang: string, key: string, data?: any): string {

  // Her zaman Turkce kullan  ru: {

  const message = (messages.tr as any)[key];    welcome: (name: string) => `Merhaba.....

  

  if (!message) {Men Hilal Edu turk tili markazining yordamchi assistant botiman!

    console.warn(`Translation missing: ${key}`);

    return key;Grammatik xatolarni tekshiraman.

  }

  *Quyidagilarni yuboring:*

  if (typeof message === 'function') {- Matn - grammatik xatolarni tekshiraman

    return message(data);- Ovozli xabar - matnga aylantirib tekshiraman

  }- Rasm - rasmdagi matnni oqib tekshiraman

  

  return message;*Til tanlash:* /language

}

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
