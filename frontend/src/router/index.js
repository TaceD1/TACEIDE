import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import QuestionListView from '../views/QuestionListView.vue'
import QuestionDetailView from '../views/QuestionDetailView.vue'
import AnalysisView from '../views/AnalysisView.vue'
import CurriculumView from '../views/CurriculumView.vue'
import LearningPlanView from '../views/LearningPlanView.vue'
import ProgressTrackerView from '../views/ProgressTrackerView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/questions',
    name: 'questions',
    component: QuestionListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/questions/:id',
    name: 'question-detail',
    component: QuestionDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/analysis',
    name: 'analysis',
    component: AnalysisView,
    meta: { requiresAuth: true }
  },
  {
    path: '/curriculum',
    name: 'curriculum',
    component: CurriculumView,
    meta: { requiresAuth: true }
  },
  {
    path: '/learning-plans',
    name: 'learning-plans',
    component: LearningPlanView,
    meta: { requiresAuth: true }
  },
  {
    path: '/progress',
    name: 'progress',
    component: ProgressTrackerView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token')

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router