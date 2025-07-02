<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>错题本小程序</h1>
        <p class="login-subtitle">扫码登录，开始智能学习之旅</p>
      </div>
      
      <div class="login-body">
        <div class="qrcode-container">
          <div class="mock-qrcode">
            <span>模拟微信二维码</span>
          </div>
          <p class="qrcode-tip">请使用微信扫一扫登录</p>
        </div>
        
        <div class="divider">
          <span>或</span>
        </div>
        
        <button @click="simulateWechatLogin" class="btn-wechat">
          <span class="wechat-icon">W</span>
          模拟微信登录
        </button>
      </div>
      
      <AlertMessage 
        v-if="showError" 
        type="error" 
        :message="errorMessage" 
        @dismiss="clearError" 
      />
      
      <LoadingSpinner v-if="isLoading" message="登录中..." :overlay="true" />
      
      <div class="login-footer">
        <p>登录即表示您同意我们的<a href="#">服务条款</a>和<a href="#">隐私政策</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AlertMessage from '../components/AlertMessage.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

export default {
  name: 'LoginView',
  components: {
    AlertMessage,
    LoadingSpinner
  },
  data() {
    return {
      showError: false,
      errorMessage: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'error',
      'authStatus'
    ])
  },
  watch: {
    error(newError) {
      if (newError) {
        this.showError = true
        this.errorMessage = newError
      }
    },
    authStatus(newStatus) {
      this.isLoading = newStatus === 'loading'
    }
  },
  mounted() {
    // 检查URL中是否有code参数（微信授权回调）
    const code = this.$route.query.code
    if (code) {
      this.loginWithCode(code)
    }
  },
  methods: {
    ...mapActions([
      'login',
      'clearError'
    ]),
    loginWithCode(code) {
      this.isLoading = true
      this.login(code)
        .then(() => {
          this.$router.push('/')
        })
        .catch(err => {
          console.error('Login error:', err)
          this.showError = true
          this.errorMessage = err.response?.data?.message || '登录失败，请重试'
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    simulateWechatLogin() {
      // 模拟微信登录，生成随机code
      const mockCode = 'mock_' + Math.random().toString(36).substring(2, 15)
      this.loginWithCode(mockCode)
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 1rem;
}

.login-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  position: relative;
}

.login-header {
  padding: 2rem 1.5rem;
  text-align: center;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.login-subtitle {
  color: #6c757d;
  margin-top: 0.5rem;
}

.login-body {
  padding: 2rem 1.5rem;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.mock-qrcode {
  width: 180px;
  height: 180px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.qrcode-tip {
  color: #6c757d;
  font-size: 0.9rem;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #eee;
}

.divider span {
  padding: 0 1rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.btn-wechat {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #07C160;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-wechat:hover {
  background-color: #06ad56;
}

.wechat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: white;
  color: #07C160;
  border-radius: 50%;
  margin-right: 0.5rem;
  font-weight: bold;
}

.login-footer {
  padding: 1.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: #6c757d;
  border-top: 1px solid #eee;
}

.login-footer a {
  color: #3273dc;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}

.error {
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
}
</style>