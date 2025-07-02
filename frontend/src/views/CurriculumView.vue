<template>
  <div class="curriculum">
    <AlertMessage 
      v-if="alert.show" 
      :type="alert.type" 
      :message="alert.message" 
      :duration="alert.duration"
    />
    <LoadingSpinner v-if="loading" message="加载课程数据中..."/>
    
    <div class="curriculum-container" v-if="!loading">
      <div class="curriculum-header">
        <h2>课程大纲浏览</h2>
        <p class="description">浏览和查看各学科、年级的课程大纲和知识点</p>
      </div>
      
      <div class="filters">
        <div class="filter-group">
          <label>学科:</label>
          <select v-model="selectedSubject" @change="fetchGrades" class="filter-select">
            <option value="">请选择学科</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.name }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>年级:</label>
          <select v-model="selectedGrade" @change="fetchCurriculums" :disabled="!selectedSubject" class="filter-select">
            <option value="">请选择年级</option>
            <option v-for="grade in grades" :key="grade.id" :value="grade.id">{{ grade.name }}</option>
          </select>
        </div>
      </div>
    
    <div v-if="curriculums.length > 0" class="curriculum-list">
      <div v-for="curriculum in curriculums" :key="curriculum.id" class="curriculum-item">
        <div class="curriculum-item-header">
          <h3>{{ curriculum.name }}</h3>
          <span class="curriculum-badge">{{ getSubjectName(curriculum.subject) }}</span>
        </div>
        <p class="curriculum-description">{{ curriculum.description }}</p>
        <div class="curriculum-meta">
          <span class="grade-info">适用年级: {{ getGradeName(curriculum.grade) }}</span>
        </div>
        <button @click="viewCurriculumDetail(curriculum.id)" class="detail-btn">
          <i class="icon-detail"></i> 查看详情
        </button>
      </div>
    </div>
    
    <div v-else-if="selectedGrade && !loading" class="no-data">
      <div class="no-data-icon">📚</div>
      <h3>没有找到相关课程大纲</h3>
      <p>请尝试选择其他学科或年级</p>
    </div>
    
    <div v-if="selectedCurriculum" class="curriculum-detail">
      <div class="detail-header">
        <h3>{{ selectedCurriculum.name }}</h3>
        <button @click="closeDetail" class="close-btn">
          <i class="icon-close"></i> 关闭
        </button>
      </div>
      
      <div class="chapters-container">
        <div v-for="chapter in selectedCurriculum.chapters" :key="chapter.id" class="chapter">
          <div class="chapter-header">
            <h4>{{ chapter.name }}</h4>
            <span class="chapter-number">第 {{ chapter.order || '?' }} 章</span>
          </div>
          <p class="chapter-description">{{ chapter.description }}</p>
          
          <div class="knowledge-points">
            <h5>知识点</h5>
            <div class="knowledge-points-list">
              <div 
                v-for="point in chapter.knowledge_points" 
                :key="point.id"
                class="knowledge-point-item"
              >
                <div class="point-name">{{ point.name }}</div>
                <div 
                  v-if="point.mastery_level" 
                  :class="['mastery-badge', 'mastery-' + point.mastery_level]"
                >
                  {{ getMasteryText(point.mastery_level) }}
                </div>
                <div class="point-actions">
                  <button @click="updateMastery(point)" class="small-btn">
                    更新掌握度
                  </button>
                  <button @click="findResources(point.name)" class="small-btn">
                    学习资源
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showMasteryUpdate" class="mastery-update-modal">
      <div class="modal-content">
        <h3>更新知识点掌握程度</h3>
        <p>{{ selectedKnowledgePoint ? selectedKnowledgePoint.name : '' }}</p>
        
        <div class="mastery-selector">
          <button 
            v-for="level in 5" 
            :key="level"
            :class="['mastery-btn', 'mastery-' + level, {'active': currentMasteryLevel === level}]"
            @click="currentMasteryLevel = level"
          >
            {{ level }} - {{ getMasteryText(level) }}
          </button>
        </div>
        
        <div class="modal-actions">
          <button @click="saveMasteryUpdate" class="primary-btn">保存</button>
          <button @click="showMasteryUpdate = false" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import { curriculumApi, analysisApi } from '@/services/api'

