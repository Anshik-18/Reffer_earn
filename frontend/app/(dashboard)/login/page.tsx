'use client'
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, ArrowRight } from 'lucide-react';
 import { useDispatch } from "react-redux";
import { setUser } from "../../../store/slice";
import { api, setAuthToken } from "../../../lib/api";

import { useRouter } from 'next/navigation';

export default function ModernAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
//   const [refferalcode,setrefferalcode] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    refferalcode:''
  });

  const handleInputChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const router = useRouter();


const dispatch = useDispatch();

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    if (isLogin) {
      const res = await api.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = res.data;
      
      localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))

      setAuthToken(token);
      console.log("Before dispatch:", { user: res.data.user, token: res.data.token });


        dispatch(setUser({ ...user, token }));
        console.log("After dispatch call");
      router.push("/home")
     
    } else {
      const res = await api.post("/user/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        referralCode: formData.refferalcode || undefined,
      });
         console.log("Before dispatch:", { user: res.data.user, token: res.data.token });
      
         const { token, user } = res.data;
         localStorage.setItem('token', token)
   localStorage.setItem('user', JSON.stringify(user))

        dispatch(setUser({ ...user, token }));
        console.log("After dispatch call", { user: res.data.user, token: res.data.token });
      setIsLogin(true);
      router.push("/home")
    }
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || "Error occurred");
  } finally {
    setIsLoading(false);
  }
};


  const handleSocialAuth = (provider:any) => {
    alert(`Continue with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-black rounded-xl mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isLogin ? 'Enter your credentials to continue' : 'Sign up to get started'}
            </p>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none text-sm text-gray-700"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3  text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none text-sm "
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none text-sm text-gray-800"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none text-sm text-gray-800"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refferal Code
                </label>
                <div className="relative">
                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-00 w-5 h-5 pointer-events-none text-gray-700" />
                  <input
                    type={ 'text' }
                    name="refferalcode"
                    value={formData.refferalcode}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none text-sm text-gray-800"
                    placeholder="XYZ3243"
                  />
             
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2" 
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button className="text-sm text-black hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            {!isLogin && (
              <label className="flex items-start cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2 mt-0.5" 
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the <button className="text-black hover:underline font-medium">Terms of Service</button> and <button className="text-black hover:underline font-medium">Privacy Policy</button>
                </span>
              </label>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-black hover:underline font-semibold"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

 
      </div>
    </div>
  );
}