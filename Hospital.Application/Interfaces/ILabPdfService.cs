using Hospital.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface ILabPdfService
    {
        /// <summary>
        /// Lab nəticəsi üçün PDF generasiya edir və wwwroot/lab-results/ qovluğuna saxlayır.
        /// Geri qaytarır: DB-yə yazılacaq relative path, məs. "lab-results/labresult_42_20250302143000.pdf"
        /// </summary>
        Task<string> GenerateLabResultPdfAsync(LabResultPdfModel model);

        /// <summary>
        /// DB-dəki relative path-i disk üzərindəki tam fiziki yola çevirir.
        /// Nümunə: "lab-results/labresult_42.pdf" → "/var/www/app/wwwroot/lab-results/labresult_42.pdf"
        /// </summary>
        string GetPdfFullPath(string relativePath);

        /// <summary>
        /// PDF faylını disk-dən silir. Path tapılmasa istisna atmır.
        /// </summary>
        void DeletePdfFile(string relativePath);
    }
}
