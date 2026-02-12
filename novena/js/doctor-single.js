// Doctor Single Page
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('id');
    
    if (doctorId) {
        await loadDoctorDetails(doctorId);
    }
});

async function loadDoctorDetails(id) {
    try {
        const doctor = await fetchAPI(`/Doctors/${id}`);
        
        // Update doctor image
        document.querySelector('.doctor-img-block img').src = `${API_URL}${doctor.imagePath}`;
        document.querySelector('.doctor-img-block img').alt = doctor.fullName;
        
        // Update doctor info
        document.querySelector('.info-block h4').textContent = doctor.fullName;
        document.querySelector('.info-block p').textContent = doctor.specialization;
        
        // Update description
        document.querySelector('.doctor-details h2').textContent = `Introducing ${doctor.fullName}`;
        document.querySelector('.doctor-details p').textContent = doctor.description;
        
        // Update page title
        document.querySelector('.page-title h1').textContent = doctor.fullName;
        
    } catch (error) {
        console.error('Error loading doctor details:', error);
    }
}