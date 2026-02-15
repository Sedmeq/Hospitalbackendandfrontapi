using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IDoctorRepository Doctors { get; }
        IPatientRepository Patients { get; }
        IDepartmentRepository Departments { get; }
        INurseRepository Nurses { get; }
        IPharmacistRepository Pharmacists { get; }
        IAccountantRepository Accountants { get; }
        IAppointmentRepository Appointments { get; }
        
        IPrescriptionRepository Prescriptions { get; }
        IPrescribedMedicineRepository PrescribedMedicines { get; }
        IMedicineInventoryRepository Medicines { get; }

        IStockAdjustmentRepository StockAdjustments { get; }
        IDispenseLogRepository DispenseLogs { get; }

        IServiceRepository Services { get; }
        ISliderRepository Sliders { get; }
        ITestimonialRepository Testimonials { get; }
        IBlogRepository Blogs { get; } // YENİ
        IBlogCommentRepository BlogComments { get; }
        IPartnersRepository Partners { get; }
        IAboutSectionRepository AboutSections { get; }
        IContactRepository Contacts { get; }
        IAboutRepository Abouts { get; }
        IContactInfoRepository ContactInfos { get; }
        IDoctorEducationRepository DoctorEducations { get; } // YENİ
        IDoctorSkillRepository DoctorSkills { get; }

        IDoctorScheduleRepository DoctorSchedules { get; } // YENİ

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
