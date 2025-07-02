<template>
  <transition name="fade">
    <div v-if="visible" class="alert" :class="typeClass">
      <div class="alert-content">
        <span class="alert-icon">{{ icon }}</span>
        <div class="alert-message">
          <strong v-if="title" class="alert-title">{{ title }}</strong>
          <p class="alert-text">{{ message }}</p>
        </div>
      </div>
      <button v-if="dismissible" @click="dismiss" class="alert-close">&times;</button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AlertMessage',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: value => ['success', 'info', 'warning', 'error'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 5000 // 5 seconds
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    typeClass() {
      return `alert-${this.type}`;
    },
    icon() {
      const icons = {
        success: '✓',
        info: 'ℹ',
        warning: '⚠',
        error: '✕'
      };
      return icons[this.type];
    }
  },
  mounted() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        this.dismiss();
      }, this.duration);
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    dismiss() {
      this.$emit('dismiss');
    }
  }
}
</script>

<style scoped>
.alert {
  position: relative;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.alert-content {
  display: flex;
  align-items: center;
}

.alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 0.75rem;
  font-weight: bold;
}

.alert-message {
  flex: 1;
}

.alert-title {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
}

.alert-text {
  margin: 0;
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.alert-close:hover {
  opacity: 1;
}

/* Alert types */
.alert-success {
  background-color: #f0faf0;
  border-left: 4px solid #48c774;
  color: #257942;
}

.alert-success .alert-icon {
  background-color: #48c774;
  color: white;
}

.alert-info {
  background-color: #f0f8ff;
  border-left: 4px solid #3298dc;
  color: #1a5a91;
}

.alert-info .alert-icon {
  background-color: #3298dc;
  color: white;
}

.alert-warning {
  background-color: #fffbeb;
  border-left: 4px solid #ffdd57;
  color: #947600;
}

.alert-warning .alert-icon {
  background-color: #ffdd57;
  color: #806c00;
}

.alert-error {
  background-color: #feecf0;
  border-left: 4px solid #f14668;
  color: #cc0f35;
}

.alert-error .alert-icon {
  background-color: #f14668;
  color: white;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>