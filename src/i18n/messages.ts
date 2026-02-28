export type Locale = 'en' | 'zh'

export const messages = {
  en: {
    navHome: 'Home',
    navPosts: 'Posts',
    navPhotos: 'Photos',
    navAbout: 'About',
    navPrimaryLabel: 'Primary navigation',
    languageLabel: 'Language',
    themeLabel: 'Theme mode',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',

    homeKicker: 'Minimal Notes',
    homeTitle: 'Designing simple software, one post at a time.',
    homeDescription:
      "This is a minimal blog inspired by antfu's structure with a Notion-like neutral visual system. Focus is on writing clarity and calm reading rhythm.",
    homeRecentPosts: 'Recent Posts',
    homeViewAll: 'View all',

    postsTitle: 'Posts',
    postsDescription: 'Writing on web design, development workflow, and product thinking.',
    postsFilterLabel: 'Filter posts by tag',
    postsAll: 'All',

    photosTitle: 'Photo Wall',
    photosDescription: 'A calm visual timeline, optimized for fast loading and reuse.',
    photosEmpty: 'No photos yet. Put images into the /photos folder and run pnpm photos.',

    postBackToPosts: 'Back to posts',
    postNotFoundTitle: 'Post not found',
    postNotFoundDescription: 'The post may be private, moved, or still in draft mode.',
    postGoAll: 'Go to all posts',

    aboutTitle: 'About',
    aboutDescription: 'A minimal personal corner for notes, experiments, and shipping logs.',
    aboutWho: 'Who I am',
    aboutWhoText:
      'I build small products and write practical notes about frontend architecture, UX details, and developer tooling.',
    aboutStack: 'Tech stack',
    aboutStackText: 'Vue, TypeScript, Vite, and a strong preference for clear interfaces.',
    aboutContact: 'Contact',

    notFoundTitle: 'Page not found',
    notFoundDescription: 'The page you requested does not exist.',
    notFoundBackHome: 'Back to home',

    tagsLabel: 'Tags',
    footerBuiltWith: 'Built with Vue and Vite.',
  },
  zh: {
    navHome: '首页',
    navPosts: '文章',
    navPhotos: '照片墙',
    navAbout: '关于',
    navPrimaryLabel: '主导航',
    languageLabel: '语言',
    themeLabel: '主题模式',
    themeLight: '浅色',
    themeDark: '深色',
    themeSystem: '跟随系统',

    homeKicker: '极简笔记',
    homeTitle: '一次写一篇，持续打磨简单的软件。',
    homeDescription: '这是一个参考 antfu 结构与 Notion 中性配色的极简博客，聚焦清晰表达与平静阅读节奏。',
    homeRecentPosts: '最新文章',
    homeViewAll: '查看全部',

    postsTitle: '文章',
    postsDescription: '记录 Web 设计、开发工作流与产品思考。',
    postsFilterLabel: '按标签筛选文章',
    postsAll: '全部',

    photosTitle: '照片墙',
    photosDescription: '一组克制简洁、加载优化的视觉记录。',
    photosEmpty: '暂无照片。请把图片放到 /photos 目录后执行 pnpm photos。',

    postBackToPosts: '返回文章列表',
    postNotFoundTitle: '未找到文章',
    postNotFoundDescription: '这篇文章可能是私有、已移动，或仍处于草稿状态。',
    postGoAll: '查看全部文章',

    aboutTitle: '关于',
    aboutDescription: '一个用于记录笔记、实验和交付日志的极简个人空间。',
    aboutWho: '我是谁',
    aboutWhoText: '我专注于构建小而实用的产品，并写下前端架构、UX 细节与开发工具相关的实践。',
    aboutStack: '技术栈',
    aboutStackText: 'Vue、TypeScript、Vite，以及对清晰接口设计的偏好。',
    aboutContact: '联系方式',

    notFoundTitle: '页面不存在',
    notFoundDescription: '你访问的页面不存在。',
    notFoundBackHome: '返回首页',

    tagsLabel: '标签',
    footerBuiltWith: '由 Vue 与 Vite 构建。',
  },
} as const

export type MessageKey = keyof (typeof messages)['en']
