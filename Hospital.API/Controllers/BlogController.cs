using Hospital.Application.Features.Blog.Command;
using Hospital.Application.Features.Blog.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BlogController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAllBlogs")]
        public async Task<IActionResult> GetAllBlogs()
        {
            var blogs = await _mediator.Send(new GetAllBlogsQuery());
            return Ok(blogs);
        }

        [HttpGet("GetBlogById/{id}")]
        public async Task<IActionResult> GetBlogById(int id)
        {
            var blog = await _mediator.Send(new GetBlogByIdQuery { Id = id });
            return Ok(blog);
        }

        [HttpGet("GetBlogsByCategory/{category}")]
        public async Task<IActionResult> GetBlogsByCategory(string category)
        {
            var blogs = await _mediator.Send(new GetBlogsByCategoryQuery { Category = category });
            return Ok(blogs);
        }

        [HttpGet("SearchBlogs")]
        public async Task<IActionResult> SearchBlogs([FromQuery] string searchTerm)
        {
            var blogs = await _mediator.Send(new SearchBlogsQuery { SearchTerm = searchTerm });
            return Ok(blogs);
        }

        [HttpPost]
        [Route("CreateBlog")]
        public async Task<IActionResult> CreateBlog([FromForm] CreateBlogCommand command)
        {
            var newBlog = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetBlogById), new { id = newBlog.Id }, newBlog);
        }

        [HttpPut("UpdateBlog/{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromForm] UpdateBlogCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL and body do not match.");
            }

            var updatedBlog = await _mediator.Send(command);
            return Ok(updatedBlog);
        }

        [HttpDelete("DeleteBlog/{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var deletedBlog = await _mediator.Send(new DeleteBlogCommand { Id = id });
            return Ok($"Blog '{deletedBlog.Title}' was deleted successfully.");
        }

        [HttpPost("AddComment")]
        public async Task<IActionResult> AddComment([FromBody] AddCommentToBlogCommand command)
        {
            var comment = await _mediator.Send(command);
            return Ok(comment);
        }

        [HttpDelete("DeleteComment/{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            await _mediator.Send(new DeleteBlogCommentCommand { CommentId = commentId });
            return Ok("Comment deleted successfully.");
        }
    }
}
