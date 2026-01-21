export type Language = 'tr';
export const defaultLanguage: Language = 'tr';

const messages = {
  tr: {
    welcome: (name: string) =>
      'Merhaba ' + name + '! Ben Hilal Edu Turk Dili Merkezi yardimci asistaniyim. Metin gonderin, kontrol ederim.',

    help: '*Yardim*\\n- Metin mesaji\\n- Sesli mesaj\\n- Resim\\n\\n/start - Baslat\\n/help - Yardim\\n/stats - Istatistikler',

    processing: 'Kontrol ediliyor...',
    processingVoice: 'Sesli mesaj isleniyor...',
    processingImage: 'Resim isleniyor...',
    processingVideo: 'Video isleniyor...',
    noErrors: 'Dilbilgisi hatasi bulunamadi! Metin dogru.',

    result: (data: any) => {
      if (data.hasErrors) {
        return '*Orijinal:*\\n' + data.original + '\\n\\n*Duzeltilmis:*\\n' + data.corrected;
      }
      return '*Metin:*\\n' + data.original;
    },

    stats: (data: any) =>
      '*Istatistikler*\\nMetin: ' + data.textRequests + '\\nSes: ' + data.voiceRequests + '\\nResim: ' + data.imageRequests,

    errorProcessing: 'Hata olustu. Tekrar deneyin.',
    errorVoice: 'Sesli mesaj isleme hatasi.',
    errorImage: 'Resim isleme hatasi.',
    errorVideo: 'Video isleme hatasi.',
    errorNoText: 'Resimde metin bulunamadi.',

    subscribeFirst: 'Kanallara abone olun:',
    checkSubscription: 'Aboneligi kontrol et',
    subscriptionConfirmed: 'Abonelik onaylandi!',
    notSubscribed: 'Henuz abone olmamissiniz!',

    adminOnly: 'Bu komut yoneticiler icindir.',
    adminPanel: '*Admin Paneli*\\n/admin\\n/adminstats\\n/broadcast [mesaj]\\n/channels',

    adminStats: (data: any) =>
      '*Istatistikler*\\nKullanicilar: ' + data.totalUsers + '\\nBugun: ' + data.todayUsers + '\\nAktif: ' + data.activeUsers + '\\nToplam istek: ' + data.totalRequests,

    noChannels: 'Zorunlu kanal yok.',
    broadcastNoText: 'Mesaj girin: /broadcast Merhaba!',
    broadcastSending: 'Gonderiliyor...',
    broadcastResult: (sent: number, failed: number) =>
      'Gonderildi: ' + sent + ', Hata: ' + failed,
  },
};

export function t(lang: string, key: string, ...args: any[]): string {
  const msg = (messages.tr as any)[key];
  if (!msg) return key;
  if (typeof msg === 'function') return msg(...args);
  return msg;
}
