import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: require('@/views/index').default
  },
  {
    path: '/eq',
    component: require('@/views/eq').default
  },
  {
    path: '/wave',
    component: require('@/views/wave').default
  },
  {
    path: '/voice',
    component: require('@/views/voice').default
  },
  {
    path: '/piano',
    component: require('@/views/piano').default
  },
]

const router = new VueRouter({ routes });

export default router