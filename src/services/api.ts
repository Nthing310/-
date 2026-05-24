/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, User } from '../types';

// Preset local storage keys
const STORAGE_KEY_STUDENTS = 'nuaa_sms_students';
const STORAGE_KEY_USER = 'nuaa_sms_user';

// Authentic NUAA Preset Student List (approx. 15 students to demonstrate pagination, search, etc.)
const INITIAL_STUDENTS: Student[] = [
  {
    id: 'nuaa-s01',
    studentId: '162110108',
    name: '张云鹏',
    gender: '男',
    age: 23,
    college: '航空学院',
    major: '飞行器设计与工程',
    className: '1621101',
    category: '本科生',
    entryDate: '2021-09-01',
    status: '在籍',
    phone: '13812345678',
    email: 'zhangyp@nuaa.edu.cn',
    idCard: '320102200301152019',
    nativePlace: '江苏南京'
  },
  {
    id: 'nuaa-s02',
    studentId: '162110212',
    name: '王佳怡',
    gender: '女',
    age: 22,
    college: '航空学院',
    major: '飞行器环境与生命保障工程',
    className: '1621102',
    category: '本科生',
    entryDate: '2021-09-01',
    status: '在籍',
    phone: '13951712345',
    email: 'wangjiayi@nuaa.edu.cn',
    idCard: '32050220040512882X',
    nativePlace: '江苏苏州'
  },
  {
    id: 'nuaa-s03',
    studentId: '162220101',
    name: '徐振宇',
    gender: '男',
    age: 21,
    college: '能源与动力学院',
    major: '飞行器动力工程',
    className: '1622201',
    category: '本科生',
    entryDate: '2022-09-01',
    status: '在籍',
    phone: '15050519876',
    email: 'xu_zhenyu@nuaa.edu.cn',
    idCard: '320202200508213312',
    nativePlace: '江苏无锡'
  },
  {
    id: 'nuaa-s04',
    studentId: '162230115',
    name: '林静宜',
    gender: '女',
    age: 21,
    college: '自动化学院',
    major: '自动化',
    className: '1622301',
    category: '本科生',
    entryDate: '2022-09-01',
    status: '在籍',
    phone: '13615152233',
    email: 'linjy@nuaa.edu.cn',
    idCard: '320401200511105125',
    nativePlace: '江苏常州'
  },
  {
    id: 'nuaa-s05',
    studentId: '162340209',
    name: '陈修远',
    gender: '男',
    age: 20,
    college: '电子信息工程学院',
    major: '微电子科学与工程',
    className: '1623402',
    category: '本科生',
    entryDate: '2023-09-01',
    status: '在籍',
    phone: '18851609988',
    email: 'chenxy@nuaa.edu.cn',
    idCard: '321001200602184011',
    nativePlace: '江苏扬州'
  },
  {
    id: 'nuaa-s06',
    studentId: '502360102',
    name: '郭瑞涵',
    gender: '男',
    age: 25,
    college: '计算机科学与技术学院',
    major: '计算机科学与技术',
    className: '5023601',
    category: '研究生',
    entryDate: '2023-09-01',
    status: '在籍',
    phone: '15951887654',
    email: 'guorh_yjs@nuaa.edu.cn',
    idCard: '370205200104192031',
    nativePlace: '山东青岛'
  },
  {
    id: 'nuaa-s07',
    studentId: '162160122',
    name: '赵雪晴',
    gender: '女',
    age: 22,
    college: '计算机科学与技术学院',
    major: '软件工程',
    className: '1621601',
    category: '本科生',
    entryDate: '2021-09-01',
    status: '毕业',
    phone: '13585174431',
    email: 'zhaoxq@nuaa.edu.cn',
    idCard: '320602200410052345',
    nativePlace: '江苏南通'
  },
  {
    id: 'nuaa-s08',
    studentId: '162350106',
    name: '李默凡',
    gender: '男',
    age: 20,
    college: '机电学院',
    major: '机械工程',
    className: '1623501',
    category: '本科生',
    entryDate: '2023-09-01',
    status: '在籍',
    phone: '17751023344',
    email: 'limf@nuaa.edu.cn',
    idCard: '330102200612140135',
    nativePlace: '浙江杭州'
  },
  {
    id: 'nuaa-s09',
    studentId: '162230221',
    name: '周奕廷',
    gender: '男',
    age: 22,
    college: '自动化学院',
    major: '电气工程及其自动化',
    className: '1622302',
    category: '本科生',
    entryDate: '2022-09-01',
    status: '保留学籍',
    phone: '15850556633',
    email: 'zhouyiting@nuaa.edu.cn',
    idCard: '320302200407153351',
    nativePlace: '江苏徐州'
  },
  {
    id: 'nuaa-s10',
    studentId: '162170118',
    name: '陆子涵',
    gender: '女',
    age: 23,
    college: '经济与管理学院',
    major: '电子商务',
    className: '1621701',
    category: '本科生',
    entryDate: '2021-09-01',
    status: '在籍',
    phone: '15151883399',
    email: 'luzihan@nuaa.edu.cn',
    idCard: '320115200302220928',
    nativePlace: '江苏南京'
  },
  {
    id: 'nuaa-s11',
    studentId: '502260211',
    name: '韩明杰',
    gender: '男',
    age: 26,
    college: '计算机科学与技术学院',
    major: '人工智能',
    className: '5022602',
    category: '研究生',
    entryDate: '2022-09-01',
    status: '在籍',
    phone: '13770732288',
    email: 'hanmj_yjs@nuaa.edu.cn',
    idCard: '130102200008081213',
    nativePlace: '河北石家庄'
  },
  {
    id: 'nuaa-s12',
    studentId: '162290103',
    name: '沈梦琪',
    gender: '女',
    age: 22,
    college: '民航学院',
    major: '交通运输(民航客运)',
    className: '1622901',
    category: '本科生',
    entryDate: '2022-09-01',
    status: '在籍',
    phone: '13913334455',
    email: 'shen_mq@nuaa.edu.cn',
    idCard: '320583200411234567',
    nativePlace: '江苏昆山'
  },
  {
    id: 'nuaa-s13',
    studentId: '162380120',
    name: '董承德',
    gender: '男',
    age: 19,
    college: '理学院',
    major: '应用物理学',
    className: '1623801',
    category: '本科生',
    entryDate: '2023-09-01',
    status: '在籍',
    phone: '13851996611',
    email: 'dongcd@nuaa.edu.cn',
    idCard: '34010420070314227X',
    nativePlace: '安徽合肥'
  },
  {
    id: 'nuaa-s14',
    studentId: '162410103',
    name: '薛婉如',
    gender: '女',
    age: 20,
    college: '外国语学院',
    major: '英语',
    className: '1624101',
    category: '本科生',
    entryDate: '2024-09-01',
    status: '在籍',
    phone: '13305167788',
    email: 'xuewanru@nuaa.edu.cn',
    idCard: '321201200610190122',
    nativePlace: '江苏泰州'
  },
  {
    id: 'nuaa-s15',
    studentId: '502440108',
    name: '杨天宇',
    gender: '男',
    age: 24,
    college: '电子信息工程学院',
    major: '通信工程',
    className: '5024401',
    category: '研究生',
    entryDate: '2024-09-01',
    status: '在籍',
    phone: '15050587788',
    email: 'yangty_yjs@nuaa.edu.cn',
    idCard: '410103200211025531',
    nativePlace: '河南郑州'
  }
];

