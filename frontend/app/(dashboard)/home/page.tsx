'use client'
import React, { useEffect, useState } from 'react';
import { BookOpen, Users, Coins, TrendingUp, ArrowRight, Gift, UserPlus } from 'lucide-react';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { clearUser } from "@/../../store/slice";
import { setAuthToken } from "@/lib/api";
import { useRouter } from 'next/navigation';

export default function BookRefferHomepage() {
    const router = useRouter()
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    console.log("userid",user._id)
    console.log(user)
  const [email, setEmail] = useState('');
  const [username,setusername] = useState('');
   const [refferalcode,setrefferalcode] = useState('')
   const[credits,setcredits] = useState('')
    const [purchasesucess,setpurchasesucess] = useState(false)
    const[purchaseloading,setpurchaseloading] = useState(false)
  const[reffered,setreffered] = useState('');
  const[converted,setconverted] = useState('')

 
  async function getuserdetail(){
      if(user._id){
          
          console.log("userid is not null",user._id)
          const res = await axios.post(" https://reffer-earn-6slr.onrender.com/api/dashboard/info",{_id:user._id})
          const userdata =  res.data
          setusername(userdata.name)
         setcredits(userdata.credits)
          setconverted(userdata.converted_refferd)
          setreffered(userdata.total_reffered)
          setrefferalcode(userdata.refferalcode)
      }
  
  }
  async function handlepurchase(){
    setpurchaseloading(true)
    const res = await axios.post(" https://reffer-earn-6slr.onrender.com/api/purchase",{userId:user._id})
    if(res.data.success){
        setpurchasesucess(true)
        setpurchaseloading(false)
    }
    else{
         setpurchasesucess(false)
        setpurchaseloading(false)
    }
  }
useEffect(() => {
  if (user && user._id) {
    getuserdetail();
  }
}, [user._id]); 

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BookReffer</span>
          </div>
          <div className="flex items-center gap-6">
   
            <button onClick={()=>{
                router.push("/login")
            }} className="px-4 py-2 bg-green-400 text-white rounded-lg text-sm font-medium hover:bg-green-500 transition-colors">
             {user.name?"Logout":"Login"} 
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Buy books. Refer friends.<br />Earn credits.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Purchase programming books and earn credits when your friends buy too. It's that simple.
          </p>
     
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-20">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <Users className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{reffered|| 0}</div>
            <div className="text-sm text-gray-600">Users Referred</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <BookOpen className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{converted||0}</div>
            <div className="text-sm text-gray-600">Converted Reffers</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <Coins className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{credits||0}</div>
            <div className="text-sm text-gray-600">Credits Earned</div>
          </div>
        </div>

        {/* Featured Book */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Book</h2>
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-48 h-64 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                <div className="text-white text-center p-6">
                  <BookOpen className="w-16 h-16 mx-auto mb-3 opacity-80" />
                  <div className="text-xs font-bold">THE PRAGMATIC</div>
                  <div className="text-xs font-bold">PROGRAMMER</div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  The Pragmatic Programmer
                </h3>
                <p className="text-sm text-gray-500 mb-4">by Andrew Hunt & David Thomas</p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  A classic guide for software developers. Learn timeless principles and practical techniques that will help you write better code, faster. Perfect for developers at any stage of their career.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-gray-900">$42</div>
                  <button  onClick={handlepurchase} className="px-6 py-3 bg-green-400 text-white rounded-lg font-medium hover:bg-green-500 transition-colors flex items-center gap-2 hover:cursor-pointer">
                    {purchasesucess?   "Read the book" : (purchaseloading? "Buying..." :"Buy Now") }
                   
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How Referrals Work */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Referrals Work</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                You earn 2 credits
              </h3>
              <p className="text-gray-700">
                When someone uses your referral link to make their first purchase, you get 2 credits added to your account.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                They get 2 credits too
              </h3>
              <p className="text-gray-700">
                Your friend also receives 2 credits on their first order. Everyone wins when you share BookReffer.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
    <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl p-12 text-center">
  <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
  <h2 className="text-3xl font-bold text-white mb-4">
    Join BookReffer today — earn while you read!
  </h2>
  <p className="text-gray-300 mb-8">
    Copy your referral code and share it with your friends.
  </p>

  <div className="flex gap-3 max-w-md mx-auto">
    <input
      type="text"
      value={refferalcode}
      readOnly
      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-green-400 font-semibold text-center tracking-widest select-all"
    />
    <button
      onClick={() => {
        navigator.clipboard.writeText(refferalcode);
        alert("Referral code copied!");
      }}
      className="px-6 py-3 bg-green-400 text-white rounded-lg font-medium hover:bg-green-500 transition-colors whitespace-nowrap"
    >
      Copy
    </button>
  </div>
</div>

      </div>


    </div>
  );
}