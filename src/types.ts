/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string; // Internal UUID
  studentId: string; // 南航学号, e.g. 162110188
  name: string; // 姓名
  gender: '男' | '女'; // 性别
  age: number; // 年龄
  college: string; // 所在学院
  major: string; // 专业
  className: string; // 班级
  category: '本科生' | '研究生'; // 学生类别
  entryDate: string; // 入学日期, e.g. 2021-09-01
  status: '在籍' | '保留学籍' | '休学' | '毕业'; // 学籍状态
  phone: string; // 电话号码
  email: string; // 电子邮箱
  idCard: string; // 身份证号
  nativePlace: string; // 籍贯
}

export interface User {
  username: string;
  name: string;
  role: '教务管理员' | '辅导员';
  college?: string; // If restricted to specific college
}

export const NUAA_COLLEGES = [
  {
    name: '航空学院',
    majors: ['飞行器设计与工程', '飞行器环境与生命保障工程', '工程力学', '交通运输']
  },
  {
    name: '能源与动力学院',
    majors: ['飞行器动力工程', '能源与动力工程', '新能源科学与工程']
  },
  {
    name: '自动化学院',
    majors: ['自动化', '电气工程及其自动化', '测控技术与仪器', '智能电网信息工程']
  },
  {
    name: '电子信息工程学院',
    majors: ['电子信息工程', '通信工程', '微电子科学与工程', '信息对抗技术']
  },
  {
    name: '机电学院',
    majors: ['机械工程', '工业设计', '飞行器制造工程', '车辆工程', '智能制造工程']
  },
  {
    name: '计算机科学与技术学院',
    majors: ['计算机科学与技术', '软件工程', '信息安全', '物联网工程', '人工智能']
  },
  {
    name: '经济与管理学院',
    majors: ['工商管理', '信息管理与信息系统', '工业工程', '金融学', '电子商务']
  },
  {
    name: '理学院',
    majors: ['应用物理学', '信息与计算科学', '微电子学', '统计学']
  },
  {
    name: '民航学院',
    majors: ['交通运输(民航客运)', '飞行技术', '土木工程', '空中交通管理']
  },
  {
    name: '外国语学院',
    majors: ['英语', '日语', '德语']
  }
];
