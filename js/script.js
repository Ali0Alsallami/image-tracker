function uploadImage() {
    const imageInput = document.getElementById('imageInput');
    const searchButton = document.getElementById('searchButton');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
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
    progressContainer.classList.remove('hidden');
    progressBar.style.width = '0%';
    progressText.textContent = 'جارٍ الرفع: 0%';

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.imgbb.com/1/upload?key=3a315a441adacca4b8ecebf95d38e039', true);

    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            progressBar.style.width = percentComplete + '%';
            progressText.textContent = `جارٍ الرفع: ${Math.round(percentComplete)}%`;
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                if (!data.success || !data.data || !data.data.url) {
                    alert('فشل رفع الصورة: استجابة غير صالحة');
                    resetUpload();
                    return;
                }
                const imageUrl = data.data.url;

                googleLink.href = `https://images.google.com/searchbyimage?image_url=${encodeURIComponent(imageUrl)}`;
                yandexLink.href = `https://yandex.com/images/search?url=${encodeURIComponent(imageUrl)}&rpt=imageview`;
                bingLink.href = `https://www.bing.com/images/search?view=detailv2&mediaurl=${encodeURIComponent(imageUrl)}`;
                resultsDiv.classList.remove('hidden');
            } catch (error) {
                console.error('Error parsing response:', error);
                alert('خطأ في معالجة استجابة الرفع');
            }
        } else {
            alert(`خطأ في الرفع: حالة ${xhr.status}`);
        }
        resetUpload();
    };

    xhr.onerror = function () {
        alert('حدث خطأ أثناء رفع الصورة');
        resetUpload();
    };

    xhr.send(formData);

    function resetUpload() {
        searchButton.textContent = 'رفع وبحث عن الصورة';
        searchButton.innerHTML = `
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            رفع وبحث عن الصورة
        `;
        searchButton.disabled = false;
        progressContainer.classList.add('hidden');
    }
}

// معاينة الصورة
document.getElementById('imageInput').addEventListener('change', () => {
    const preview = document.getElementById('preview');
    preview.innerHTML = '';
    if (document.getElementById('imageInput').files[0]) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(document.getElementById('imageInput').files[0]);
        img.className = 'w-full h-auto object-cover';
        preview.appendChild(img);
    }
});
