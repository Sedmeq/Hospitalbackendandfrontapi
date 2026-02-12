// Blog Single Page
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    
    if (blogId) {
        await loadBlogDetails(blogId);
        setupCommentForm(blogId);
    }
});

async function loadBlogDetails(id) {
    try {
        const blog = await fetchAPI(`/Blogs/${id}`);
        
        // Update blog image
        document.querySelector('.single-blog-item img').src = `${API_URL}${blog.imagePath}`;
        
        // Update blog content
        document.querySelector('.blog-item-content h2 a').textContent = blog.title;
        document.querySelector('.blog-item-content .lead').textContent = blog.content.substring(0, 200);
        document.querySelector('.blog-item-content p').textContent = blog.content;
        
        // Update meta
        document.querySelector('.blog-item-meta .text-muted').innerHTML = 
            `<i class="icofont-comment mr-2"></i>${blog.commentCount} Comments`;
        document.querySelector('.blog-item-meta .text-black').innerHTML = 
            `<i class="icofont-calendar mr-2"></i> ${new Date(blog.publishedDate).toLocaleDateString()}`;
        
        // Load comments
        loadComments(blog.comments);
        
    } catch (error) {
        console.error('Error loading blog details:', error);
    }
}

function loadComments(comments) {
    const commentList = document.querySelector('.comment-tree');
    commentList.innerHTML = '';
    
    comments.forEach(comment => {
        const commentHTML = `
            <li class="mb-5">
                <div class="comment-area-box">
                    <div class="comment-thumb float-left">
                        <img alt="" src="images/blog/testimonial1.jpg" class="img-fluid">
                    </div>
                    <div class="comment-info">
                        <h5 class="mb-1">${comment.authorName}</h5>
                        <span class="date-comm">Posted ${new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="comment-content mt-3">
                        <p>${comment.content}</p>
                    </div>
                </div>
            </li>
        `;
        commentList.innerHTML += commentHTML;
    });
}

function setupCommentForm(blogId) {
    const form = document.getElementById('comment-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const comment = {
            authorName: document.getElementById('name').value,
            content: document.getElementById('comment').value
        };
        
        try {
            await fetchAPI(`/Blogs/${blogId}/comments`, {
                method: 'POST',
                body: JSON.stringify(comment)
            });
            
            // Reload page to show new comment
            window.location.reload();
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Error posting comment. Please try again.');
        }
    });
}