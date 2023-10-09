import{_ as o}from"./chunks/ArticleMetadata.ab99b5ed.js";import{_ as c,E as r,o as e,c as i,J as y,w as A,k as p,a as d,S as f,b as C,e as D}from"./chunks/framework.2a90b486.js";import"./chunks/index.9238ff01.js";import"./chunks/utils.0af74d36.js";import"./chunks/md5.3e7612d8.js";const N=JSON.parse('{"title":"TypeScript 的interface","description":"","frontmatter":{"title":"TypeScript 的interface","author":"DBAAZzz","date":"2023/09/25 00:00","categories":["TypeScript入门学习"],"tags":["TypeScript","interface"]},"headers":[],"relativePath":"courses/typescript/01-基础学习/07-TypeScript的interface.md","filePath":"courses/typescript/01-基础学习/07-TypeScript的interface.md","lastUpdated":1696171911000}'),_={name:"courses/typescript/01-基础学习/07-TypeScript的interface.md"},h=p("h1",{id:"typescript-的-interface",tabindex:"-1"},[d("TypeScript 的 interface "),p("a",{class:"header-anchor",href:"#typescript-的-interface","aria-label":'Permalink to "TypeScript 的 interface"'},"​")],-1),m=f(`<p>interface 是对象的模版，可以看作是一种类型约定，中文译为“接口”。</p><h2 id="interface-的继承" tabindex="-1">interface 的继承 <a class="header-anchor" href="#interface-的继承" aria-label="Permalink to &quot;interface 的继承&quot;">​</a></h2><p>interface 可以继承其他的类型</p><h3 id="interface-继承-interface" tabindex="-1">interface 继承 interface <a class="header-anchor" href="#interface-继承-interface" aria-label="Permalink to &quot;interface 继承 interface&quot;">​</a></h3><p>interface 可以使用 extends 关键字，继承其他的 interface</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">interface</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Style</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F69D50;">color</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">interface</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Shape</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F69D50;">name</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">// 可以多种继承</span></span>
<span class="line"><span style="color:#F47067;">interface</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Circle</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">extends</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Style</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">Shape</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F69D50;">radius</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">number</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">interface</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Style</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">color</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">interface</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Shape</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">name</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 可以多种继承</span></span>
<span class="line"><span style="color:#D73A49;">interface</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Circle</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">extends</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Style</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">Shape</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">radius</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,6);function B(s,u,F,E,S,T){const l=o,t=r("ClientOnly");return e(),i("div",null,[h,y(t,null,{default:A(()=>{var a,n;return[(((a=s.$frontmatter)==null?void 0:a.aside)??!0)&&(((n=s.$frontmatter)==null?void 0:n.showArticleMetadata)??!0)?(e(),C(l,{key:0,article:s.$frontmatter},null,8,["article"])):D("",!0)]}),_:1}),m])}const P=c(_,[["render",B]]);export{N as __pageData,P as default};
