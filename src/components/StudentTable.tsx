/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Student, NUAA_COLLEGES, User } from '../types';
import { Search, Eye, Filter, Trash2, SlidersHorizontal, ArrowUpDown, RefreshCw, Layers } from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  selectedCollege: string;
  selectedStatus: string;
  selectedCategory: string;
  currentUser: User;
  
  onSearchChange: (val: string) => void;
  onCollegeChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onPageChange: (val: number) => void;
  onRefresh: () => void;
  onViewDetail: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
}

export default function StudentTable({
  students,
  total,
  loading,
  page,
  pageSize,
  searchQuery,
  selectedCollege,
  selectedStatus,
  selectedCategory,
  currentUser,
  onSearchChange,
  onCollegeChange,
  onStatusChange,
  onCategoryChange,
  onPageChange,
  onRefresh,
  onViewDetail,
  onDeleteStudent
}: StudentTableProps) {
  
  const totalPages = Math.ceil(total / pageSize);

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case '在籍':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">● 在籍</span>;
      case '保留学籍':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">● 保留学籍</span>;
      case '休学':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">● 休学</span>;
      case '毕业':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">● 毕业</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">● 其他</span>;
    }
  };

  const clearFilters = () => {
    onSearchChange('');
    onCollegeChange('');
    onStatusChange('');
    onCategoryChange('');
    onPageChange(1);
  };

  return (
    <div id="student_workspace" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
      
      {/* Title block & Refresh action */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0A4CA3]" />
            全校在册学籍学分名录汇总
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            校内教务人员可进行多属性索引，双向校对并核查所有在册学籍细目
          </p>
        </div>
        <div className="flex items-center gap-2">
          {currentUser.college && (
            <div className="text-xs font-bold text-[#0A4CA3] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
              我的学院：{currentUser.college}
            </div>
          )}
          <button
            id="workspace_refresh_btn"
            type="button"
            onClick={onRefresh}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 shadow-sm flex items-center gap-1 text-xs font-medium cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            同步数据
          </button>
        </div>
      </div>

      {/* Advanced Filter Criteria Layout */}
      <div className="p-6 bg-slate-50/60 border-b border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Text Search Input */}
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="search_query"
              type="text"
              placeholder="按姓名/学号/班级模糊定位..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onPageChange(1);
              }}
              className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-white text-xs font-medium placeholder-slate-400 text-slate-800 transition-all outline-none"
            />
          </div>

          {/* College Filter SELECT */}
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-4 h-4" />
            </div>
            <select
              id="filter_college"
              value={selectedCollege}
              onChange={(e) => {
                onCollegeChange(e.target.value);
                onPageChange(1);
              }}
              className="block w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-white text-xs font-medium text-slate-700 transition-all outline-none appearance-none"
            >
              <option value="">所属学院-全部</option>
              {NUAA_COLLEGES.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Student Category SELECT */}
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <select
              id="filter_category"
              value={selectedCategory}
              onChange={(e) => {
                onCategoryChange(e.target.value);
                onPageChange(1);
              }}
              className="block w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-white text-xs font-medium text-slate-700 transition-all outline-none appearance-none"
            >
              <option value="">人才层级-全部</option>
              <option value="本科生">本科生 (Undergraduate)</option>
              <option value="研究生">研究生 (Postgraduate)</option>
            </select>
          </div>

          {/* Status Filter SELECT */}
          <div className="relative rounded-xl shadow-sm flex items-center gap-2">
            <select
              id="filter_status"
              value={selectedStatus}
              onChange={(e) => {
                onStatusChange(e.target.value);
                onPageChange(1);
              }}
              className="block w-full pl-3.5 pr-8 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0A4CA3] focus:border-[#0A4CA3] bg-white text-xs font-medium text-slate-700 transition-all outline-none appearance-none"
            >
              <option value="">学籍状态-全部</option>
              <option value="在籍">学籍在籍</option>
              <option value="保留学籍">保留学籍</option>
              <option value="休学">自费休学</option>
              <option value="毕业">完成毕业</option>
            </select>

            {(searchQuery || selectedCollege || selectedStatus || selectedCategory) && (
              <button
                id="clear_filters_btn"
                onClick={clearFilters}
                className="text-xs shrink-0 font-semibold text-rose-600 hover:text-rose-700 px-3 py-2 border border-rose-200 rounded-xl hover:bg-rose-50 transition-all cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Student spreadsheet Layout */}
      <div className="overflow-x-auto relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#0A4CA3] animate-spin"></div>
            </div>
            <span className="text-xs text-slate-400 mt-4 font-semibold tracking-wide">正在同步南航学籍教务数据库...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-20 bg-white">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto font-bold mb-4">
              ?
            </div>
            <h3 className="text-sm font-semibold text-slate-800">未检索到匹配的学生记录</h3>
            <p className="text-xs text-slate-400 mt-1">
              请检查您的多维度索引或者拼写，也可以录入新生学籍加入数据库。
            </p>
            {(searchQuery || selectedCollege || selectedStatus || selectedCategory) && (
              <button
                id="no_data_reset_btn"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-slate-100 text-[#0A4CA3] hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
              >
                清空查询条件
              </button>
            )}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">学生学号 <ArrowUpDown className="w-3 h-3 text-slate-300" /></span>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  姓名 / 层级
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  性别
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  年龄
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  所属部门与专业
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  班级
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  学籍状态
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  操作面板
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {students.map((student) => (
                <tr
                  key={student.id}
                  id={`student_row_${student.studentId}`}
                  className="hover:bg-blue-50/20 transition-all font-medium"
                >
                  
                  {/* 学号 */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold font-mono text-slate-800">
                    {student.studentId}
                  </td>
                  
                  {/* 姓名/层级 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{student.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold tracking-tight ${
                        student.category === '研究生' ? 'bg-[#E58E26]/10 text-[#E58E26]' : 'bg-blue-50 text-[#0A4CA3]'
                      }`}>
                        {student.category}
                      </span>
                    </div>
                  </td>
                  
                  {/* 性别 */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                    {student.gender}
                  </td>
                  
                  {/* 年龄 */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                    {student.age}岁
                  </td>
                  
                  {/* 所属学院专业 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-bold text-slate-800">{student.college}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{student.major}</div>
                  </td>
                  
                  {/* 班级 */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500">
                    {student.className}班
                  </td>
                  
                  {/* 状态 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(student.status)}
                  </td>
                  
                  {/* 操作面板 */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-semibold">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        id={`btn_detail_${student.studentId}`}
                        type="button"
                        onClick={() => onViewDetail(student)}
                        className="py-1.5 px-3 rounded-lg bg-slate-50 text-slate-700 hover:text-white hover:bg-slate-800 border border-slate-200 transition-all inline-flex items-center gap-1 shadow-sm select-none cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        查看学籍
                      </button>
                      <button
                        id={`btn_delete_${student.studentId}`}
                        type="button"
                        onClick={() => onDeleteStudent(student)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all select-none cursor-pointer"
                        title="删除/注销学籍"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination control footer bar */}
      {students.length > 0 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between font-mono">
          
          <div className="text-xs text-slate-500">
            共计 <span className="font-bold text-[#0A4CA3]">{total}</span> 名在籍学子 · 
            显示第 <span className="font-bold">{(page - 1) * pageSize + 1}</span> 至{' '}
            <span className="font-bold">{Math.min(page * pageSize, total)}</span> 条
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="prev_page_btn"
              type="button"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              上一页
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                id={`page_num_btn_${idx + 1}`}
                type="button"
                onClick={() => onPageChange(idx + 1)}
                className={`w-8 h-8 rounded-xl border text-xs font-bold leading-none flex items-center justify-center transition-all cursor-pointer ${
                  page === idx + 1
                    ? 'bg-[#0A4CA3] text-white border-transparent'
                    : 'bg-white border-slate-200 hover:bg-blue-50 text-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              id="next_page_btn"
              type="button"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              下一页
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
