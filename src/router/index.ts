import { createRouter, createWebHistory } from 'vue-router'
import AboutPage from '../pages/AboutPage.vue'
import HomePage from '../pages/HomePage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
import PostDetailPage from '../pages/PostDetailPage.vue'
import PostsPage from '../pages/PostsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostsPage,
    },
    {
      path: '/posts/:slug',
      name: 'post-detail',
      component: PostDetailPage,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
