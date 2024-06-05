import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import './index.scss';
import {EnhanceAppContext} from 'vitepress/dist/client';
// @ts-ignore
import Index from '../components/index.vue'

export default {
    ...DefaultTheme,
    enhanceApp(ctx: EnhanceAppContext) {
        DefaultTheme.enhanceApp(ctx)
        ctx.app.component('Index', Index)
    }
}