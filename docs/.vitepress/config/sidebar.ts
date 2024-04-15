import type { DefaultTheme } from 'vitepress';
import fg from 'fast-glob';
import matter from 'gray-matter';
const sync = fg.sync;

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/courses/typescript/': getItems('courses/typescript'),
  '/courses/react/': getItems('courses/react'),
  '/courses/node/': getItems('courses/node'),
};

/**
 * 根据 某小课/序号-分组/序号-xxx.md 的目录格式, 获取侧边栏分组及分组下标题
 *
 * courses/mybatis/01-MyBatis基础/01-xxx.md
 *
 * @param path 扫描基础路径
 * @returns {DefaultTheme.SidebarItem[]}
 */
function getItems(path: string) {
  // 侧边栏分组数组
  let groups: DefaultTheme.SidebarItem[] = [];
  // 侧边栏分组下标题数组
  let items: DefaultTheme.SidebarItem[] = [];
  let total = 0;
  // 当分组内文章数量少于 2 篇或文章总数显示超过 20 篇时，自动折叠分组
  const groupCollapsedSize = 2;
  const titleCollapsedSize = 20;

  // 1.获取所有分组目录
  sync(`docs/${path}/*`, {
    onlyDirectories: true,
    objectMode: true,
  }).forEach(({ name }) => {
    let groupName = name;
    // 2.获取分组下的所有文章
    sync(`docs/${path}/${groupName}/*`, {
      onlyFiles: true,
      objectMode: true,
    }).forEach((article) => {
      const articleFile = matter.read(`${article.path}`);
      const { data } = articleFile;
      // 向前追加标题
      items.push({
        text: data.title,
        link: `/${path}/${groupName}/${article.name.replace('.md', '')}`,
      });
      total += 1;
    });

    // 3.向前追加到分组
    // 当分组内文章数量少于 A 篇或文章总数显示超过 B 篇时，自动折叠分组
    groups.push({
      text: `${groupName.substring(groupName.indexOf('-') + 1)} (${items.length
        }篇)`,
      items: items,
      collapsed:
        items.length < groupCollapsedSize || total > titleCollapsedSize,
    });

    // 4.清空侧边栏分组下标题数组
    items = [];
  });

  // 添加序号
  addOrderNumber(groups);
  return groups;
}

/**
 * 添加序号
 *
 * @param groups 分组数据
 */
function addOrderNumber(groups) {
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].items.length; j++) {
      const items = groups[i].items;
      const index = j + 1;
      let indexStyle = `<div class="text-color-gray mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
      if (index == 1) {
        indexStyle = `<div class="text-color-red mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
      } else if (index == 2) {
        indexStyle = `<div class="text-color-orange mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
      } else if (index == 3) {
        indexStyle = `<div class="text-color-yellow mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
      }
      items[j].text = `${indexStyle}${items[j].text}`;
    }
  }
}
