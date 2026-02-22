using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class PrescriptionPdfModel
    {
        public int PrescriptionId { get; set; }
        public DateTime PrescriptionDate { get; set; }
        public string PatientName { get; set; }
        public string DoctorName { get; set; }
        public string DepartmentName { get; set; }
        public List<PrescribedMedicineItem> Medicines { get; set; } = new();
    }

    public class PrescribedMedicineItem
    {
        public string MedicineName { get; set; }
        public string Instructions { get; set; }
        public int Quantity { get; set; }
    }
}
