using Hospital.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Infrastructure.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;
        private const string DoctorsFolder = "doctors";
        private const string DepartmentsFolder = "departments"; // YENİ
        private const string ServicesFolder = "services"; // YENİ
        private const string SlidersFolder = "sliders"; // YENİ
        private const string TestimonialsFolder = "testimonials"; // YENİ
        private const string BlogsFolder = "blogs";
        private const string PartnersFolder = "partners";
        private const string AboutSectionFolder = "aboutSection";
        private const string AboutFolder = "about";
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
        private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        // Doctor metodları (əvvəlki kodlar...)
        public async Task<string> SaveDoctorImageAsync(IFormFile file, int doctorId)
        {
            return await SaveImageAsync(file, DoctorsFolder, $"doctor_{doctorId}");
        }

        public async Task<bool> DeleteDoctorImageAsync(string imagePath)
        {
            return await DeleteImageAsync(imagePath);
        }

        public string GetDoctorImageUrl(string imagePath)
        {
            return GetImageUrl(imagePath);
        }

        // Department metodları - YENİ
        public async Task<string> SaveDepartmentImageAsync(IFormFile file, int departmentId)
        {
            return await SaveImageAsync(file, DepartmentsFolder, $"department_{departmentId}");
        }

        public async Task<bool> DeleteDepartmentImageAsync(string imagePath)
        {
            return await DeleteImageAsync(imagePath);
        }

        public string GetDepartmentImageUrl(string imagePath)
        {
            return GetImageUrl(imagePath);
        }

        // Service metodları - YENİ
        public async Task<string> SaveServiceImageAsync(IFormFile file, int serviceId)
        {
            return await SaveImageAsync(file, ServicesFolder, $"service_{serviceId}");
        }

        public async Task<bool> DeleteServiceImageAsync(string imagePath)
        {
            return await DeleteImageAsync(imagePath);
        }

        public string GetServiceImageUrl(string imagePath)
        {
            return GetImageUrl(imagePath);
        }

        // Slider metodları - YENİ
        public async Task<string> SaveSliderImageAsync(IFormFile file, int sliderId)
        {
            return await SaveImageAsync(file, SlidersFolder, $"slider_{sliderId}");
        }
        public async Task<bool> DeleteSliderImageAsync(string imagePath)
        {
            return await DeleteImageAsync(imagePath);
        }
        public string GetSliderImageUrl(string imagePath)
        {
            return GetImageUrl(imagePath);
        }

        // Testimonial metodları - YENİ
        public async Task<string> SaveTestimonialImageAsync(IFormFile file, int testimonialId)
        {
            return await SaveImageAsync(file, TestimonialsFolder, $"testimonial_{testimonialId}");
        }
        public async Task<bool> DeleteTestimonialImageAsync(string imagePath)
        {
            return await DeleteImageAsync(imagePath);
        }
        public string GetTestimonialImageUrl(string imagePath)
        {
            return GetImageUrl(imagePath);
        }

        // Blog metodları - YENİ
        public async Task<string> SaveBlogImageAsync(IFormFile file, int blogId)
        {
            return await SaveImageAsync(file, BlogsFolder, $"blog_{blogId}");
        }

        public async Task<bool> DeleteBlogImageAsync(string imagePath)
        {
            return await DeleteImageAsync(imagePath);
        }

        public string GetBlogImageUrl(string imagePath)
        {
            return GetImageUrl(imagePath);
        }

        // Partner metodları - YENİ
        public async Task<string> SavePartnerImageAsync(IFormFile file, int partnerId)
        {
            return await SaveImageAsync(file, PartnersFolder, $"partner_{partnerId}");
        }
        public async Task<bool> DeletePartnerImageAsync(string imagePath)
        {
            return await DeleteImageAsync(imagePath);
        }
        public string GetPartnerImageUrl(string imagePath)
        {
            return GetImageUrl(imagePath);
        }

        // AboutSection metodları - YENİ
        public async Task<string> SaveAboutSectionImageAsync(IFormFile file, int aboutSectionId, string imageNumber)
        {
            return await SaveImageAsync(file, AboutSectionFolder, $"aboutsection_{aboutSectionId}_{imageNumber}");
        }

        public async Task<bool> DeleteAboutSectionImageAsync(string imagePath)
        {
            return await DeleteImageAsync(imagePath);
        }

        public string GetAboutSectionImageUrl(string imagePath)
        {
            return GetImageUrl(imagePath);
        }

        // About metodları - YENİ
        public async Task<string> SaveAboutImageAsync(IFormFile file, int aboutId)
        {
            return await SaveImageAsync(file, AboutFolder, $"about_{aboutId}");
        }

        public async Task<bool> DeleteAboutImageAsync(string imagePath)
        {
            return await DeleteImageAsync(imagePath);
        }

        public string GetAboutImageUrl(string imagePath)
        {
            return GetImageUrl(imagePath);
        }

        // Ümumi metodlar (kod təkrarını azaltmaq üçün)
        private async Task<string> SaveImageAsync(IFormFile file, string folderName, string filePrefix)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            // Fayl ölçüsünü yoxla
            if (file.Length > MaxFileSize)
                throw new ArgumentException($"File size cannot exceed {MaxFileSize / 1024 / 1024} MB");

            // Fayl uzantısını yoxla
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
                throw new ArgumentException($"File type not allowed. Allowed types: {string.Join(", ", _allowedExtensions)}");

            // wwwroot/images/{folderName} folder yaradırıq
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "images", folderName);
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Unikal fayl adı yaradırıq
            var uniqueFileName = $"{filePrefix}_{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Faylı saxlayırıq
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // Nisbi yolu qaytarırıq
            return Path.Combine("images", folderName, uniqueFileName).Replace("\\", "/");
        }

        private async Task<bool> DeleteImageAsync(string imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
                return false;

            try
            {
                var fullPath = Path.Combine(_environment.WebRootPath, imagePath);

                if (File.Exists(fullPath))
                {
                    await Task.Run(() => File.Delete(fullPath));
                    return true;
                }

                return false;
            }
            catch
            {
                return false;
            }
        }

        private string GetImageUrl(string imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
                return string.Empty;

            return $"/{imagePath}";
        }
    }
}
