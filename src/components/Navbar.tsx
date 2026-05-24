/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { LogOut, Calendar, ShieldCheck, UserCheck, Plane, Clock } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
}

export default function Navbar({ currentUser, onLogout }: NavbarProps) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    // Elegant dynamic clock supporting real-time UTC/local display
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setTimeStr(now.toLocaleString('zh-CN', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine school semester or term dynamically
  const getSemesterText = () => {
    return '2025-2026学年 第二学期';
  };

  return (
    <header id="system_header" className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="bg-[#0A4CA3] text-white p-1.5 rounded-xl shadow-inner flex items-center justify-center">
              <Plane className="h-5 w-5 rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-[15px] sm:text-[17px] tracking-tight">南京航空航天大学</span>
                <span className="text-[10px] bg-blue-50 text-[#0A4CA3] font-bold px-1.5 py-0.5 rounded-md border border-blue-100">教务系统</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">学生信息管理系统 (NUAA SMS)</p>
            </div>
          </div>

          {/* Center Info - current Academic Semester */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 rounded-full text-xs text-slate-600 font-medium border border-slate-100 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>【当前教学周期】</span>
            <span className="font-semibold text-slate-800">{getSemesterText()}</span>
          </div>

          {/* Right Area: Dynamic Time + User Info + Logout */}
          <div className="flex items-center gap-4">
            
            {/* Monospace Active Dynamic Clock */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100/60 leading-none px-3 py-1.5 rounded-lg font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-sans font-semibold text-slate-400">教务时间:</span>
              <span className="text-[#0A4CA3] font-bold tracking-wider">{timeStr}</span>
            </div>

            {/* Admin User Card info */}
            <div name="profile-badge" className="flex items-center gap-2 bg-slate-50 p-1 pr-3 rounded-full border border-slate-200">
              <div className="bg-gradient-to-tr from-[#0A4CA3] to-sky-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-xs font-bold shadow-sm">
                {currentUser.name[0]}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-800 leading-none flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  {currentUser.role === '教务管理员' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 tracking-tight mt-0.5">
                  {currentUser.college ? `${currentUser.college} · ` : ''}{currentUser.role}
                </div>
              </div>
            </div>

            {/* Logout Trigger button */}
            <button
              id="logout_btn"
              type="button"
              onClick={onLogout}
              title="安全注销并退出"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
