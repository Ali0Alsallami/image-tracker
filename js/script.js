async function uploadImage() {
    const imageInput = document.getElementById('imageInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');
    const googleLink = document.getElementById('googleLink');
    const yandexLink = document.getElementById('yandexLink');
    const bingLink = document.getElementById('bingLink');

    if (!imageInput.files[0]) {
        alert('يرجى اختيار صورة');
        return;
    }

    searchButton.textContent = 'جارٍ الرفع...';
    searchButton.disabled = true;

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    try {
        // رفع الصورة إلى imgbb.com
        const response = await fetch('https://api.imgbb.com/1/upload?key=3a315a441adacca4b8ecebf95d38e039', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (!data.success) {
            throw new Error('فشل رفع الصورة');
        }
        const imageUrl = data.data.url;

        // إنشاء روابط البحث
        googleLink.href = `https://images.google.com/searchbyimage?image_url=${encodeURIComponent(imageUrl)}`;
        yandexLink.href = `https://yandex.com/images/search?url=${encodeURIComponent(imageUrl)}&rpt=imageview`;
        bingLink.href = `https://www.bing.com/images/search?view=detailv2&mediaurl=${encodeURIComponent(imageUrl)}`;
        resultsDiv.classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ أثناء رفع الصورة');
    }

    searchButton.textContent = 'بحث عن الصورة';
    searchButton.disabled = false;
}

// معاينة الصورة
document.getElementById('imageInput').addEventListener('change', () => {
    const preview = document.createElement('img');
    preview.src = URL.createObjectURL(document.getElementById('imageInput').files[0]);
    preview.className = 'w-full h-40 object-cover mb-4';
    const parent = document.getElementById('imageInput').parentNode;
    parent.insertBefore(preview, document.getElementById('imageInput').nextSibling);
});