export default {
  name: 'CurriculumView',
  components: {
    LoadingSpinner,
    AlertMessage
  },
  data() {
    return {
      subjects: [],
      grades: [],
      curriculums: [],
      selectedSubject: '',
      selectedGrade: '',
      selectedCurriculum: null,
      loading: false,
      showMasteryUpdate: false,
      selectedKnowledgePoint: null,
      currentMasteryLevel: 1,
      alert: {
        show: false,
        type: 'success',
        message: '',
        duration: 3000
      }
    }
  },
  created() {
    this.fetchSubjects()
  },
  methods: {
    fetchSubjects() {
      this.loading = true
      
      curriculumApi.getSubjects()
        .then(response => {
          this.subjects = response.data
          this.loading = false
        })
        .catch(error => {
          console.error('获取学科列表失败:', error)
          this.loading = false
          this.showAlert('error', '获取学科列表失败，请重试')
        })
    },
    fetchGrades() {
      if (!this.selectedSubject) {
        this.grades = []
        this.selectedGrade = ''
        return
      }
      
      this.loading = true
      
      curriculumApi.getGrades({ subject: this.selectedSubject })
        .then(response => {
          this.grades = response.data
          this.loading = false
        })
        .catch(error => {
          console.error('获取年级列表失败:', error)
          this.loading = false
          this.showAlert('error', '获取年级列表失败，请重试')
        })
    },
    fetchCurriculums() {
      if (!this.selectedGrade) {
        this.curriculums = []
        return
      }
      
      this.loading = true
      
      curriculumApi.getCurriculums({ 
        subject: this.selectedSubject,
        grade: this.selectedGrade 
      })
      .then(response => {
        this.curriculums = response.data
        this.loading = false
      })
      .catch(error => {
        console.error('获取课程大纲失败:', error)
        this.loading = false
        this.showAlert('error', '获取课程大纲失败，请重试')
      })
    },
    viewCurriculumDetail(curriculumId) {
      this.loading = true
      
      curriculumApi.getCurriculumDetail(curriculumId)
        .then(response => {
          this.selectedCurriculum = response.data
          this.loading = false
        })
        .catch(error => {
          console.error('获取课程大纲详情失败:', error)
          this.loading = false
          this.showAlert('error', '获取课程大纲详情失败，请重试')
        })
    },
    getMasteryText(level) {
      const levels = {
        1: '不熟悉',
        2: '了解',
        3: '掌握',
        4: '精通',
        5: '熟练'
      }
      return levels[level] || '未知'
    },
    
    getSubjectName(subjectId) {
      const subject = this.subjects.find(s => s.id === subjectId)
      return subject ? subject.name : '未知学科'
    },
    
    getGradeName(gradeId) {
      const grade = this.grades.find(g => g.id === gradeId)
      return grade ? grade.name : '未知年级'
    },
    
    closeDetail() {
      this.selectedCurriculum = null
    },
    
    updateMastery(knowledgePoint) {
      this.selectedKnowledgePoint = knowledgePoint
      this.currentMasteryLevel = knowledgePoint.mastery_level || 1
      this.showMasteryUpdate = true
    },
    
    saveMasteryUpdate() {
      if (!this.selectedKnowledgePoint) return
      
      this.loading = true
      
      analysisApi.updateProgress({
        knowledge_point: this.selectedKnowledgePoint.id,
        mastery_level: this.currentMasteryLevel
      })
      .then(() => {
        // 更新本地数据
        if (this.selectedKnowledgePoint) {
          this.selectedKnowledgePoint.mastery_level = this.currentMasteryLevel
        }
        this.showMasteryUpdate = false
        this.loading = false
        this.showAlert('success', '掌握程度已更新')
      })
      .catch(error => {
        console.error('更新掌握程度失败:', error)
        this.loading = false
        this.showAlert('error', '更新失败，请重试')
      })
    },
    
    findResources(knowledgePointName) {
      this.loading = true
      
      curriculumApi.getLearningResources({ knowledge_point_name: knowledgePointName })
        .then(response => {
          this.loading = false
          if (response.data.length > 0) {
            this.showAlert('success', `找到 ${response.data.length} 个相关资源`)
            // 可以在这里实现资源展示逻辑
          } else {
            this.showAlert('info', '暂无相关学习资源')
          }
        })
        .catch(error => {
          console.error('查找资源失败:', error)
          this.loading = false
          this.showAlert('error', '查找资源失败，请重试')
        })
    },
    
    showAlert(type, message, duration = 3000) {
      this.alert = {
        show: true,
        type,
        message,
        duration
      }
      
      setTimeout(() => {
        this.alert.show = false
      }, duration)
    }
  }
}
</script>

