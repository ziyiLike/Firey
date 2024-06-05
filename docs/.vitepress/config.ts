import {defineConfig} from 'vitepress'
import NavList from './route/navList'
import SidebarComponent from './route/sidebarComponent'

export default defineConfig({
    lang: 'en-US',
    title: 'Firey',
    description: 'A cross-era framework for Node Js Web services.',
    lastUpdated: true,
    head: [
        // 添加图标
        [
            'link',
            {rel: 'icon', href: 'http://81.68.222.165:9000/ziyi-like/firey.jpg?Content-Type=image/png'}
        ]
    ],
    themeConfig: {
        logo: '',
        siteTitle: 'Firey',
        socialLinks: [{icon: 'github', link: 'https://github.com/ziyiLike/Firefly'}],
        nav: NavList,
        sidebar: {
            '/document/': SidebarComponent
        },
        editLink: {
            pattern: 'https://github.com/ziyiLike/Firefly/docs/:path',
            text: 'Edit this page on GitHub'
        },
    },
    markdown: {}
})