// Seed storage Helper
function loadStudentsFromStorage(): Student[] {
  const data = localStorage.getItem(STORAGE_KEY_STUDENTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_STUDENTS;
  }
}

function saveStudentsToStorage(students: Student[]) {
  localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
}

// Simulated network latency helper to replicate beautiful real B/S interaction
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const StudentService = {
  /**
   * Fetch paginated & filtered students (standard academic query API interface)
   */
  async getStudents(params?: {
    query?: string;
    college?: string;
    status?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    students: Student[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    await delay(350); // Simulates database fetch latency
    const students = loadStudentsFromStorage();

    const q = params?.query?.trim().toLowerCase() || '';
    const college = params?.college || '';
    const status = params?.status || '';
    const category = params?.category || '';
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 8;

    // Filter students
    let filtered = students.filter(student => {
      // 1. Text Query matches studentId or Name
      if (q && !(
        student.studentId.toLowerCase().includes(q) ||
        student.name.toLowerCase().includes(q) ||
        student.major.toLowerCase().includes(q) ||
        student.className.toLowerCase().includes(q)
      )) {
        return false;
      }
      // 2. College matching
      if (college && student.college !== college) {
        return false;
      }
      // 3. Status matching
      if (status && student.status !== status) {
        return false;
      }
      // 4. Category matching
      if (category && student.category !== category) {
        return false;
      }
      return true;
    });

    // Sort: newest school entry / larger ID first by default
    filtered.sort((a, b) => b.studentId.localeCompare(a.studentId));

    // Pagination
    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      students: paginated,
      total,
      page,
      pageSize
    };
  },

  /**
   * Fetch specialized student detail by Internal ID or NUAA Student ID
   */
  async getStudentById(id: string): Promise<Student | null> {
    await delay(200);
    const students = loadStudentsFromStorage();
    const student = students.find(s => s.id === id || s.studentId === id);
    return student || null;
  },

  /**
   * Create newborn student record (新生学籍录入)
   */
  async addStudent(newStudent: Omit<Student, 'id'>): Promise<{ success: boolean; data?: Student; error?: string }> {
    await delay(500); // DB transactional delay
    const students = loadStudentsFromStorage();

    // Key Validation - Student ID uniqueness is critical
    const exists = students.some(s => s.studentId === newStudent.studentId);
    if (exists) {
      return {
        success: false,
        error: `学籍录入失败：系统已存在学号为【${newStudent.studentId}】的学生信息，请勿重复注册。`
      };
    }

    // Structural constraint checks
    if (!newStudent.studentId || !newStudent.name || !newStudent.college || !newStudent.major || !newStudent.className) {
      return {
        success: false,
        error: '学籍录入失败：带有星号的必要学籍信息必填，请检查填写。'
      };
    }

    // Format matches: NUAA ID should typically be 9 digits (本科16开头/研究生50开头等) or 8-10 digits. We enforce standard digits validation
    const idRegex = /^\d{8,11}$/;
    if (!idRegex.test(newStudent.studentId)) {
      return {
        success: false,
        error: '学号格式错误：南京航空航天大学学生学号一般为 8-11 位由纯数字组成的学籍代码，请核实。'
      };
    }

    const created: Student = {
      ...newStudent,
      id: 'nuaa-' + Math.random().toString(36).substr(2, 9)
    };

    students.unshift(created); // Place newest at start of storage array
    saveStudentsToStorage(students);

    return {
      success: true,
      data: created
    };
  },

  /**
   * Update student academic data
   */
  async updateStudent(id: string, updatedFields: Partial<Student>): Promise<{ success: boolean; data?: Student; error?: string }> {
    await delay(400);
    const students = loadStudentsFromStorage();
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
      return {
        success: false,
        error: '修改失败：未能在系统数据库中找到该名学生的对应记录。'
      };
    }

    // Check unique key collision if student_id is changed
    if (updatedFields.studentId && updatedFields.studentId !== students[index].studentId) {
      const exists = students.some(s => s.studentId === updatedFields.studentId);
      if (exists) {
        return {
          success: false,
          error: `学籍号冲突：系统中已存有学号【${updatedFields.studentId}】的另一名学生。`
        };
      }
    }

    const currentStudent = students[index];
    const updated: Student = {
      ...currentStudent,
      ...updatedFields,
      id: currentStudent.id // Prevent id modification
    };

    students[index] = updated;
    saveStudentsToStorage(students);

    return {
      success: true,
      data: updated
    };
  },

  /**
   * Delete student registry (学籍注销)
   */
  async deleteStudent(id: string): Promise<boolean> {
    await delay(300);
    const students = loadStudentsFromStorage();
    const filtered = students.filter(s => s.id !== id);
    if (filtered.length !== students.length) {
      saveStudentsToStorage(filtered);
      return true;
    }
    return false;
  }
};

