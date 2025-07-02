<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-logo">错题本</router-link>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': isMenuActive }" v-if="isAuthenticated">
      <router-link to="/" class="navbar-item" exact-active-class="is-active">首页</router-link>
      <router-link to="/profile" class="navbar-item" active-class="is-active">个人资料</router-link>
      <router-link to="/questions" class="navbar-item" active-class="is-active">我的错题</router-link>
      <router-link to="/curriculum" class="navbar-item" active-class="is-active">课程大纲</router-link>
      <router-link to="/progress" class="navbar-item" active-class="is-active">学习进度</router-link>
      <router-link to="/analysis" class="navbar-item" active-class="is-active">薄弱点分析</router-link>
      <router-link to="/learning-plans" class="navbar-item" active-class="is-active">学习计划</router-link>
    </div>
    <div class="navbar-end" v-if="isAuthenticated">
      <div class="navbar-item">
        <button @click="logout" class="button is-danger">退出登录</button>
      </div>
    </div>
    <button 
      class="navbar-burger" 
      :class="{ 'is-active': isMenuActive }" 
      @click="toggleMenu"
      v-if="isAuthenticated">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NavBar',
  data() {
    return {
      isMenuActive: false
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'user'
    ])
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    toggleMenu() {
      this.isMenuActive = !this.isMenuActive
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a4a4a;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  align-items: center;
}

.navbar-item {
  padding: 0.5rem 1rem;
  color: #4a4a4a;
  text-decoration: none;
  transition: color 0.3s;
}

.navbar-item:hover, .navbar-item.is-active {
  color: #3273dc;
}

.navbar-end {
  margin-left: auto;
}

.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.button.is-danger {
  background-color: #ff3860;
  color: white;
}

.navbar-burger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.navbar-burger span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: #4a4a4a;
  margin: 5px 0;
  transition: all 0.3s;
}

@media screen and (max-width: 768px) {
  .navbar-menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #f8f9fa;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
  
  .navbar-menu.is-active {
    display: flex;
  }
  
  .navbar-burger {
    display: block;
  }
  
  .navbar-burger.is-active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .navbar-burger.is-active span:nth-child(2) {
    opacity: 0;
  }
  
  .navbar-burger.is-active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }
  
  .navbar-end {
    margin: 0;
    width: 100%;
    padding: 0.5rem;
  }
}
</style>