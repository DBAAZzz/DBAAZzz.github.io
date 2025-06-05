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
        text: '从0开始学vue3',
        link: '/courses/从0开始学vue3/index',
        activeMatch: '/courses/从0开始学vue3/',
      },
      {
        text: '杂项',
        link: '/courses/杂项/index',
        activeMatch: '/courses/杂项/',
      },
      {
        text: '面试',
        link: '/courses/面试/index',
        activeMatch: '/courses/面试/',
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
