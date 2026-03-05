import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogApi } from "../../api/blogApi";
import { useToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const API_ORIGIN = "http://localhost:5151";
const buildImgUrl = (path) =>
{
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const fixed = path.startsWith("/") ? path : `/${path}`;
    return `${API_ORIGIN}${fixed}`;
};

const BlogDetails = () =>
{
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast, ToastComponent } = useToast();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        loadBlog();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadBlog = async () =>
    {
        try
        {
            const res = await blogApi.getBlogById(id);
            setBlog(res.data);
        } catch
        {
            showToast("Error loading blog details", "error");
        } finally
        {
            setLoading(false);
        }
    };
    const handleDeleteComment = async (commentId) =>
    {
        if (!window.confirm("Delete this comment?")) return;

        try
        {
            await blogApi.deleteComment(commentId);
            showToast("Comment deleted successfully", "success");
            // yenidən detail yüklə
            const res = await blogApi.getBlogById(id);
            setBlog(res.data);
        } catch (error)
        {
            const msg =
                error?.response?.data?.message ||
                (typeof error?.response?.data === "string" ? error.response.data : null) ||
                "Error deleting comment";
            showToast(msg, "error");
        }
    };


    if (loading) return <LoadingSpinner fullScreen />;

    if (!blog)
    {
        return (
            <div>
                {ToastComponent}
                <button className="btn btn-secondary" onClick={() => navigate("/blogs")}>
                    ← Back
                </button>
                <div className="card" style={{ padding: 16, marginTop: 12 }}>
                    Blog not found
                </div>
            </div>
        );
    }

    const imgPath = blog.imagePath ?? blog.imageUrl;
    // comments array adı backend DTO-da fərqli ola bilər:
    const comments = blog.comments ?? blog.blogComments ?? blog.commentDtos ?? [];

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <button className="btn btn-secondary" onClick={() => navigate("/blogs")}>
                    ← Back
                </button>
            </div>

            <div className="card" style={{ padding: 20 }}>
                <h2>{blog.title}</h2>

                <div style={{ marginBottom: 10, opacity: 0.8 }}>
                    <b>Author:</b> {blog.author} |
                    <b> Category:</b> {blog.category} |
                    <b> Published:</b>{" "}
                    {new Date(blog.publishedDate).toLocaleDateString()} |
                    <b> Comments:</b> {blog.commentCount}
                </div>

                {blog.imagePath && (
                    <img
                        src={buildImgUrl(blog.imagePath)}
                        alt={blog.title}
                        style={{
                            width: "100%",
                            maxHeight: 400,
                            objectFit: "cover",
                            borderRadius: 12,
                            marginBottom: 20,
                        }}
                    />
                )}

                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                    {blog.content}
                </div>
            </div>


            {/* Comments */}
            <div className="card" style={{ padding: 20, marginTop: 20 }}>
                <h3>Comments ({comments.length})</h3>

                {comments.length > 0 ? (
                    comments.map((c) => (
                        <div key={c.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
                            <div style={{ fontWeight: 600 }}>
                                {c.authorName}
                                {(c.visitorEmail || c.email || c.authorEmail) && (
                                    <span style={{ fontWeight: 400, opacity: 0.7, marginLeft: 8 }}>
                                        ({c.visitorEmail || c.email || c.authorEmail})
                                    </span>
                                )}
                            </div>

                            <div style={{ fontSize: 13, opacity: 0.6 }}>
                                {new Date(c.createdAt).toLocaleString()}
                            </div>

                            <div style={{ marginTop: 5 }}>{c.content}</div>

                            <button
                                className="btn btn-danger btn-sm"
                                style={{ marginTop: 8 }}
                                onClick={() => handleDeleteComment(c.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <div>No comments yet.</div>
                )}
            </div>

        </div>
    );
};

export default BlogDetails;
