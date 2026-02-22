using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class Faq
    {
        public int Id { get; set; }

        public string Question { get; set; }
        public string Answer { get; set; }

        public bool IsActive { get; set; } = true;

        public int Order { get; set; }  // sıralama üçün

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
