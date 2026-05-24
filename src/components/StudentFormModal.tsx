/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, NUAA_COLLEGES } from '../types';
import { X, Check, ClipboardList, AlertTriangle, HelpCircle } from 'lucide-react';

interface StudentFormModalProps {
  onClose: () => void;
  onSubmit: (studentData: Omit<Student, 'id'>) => Promise<{ success: boolean; error?: string }>;
}

export default function StudentFormModal({ onClose, onSubmit }: StudentFormModalProps) {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [age, setAge] = useState<number>(20);
  const [college, setCollege] = useState('');
  const [major, setMajor] = useState('');
  const [className, setClassName] = useState('');
  const [category, setCategory] = useState<'本科生' | '研究生'>('本科生');
  const [entryDate, setEntryDate] = useState('2026-09-01');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [idCard, setIdCard] = useState('');
  const [nativePlace, setNativePlace] = useState('江苏南京');
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Get majors list matching the currently chosen college
  const currentCollegeInfo = NUAA_COLLEGES.find(c => c.name === college);
  const availableMajors = currentCollegeInfo ? currentCollegeInfo.majors : [];

  // Reset major selection whenever college switches
  useEffect(() => {
    if (availableMajors.length > 0) {
      setMajor(availableMajors[0]);
    } else {
      setMajor('');
    }
  }, [college]);

  // Handy auto-generator: build standard NUAA student email when ID changes
  useEffect(() => {
    if (studentId.trim() && /^\d+$/.test(studentId)) {
      setEmail(`${studentId.trim()}@nuaa.edu.cn`);
    } else if (!studentId.trim()) {
      setEmail('');
    }
  }, [studentId]);

  // Form submit handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Front-end Checks
    if (!studentId.trim() || !name.trim() || !college || !major || !className.trim()) {
      setValidationError('学籍录入校验错误：请完整填写所有带有星号（*）的必填学籍档案字段。');
      return;
    }

    // RegEx student ID validation (8-11 digit numeric NUAA format)
    if (!/^\d{8,11}$/.test(studentId)) {
      setValidationError('学年注册格式错误：南航学生学号一般为 8 至 11 位由纯数字组成的学籍代码（如1621xxxx或5022xxxx），请核对。');
      return;
    }

    if (age <= 15 || age >= 50) {
      setValidationError('学籍常规校验提示：请输入合理的在读年龄范围（16周岁至49周岁）。');
      return;
    }

    if (phone.trim() && !/^1[3-9]\d{9}$/.test(phone.trim())) {
      setValidationError('联系电话格式错误：请输入正确的11位中国大陆手机号码。');
      return;
    }

    if (idCard.trim() && !/^\d{17}[\dXx]$/.test(idCard.trim())) {
      setValidationError('身份证件校验异常：请输入规范的18位二代身份证件号码。');
      return;
    }

    setSubmitting(true);

    const payload: Omit<Student, 'id'> = {
      studentId: studentId.trim(),
      name: name.trim(),
      gender,
      age: Number(age),
      college,
      major,
      className: className.trim(),
      category,
      entryDate,
      status: '在籍', // Newborn student registers as active '在籍' by default
      phone: phone.trim() || '未登记',
      email: email.trim() || `${studentId}@nuaa.edu.cn`,
      idCard: idCard.trim() || '未核验',
      nativePlace: nativePlace.trim() || '中国大陆'
    };

    try {
      const response = await onSubmit(payload);
      if (response.success) {
        onClose();
      } else {
        setValidationError(response.error || '录入失败，教务后台反馈异常。');
      }
    } catch (err) {
      setValidationError('联名教务后端系统超时，请稍后刷新重试。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="student_form_overlay" className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs font-sans">
      
      <div id="student_form_modal" className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fade-in my-8">
        
        {/* Modal Top Header Bar */}
        <div className="bg-gradient-to-r from-[#0A4CA3] to-blue-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">南京航空航天大学 · 新生学籍录入</h3>
              <p className="text-[11px] text-blue-100/80 font-medium">录入本期入校本科生与研究生档案，同步至信息化MySQL核心数据库</p>
            </div>
          </div>
          <button
            id="close_form_btn"
            type="button"
            onClick={onClose}
            className="p-1 px-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body Container */}
        <form id="student_submit_form" onSubmit={handleFormSubmit} className="p-6 space-y-5">
          
          {validationError && (
            <div id="form_validation_alert" className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg flex items-start gap-2 text-rose-800 text-xs animate-fade-in font-medium">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <h4 className="font-bold text-rose-900">学籍信息审核未通过</h4>
                <p className="mt-0.5 text-rose-700 leading-normal">{validationError}</p>
              </div>
            </div>
          )}

          {/* Core academic section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 学号 */}
            <div>
              <label htmlFor="form_student_id" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                学生学号 <span className="text-rose-500">*</span>
              </label>
              <input
                id="form_student_id"
                type="text"
                required
                maxLength={11}
                placeholder="例如: 162110108"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ''))} // Numeric only
                className="block w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-slate-50 text-xs font-semibold font-mono text-slate-800 transition-all outline-none"
              />
            </div>

            {/* 姓名 */}
            <div>
              <label htmlFor="form_name" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                姓名 <span className="text-rose-500">*</span>
              </label>
              <input
                id="form_name"
                type="text"
                required
                placeholder="请输入学生真实姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-slate-50 text-xs font-bold text-slate-800 transition-all outline-none"
              />
            </div>

            {/* 人才类别 & 性别 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  人才层级 <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setCategory('本科生')}
                    className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-all ${
                      category === '本科生' ? 'bg-white text-[#0A4CA3] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    本科生
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('研究生')}
                    className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-all ${
                      category === '研究生' ? 'bg-white text-[#E58E26] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    研究生
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  性别 <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setGender('男')}
                    className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-all ${
                      gender === '男' ? 'bg-white text-[#0A4CA3] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    男
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('女')}
                    className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-all ${
                      gender === '女' ? 'bg-white text-[#0A4CA3] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    女
                  </button>
                </div>
              </div>
            </div>

            {/* 年龄 & 入学日期 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="form_age" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  在籍年龄 <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form_age"
                  type="number"
                  required
                  min={15}
                  max={50}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="block w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-slate-50 text-xs font-semibold font-mono text-slate-800 transition-all outline-none"
                />
              </div>

              <div>
                <label htmlFor="form_entry_date" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  学期注册日期 <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form_entry_date"
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="block w-full px-3.5 py-1.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-slate-50 text-xs font-semibold font-mono text-slate-700 transition-all outline-none"
                />
              </div>
            </div>

            {/* 学院选择 */}
            <div>
              <label htmlFor="form_college" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                所属学院 <span className="text-rose-500">*</span>
              </label>
              <select
                id="form_college"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="block w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-slate-50 text-xs font-semibold text-slate-800 transition-all outline-none"
              >
                <option value="">-- 请选择对应二级学院 --</option>
                {NUAA_COLLEGES.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* 专业（联动） */}
            <div>
              <label htmlFor="form_major" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                所属专业 <span className="text-rose-500">*</span>
              </label>
              <select
                id="form_major"
                required
                disabled={!college}
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="block w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-slate-50 text-xs font-semibold text-slate-800 transition-all outline-none disabled:opacity-50"
              >
                {!college ? (
                  <option value="">-- 请先选择所属学院以匹配专业 --</option>
                ) : (
                  availableMajors.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))
                )}
              </select>
            </div>

            {/* 班级 */}
            <div>
              <label htmlFor="form_class" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                行政班号 / 班级代号 <span className="text-rose-500">*</span>
              </label>
              <input
                id="form_class"
                type="text"
                required
                placeholder="如: 1621101"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="block w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-slate-50 text-xs font-semibold font-mono text-slate-800 transition-all outline-none"
              />
            </div>

            {/* 籍贯 */}
            <div>
              <label htmlFor="form_native" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                客居籍贯
              </label>
              <input
                id="form_native"
                type="text"
                placeholder="例如: 江苏南京"
                value={nativePlace}
                onChange={(e) => setNativePlace(e.target.value)}
                className="block w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-slate-50 text-xs font-semibold text-slate-800 transition-all outline-none"
              />
            </div>

          </div>

          <div className="border-t border-slate-100 pt-3">
            <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              辅助联系及身份证校验资料（选填）
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div>
                <label htmlFor="form_phone" className="block text-[10px] font-semibold text-slate-500 mb-1">
                  辅导员备用联系电话
                </label>
                <input
                  id="form_phone"
                  type="text"
                  maxLength={11}
                  placeholder="如: 13812345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="block w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 outline-none focus:border-[#0A4CA3]"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="form_id_card" className="block text-[10px] font-semibold text-slate-500 mb-1">
                  国家法制二代居民身份证号码
                </label>
                <input
                  id="form_id_card"
                  type="text"
                  maxLength={18}
                  placeholder="请输入18位二代身份证号"
                  value={idCard}
                  onChange={(e) => setIdCard(e.target.value.toUpperCase())}
                  className="block w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 outline-none focus:border-[#0A4CA3]"
                />
              </div>

            </div>

            {/* Email Auto-suggest preview */}
            {email && (
              <p className="text-[10px] text-emerald-600 mt-2 font-mono flex items-center gap-1">
                <span>✓ 系统已自动配备南航专属域邮箱：</span>
                <span className="font-bold underline">{email}</span>
              </p>
            )}
          </div>

          {/* Modal Buttons Footer panel */}
          <div className="bg-slate-50 px-6 py-4 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              id="cancel_form_btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 transition-all shadow-sm cursor-pointer"
            >
              取消并返回
            </button>
            <button
              id="submit_student_btn"
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#0A4CA3] hover:bg-blue-800 rounded-xl text-xs font-semibold text-white transition-all shadow-md inline-flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>正在提交学籍写入安全通道...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>完成录入并审核发布</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
