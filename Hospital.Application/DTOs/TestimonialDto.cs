using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.DTOs
{
    public class TestimonialDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;        // Amazing service!
        public string Comment { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }
}
