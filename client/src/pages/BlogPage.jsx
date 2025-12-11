import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get('/api/blogs');
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Pet Care <span className="text-forest-green">Blog</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Tips, stories, and advice for happy pets and owners.
          </p>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green"></div>
            </div>
        ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
        ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                    <Link key={blog._id} to={`/blog/${blog._id}`} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
                        <div className="flex-shrink-0">
                            <img className="h-48 w-full object-cover" src={blog.image} alt={blog.title} />
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-forest-green">
                                    {blog.tags.join(', ')}
                                </p>
                                <div className="block mt-2">
                                    <p className="text-xl font-semibold text-gray-900">{blog.title}</p>
                                    <p className="mt-3 text-base text-gray-500 line-clamp-3">{blog.content}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="sr-only">{blog.author.name}</span>
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                                        {blog.author.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{blog.author.name}</p>
                                    <div className="flex space-x-1 text-sm text-gray-500">
                                        <time dateTime={blog.createdAt}>{new Date(blog.createdAt).toLocaleDateString()}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
