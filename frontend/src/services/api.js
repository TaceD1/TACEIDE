import axios from 'axios';
import store from '../store';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  config => {
    const token = store.state.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理常见错误
apiClient.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    // 处理401未授权错误 - 清除token并重定向到登录页
    if (response && response.status === 401) {
      store.dispatch('logout');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// 用户相关API
const userApi = {
  // 微信登录
  wechatLogin(code) {
    return apiClient.post('/users/wechat-login/', { code });
  },
  
  // 获取用户资料
  getProfile() {
    return apiClient.get('/users/profile/');
  },
  
  // 更新用户资料
  updateProfile(profileData) {
    return apiClient.put('/users/profile/', profileData);
  }
};

// 错题相关API
const questionApi = {
  // 获取错题列表
  getQuestions(params = {}) {
    return apiClient.get('/questions/', { params });
  },
  
  // 获取单个错题详情
  getQuestion(id) {
    return apiClient.get(`/questions/${id}/`);
  },
  
  // 创建新错题
  createQuestion(questionData) {
    const formData = new FormData();
    
    // 处理图片上传
    if (questionData.image && questionData.image instanceof File) {
      formData.append('image', questionData.image);
    }
    
    // 添加其他字段
    if (questionData.content) formData.append('content', questionData.content);
    if (questionData.answer) formData.append('answer', questionData.answer);
    if (questionData.explanation) formData.append('explanation', questionData.explanation);
    if (questionData.knowledge_points) {
      // 处理知识点数组
      if (Array.isArray(questionData.knowledge_points)) {
        questionData.knowledge_points.forEach(kp => {
          formData.append('knowledge_points', kp);
        });
      } else {
        formData.append('knowledge_points', questionData.knowledge_points);
      }
    }
    
    return apiClient.post('/questions/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 更新错题
  updateQuestion(id, questionData) {
    const formData = new FormData();
    
    // 处理图片上传
    if (questionData.image && questionData.image instanceof File) {
      formData.append('image', questionData.image);
    }
    
    // 添加其他字段
    if (questionData.content) formData.append('content', questionData.content);
    if (questionData.answer) formData.append('answer', questionData.answer);
    if (questionData.explanation) formData.append('explanation', questionData.explanation);
    if (questionData.knowledge_points) {
      // 处理知识点数组
      if (Array.isArray(questionData.knowledge_points)) {
        questionData.knowledge_points.forEach(kp => {
          formData.append('knowledge_points', kp);
        });
      } else {
        formData.append('knowledge_points', questionData.knowledge_points);
      }
    }
    
    return apiClient.put(`/questions/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 删除错题
  deleteQuestion(id) {
    return apiClient.delete(`/questions/${id}/`);
  }
};

// 课程大纲相关API
const curriculumApi = {
  // 获取学科列表
  getSubjects() {
    return apiClient.get('/curriculum/subjects/');
  },
  
  // 获取年级列表
  getGrades() {
    return apiClient.get('/curriculum/grades/');
  },
  
  // 获取课程大纲列表
  getCurriculums(params = {}) {
    return apiClient.get('/curriculum/curriculums/', { params });
  },
  
  // 获取单个课程大纲详情
  getCurriculum(id) {
    return apiClient.get(`/curriculum/curriculums/${id}/`);
  },
  
  // 获取知识点列表
  getKnowledgePoints(params = {}) {
    return apiClient.get('/curriculum/knowledge-points/', { params });
  },
  
  // 获取单个知识点详情
  getKnowledgePoint(id) {
    return apiClient.get(`/curriculum/knowledge-points/${id}/`);
  },
  
  // 获取学习资源
  getLearningResources(params = {}) {
    return apiClient.get('/curriculum/learning-resources/', { params });
  }
};

// 分析相关API
const analysisApi = {
  // 获取薄弱点分析
  getWeaknessAnalysis() {
    return apiClient.get('/analysis/weakness/');
  },
  
  // 获取学习建议
  getRecommendations(params = {}) {
    return apiClient.get('/analysis/recommendations/', { params });
  },
  
  // 生成针对性测试
  generateTest(params = {}) {
    return apiClient.get('/analysis/generate-test/', { params });
  },
  
  // 获取学习进度
  getProgressTracker(params = {}) {
    return apiClient.get('/analysis/progress-tracker/', { params });
  },
  
  // 更新知识点掌握程度
  updateProgress(data) {
    return apiClient.post('/analysis/update-progress/', data);
  },
  
  // 获取学习计划列表
  getLearningPlans(params = {}) {
    return apiClient.get('/analysis/learning-plans/', { params });
  },
  
  // 获取单个学习计划
  getLearningPlan(id) {
    return apiClient.get(`/analysis/learning-plans/${id}/`);
  },
  
  // 创建学习计划
  createLearningPlan(planData) {
    return apiClient.post('/analysis/learning-plans/', planData);
  },
  
  // 更新学习计划
  updateLearningPlan(id, planData) {
    return apiClient.put(`/analysis/learning-plans/${id}/`, planData);
  },
  
  // 获取学习计划项目列表
  getLearningPlanItems(planId) {
    return apiClient.get(`/analysis/learning-plans/${planId}/items/`);
  },
  
  // 更新学习计划项目
  updateLearningPlanItem(itemId, itemData) {
    return apiClient.put(`/analysis/learning-plan-items/${itemId}/`, itemData);
  },
  
  // 获取分析报告列表
  getReports(params = {}) {
    return apiClient.get('/analysis/reports/', { params });
  },
  
  // 获取单个分析报告
  getReport(id) {
    return apiClient.get(`/analysis/reports/${id}/`);
  }
};

export {
  apiClient,
  userApi,
  questionApi,
  curriculumApi,
  analysisApi
};