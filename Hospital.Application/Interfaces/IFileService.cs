using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveDoctorImageAsync(IFormFile file, int doctorId);
        Task<bool> DeleteDoctorImageAsync(string imagePath);
        string GetDoctorImageUrl(string imagePath);

        Task<string> SaveDepartmentImageAsync(IFormFile file, int departmentId);
        Task<bool> DeleteDepartmentImageAsync(string imagePath);
        string GetDepartmentImageUrl(string imagePath);

        // Service - YENİ
        Task<string> SaveServiceImageAsync(IFormFile file, int serviceId);
        Task<bool> DeleteServiceImageAsync(string imagePath);
        string GetServiceImageUrl(string imagePath);

        // Slider - YENİ
        Task<string> SaveSliderImageAsync(IFormFile file, int sliderId);
        Task<bool> DeleteSliderImageAsync(string imagePath);
        string GetSliderImageUrl(string imagePath);

        // Testimonial - YENİ
        Task<string> SaveTestimonialImageAsync(IFormFile file, int testimonialId);
            Task<bool> DeleteTestimonialImageAsync(string imagePath);
        string GetTestimonialImageUrl(string imagePath);

        // Blog - YENİ
        Task<string> SaveBlogImageAsync(IFormFile file, int blogId);
        Task<bool> DeleteBlogImageAsync(string imagePath);
        string GetBlogImageUrl(string imagePath);

        //Partners  - YENİ
        Task<string> SavePartnerImageAsync(IFormFile file, int partnerId);
        Task<bool> DeletePartnerImageAsync(string imagePath);
        string GetPartnerImageUrl(string imagePath);

        // AboutSection - YENİ
        Task<string> SaveAboutSectionImageAsync(IFormFile file, int aboutSectionId, string imageNumber);
        Task<bool> DeleteAboutSectionImageAsync(string imagePath);
        string GetAboutSectionImageUrl(string imagePath);

        // About - YENİ
        Task<string> SaveAboutImageAsync(IFormFile file, int aboutId);
        Task<bool> DeleteAboutImageAsync(string imagePath);
        string GetAboutImageUrl(string imagePath);

        // ContactInfo - YENİ
        Task<string> SaveContactInfoImageAsync(IFormFile file, int contactInfoId);
        Task<bool> DeleteContactInfoImageAsync(string imagePath);
        string GetContactInfoImageUrl(string imagePath);


        // Hospital.Application/Interfaces/IFileService.cs
        Task<string> SavePatientImageAsync(IFormFile file, int patientId);
        Task<bool> DeletePatientImageAsync(string imagePath);
        string GetPatientImageUrl(string imagePath);
    }
}
