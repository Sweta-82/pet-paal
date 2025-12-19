import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import { gsap } from 'gsap';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
    gsap.fromTo(".login-container", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
  }, [navigate, userInfo]);

  const submitHandler = (data) => {
    dispatch(login(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-bg bg-opacity-50 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-md w-full space-y-8 login-container bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-pastel-purple/20 border border-white/60">
        <div>
          <h2 className="mt-6 text-center text-4xl font-bold text-gray-800 drop-shadow-sm" style={{ fontFamily: '"BBH Bartle Static", sans-serif' }}>
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-bold text-pastel-purple hover:text-pastel-pink transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitHandler)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="mb-4">
              <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700 mb-1 pl-1">Email address</label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                className={`appearance-none block w-full px-3 py-3 border ${errors.email ? 'border-red-500' : 'border-pastel-pink/30'} placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm bg-white/50 transition-all shadow-sm`}
                placeholder="Email address"
                {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 pl-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1 pl-1">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`appearance-none block w-full px-3 py-3 border ${errors.password ? 'border-red-500' : 'border-pastel-pink/30'} placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm bg-white/50 transition-all shadow-sm`}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 pl-1">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-pastel-purple to-pastel-pink hover:from-pastel-pink hover:to-pastel-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-purple disabled:opacity-50 shadow-lg transform hover:scale-[1.02] transition-all duration-300"
            >
              {loading ? 'Logging in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
