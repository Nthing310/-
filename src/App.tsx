/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Student, User } from './types';
import { StudentService, AuthService } from './services/api';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import StudentTable from './components/StudentTable';
import StudentFormModal from './components/StudentFormModal';
import StudentDetailModal from './components/StudentDetailModal';

import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  UserMinus, 
  UserPlus, 
  Plane, 
  AlertTriangle, 
  Sparkles,
  Search,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Student list states
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(false);

  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals visibility states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Key stats counters (aggregated live from internal storage)
  const [stats, setStats] = useState({
    total: 0,
    undergrad: 0,
    postgrad: 0,
    graduated: 0
  });

  // Verify auth on mount
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setInitializing(false);
  }, []);

  // Show beautiful floating feedback toast alerts
  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Re-compute academic aggregates to keep bento grids updated
  const recomputeStats = useCallback(() => {
    // Get all students inside storage bypassing filters
    const all = JSON.parse(localStorage.getItem('nuaa_sms_students') || '[]');
    const undergrad = all.filter((s: Student) => s.category === '本科生').length;
    const postgrad = all.filter((s: Student) => s.category === '研究生').length;
    const graduated = all.filter((s: Student) => s.status === '毕业').length;
    setStats({
      total: all.length,
      undergrad,
      postgrad,
      graduated
    });
  }, []);

  // Fetch paginated & filtered list
  const fetchStudentsList = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const response = await StudentService.getStudents({
        query: searchQuery,
        college: selectedCollege,
        status: selectedStatus,
        category: selectedCategory,
        page,
        pageSize
      });
      setStudents(response.students);
      setTotalStudents(response.total);
    } catch (e) {
      triggerToast('无法载入南航数据库信息，请重试', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentUser, searchQuery, selectedCollege, selectedStatus, selectedCategory, page, pageSize]);

  // Sync list and stats
  useEffect(() => {
    if (currentUser) {
      fetchStudentsList();
      recomputeStats();
    }
  }, [currentUser, fetchStudentsList, recomputeStats]);

  // Handle staff logging out
  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    triggerToast('已成功而安全地注销教务系统登录', 'info');
  };

  // Save Newborn Student registry
  const handleCreateStudent = async (studentPayload: Omit<Student, 'id'>) => {
    const response = await StudentService.addStudent(studentPayload);
    if (response.success && response.data) {
      triggerToast(`恭喜！成功为新生【${response.data.name}】录入并注册南航学籍`, 'success');
      fetchStudentsList();
      recomputeStats();
      return { success: true };
    } else {
      return { success: false, error: response.error };
    }
  };

  // Save Updates on specific student details
  const handleUpdateStudent = async (id: string, updatedFields: Partial<Student>) => {
    const response = await StudentService.updateStudent(id, updatedFields);
    if (response.success && response.data) {
      triggerToast(`学籍信息校对保存成功！已更新学生【${response.data.name}】的档案记录`, 'success');
      // If we are currently observing this student in detail modal, update viewing node
      setViewingStudent(response.data);
      fetchStudentsList();
      recomputeStats();
      return { success: true };
    } else {
      return { success: false, error: response.error };
    }
  };

  // Secure deregistration / deletion execute
  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    const isDeleted = await StudentService.deleteStudent(deletingStudent.id);
    if (isDeleted) {
      triggerToast(`学籍注销成功：已安全地将【${deletingStudent.name}（学号：${deletingStudent.studentId}）】的学籍从MySQL数据库中注销移除。`, 'success');
      setDeletingStudent(null);
      // Stay on first page if paging overflows
      if (students.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      } else {
        fetchStudentsList();
      }
      recomputeStats();
    } else {
      triggerToast('删除操作未能全部完成，请检查权限', 'error');
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#0A4CA3] animate-spin"></div>
        </div>
        <span className="text-xs text-slate-400 mt-4 font-mono font-semibold">INITIALIZING NUAA CLOUD SYSTEMS...</span>
      </div>
    );
  }

  // Unauthorized page -> Redirected to Login view
  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => {
      setCurrentUser(user);
      triggerToast(`欢迎登录！${user.name}（${user.role}），您当前的专属教务授权一切正常。`, 'success');
    }} />;
  }

  return (
    <div id="app_root" className="min-h-screen bg-slate-100 font-sans flex flex-col relative pb-12 text-slate-800">
      
      {/* Official Header Navbar component */}
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      {/* Floating System Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-18 right-4 z-50 p-4 rounded-2xl shadow-xl max-w-sm border backdrop-blur-md flex items-start gap-2.5 font-sans ${
              toastMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : toastMessage.type === 'error' 
                ? 'bg-rose-50 text-rose-800 border-rose-200' 
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${
              toastMessage.type === 'success' ? 'bg-emerald-500 text-white' : toastMessage.type === 'error' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              {toastMessage.type === 'success' ? (
                <UserCheck className="w-4 h-4" />
              ) : toastMessage.type === 'error' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4 animate-pulse" />
              )}
            </div>
            <div className="text-xs">
              <p className="font-bold">
                {toastMessage.type === 'success' ? '系统核实提醒' : toastMessage.type === 'error' ? '系统验证警告' : '教务实时公告'}
              </p>
              <p className="mt-0.5 font-semibold text-slate-600 leading-normal">{toastMessage.text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full space-y-6 flex-1">
        
        {/* Bento Row 1: Welcome Banner & Admin Card Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Welcome Banner Card & University motto */}
          <div 
            id="school_welcome_banner" 
            className="lg:col-span-8 bg-gradient-to-r from-[#0A4CA3] to-blue-800 rounded-3xl text-white p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between gap-6 hover:shadow-md transition-all duration-300"
          >
            {/* Subtle Jet Engine / Flight math decoration outlines */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            <div className="absolute top-0 right-0 p-12 bg-sky-400 rounded-full blur-3xl opacity-25 translate-x-12 -translate-y-12"></div>
            
            <div className="space-y-3 z-10">
              <span className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/15 cursor-pointer backdrop-blur-md text-sky-200 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase border border-white/10 transition-all">
                <Plane className="w-3.5 h-3.5 rotate-45 animate-bounce" />
                智周万物 · 道济天下
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                南京航空航天大学学生信息管理中心
              </h2>
              <p className="text-xs text-blue-100 font-medium leading-relaxed max-w-2xl">
                欢迎登录。当前教务网系统已完美与学校学生学籍档案数据库成功连接。教务管理员与辅导员在此可高效、安全地录入并校对本科生及研究生的在校学籍档案、学院归属与在校状态。
              </p>
            </div>

            <div className="z-10 mt-2">
              <button
                id="newborn_registration_trigger"
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="px-5 py-3.5 bg-[#E58E26] hover:bg-amber-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md hover:shadow-amber-500/20 active:scale-95 inline-flex items-center gap-2 cursor-pointer border border-[#E58E26]/20 animate-fade-in"
              >
                <UserPlus className="w-4 h-4" />
                <span>录入新生学籍档案 (Add Student)</span>
              </button>
            </div>
          </div>

          {/* Academic Calendar & Operator Bento Box */}
          <div 
            id="academic_duty_bento" 
            className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">教务授权认证</h3>
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" title="教务系统联通就绪"></span>
              </div>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                  <span className="text-slate-400 font-semibold">当前操作员</span>
                  <span className="font-bold text-slate-800">{currentUser.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                  <span className="text-slate-400 font-semibold">系统角色</span>
                  <span className="font-bold text-[#0A4CA3]">{currentUser.role}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                  <span className="text-slate-400 font-semibold">管辖事务组</span>
                  <span className="font-bold text-slate-800">{currentUser.college || '全校管理事务'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-semibold">当前教学学期</span>
                  <span className="font-semibold text-slate-700">2025-2026学期 第二周</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-bold font-mono text-center">
              南京航空航天大学 · 教务保障中心
            </div>
          </div>

        </div>

        {/* Dynamic statistical counters (bento grid layout) */}
        <div id="stats_dashboard" className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="p-3 bg-blue-50 text-[#0A4CA3] rounded-2xl">
              <Users className="w-5 h-5 text-[#0A4CA3]" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">在册生源总合</p>
              <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">{stats.total} <span className="text-xs text-slate-400 font-sans font-medium">人</span></p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">本科生学籍数</p>
              <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">{stats.undergrad} <span className="text-xs text-slate-400 font-sans font-medium">人</span></p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="p-3 bg-amber-50 text-[#E58E26] rounded-2xl font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">研究生学籍数</p>
              <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">{stats.postgrad} <span className="text-xs text-slate-400 font-sans font-medium">人</span></p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">完成毕业总合</p>
              <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">{stats.graduated} <span className="text-xs text-slate-400 font-sans font-medium">人</span></p>
            </div>
          </div>

        </div>

        {/* Central main student information table module */}
        <section id="table_workspace_section" className="space-y-4 shadow-sm border border-slate-200/80 rounded-3xl overflow-hidden">
          <StudentTable
            students={students}
            total={totalStudents}
            loading={loading}
            page={page}
            pageSize={pageSize}
            searchQuery={searchQuery}
            selectedCollege={selectedCollege}
            selectedStatus={selectedStatus}
            selectedCategory={selectedCategory}
            currentUser={currentUser}
            onSearchChange={setSearchQuery}
            onCollegeChange={setSelectedCollege}
            onStatusChange={setSelectedStatus}
            onCategoryChange={setSelectedCategory}
            onPageChange={setPage}
            onRefresh={fetchStudentsList}
            onViewDetail={(student) => setViewingStudent(student)}
            onDeleteStudent={(student) => setDeletingStudent(student)}
          />
        </section>

      </main>

      {/* MODAL I: Newborn Student Registration popup */}
      {isCreateOpen && (
        <StudentFormModal
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateStudent}
        />
      )}

      {/* MODAL II: Detailed electronic profile view & update block */}
      {viewingStudent && (
        <StudentDetailModal
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
          onUpdate={handleUpdateStudent}
        />
      )}

      {/* MODAL III: Deregistration safety warning confirmation pop-up */}
      {deletingStudent && (
        <div id="delete_modal_overlay" className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs font-sans">
          
          <div id="delete_confirm_card" className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in">
            
            <div className="bg-rose-600 text-white px-5 py-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
              <h4 className="font-bold text-sm sm:text-base">学籍销档注销安全提醒</h4>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                亲爱的教务管理员，您在此发起注销学生学籍变动操作。该操作将在 MySQL 高等生源核心管理数据库中，注销该名学子对应的学籍表行记录：
              </p>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">学籍号及姓名:</span>
                  <span className="text-rose-700 font-bold">{deletingStudent.name} ({deletingStudent.studentId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">层级及学院:</span>
                  <span className="text-slate-800">{deletingStudent.category} · {deletingStudent.college}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">常驻班级:</span>
                  <span className="text-slate-800 font-mono">{deletingStudent.className} 班</span>
                </div>
              </div>

              <p className="text-[11px] text-rose-600 font-bold bg-rose-50 p-3 rounded-lg flex items-start gap-1">
                <span>⚠ 注意：</span>
                <span>此操作会触发不可逆的数据联锁注销程序，该名学生的电子在校名录、档案、选课等都会被系统一并清除。请再次确认。</span>
              </p>
            </div>

            <div className="bg-slate-50 px-5 py-3.5 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                id="cancel_delete_btn"
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs text-slate-600 font-bold transition-all cursor-pointer"
              >
                取消并不予处理
              </button>
              <button
                id="confirm_delete_btn"
                type="button"
                onClick={handleConfirmDelete}
                className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                授权无误，执行注销程序
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
