<template>
  <div class="home">
    <div v-if="!isLoggedIn" class="welcome-container">
      <div class="welcome-card">
        <h1 class="welcome-title">欢迎使用错题本小程序</h1>
        <p class="welcome-subtitle">智能分析错题，提升学习效率</p>
        <div class="welcome-description">
          <p>这是一个专为学生设计的错题管理和学习分析平台，帮助你：</p>
          <ul>
            <li>系统化管理错题，随时查阅</li>
            <li>智能分析薄弱知识点</li>
            <li>生成个性化学习计划</li>
            <li>追踪学习进度，提高效率</li>
          </ul>
        </div>
        <router-link to="/login" class="login-btn">微信登录</router-link>
      </div>
    </div>
    <div v-else class="dashboard-container">
      <div class="welcome-banner">
        <h1 class="welcome-back">欢迎回来，<span class="username">{{ $store.state.user.nickname || '同学' }}</span></h1>
        <p class="welcome-message">今天是学习的好日子，继续努力吧！</p>
      </div>
      
      <div class="feature-cards">
        <router-link to="/profile" class="feature-card">
          <div class="card-icon">👤</div>
          <h3 class="card-title">个人资料</h3>
          <p class="card-description">管理你的个人信息和学习偏好</p>
        </router-link>
        
        <router-link to="/questions" class="feature-card">
          <div class="card-icon">📝</div>
          <h3 class="card-title">我的错题</h3>
          <p class="card-description">查看和管理你收集的所有错题</p>
        </router-link>
        
        <router-link to="/curriculum" class="feature-card">
          <div class="card-icon">📚</div>
          <h3 class="card-title">课程大纲</h3>
          <p class="card-description">浏览学科知识体系和知识点</p>
        </router-link>
        
        <router-link to="/progress" class="feature-card">
          <div class="card-icon">📊</div>
          <h3 class="card-title">学习进度</h3>
          <p class="card-description">查看你的学习进展和成就</p>
        </router-link>
        
        <router-link to="/analysis" class="feature-card">
          <div class="card-icon">🔍</div>
          <h3 class="card-title">薄弱点分析</h3>
          <p class="card-description">发现需要加强的知识点</p>
        </router-link>
        
        <router-link to="/learning-plans" class="feature-card">
          <div class="card-icon">📅</div>
          <h3 class="card-title">学习计划</h3>
          <p class="card-description">制定和跟踪个性化学习计划</p>
        </router-link>
      </div>
      
      <div class="logout-container">
        <button @click="logout" class="logout-btn">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'HomeView',
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  methods: {
    ...mapActions(['logout'])
  }
}
</script>

<style scoped>
.home {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #2c3e50;
  padding: 20px;
}

/* 未登录状态样式 */
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.welcome-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 700px;
  text-align: center;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.welcome-subtitle {
  font-size: 1.3rem;
  color: #3498db;
  margin-bottom: 30px;
}

.welcome-description {
  text-align: left;
  margin-bottom: 30px;
}

.welcome-description p {
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.welcome-description ul {
  padding-left: 20px;
}

.welcome-description li {
  margin-bottom: 10px;
  font-size: 1.05rem;
  line-height: 1.5;
}

.login-btn {
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
}

.login-btn:hover {
  background-color: #2980b9;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
}

/* 已登录状态样式 */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.8s ease-out;
}

.welcome-banner {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-bottom: 40px;
  text-align: center;
}

.welcome-back {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.username {
  color: #3498db;
  font-weight: 700;
}

.welcome-message {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.feature-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 25px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.card-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.card-description {
  color: #7f8c8d;
  font-size: 0.95rem;
  line-height: 1.5;
}

.logout-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 40px;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #c0392b;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-card {
    padding: 25px;
    margin: 0 15px;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-subtitle {
    font-size: 1.1rem;
  }
  
  .feature-cards {
    grid-template-columns: 1fr;
  }
  
  .welcome-banner {
    padding: 20px;
  }
  
  .welcome-back {
    font-size: 1.6rem;
  }
}
</style>