// Blog Page
document.addEventListener('DOMContentLoaded', async function() {
    await loadBlogs();
});

async function loadBlogs() {
    try {
        const blogs = await fetchAPI('/Blogs');
        const container = document.querySelector('.row > .col-lg-8 > .row');
        container.innerHTML = '';
        
        blogs.forEach(blog => {
            const blogCard = `
                <div class="col-lg-12 col-md-12 mb-5">
                    <div class="blog-item">
                        <div class="blog-thumb">
                            <img src="${API_URL}${blog.imagePath}" alt="${blog.title}" class="img-fluid">
                        </div>
                        <div class="blog-item-content">
                            <div class="blog-item-meta mb-3 mt-4">
                                <span class="text-muted text-capitalize mr-3">
                                    <i class="icofont-comment mr-2"></i>${blog.commentCount} Comments
                                </span>
                                <span class="text-black text-capitalize mr-3">
                                    <i class="icofont-calendar mr-1"></i> ${new Date(blog.publishedDate).toLocaleDateString()}
                                </span>
                            </div>
                            <h2 class="mt-3 mb-3">
                                <a href="blog-single.html?id=${blog.id}">${blog.title}</a>
                            </h2>
                            <p class="mb-4">${blog.content.substring(0, 200)}...</p>
                            <a href="blog-single.html?id=${blog.id}" class="btn btn-main btn-icon btn-round-full">
                                Read More <i class="icofont-simple-right ml-2"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += blogCard;
        });
    } catch (error) {
        console.error('Error loading blogs:', error);
    }
}