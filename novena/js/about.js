// About Page
document.addEventListener('DOMContentLoaded', async function() {
    await loadAboutContent();
});

async function loadAboutContent() {
    try {
        const about = await fetchAPI('/Abouts');
        
        // Update title
        document.querySelector('.about-page h2').textContent = about.title;
        
        // Update description
        document.querySelector('.about-page p').textContent = about.description;
        
        // Update images (əgər varsa)
        if (about.imagePaths && about.imagePaths.length > 0) {
            const imgContainer = document.querySelector('.about-page .col-lg-8');
            about.imagePaths.forEach(imgPath => {
                const img = document.createElement('img');
                img.src = `${API_URL}${imgPath}`;
                img.className = 'img-fluid mb-3';
                img.alt = about.title;
                imgContainer.appendChild(img);
            });
        }
        
    } catch (error) {
        console.error('Error loading about content:', error);
    }
}