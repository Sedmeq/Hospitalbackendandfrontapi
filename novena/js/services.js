// Services Page
document.addEventListener('DOMContentLoaded', async function() {
    await loadServices();
});

async function loadServices() {
    try {
        const services = await fetchAPI('/Services');
        const container = document.querySelector('.service-2 .row');
        container.innerHTML = '';
        
        services.forEach(service => {
            const serviceCard = `
                <div class="col-lg-4 col-md-6 col-sm-6">
                    <div class="service-block mb-5">
                        <img src="${API_URL}${service.imagePath}" alt="${service.title}" class="img-fluid">
                        <div class="content">
                            <h4 class="mt-4 mb-2 title-color">${service.title}</h4>
                            <p class="mb-4">${service.description}</p>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += serviceCard;
        });
    } catch (error) {
        console.error('Error loading services:', error);
    }
}