using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Application.DTOs;
using MediatR;

namespace Hospital.Application.Features.Prescription.Command
{
    public class CreatePrescriptionCommand : IRequest<CreatePrescriptionResult>
    {
        public int AppointmentId { get; set; }
        public List<PrescribedMedicineInput> Medicines { get; set; } = new();
    }

    public class PrescribedMedicineInput
    {
        public string MedicineName { get; set; }
        public string Instructions { get; set; }
        public int Quantity { get; set; }
    }

    public class CreatePrescriptionResult
    {
        public int PrescriptionId { get; set; }
        public string DownloadUrl { get; set; }
    }
}
