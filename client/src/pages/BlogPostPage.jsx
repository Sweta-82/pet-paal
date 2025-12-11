import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BlogPostPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/blogs/${id}`);
        setBlog(data);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-off-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green"></div>
        </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-20">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <img className="h-64 w-full object-cover" src={blog.image} alt={blog.title} />
        <div className="p-8">
            <Link to="/blog" className="inline-flex items-center text-forest-green hover:text-green-700 mb-6 transition-colors">
                <FaArrowLeft className="mr-2" /> Back to Blog
            </Link>
            <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {blog.tags.join(', ')}
                </span>
                <span className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{blog.title}</h1>
            <div className="prose prose-green max-w-none text-gray-700">
                {blog.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                ))}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">Written by <span className="font-medium text-gray-900">{blog.author.name}</span></p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
