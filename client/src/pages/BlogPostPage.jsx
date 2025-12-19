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
    <div className="min-h-screen bg-pastel-bg bg-opacity-50 py-12 px-4 sm:px-6 lg:px-8 pt-32 transition-colors duration-500">
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-pastel-purple/20 border border-white/60 overflow-hidden">
        <img className="h-80 w-full object-cover" src={blog.image} alt={blog.title} />
        <div className="p-10">
          <Link to="/resources" className="inline-flex items-center text-pastel-purple hover:text-pastel-pink mb-8 transition-colors font-bold text-lg">
            <FaArrowLeft className="mr-2" /> Back to Resources
          </Link>
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-bold bg-pastel-purple/20 text-pastel-purple border border-pastel-purple/10">
              {blog.tags.join(', ')}
            </span>
            <span className="text-sm text-gray-500 font-medium">{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight" style={{ fontFamily: '"BBH Bartle Static", sans-serif' }}>{blog.title}</h1>
          <div className="prose prose-lg prose-purple max-w-none text-gray-700 leading-relaxed">
            {blog.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-6">{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 pt-8 border-t border-pastel-pink/20">
            <p className="text-base text-gray-500">Written by <span className="font-bold text-gray-900">{blog.author.name}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
