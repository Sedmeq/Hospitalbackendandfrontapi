using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class Notification
    {
        public int Id { get; set; }

        public required string ApplicationUserId { get; set; }

        public required string Type { get; set; } // "appointment", "lab", "prescription"
        public required string Title { get; set; }
        public required string Message { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public ApplicationUser? ApplicationUser { get; set; }
    }
}
