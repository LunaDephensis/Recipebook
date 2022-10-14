import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/myrecipes',
    name: 'MyRecipes',
    meta: {
      requiresAuth: true
    },
    component: () => import('../views/MyRecipes.vue')
  },
  {
    path: '/recipe/:id',
    name: 'Recipe',
    meta: {
      requiresAuth: true
    },
    component: () => import('../views/Recipe.vue')
  },
  {
    path: '/newrecipe',
    name: 'NewRecipe',
    meta: {
      requiresAuth: true
    },
    component: () => import('../views/NewRecipe.vue')
  },
  {
    path: '/recipe/edit/:id',
    name: 'EditRecipe',
    meta: {
      requiresAuth: true
    },
    component: () => import('../views/EditRecipe.vue')
  },
  {
    path: '/error',
    name: 'ErrorPage',
    component: () => import('../views/ErrorPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if(to.hash) {
      return {
        el: to.hash,
        top: 90,
        behavior: 'smooth'
      }
    }
    else {
      return {
        top: 0
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    let token = localStorage.getItem('token');
    if(token) {
      next()
    }
    else {
      next({name: 'Main'})
    }
  }
  else {
    next()
  }
})

export default router
