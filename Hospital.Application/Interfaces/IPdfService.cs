using Hospital.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface IPdfService
    {
        Task<string> GeneratePrescriptionPdfAsync(PrescriptionPdfModel model);
        // Returns: relative path, e.g. "prescriptions/prescription_42.pdf"
    }
}
