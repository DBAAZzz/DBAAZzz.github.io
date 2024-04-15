import type { DefaultTheme } from 'vitepress';

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '我的小册',
    items: [
      {
        text: 'TypeScript',
        link: '/courses/typescript/index',
        activeMatch: '/courses/typescript/',
      },
      {
        text: 'React 学习',
        link: '/courses/react/index',
        activeMatch: '/courses/react/',
      },
      {
        text: 'Node',
        link: '/courses/node/了解PM2和PM2命令',
        activeMatch: '/courses/node/',
      }
    ],
    activeMatch: '/courses/',
  },
  {
    text: '我的标签',
    link: '/tags',
    activeMatch: '/tags',
  },
];
