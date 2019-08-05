import Vue from 'vue'
import SvgIcon from '@/components/svg-icon'// svg组件

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('@/assets/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)