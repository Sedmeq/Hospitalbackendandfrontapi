using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.LabResult.Command
{
    public class CreateLabResultCommand : IRequest<LabResultDto>
    {
        public string Title { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime ResultDate { get; set; } = DateTime.UtcNow;

        /// <summary>Appointment-ə bağlı olarsa doldurulur (optional)</summary>
        public int? AppointmentId { get; set; }

        /// <summary>Doctor panel-dən birbaşa patient seçirsə istifadə edilir</summary>
        public int PatientId { get; set; }

        public List<LabResultItemInput> Items { get; set; } = new();
    }

    public class LabResultItemInput
    {
        public string TestName { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public string ReferenceRange { get; set; } = string.Empty;
        /// <summary>Normal | High | Low | Critical</summary>
        public string Status { get; set; } = "Normal";
    }
}
