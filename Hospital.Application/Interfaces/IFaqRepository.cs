using Hospital.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface IFaqRepository : IGenericRepository<Faq>
    {
        Task<IEnumerable<Faq>> GetActiveFaqsAsync();
        Task<IEnumerable<Faq>> GetFaqsOrderedAsync();
    }
}
