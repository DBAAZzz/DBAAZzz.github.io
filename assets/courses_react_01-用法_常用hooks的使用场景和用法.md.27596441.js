import{_ as s,o as a,c as n,X as l}from"./chunks/framework.b5b468c2.js";const C=JSON.parse('{"title":"常用hooks的使用场景和用法","description":"","frontmatter":{"title":"常用hooks的使用场景和用法","author":"DBAAZzz","date":"2024/04/15 17：37","categories":["react 学习"],"tags":["hooks"]},"headers":[],"relativePath":"courses/react/01-用法/常用hooks的使用场景和用法.md","filePath":"courses/react/01-用法/常用hooks的使用场景和用法.md","lastUpdated":1713180694000}'),p={name:"courses/react/01-用法/常用hooks的使用场景和用法.md"},o=l(`<h1 id="常用-hooks-的使用场景和用法" tabindex="-1">常用 hooks 的使用场景和用法 <a class="header-anchor" href="#常用-hooks-的使用场景和用法" aria-label="Permalink to &quot;常用 hooks 的使用场景和用法&quot;">​</a></h1><h2 id="usestate" tabindex="-1">useState <a class="header-anchor" href="#usestate" aria-label="Permalink to &quot;useState&quot;">​</a></h2><h3 id="作用" tabindex="-1">作用 <a class="header-anchor" href="#作用" aria-label="Permalink to &quot;作用&quot;">​</a></h3><p>useState 的作用是保证函数式组件在重复渲染时保留这个 state。函数式组件重新渲染都是独立的闭包，函数式组件里的函数都是独立的，取到的值不会受后面操作的影响。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">function</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Counter2</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">let</span><span style="color:#ADBAC7;"> [number, setNumber] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">useState</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">function</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">alertNumber</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">setTimeout</span><span style="color:#ADBAC7;">(() </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#768390;">// alert 只能获取到点击按钮时的那个状态</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#DCBDFB;">alert</span><span style="color:#ADBAC7;">(number);</span></span>
<span class="line"><span style="color:#ADBAC7;">    }, </span><span style="color:#6CB6FF;">3000</span><span style="color:#ADBAC7;">);</span></span>
<span class="line"><span style="color:#ADBAC7;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> (</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">&lt;&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;</span><span style="color:#F69D50;">p</span><span style="color:#ADBAC7;">&gt;{number}</span><span style="color:#F47067;">&lt;/</span><span style="color:#ADBAC7;">p</span><span style="color:#F47067;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">button onClick</span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">{() =&gt; </span><span style="color:#DCBDFB;">setNumber</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">number</span><span style="color:#ADBAC7;"> + 1)}</span><span style="color:#F47067;">&gt;+</span><span style="color:#ADBAC7;">&lt;/</span><span style="color:#F69D50;">button</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">button onClick</span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">{alertNumber}</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">alertNumber</span><span style="color:#F47067;">&lt;/</span><span style="color:#ADBAC7;">button</span><span style="color:#F47067;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">&lt;/&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  );</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki vitesse-light vp-code-light"><code><span class="line"><span style="color:#AB5959;">function</span><span style="color:#393A34;"> </span><span style="color:#59873A;">Counter2</span><span style="color:#999999;">()</span><span style="color:#393A34;"> </span><span style="color:#999999;">{</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#AB5959;">let </span><span style="color:#999999;">[</span><span style="color:#B07D48;">number</span><span style="color:#999999;">,</span><span style="color:#AB5959;"> </span><span style="color:#B07D48;">setNumber</span><span style="color:#999999;">]</span><span style="color:#AB5959;"> </span><span style="color:#999999;">=</span><span style="color:#AB5959;"> </span><span style="color:#59873A;">useState</span><span style="color:#999999;">(</span><span style="color:#2F798A;">0</span><span style="color:#999999;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#AB5959;">function</span><span style="color:#393A34;"> </span><span style="color:#59873A;">alertNumber</span><span style="color:#999999;">()</span><span style="color:#393A34;"> </span><span style="color:#999999;">{</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#59873A;">setTimeout</span><span style="color:#999999;">(()</span><span style="color:#393A34;"> </span><span style="color:#999999;">=&gt;</span><span style="color:#393A34;"> </span><span style="color:#999999;">{</span></span>
<span class="line"><span style="color:#999999;">      </span><span style="color:#A0ADA0;">// alert 只能获取到点击按钮时的那个状态</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#59873A;">alert</span><span style="color:#999999;">(</span><span style="color:#B07D48;">number</span><span style="color:#999999;">);</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#999999;">},</span><span style="color:#393A34;"> </span><span style="color:#2F798A;">3000</span><span style="color:#999999;">);</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#999999;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#1E754F;">return</span><span style="color:#393A34;"> </span><span style="color:#999999;">(</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#999999;">&lt;&gt;</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#999999;">&lt;</span><span style="color:#2E8F82;">p</span><span style="color:#999999;">&gt;{</span><span style="color:#B07D48;">number</span><span style="color:#999999;">}&lt;</span><span style="color:#AB5959;">/</span><span style="color:#B07D48;">p</span><span style="color:#999999;">&gt;</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#999999;">&lt;</span><span style="color:#B07D48;">button</span><span style="color:#393A34;"> </span><span style="color:#B07D48;">onClick</span><span style="color:#999999;">={() =&gt; </span><span style="color:#59873A;">setNumber</span><span style="color:#999999;">(</span><span style="color:#B07D48;">number</span><span style="color:#999999;"> + 1)}&gt;</span><span style="color:#AB5959;">+</span><span style="color:#999999;">&lt;</span><span style="color:#393A34;">/</span><span style="color:#2E8F82;">button</span><span style="color:#999999;">&gt;</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#999999;">&lt;</span><span style="color:#B07D48;">button</span><span style="color:#393A34;"> </span><span style="color:#B07D48;">onClick</span><span style="color:#999999;">={</span><span style="color:#B07D48;">alertNumber</span><span style="color:#999999;">}&gt;</span><span style="color:#B07D48;">alertNumber</span><span style="color:#999999;">&lt;</span><span style="color:#AB5959;">/</span><span style="color:#B07D48;">button</span><span style="color:#999999;">&gt;</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#999999;">&lt;</span><span style="color:#AB5959;">/</span><span style="color:#999999;">&gt;</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#999999;">);</span></span>
<span class="line"><span style="color:#999999;">}</span></span></code></pre></div><h3 id="基本用法" tabindex="-1">基本用法 <a class="header-anchor" href="#基本用法" aria-label="Permalink to &quot;基本用法&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> [</span><span style="color:#6CB6FF;">state</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">dispatch</span><span style="color:#ADBAC7;">] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">useState</span><span style="color:#ADBAC7;">(initData);</span></span></code></pre><pre class="shiki vitesse-light vp-code-light"><code><span class="line"><span style="color:#AB5959;">const </span><span style="color:#999999;">[</span><span style="color:#B07D48;">state</span><span style="color:#999999;">,</span><span style="color:#AB5959;"> </span><span style="color:#B07D48;">dispatch</span><span style="color:#999999;">]</span><span style="color:#AB5959;"> </span><span style="color:#999999;">=</span><span style="color:#AB5959;"> </span><span style="color:#59873A;">useState</span><span style="color:#999999;">(</span><span style="color:#B07D48;">initData</span><span style="color:#999999;">);</span></span></code></pre></div><ul><li>state，目的提供给 UI ，作为渲染视图的数据源。</li><li>dispatch 改变 state 的函数，可以理解为推动函数组件渲染的渲染函数</li><li>initData 有两种情况，第一种情况是非函数，将作为 state 初始化的值。 第二种情况是函数，函数的返回值作为 useState 初始化的值。</li></ul><p>对于 dispatch 的参数，有两种情况：</p><ul><li><p>第一种非函数情况，此时将作为新的值，赋予给 state，作为下一次渲染使用;</p></li><li><p>第二种是函数的情况，如果 dispatch 的参数为一个函数，这里可以称它为 reducer，reducer 参数，是上一次返回最新的 state，返回值作为新的 state。</p></li></ul><h3 id="注意事项" tabindex="-1">注意事项 <a class="header-anchor" href="#注意事项" aria-label="Permalink to &quot;注意事项&quot;">​</a></h3><p>-在使用 useState 的 dispatchAction 更新 state 的时候，记得不要传入相同的 state，这样会使视图不更新。useState 的 dispatchAction 方法会默认比较两次 state 是否相同，然后决定是否更新组件。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">export</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">default</span><span style="color:#F69D50;"> </span><span style="color:#F47067;">function</span><span style="color:#F69D50;"> </span><span style="color:#DCBDFB;">Index</span><span style="color:#F69D50;">() </span><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> [</span><span style="color:#6CB6FF;">state</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">dispatchState</span><span style="color:#ADBAC7;">] </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">useState</span><span style="color:#ADBAC7;">({ name: </span><span style="color:#96D0FF;">&#39;xiaoming&#39;</span><span style="color:#ADBAC7;"> });</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">handleClick</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> () </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">// 点击按钮，视图没有更新</span></span>
<span class="line"><span style="color:#ADBAC7;">    state.name </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;xiaohong&#39;</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">dispatchState</span><span style="color:#ADBAC7;">(state);</span></span>
<span class="line"><span style="color:#ADBAC7;">  };</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> (</span></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;</span><span style="color:#F69D50;">div</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;</span><span style="color:#F69D50;">span</span><span style="color:#ADBAC7;">&gt; {</span><span style="color:#F69D50;">state</span><span style="color:#ADBAC7;">.</span><span style="color:#F69D50;">name</span><span style="color:#ADBAC7;">}</span><span style="color:#F47067;">&lt;/</span><span style="color:#ADBAC7;">span</span><span style="color:#F47067;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;">button onClick</span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">{handleClick}</span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;">changeName</span><span style="color:#F47067;">++&lt;/</span><span style="color:#ADBAC7;">button</span><span style="color:#F47067;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">&lt;/</span><span style="color:#ADBAC7;">div</span><span style="color:#F47067;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  );</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span></code></pre><pre class="shiki vitesse-light vp-code-light"><code><span class="line"><span style="color:#1E754F;">export</span><span style="color:#393A34;"> </span><span style="color:#1E754F;">default</span><span style="color:#393A34;"> </span><span style="color:#AB5959;">function</span><span style="color:#393A34;"> </span><span style="color:#59873A;">Index</span><span style="color:#999999;">()</span><span style="color:#393A34;"> </span><span style="color:#999999;">{</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#AB5959;">const </span><span style="color:#999999;">[</span><span style="color:#B07D48;">state</span><span style="color:#999999;">,</span><span style="color:#AB5959;"> </span><span style="color:#B07D48;">dispatchState</span><span style="color:#999999;">]</span><span style="color:#AB5959;"> </span><span style="color:#999999;">=</span><span style="color:#AB5959;"> </span><span style="color:#59873A;">useState</span><span style="color:#999999;">({ </span><span style="color:#998418;">name</span><span style="color:#999999;">: </span><span style="color:#B5695999;">&#39;</span><span style="color:#B56959;">xiaoming</span><span style="color:#B5695999;">&#39;</span><span style="color:#999999;"> });</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#AB5959;">const </span><span style="color:#59873A;">handleClick</span><span style="color:#AB5959;"> </span><span style="color:#999999;">=</span><span style="color:#AB5959;"> </span><span style="color:#999999;">()</span><span style="color:#AB5959;"> </span><span style="color:#999999;">=&gt;</span><span style="color:#AB5959;"> </span><span style="color:#999999;">{</span></span>
<span class="line"><span style="color:#999999;">    </span><span style="color:#A0ADA0;">// 点击按钮，视图没有更新</span></span>
<span class="line"><span style="color:#AB5959;">    </span><span style="color:#B07D48;">state</span><span style="color:#999999;">.</span><span style="color:#B07D48;">name</span><span style="color:#AB5959;"> </span><span style="color:#999999;">=</span><span style="color:#AB5959;"> </span><span style="color:#B5695999;">&#39;</span><span style="color:#B56959;">xiaohong</span><span style="color:#B5695999;">&#39;</span><span style="color:#999999;">;</span></span>
<span class="line"><span style="color:#AB5959;">    </span><span style="color:#59873A;">dispatchState</span><span style="color:#999999;">(</span><span style="color:#B07D48;">state</span><span style="color:#999999;">);</span></span>
<span class="line"><span style="color:#AB5959;">  </span><span style="color:#999999;">};</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#1E754F;">return</span><span style="color:#393A34;"> </span><span style="color:#999999;">(</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#999999;">&lt;</span><span style="color:#2E8F82;">div</span><span style="color:#999999;">&gt;</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#999999;">&lt;</span><span style="color:#2E8F82;">span</span><span style="color:#999999;">&gt;</span><span style="color:#393A34;"> </span><span style="color:#999999;">{</span><span style="color:#B07D48;">state</span><span style="color:#393A34;">.</span><span style="color:#B07D48;">name</span><span style="color:#999999;">}&lt;</span><span style="color:#AB5959;">/</span><span style="color:#B07D48;">span</span><span style="color:#999999;">&gt;</span></span>
<span class="line"><span style="color:#393A34;">      </span><span style="color:#999999;">&lt;</span><span style="color:#B07D48;">button</span><span style="color:#393A34;"> </span><span style="color:#B07D48;">onClick</span><span style="color:#999999;">={</span><span style="color:#B07D48;">handleClick</span><span style="color:#999999;">}&gt;</span><span style="color:#B07D48;">changeName</span><span style="color:#AB5959;">++</span><span style="color:#999999;">&lt;</span><span style="color:#AB5959;">/</span><span style="color:#B07D48;">button</span><span style="color:#999999;">&gt;</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#999999;">&lt;</span><span style="color:#AB5959;">/</span><span style="color:#B07D48;">div</span><span style="color:#999999;">&gt;</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#999999;">);</span></span>
<span class="line"><span style="color:#999999;">}</span></span></code></pre></div><h3 id="如何监听-state-的变化" tabindex="-1">如何监听 state 的变化 <a class="header-anchor" href="#如何监听-state-的变化" aria-label="Permalink to &quot;如何监听 state 的变化&quot;">​</a></h3><p>在函数式组件中只能通过 useEffect 来执行 state 变化引起的副作用。</p><h2 id="useeffect" tabindex="-1">useEffect <a class="header-anchor" href="#useeffect" aria-label="Permalink to &quot;useEffect&quot;">​</a></h2><h3 id="基本用法-1" tabindex="-1">基本用法 <a class="header-anchor" href="#基本用法-1" aria-label="Permalink to &quot;基本用法&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#DCBDFB;">useEffect</span><span style="color:#ADBAC7;">(() </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> destory;</span></span>
<span class="line"><span style="color:#ADBAC7;">}, dep);</span></span></code></pre><pre class="shiki vitesse-light vp-code-light"><code><span class="line"><span style="color:#59873A;">useEffect</span><span style="color:#999999;">(()</span><span style="color:#393A34;"> </span><span style="color:#999999;">=&gt;</span><span style="color:#393A34;"> </span><span style="color:#999999;">{</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#1E754F;">return</span><span style="color:#393A34;"> </span><span style="color:#B07D48;">destory</span><span style="color:#999999;">;</span></span>
<span class="line"><span style="color:#999999;">},</span><span style="color:#393A34;"> </span><span style="color:#B07D48;">dep</span><span style="color:#999999;">);</span></span></code></pre></div><ul><li>第一个参数 callback，返回的 destory 函数， destory 作为下一次 callback 执行之前调用，用于清除上一次 callback 产生的副作用。如清除定时器</li><li>第二个参数作为依赖项，是一个数组，可以有多个依赖项，依赖项改变，<strong>执行上一次 callback 返回的 destory</strong>，和执行新的 effect 第一个参数 callback</li></ul><p>useEffect 是采用<strong>异步调用</strong> ，对于每一个 effect 的 callback， React 会向 setTimeout 回调函数一样，放入任务队列，等到主线程任务完成，DOM 更新、js 执行完成、视图绘制完毕才执行。所以 effect 回调函数不会阻塞浏览器绘制视图。</p><h3 id="常用用法" tabindex="-1">常用用法 <a class="header-anchor" href="#常用用法" aria-label="Permalink to &quot;常用用法&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#768390;">// 依赖项是一个空数组，只执行一次</span></span>
<span class="line"><span style="color:#768390;">// 告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行</span></span>
<span class="line"><span style="color:#DCBDFB;">useEffect</span><span style="color:#ADBAC7;">(() </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">users</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">User</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}, []);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">// dep1 或者 dep2 任意一个发生变化都会执行</span></span>
<span class="line"><span style="color:#DCBDFB;">useEffect</span><span style="color:#ADBAC7;">(() </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">users</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">User</span><span style="color:#ADBAC7;">();</span></span>
<span class="line"><span style="color:#ADBAC7;">}, [dep1, dep2]);</span></span></code></pre><pre class="shiki vitesse-light vp-code-light"><code><span class="line"><span style="color:#A0ADA0;">// 依赖项是一个空数组，只执行一次</span></span>
<span class="line"><span style="color:#A0ADA0;">// 告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行</span></span>
<span class="line"><span style="color:#59873A;">useEffect</span><span style="color:#999999;">(()</span><span style="color:#393A34;"> </span><span style="color:#999999;">=&gt;</span><span style="color:#393A34;"> </span><span style="color:#999999;">{</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#AB5959;">const </span><span style="color:#B07D48;">users</span><span style="color:#AB5959;"> </span><span style="color:#999999;">=</span><span style="color:#AB5959;"> new </span><span style="color:#59873A;">User</span><span style="color:#999999;">();</span></span>
<span class="line"><span style="color:#999999;">},</span><span style="color:#393A34;"> </span><span style="color:#999999;">[]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A0ADA0;">// dep1 或者 dep2 任意一个发生变化都会执行</span></span>
<span class="line"><span style="color:#59873A;">useEffect</span><span style="color:#999999;">(()</span><span style="color:#393A34;"> </span><span style="color:#999999;">=&gt;</span><span style="color:#393A34;"> </span><span style="color:#999999;">{</span></span>
<span class="line"><span style="color:#393A34;">  </span><span style="color:#AB5959;">const </span><span style="color:#B07D48;">users</span><span style="color:#AB5959;"> </span><span style="color:#999999;">=</span><span style="color:#AB5959;"> new </span><span style="color:#59873A;">User</span><span style="color:#999999;">();</span></span>
<span class="line"><span style="color:#999999;">},</span><span style="color:#393A34;"> </span><span style="color:#999999;">[</span><span style="color:#B07D48;">dep1</span><span style="color:#999999;">,</span><span style="color:#393A34;"> </span><span style="color:#B07D48;">dep2</span><span style="color:#999999;">]);</span></span></code></pre></div>`,22),e=[o];function t(c,r,y,A,i,B){return a(),n("div",null,e)}const d=s(p,[["render",t]]);export{C as __pageData,d as default};
