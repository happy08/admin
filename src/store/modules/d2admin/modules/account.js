import { Message, MessageBox } from 'element-ui'
import { cookieSet, cookieRemove } from '@/common/cookie'
//import util from '@/libs/util.js'
import router from '@/router'
//import { AccountLogin } from '@api/sys.login'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} param context
     * @param {Object} param userInfo 登陆后获得的用户信息
     */
    login ({ dispatch }, userInfo) {
      return new Promise(async resolve => {
        cookieSet('token', userInfo.token)
        // 用户登录后从持久化数据加载一系列的设置
        await dispatch('load')
        // 结束
        resolve()
      })
    },

    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout () {
        // 删除cookie
        cookieRemove('token')
        //cookieRemove('uuid')
        window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = false
        // 清空 vuex 用户信息
        //await dispatch('d2admin/user/set', {}, { root: true })
        // 跳转路由
        router.push({
          name: 'login'
        })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', {
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({
              message: '取消注销操作'
            })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('d2admin/page/openedLoad', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, { root: true })
        // DB -> store 持久化数据加载颜色设置
        await dispatch('d2admin/color/load', null, { root: true })
        // end
        resolve()
      })
    }
  }
}
