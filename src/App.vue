<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import util from '@/libs/util'
import { messages } from '@/i18n'

export default {
  name: 'app',
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  created () {
    this.i18nHandle(this.$i18n.locale)
  },
  methods: {
    i18nHandle (val, oldVal) {
      util.cookies.set('lang', val)
      document.querySelector('html').setAttribute('lang', val)
      document.title = messages[val].brand.lg
      // 非登录页面，切换语言刷新页面
      if (this.$route.name !== 'login' && oldVal) {
        window.location.reload()
      }
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/style/public-class.scss';
</style>
