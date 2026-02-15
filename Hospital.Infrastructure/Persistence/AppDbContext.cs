using Hospital.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Hospital.Infrastructure.Persistence
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {

        public DbSet<Doctor> Patient { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Nurse> Nurses { get; set; }
        public DbSet<Pharmacist> pharmacists { get; set; }
        public DbSet<Accountant> Accountants { get; set; }

        public DbSet<Appointment> Appointments { get; set; }

        public DbSet<MedicineInventory> MedicineInventories { get; set; }
        public DbSet<StockAdjustment> StockAdjustments { get; set; }
        public DbSet<DispenseLog> DispenseLogs { get; set; }

        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<PrescribedMedicine> prescribedMedicines { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Slider> Sliders { get; set; }
        public DbSet<Testimonial> Testimonials { get; set; }
        public DbSet<Blog> Blogs { get; set; } // YENİ
        public DbSet<BlogComment> BlogComments { get; set; }
        public DbSet<Partners> Partners { get; set; }
        public DbSet<AboutSection> AboutSections { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<About> Abouts { get; set; }
        public DbSet<ContactInfo> ContactInfos { get; set; }

        public DbSet<DoctorEducation> DoctorEducations { get; set; } // YENİ
        public DbSet<DoctorSkill> DoctorSkills { get; set; }
        public DbSet<DoctorSchedule> DoctorSchedules { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {

            base.OnModelCreating(builder);

            builder.Entity<Department>()
        .Property(d => d.Services)
        .HasConversion(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
            v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new List<string>()
        );

            builder.Entity<BlogComment>()
            .HasOne(bc => bc.Blog)
            .WithMany(b => b.Comments)
            .HasForeignKey(bc => bc.BlogId)
            .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Prescription>()
                .HasOne(p => p.Patient)
                .WithMany(p => p.Prescriptions)
                .HasForeignKey(p => p.PatientId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Prescription>()
                .HasOne(p => p.Doctor)
                .WithMany(p => p.Prescriptions)
                .HasForeignKey(p => p.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<PrescribedMedicine>()
                   .HasOne(p => p.Prescription)
                   .WithMany(p => p.PrescribedMedicines)
                   .HasForeignKey(p => p.PrescriptionId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<DispenseLog>()
          .HasOne(dl => dl.Pharmacist)
          .WithMany(p => p.DispenseLogs)
          .HasForeignKey(dl => dl.PharmacistId)
          .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<StockAdjustment>()
                .HasOne(sa => sa.Pharmacist)
                .WithMany(p => p.StockAdjustments)
                .HasForeignKey(sa => sa.PharmacistId)
                .OnDelete(DeleteBehavior.Restrict);

            // builder.Entity<Appointment>()
            //.HasOne(a => a.doctor)
            //.WithMany(d => d.Appointments)
            //.HasForeignKey(a => a.DoctorId)
            //.OnDelete(DeleteBehavior.Restrict); 

            // builder.Entity<Appointment>()
            //     .HasOne(a => a.patient)
            //     .WithMany(p => p.Appointments)
            //     .HasForeignKey(a => a.PatientId)
            //     .OnDelete(DeleteBehavior.Restrict);

            // One-to-One: ApplicationUser <-> Doctor
            builder.Entity<ApplicationUser>()
                .HasOne(u => u.DoctorProfile)
                .WithOne(d => d.ApplicationUser)
                .HasForeignKey<Doctor>(d => d.ApplicationUserId);

            // One-to-One: ApplicationUser <-> Patient
            builder.Entity<ApplicationUser>()
                .HasOne(u => u.PatientProfile)
                .WithOne(p => p.ApplicationUser)
                .HasForeignKey<Patient>(p => p.ApplicationUserId);

            // One-to-One: ApplicationUser <-> Nurse
            builder.Entity<ApplicationUser>().
                HasOne(u => u.NurseProfile)
                .WithOne(n => n.ApplicationUser)
                .HasForeignKey<Nurse>(n => n.ApplicationUserId);

            // One-to-One: ApplicationUser <-> Pharmacist
            builder.Entity<ApplicationUser>().
                HasOne(u => u.PharmacistProfile).
                WithOne(p => p.ApplicationUser)
                .HasForeignKey<Pharmacist>(p => p.ApplicationUserId);
            // One-to-One: ApplicationUser <-> Accountant
            builder.Entity<ApplicationUser>()
                .HasOne(u => u.AccountantProfile)
                .WithOne(a => a.ApplicationUser)
                .HasForeignKey<Accountant>(a => a.ApplicationUserId);

            //builder.Entity<Appointment>()
            //   .HasOne(a => a.Nurse)
            //   .WithMany(n => n.Appointments)
            //   .HasForeignKey(a => a.NurseId)
            //   .OnDelete(DeleteBehavior.SetNull);


            builder.Entity<Appointment>()
    .HasOne(a => a.doctor)
    .WithMany(d => d.Appointments)
    .HasForeignKey(a => a.DoctorId)
    .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Appointment>()
                .HasOne(a => a.patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false); // YENİ - nullable

            builder.Entity<Appointment>()
                .HasOne(a => a.Nurse)
                .WithMany(n => n.Appointments)
                .HasForeignKey(a => a.NurseId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);

            builder.Entity<Appointment>()
                .HasOne(a => a.Department)
                .WithMany()
                .HasForeignKey(a => a.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict); // YENİ




            builder.Entity<DoctorEducation>()
           .HasOne(de => de.Doctor)
           .WithMany(d => d.Educations)
           .HasForeignKey(de => de.DoctorId)
           .OnDelete(DeleteBehavior.Cascade);

            // DoctorSkill konfiqurasiyası - YENİ
            builder.Entity<DoctorSkill>()
                .HasOne(ds => ds.Doctor)
                .WithMany(d => d.Skills)
                .HasForeignKey(ds => ds.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            // YENİ: DoctorSchedule konfiqurasiyası
            builder.Entity<DoctorSchedule>()
                .HasOne(ds => ds.Doctor)
                .WithMany(d => d.Schedules)
                .HasForeignKey(ds => ds.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

}
