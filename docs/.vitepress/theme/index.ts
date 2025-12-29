import DefaultTheme from "vitepress/theme";
import MyLayout from "./MyLayout.vue";
import "./styles/vars.css";
import "./styles/custom.css";
import "./styles/lightbox.css";
import axios from "axios";
import api from "./api/index";

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp(ctx) {
    // extend default theme custom behaviour.
    DefaultTheme.enhanceApp(ctx);

    // 全局挂载 API 接口
    ctx.app.config.globalProperties.$http = axios;
    if (typeof window !== "undefined") {
      window.$api = api;

      // Mermaid Lightbox Logic
      const initLightbox = () => {
        // Event Delegation: Listen for clicks on .mermaid container or its children
        document.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          // 修正：vitepress-plugin-mermaid 渲染的图表可能没有 .mermaid class
          // 但 SVG 元素的 ID 通常以 'mermaid' 开头
          const svg = target.closest('svg[id^="mermaid"]') as SVGElement;

          if (svg) {
            e.preventDefault();
            e.stopPropagation();

            // Create or get overlay
            let overlay = document.querySelector(".mermaid-lightbox-overlay");
            if (!overlay) {
              overlay = document.createElement("div");
              overlay.className = "mermaid-lightbox-overlay";
              document.body.appendChild(overlay);

              // Close on click
              overlay.addEventListener("click", () => {
                overlay!.classList.remove("active");
                document.body.style.overflow = ""; // 1. 恢复滚动
                // Optional: clear content after transition
                setTimeout(() => {
                  overlay!.innerHTML = "";
                }, 300);
              });
            }

            // Clone SVG
            const clonedSvg = svg.cloneNode(true) as SVGElement;
            clonedSvg.classList.add("mermaid-lightbox-image");
            // Ensure cloned SVG has no explicit width/height to allow scaling via CSS
            clonedSvg.removeAttribute("width");
            clonedSvg.removeAttribute("height");
            clonedSvg.removeAttribute("style");
            clonedSvg.style.maxWidth = "90vw";
            clonedSvg.style.maxHeight = "90vh";

            // 2. 阻止点击图片时关闭遮罩层
            clonedSvg.addEventListener("click", (e) => {
              e.stopPropagation();
            });

            overlay.innerHTML = ""; // Clear previous
            overlay.appendChild(clonedSvg);

            // Force reflow to enable transition
            void (overlay as HTMLElement).offsetHeight;

            overlay.classList.add("active");
            document.body.style.overflow = "hidden"; // 1. 禁止滚动
          }
        });
      };

      // Run init
      initLightbox();
    }

    // register your custom global components
    // ctx.app.component('MyGlobalComponent' /* ... */)
  },
};
