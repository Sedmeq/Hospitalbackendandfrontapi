// Doctors page
document.addEventListener('DOMContentLoaded', async function() {
    await loadDepartments();
    await loadDoctors();
    
    // Department filter
    document.querySelectorAll('input[name="shuffle-filter"]').forEach(input => {
        input.addEventListener('change', async function() {
            const departmentId = this.value === 'all' ? null : parseInt(this.value.replace('cat', ''));
            await loadDoctors(departmentId);
        });
    });
});

async function loadDepartments() {
    try {
        const departments = await fetchAPI('/Departments');
        const filterContainer = document.querySelector('.btn-group');
        
        // Clear existing filters except "All"
        const allButton = filterContainer.querySelector('label');
        filterContainer.innerHTML = '';
        filterContainer.appendChild(allButton);
        
        // Add department filters
        departments.forEach((dept, index) => {
            const label = document.createElement('label');
            label.className = 'btn';
            label.innerHTML = `
                <input type="radio" name="shuffle-filter" value="cat${dept.id}" />${dept.name}
            `;
            filterContainer.appendChild(label);
        });
    } catch (error) {
        console.error('Error loading departments:', error);
    }
}

async function loadDoctors(departmentId = null) {
    try {
        const endpoint = departmentId ? `/Doctors?departmentId=${departmentId}` : '/Doctors';
        const doctors = await fetchAPI(endpoint);
        
        const container = document.querySelector('.shuffle-wrapper');
        container.innerHTML = '';
        
        doctors.forEach(doctor => {
            const doctorCard = `
                <div class="col-lg-3 col-sm-6 col-md-6 mb-4 shuffle-item" data-groups='["cat${doctor.departmentId}"]'>
                    <div class="position-relative doctor-inner-box">
                        <div class="doctor-profile">
                            <div class="doctor-img">
                                <img src="${API_URL}${doctor.imagePath}" alt="${doctor.fullName}" class="img-fluid w-100">
                            </div>
                        </div>
                        <div class="content mt-3">
                            <h4 class="mb-0"><a href="doctor-single.html?id=${doctor.id}">${doctor.fullName}</a></h4>
                            <p>${doctor.specialization}</p>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += doctorCard;
        });
    } catch (error) {
        console.error('Error loading doctors:', error);
    }
}