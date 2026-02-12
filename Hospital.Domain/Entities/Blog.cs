using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int CommentCount { get; set; }
        public string Category { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; } = DateTime.Now;
        public virtual ICollection<BlogComment> Comments { get; set; } = new List<BlogComment>();
    }
}
