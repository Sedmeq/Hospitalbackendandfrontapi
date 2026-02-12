// Department Page
document.addEventListener('DOMContentLoaded', async function() {
    await loadDepartments();
});

async function loadDepartments() {
    try {
        const departments = await fetchAPI('/Departments');
        const container = document.querySelector('.service-2 .row');
        container.innerHTML = '';
        
        departments.forEach(dept => {
            const deptCard = `
                <div class="col-lg-4 col-md-6">
                    <div class="department-block mb-5">
                        <img src="${API_URL}${dept.imagePath}" alt="${dept.name}" class="img-fluid w-100">
                        <div class="content">
                            <h4 class="mt-4 mb-2 title-color">${dept.name}</h4>
                            <p class="mb-4">${dept.shortDescription}</p>
                            <a href="department-single.html?id=${dept.id}" class="read-more">
                                Learn More <i class="icofont-simple-right ml-2"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += deptCard;
        });
    } catch (error) {
        console.error('Error loading departments:', error);
    }
}