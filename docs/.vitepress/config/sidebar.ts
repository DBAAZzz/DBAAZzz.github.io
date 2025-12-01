import type { DefaultTheme } from 'vitepress';
import fg from 'fast-glob';
import matter from 'gray-matter';
const sync = fg.sync;

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/courses/typescript/': getItems('courses/typescript'),
  '/courses/react/': getItems('courses/react'),
  '/courses/从0开始学vue3/': getItems('courses/从0开始学vue3'),
  '/courses/杂项/': getItems('courses/杂项'),
  '/courses/面试/': getItems('courses/面试')
};

/**
 * 根据 某小课/序号-分组/序号-xxx.md 的目录格式, 获取侧边栏分组及分组下标题
 * 支持二级目录结构: 某小课/序号-分组/序号-子分组/序号-xxx.md
 *
 * courses/mybatis/01-MyBatis基础/01-xxx.md
 * courses/面试/04-设计模式/01-创建型模式/01-xxx.md
 *
 * @param path 扫描基础路径
 * @returns {DefaultTheme.SidebarItem[]}
 */
function getItems(path: string) {
  // 侧边栏分组数组
  let groups: DefaultTheme.SidebarItem[] = [];
  let total = 0;

  // 1.获取所有分组目录
  sync(`docs/${path}/*`, {
    onlyDirectories: true,
    objectMode: true,
  }).forEach(({ name }) => {
    let groupName = name;

    // 检查是否存在二级目录
    const subDirs = sync(`docs/${path}/${groupName}/*`, {
      onlyDirectories: true,
      objectMode: true,
    });

    // 如果存在二级目录，则处理二级结构
    if (subDirs.length > 0) {
      let subItems: DefaultTheme.SidebarItem[] = [];
      let groupTotal = 0; // 为当前一级分组单独计数

      subDirs.forEach(({ name: subDirName }) => {
        let items: DefaultTheme.SidebarItem[] = [];

        // 获取二级目录下的所有文章
        sync(`docs/${path}/${groupName}/${subDirName}/*`, {
          onlyFiles: true,
          objectMode: true,
        }).forEach((article) => {
          const articleFile = matter.read(`${article.path}`);
          const { data } = articleFile;
          items.push({
            text: data.title,
            link: `/${path}/${groupName}/${subDirName}/${article.name.replace('.md', '')}`,
          });
        });

        if (items.length > 0) {
          subItems.push({
            text: `${subDirName.substring(subDirName.indexOf('-') + 1)} (${items.length}篇)`,
            items: items,
            collapsed: false,
          });
          groupTotal += items.length;
        }
      });

      // 同时处理一级目录下的直接文件（如果有）
      const directFiles = sync(`docs/${path}/${groupName}/*`, {
        onlyFiles: true,
        objectMode: true,
      });

      if (directFiles.length > 0) {
        let directItems: DefaultTheme.SidebarItem[] = [];
        directFiles.forEach((article) => {
          const articleFile = matter.read(`${article.path}`);
          const { data } = articleFile;
          directItems.push({
            text: data.title,
            link: `/${path}/${groupName}/${article.name.replace('.md', '')}`,
          });
        });

        // 将直接文件放在最前面
        if (directItems.length > 0) {
          subItems.unshift({
            text: `概述 (${directItems.length}篇)`,
            items: directItems,
            collapsed: false,
          });
          groupTotal += directItems.length;
        }
      }

      groups.push({
        text: `${groupName.substring(groupName.indexOf('-') + 1)} (${groupTotal}篇)`,
        items: subItems,
        collapsed: false,
      });

    } else {
      // 原有的一级目录处理逻辑
      let items: DefaultTheme.SidebarItem[] = [];

      sync(`docs/${path}/${groupName}/*`, {
        onlyFiles: true,
        objectMode: true,
      }).forEach((article) => {
        const articleFile = matter.read(`${article.path}`);
        const { data } = articleFile;
        items.push({
          text: data.title,
          link: `/${path}/${groupName}/${article.name.replace('.md', '')}`,
        });
        total += 1;
      });

      groups.push({
        text: `${groupName.substring(groupName.indexOf('-') + 1)} (${items.length}篇)`,
        items: items,
        collapsed: false,
      });
    }
  });

  // 添加序号
  addOrderNumber(groups);
  return groups;
}

/**
 * 添加序号
 * 支持二级目录结构：
 * - 一级目录下的直接文章：添加序号
 * - 二级目录分组标题：不添加序号
 * - 二级目录下的文章：添加序号
 *
 * @param groups 分组数据
 */
function addOrderNumber(groups: DefaultTheme.SidebarItem[]) {
  for (let i = 0; i < groups.length; i++) {
    const groupItems = groups[i].items;
    if (!groupItems) continue; // 跳过没有 items 的分组

    for (let j = 0; j < groupItems.length; j++) {
      const currentItem = groupItems[j];

      // 检查当前项是否还有子项（二级分组）
      if (currentItem.items && currentItem.items.length > 0) {
        // 这是一个二级分组，不给分组标题添加序号，但要给其内部的文章添加序号
        for (let k = 0; k < currentItem.items.length; k++) {
          const articleIndex = k + 1;
          let indexStyle = `<div class="text-color-gray mr-[6px]" style="font-weight: 550; display: inline-block;">${articleIndex}</div>`;
          if (articleIndex == 1) {
            indexStyle = `<div class="text-color-red mr-[6px]" style="font-weight: 550; display: inline-block;">${articleIndex}</div>`;
          } else if (articleIndex == 2) {
            indexStyle = `<div class="text-color-orange mr-[6px]" style="font-weight: 550; display: inline-block;">${articleIndex}</div>`;
          } else if (articleIndex == 3) {
            indexStyle = `<div class="text-color-yellow mr-[6px]" style="font-weight: 550; display: inline-block;">${articleIndex}</div>`;
          }
          currentItem.items[k].text = `<div style="display: flex; align-items: flex-start;">${indexStyle}<div style="flex: 1;">${currentItem.items[k].text}</div></div>`;
        }
      } else {
        // 这是一级目录下的直接文章，添加序号
        const index = j + 1;
        let indexStyle = `<div class="text-color-gray mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
        if (index == 1) {
          indexStyle = `<div class="text-color-red mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
        } else if (index == 2) {
          indexStyle = `<div class="text-color-orange mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
        } else if (index == 3) {
          indexStyle = `<div class="text-color-yellow mr-[6px]" style="font-weight: 550; display: inline-block;">${index}</div>`;
        }
        groupItems[j].text = `<div style="display: flex; align-items: flex-start;">${indexStyle}<div style="flex: 1;">${groupItems[j].text}</div></div>`;
      }
    }
  }
}
