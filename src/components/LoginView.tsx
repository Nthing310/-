/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthService } from '../services/api';
import { User } from '../types';
import { ShieldCheck, Lock, User as UserIcon, AlertCircle, Plane, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await AuthService.login(username, password);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || '登录失败，请核对信息');
      }
    } catch (err) {
      setError('网络或系统异常，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill demo credentials
  const handleQuickLogin = async (usr: string) => {
    setUsername(usr);
    setPassword('password');
    setError(null);
    setLoading(true);

    try {
      const result = await AuthService.login(usr, 'password');
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || '快捷登录失败');
      }
    } catch (err) {
      setError('快捷登录遭遇异常');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login_container" className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative Aerospace Grid Lines like aeronautical blueprint context */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center items-center gap-3">
          <div className="bg-[#0A4CA3] text-white p-2.5 rounded-2xl shadow-md border border-blue-400/20 flex items-center justify-center">
            <Plane className="h-7 w-7 rotate-45 animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold text-[#0A4CA3] tracking-wide">NUAA</h1>
            <p className="text-xs text-slate-500 font-medium tracking-tight font-mono">EST. 1952</p>
          </div>
        </div>

        <h2 className="mt-5 text-center text-2xl font-bold tracking-tight text-slate-900">
          南京航空航天大学
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium max-w-sm mx-auto">
          学生信息管理系统 · 校园数智化服务云
        </p>
      </div>

      <motion.div 
        id="login_card_wrap"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="bg-white py-10 px-6 sm:px-10 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200/60 relative">
          
          <div className="absolute top-0 right-0 p-1.5 bg-blue-50/70 text-[#0A4CA3] text-[10px] font-semibold tracking-wider rounded-bl-xl rounded-tr-xl border-l border-b border-blue-100/50 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            教务专线已加密
          </div>

          <form id="login_form" className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div id="login_error" className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg flex items-start gap-2 text-rose-800 text-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-rose-900">登录校验出现异常</h3>
                  <p className="mt-0.5 text-xs text-rose-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                数字校园账号 (用户名)
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="请输入您的教务账号 / 邮箱"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-slate-50/50 hover:bg-slate-50 placeholder-slate-400 text-slate-900 text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                统一认证密码
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="请输入您的预设密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-slate-50/50 hover:bg-slate-50 placeholder-slate-400 text-slate-900 text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-[#0A4CA3] focus:ring-[#0A4CA3] border-slate-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-[13px] font-medium text-slate-600 select-none cursor-pointer">
                  在此设备上保持登录
                </label>
              </div>
              <span className="font-semibold text-[#0A4CA3] hover:underline cursor-pointer select-none">
                忘记密码？
              </span>
            </div>

            <div>
              <button
                id="submit_button"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#0A4CA3] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A4CA3] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>正在进行教务授权认证...</span>
                  </span>
                ) : (
                  '登录学生管理云端'
                )}
              </button>
            </div>
          </form>

          {/* Preset Admin accounts suggestion for testing convenience */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              测试专属教务人员快捷登录：
            </span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                id="preset_login_admin"
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#0A4CA3]/5 hover:border-[#0A4CA3]/30 transition-all text-xs"
              >
                <div className="font-bold text-slate-800">全校超级管理员</div>
                <div className="text-slate-400 font-mono mt-0.5">账号: admin</div>
              </button>
              <button
                id="preset_login_college"
                type="button"
                onClick={() => handleQuickLogin('fudaoyuan1')}
                className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#0A4CA3]/5 hover:border-[#0A4CA3]/30 transition-all text-xs"
              >
                <div className="font-bold text-slate-800">计算机学院辅导员</div>
                <div className="text-slate-400 font-mono mt-0.5">账号: fudaoyuan1</div>
              </button>
            </div>
          </div>

        </div>

        <div className="text-center mt-6 text-slate-400 text-xs font-medium tracking-tight">
          南京航空航天大学信息化处 · 网络信息与教务保障中心
        </div>
      </motion.div>
    </div>
  );
}
