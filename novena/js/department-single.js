// Department Single Page
document.addEventListener('DOMContentLoaded', async function ()
{
    const urlParams = new URLSearchParams(window.location.search);
    const deptId = urlParams.get('id');

    if (deptId)
    {
        await loadDepartmentDetails(deptId);
    }
});

async function loadDepartmentDetails(id)
{
    try
    {
        const dept = await fetchAPI(`/Departments/${id}`);

        // Update department image
        document.querySelector('.department-img img').src = `${API_URL}${dept.imagePath}`;
        document.querySelector('.department-img img').alt = dept.name;

        // Update department content
        document.querySelector('.department-content h3').textContent = dept.name;
        document.querySelector('.department-content .lead').textContent = dept.shortDescription;
        document.querySelector('.department-content p').textContent = dept.description;

        // Update services list
        const servicesList = document.querySelector('.department-service');
        servicesList.innerHTML = '';
        dept.services.forEach(service =>
        {
            const li = document.createElement('li');
            li.innerHTML = `<i class="icofont-check mr-2"></i>${service}`;
            servicesList.appendChild(li);
        });

        // Update page title
        document.querySelector('.page-title h1').textContent = dept.name;

    } catch (error)
    {
        console.error('Error loading department details:', error);
    }
}