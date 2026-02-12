using Hospital.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface IDoctorSkillRepository : IGenericRepository<DoctorSkill>
    {
        Task<IEnumerable<DoctorSkill>> GetSkillsByDoctorIdAsync(int doctorId);
        Task<IEnumerable<DoctorSkill>> GetSkillsByCategoryAsync(int doctorId, string category);
    }
}