// Preset NUAA campus management staff logins (教务管理员 / 辅导员)
const PRESET_ACCOUNTS = [
  { username: 'admin', password: 'password', name: '王德才', role: '教务管理员' as const },
  { username: 'fudaoyuan1', password: 'password', name: '陈晨', role: '辅导员' as const, college: '计算机科学与技术学院' },
  { username: 'fudaoyuan2', password: 'password', name: '李静', role: '辅导员' as const, college: '航空学院' }
];

export const AuthService = {
  /**
   * Perform secure digital admin system login authentication
   */
  async login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await delay(600); // Encryption algorithm & verification lag emulation
    
    if (!username.trim()) {
      return { success: false, error: '请输入专属管理登录账号！' };
    }
    if (!password.trim()) {
      return { success: false, error: '请输入管理员账户对应的密码！' };
    }

    const match = PRESET_ACCOUNTS.find(
      acc => acc.username.toLowerCase() === username.toLowerCase().trim() && acc.password === password
    );

    if (match) {
      const user: User = {
        username: match.username,
        name: match.name,
        role: match.role,
        college: match.college
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      return { success: true, user };
    }

    return {
      success: false,
      error: '认证失败：专属通道账号或密码不匹配，请核实教务授权。'
    };
  },

  /**
   * Get current auth context details
   */
  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (_) {
      return null;
    }
  },

  /**
   * System logout / destroy credentials
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
};
