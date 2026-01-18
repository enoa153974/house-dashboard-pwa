self.addEventListener('install', () => {
    console.log('Service Worker installed');
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    console.log('Service Worker activated');
});

self.addEventListener('fetch', () => {
    // 今は何もしない（後でキャッシュ対応する）
});
