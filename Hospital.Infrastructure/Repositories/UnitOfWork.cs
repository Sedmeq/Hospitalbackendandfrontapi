using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Application.Interfaces;
using Hospital.Infrastructure.Persistence;

namespace Hospital.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IDoctorRepository Doctors { get; private set; }
        public IPatientRepository Patients { get; private set; }
        public IDepartmentRepository Departments { get; private set; }
        public INurseRepository Nurses { get; private set; }

        public IPharmacistRepository Pharmacists { get; private set; }
        public IAccountantRepository Accountants { get; private set; }

        public IAppointmentRepository Appointments { get; private set; }

        public IMedicineInventoryRepository Medicines { get; private set; }

        public IStockAdjustmentRepository StockAdjustments { get; private set; }
        public IDispenseLogRepository DispenseLogs { get; private set; }

        public IPrescriptionRepository Prescriptions { get; private set; }
        public IPrescribedMedicineRepository PrescribedMedicines { get; private set; }


        public IServiceRepository Services { get; private set; }
        public ISliderRepository Sliders { get; private set; }
        public ITestimonialRepository Testimonials { get; private set; }
        public IBlogRepository Blogs { get; private set; } // YENİ
        public IBlogCommentRepository BlogComments { get; private set; }
        public IPartnersRepository Partners { get; private set; }
        public IAboutSectionRepository AboutSections { get; private set; }
        public IContactRepository Contacts { get; private set; }
        public IAboutRepository Abouts { get; private set; }
        public IContactInfoRepository ContactInfos { get; private set; }
        public IDoctorEducationRepository DoctorEducations { get; private set; } // YENİ
        public IDoctorSkillRepository DoctorSkills { get; private set; }

        public UnitOfWork(
        AppDbContext context,
        IDoctorRepository doctorRepository,
        IPatientRepository patientRepository,
        IDepartmentRepository departmentRepository,
        INurseRepository nurseRepository,
        IPharmacistRepository pharmacistRepository,
        IAccountantRepository accountantRepository,
        IAppointmentRepository appointments,
        IMedicineInventoryRepository medicines,
        IStockAdjustmentRepository stockAdjustments,
        IDispenseLogRepository dispenseLogs,
        IPrescriptionRepository prescriptions,
        IPrescribedMedicineRepository prescribedMedicines,
        IServiceRepository services,
        ISliderRepository sliders,
        ITestimonialRepository testimonials,
        IBlogRepository blogs, // YENİ
        IBlogCommentRepository blogComments,
        IPartnersRepository partners,
         IAboutSectionRepository aboutSections,
         IContactRepository contacts,
            IAboutRepository abouts,
            IContactInfoRepository contactInfos,
            IDoctorEducationRepository doctorEducations, // YENİ
        IDoctorSkillRepository doctorSkills
        )
        {
            _context = context;


            Doctors = doctorRepository;
            Patients = patientRepository;
            Departments = departmentRepository;
            Nurses = nurseRepository;
            Pharmacists = pharmacistRepository;
            Accountants = accountantRepository;
            Appointments = appointments;
            Medicines = medicines;
            StockAdjustments = stockAdjustments;
            DispenseLogs = dispenseLogs;
            Prescriptions = prescriptions;
            PrescribedMedicines = prescribedMedicines;
            Services = services;
            Sliders = sliders;
            Testimonials = testimonials;
            Blogs = blogs; // YENİ
            BlogComments = blogComments;
            Partners = partners;
            AboutSections = aboutSections;
            Contacts = contacts;
            Abouts = abouts;
            ContactInfos = contactInfos;
            DoctorEducations = doctorEducations; // YENİ
            DoctorSkills = doctorSkills;
        }



        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return _context.SaveChangesAsync(cancellationToken);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
