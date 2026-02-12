using Hospital.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface IAboutSectionRepository : IGenericRepository<AboutSection>
    {
        Task<AboutSection?> GetActiveAboutSectionAsync(); // Aktiv haqqımızda məlumatını almaq üçün
    }
}