<style scoped>
.curriculum {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.curriculum-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.curriculum-header {
  margin-bottom: 20px;
  text-align: center;
}

.curriculum-header h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.curriculum-header .description {
  color: #666;
  font-size: 1.1rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: bold;
  color: #2c3e50;
  min-width: 60px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 200px;
  background-color: white;
}

.curriculum-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.curriculum-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.curriculum-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.curriculum-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.curriculum-item h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.curriculum-badge {
  background-color: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.curriculum-description {
  color: #666;
  margin-bottom: 15px;
  flex-grow: 1;
}

.curriculum-meta {
  margin-top: auto;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #777;
}

.detail-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.detail-btn:hover {
  background-color: #3aa876;
}

.no-data {
  text-align: center;
  padding: 40px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.no-data h3 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.no-data p {
  color: #666;
}

.curriculum-detail {
  margin-top: 30px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.detail-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.close-btn {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.close-btn:hover {
  background-color: #e9ecef;
}

.chapters-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.chapter {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  background-color: #f8f9fa;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.chapter h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.chapter-number {
  background-color: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.chapter-description {
  color: #666;
  margin-bottom: 20px;
}

.knowledge-points h5 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
  font-size: 1.1rem;
  border-bottom: 2px solid #42b983;
  padding-bottom: 5px;
  display: inline-block;
}

.knowledge-points-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.knowledge-point-item {
  background-color: white;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.point-name {
  font-weight: bold;
  color: #2c3e50;
}

.mastery-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.mastery-1 {
  background-color: #e74c3c;
}

.mastery-2 {
  background-color: #e67e22;
}

.mastery-3 {
  background-color: #f1c40f;
}

.mastery-4 {
  background-color: #2ecc71;
}

.mastery-5 {
  background-color: #3498db;
}

.point-actions {
  display: flex;
  gap: 8px;
  margin-top: 5px;
}

.small-btn {
  padding: 4px 8px;
  font-size: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s;
}

.small-btn:hover {
  background-color: #e9ecef;
}

.mastery-update-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
}

.mastery-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.mastery-btn {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.1s;
}

.mastery-btn.active {
  transform: scale(1.02);
  border: 2px solid #3498db;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.primary-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.primary-btn:hover {
  background-color: #3aa876;
}

.cancel-btn {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #e9ecef;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .curriculum-list {
    grid-template-columns: 1fr;
  }
  
  .knowledge-points-list {
    grid-template-columns: 1fr;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-select {
    flex-grow: 1;
  }
}
</style>

<style scoped>
.curriculum {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.filters {
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.curriculum-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.curriculum-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.curriculum-detail {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.chapter {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.knowledge-points {
  margin-top: 10px;
}

.mastery-1 { color: #ff4d4f; }
.mastery-2 { color: #faad14; }
.mastery-3 { color: #52c41a; }
.mastery-4 { color: #1890ff; }
.mastery-5 { color: #722ed1; }

.loading, .no-data {
  text-align: center;
  margin: 40px 0;
  color: #999;
}

button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #40a9ff;
}
</style>