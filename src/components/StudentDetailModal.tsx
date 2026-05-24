/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student, NUAA_COLLEGES } from '../types';
import { X, Check, Edit2, ShieldAlert, BadgeCheck, FileText, Phone, Award, Mail, IdCard, MapPin, Calendar, Clock } from 'lucide-react';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
  onUpdate: (id: string, fields: Partial<Student>) => Promise<{ success: boolean; error?: string }>;
}

export default function StudentDetailModal({ student, onClose, onUpdate }: StudentDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: student.name,
    age: student.age,
    status: student.status,
    phone: student.phone,
    email: student.email,
    nativePlace: student.nativePlace,
    className: student.className,
    major: student.major,
    college: student.college
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFieldChange = (key: keyof Student, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Switch major lists matching college during edits
  const currentCollegeInfo = NUAA_COLLEGES.find(c => c.name === (formData.college || student.college));
  const availableMajors = currentCollegeInfo ? currentCollegeInfo.majors : [];

  const handleSave = async () => {
    setErrorMsg(null);
    if (!formData.name?.trim() || !formData.className?.trim()) {
      setErrorMsg('修改失败：学生姓名或行政班号不能为空，请检查填写。');
      return;
    }

    setSaving(true);
    try {
      const resp = await onUpdate(student.id, formData);
      if (resp.success) {
        setIsEditing(false);
      } else {
        setErrorMsg(resp.error || '联校教务层同步变动失败');
      }
    } catch (e) {
      setErrorMsg('网络校验变动超时，请稍后再试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="student_detail_overlay" className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs font-sans">
      
      <div id="student_detail_modal" className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fade-in relative my-8">
        
        {/* Top Header Section */}
        <div className="bg-[#0A4CA3] text-white px-6 py-5 flex items-center justify-between relative overflow-hidden">
          
          {/* Subtle aerospace background pattern inside detail header */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:16px_16px]"></div>

          <div className="flex items-center gap-2.5 z-10">
            <FileText className="w-5 h-5 text-sky-300" />
            <div>
              <h3 className="font-bold text-base">南京航空航天大学学生电子档案</h3>
              <p className="text-[11px] text-blue-100 font-mono tracking-wider">REGISTRY NO: {student.id.toUpperCase()}</p>
            </div>
          </div>

          <button
            id="close_detail_btn"
            type="button"
            onClick={onClose}
            className="p-1 px-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-white transition-all z-10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Detail Core Body container */}
        <div className="p-6 space-y-6 relative">
          
          {errorMsg && (
            <div id="detail_error_callout" className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg flex items-start gap-2 text-rose-800 text-xs animate-fade-in font-medium">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-900">学籍变动保存失败：</span> {errorMsg}
              </div>
            </div>
          )}

          {/* Profile overview box */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-5 border-b border-slate-100 relative">
            
            {/* Left: Avatar & Basic attributes */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0A4CA3] to-indigo-600 border-2 border-slate-100 shadow-md flex items-center justify-center text-white text-xl font-bold font-sans">
                  {student.name[0]}
                </div>
                {/* Status indicator button */}
                <div className="absolute -bottom-1 -right-1 bg-white border border-slate-200 shadow-xs rounded-full px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
                  {student.status}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-lg font-bold text-slate-900">
                    {isEditing ? (
                      <input
                        id="edit_name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        className="border-b border-dashed border-slate-400 focus:border-[#0A4CA3] font-bold text-slate-800 outline-none text-base px-1"
                      />
                    ) : (
                      student.name
                    )}
                  </h4>
                  <span className="text-xs bg-blue-50 text-[#0A4CA3] font-bold px-2 py-0.5 rounded-full">
                    {student.category}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1 font-semibold font-mono">
                  学籍核实序列号：{student.studentId}
                </p>
              </div>
            </div>

            {/* Right: official stamp watermarks */}
            <div className="flex flex-col items-center sm:items-end gap-1.5">
              <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full px-2.5 py-1 text-[11px] font-bold">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                国家高等教育学籍核验通过
              </div>
              <p className="text-[10px] text-slate-400 font-medium">南航总机核对时间: 2026年</p>
            </div>

          </div>

          {/* Detailed attributes grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            
            {/* Visual authentic watermarks badge in student detail */}
            <div className="absolute right-4 bottom-4 pointer-events-none opacity-[0.06] select-none text-center">
              <Award className="w-24 h-24 text-[#0A4CA3] mx-auto" strokeWidth={1} />
              <div className="text-[10px] font-bold text-[#0A4CA3] tracking-widest mt-1">南京航空航天大学</div>
              <div className="text-[8px] text-slate-500 mt-0.5 font-semibold">AUTHORIZED DEAN STAMP</div>
            </div>

            {/* Academic profile section */}
            <div className="space-y-4 z-10">
              <h5 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Award className="w-4 h-4 text-[#0A4CA3]" />
                一、专业与学籍归属
              </h5>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-right pr-2">所属学院:</span>
                <span className="col-span-2 font-bold text-slate-800">
                  {isEditing ? (
                    <select
                      id="edit_college"
                      value={formData.college}
                      onChange={(e) => handleFieldChange('college', e.target.value)}
                      className="border border-slate-200 rounded-md px-1 py-0.5 font-bold outline-none text-slate-700 focus:border-[#0A4CA3]"
                    >
                      {NUAA_COLLEGES.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    student.college
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-right pr-2">就读专业:</span>
                <span className="col-span-2 font-bold text-slate-800">
                  {isEditing ? (
                    <select
                      id="edit_major"
                      value={formData.major}
                      onChange={(e) => handleFieldChange('major', e.target.value)}
                      className="border border-slate-200 rounded-md px-1 py-0.5 font-bold outline-none text-slate-700 focus:border-[#0A4CA3]"
                    >
                      {availableMajors.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  ) : (
                    student.major
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-right pr-2">行政班级:</span>
                <span className="col-span-2 font-bold text-slate-800">
                  {isEditing ? (
                    <input
                      id="edit_class"
                      type="text"
                      value={formData.className}
                      onChange={(e) => handleFieldChange('className', e.target.value)}
                      className="border border-slate-200 rounded-md px-1 py-0.5 font-mono text-slate-700 outline-none focus:border-[#0A4CA3]"
                    />
                  ) : (
                    `${student.className} 班`
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-right pr-2">学籍状态:</span>
                <span className="col-span-2 font-bold text-slate-800">
                  {isEditing ? (
                    <select
                      id="edit_status"
                      value={formData.status}
                      onChange={(e) => handleFieldChange('status', e.target.value)}
                      className="border border-slate-200 rounded-md px-1 py-0.5 font-bold text-slate-700 outline-none focus:border-[#0A4CA3]"
                    >
                      <option value="在籍">在籍</option>
                      <option value="保留学籍">保留学籍</option>
                      <option value="休学">休学</option>
                      <option value="毕业">毕业</option>
                    </select>
                  ) : (
                    student.status
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-right pr-2">入学日期:</span>
                <span className="col-span-2 font-medium font-mono text-slate-600">{student.entryDate}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-right pr-2">在籍年龄:</span>
                <span className="col-span-2 font-medium font-mono text-slate-600">
                  {isEditing ? (
                    <input
                      id="edit_age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleFieldChange('age', Number(e.target.value))}
                      className="border border-slate-200 rounded-md px-1 py-0.5 font-mono w-16 text-slate-700 outline-none focus:border-[#0A4CA3]"
                    />
                  ) : (
                    `${student.age} 岁`
                  )}
                </span>
              </div>

            </div>

            {/* Personal credentials and contacts folder */}
            <div className="space-y-4 z-10">
              <h5 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Phone className="w-4 h-4 text-[#0A4CA3]" />
                二、备考联系人及身份证件
              </h5>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-right pr-2">法制身份证:</span>
                <span className="col-span-2 font-medium font-mono text-slate-600 flex items-center gap-1">
                  <IdCard className="w-3.5 h-3.5 text-slate-300" />
                  {student.idCard || '未核验'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-right pr-2">常用电话:</span>
                <span className="col-span-2 font-medium font-mono text-slate-600 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-300" />
                  {isEditing ? (
                    <input
                      id="edit_phone"
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className="border border-slate-200 rounded-md px-1 py-0.5 font-mono text-slate-700 outline-none focus:border-[#0A4CA3]"
                    />
                  ) : (
                    student.phone || '未填写'
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-right pr-2">校园邮箱:</span>
                <span className="col-span-2 font-medium font-mono text-slate-600 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-300" />
                  {isEditing ? (
                    <input
                      id="edit_email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className="border border-slate-200 rounded-md px-1 py-0.5 font-mono text-slate-700 w-full outline-none focus:border-[#0A4CA3]"
                    />
                  ) : (
                    student.email
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-right pr-2">学生性别:</span>
                <span className="col-span-2 font-medium text-slate-600">{student.gender}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-right pr-2">客居籍贯:</span>
                <span className="col-span-2 font-medium text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-300" />
                  {isEditing ? (
                    <input
                      id="edit_native"
                      type="text"
                      value={formData.nativePlace}
                      onChange={(e) => handleFieldChange('nativePlace', e.target.value)}
                      className="border border-slate-200 rounded-md px-1 py-0.5 text-slate-700 outline-none focus:border-[#0A4CA3]"
                    />
                  ) : (
                    student.nativePlace || '中国大陆'
                  )}
                </span>
              </div>

            </div>

          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            <span>学籍系统说明：任何有关学生身份证号或电话的变化均由教务管理人员根据南航学籍保障条例实时记录以维护档案一致性。</span>
          </div>

        </div>

        {/* Card Footer panel */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          
          <div>
            {!isEditing ? (
              <button
                id="edit_mode_toggle_btn"
                type="button"
                onClick={() => {
                  setFormData({
                    name: student.name,
                    age: student.age,
                    status: student.status,
                    phone: student.phone,
                    email: student.email,
                    nativePlace: student.nativePlace,
                    className: student.className,
                    major: student.major,
                    college: student.college
                  });
                  setIsEditing(true);
                  setErrorMsg(null);
                }}
                className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 font-semibold text-xs text-[#0A4CA3] transition-all flex items-center gap-1 shadow-sm hover:border-[#0A4CA3]/35 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                修改学籍细目
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="save_changes_btn"
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold text-xs text-white transition-all flex items-center gap-1 shadow-md disabled:opacity-40 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  保存更改
                </button>
                <button
                  id="cancel_edit_btn"
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setErrorMsg(null);
                  }}
                  className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs text-slate-600 transition-all font-semibold cursor-pointer"
                >
                  放弃修改
                </button>
              </div>
            )}
          </div>

          <button
            id="detail_close_bottom_btn"
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
          >
            确认无误并关闭
          </button>

        </div>

      </div>

    </div>
  );
}
