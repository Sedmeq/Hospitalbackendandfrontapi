// Index Page - Services section yükləmək üçün
document.addEventListener('DOMContentLoaded', async function() {
    await loadHomeServices();
});

async function loadHomeServices() {
    try {
        const services = await fetchAPI('/Services');
        const container = document.querySelector('.service.gray-bg .row');
        container.innerHTML = '';
        
        // İlk 6 xidməti göstər
        services.slice(0, 6).forEach(service => {
            const serviceCard = `
                <div class="col-lg-4 col-md-6 col-sm-6">
                    <div class="service-item mb-4">
                        <div class="icon d-flex align-items-center">
                            <i class="${service.iconClass} text-lg"></i>
                            <h4 class="mt-3 mb-3">${service.title}</h4>
                        </div>
                        <div class="content">
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