using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using Hospital.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Infrastructure.Repositories
{
    public class PartnersRepository : GenericRepository<Partners>, IPartnersRepository
    {
        public PartnersRepository(AppDbContext context) : base(context)
        {
        }
    }
}
