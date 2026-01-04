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
        let zoomScale = 1;
        let wheelHandler: ((e: Event) => void) | null = null;

        // Cleanup existing overlay to ensure updates work during dev
        if (typeof document !== "undefined") {
          const existingOverlay = document.querySelector(
            ".mermaid-lightbox-overlay"
          );
          if (existingOverlay) existingOverlay.remove();
        }

        // Event Delegation: Listen for clicks on .mermaid container or its children
        document.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          // 修正：vitepress-plugin-mermaid 渲染的图表可能没有 .mermaid class
          // 但 SVG 元素的 ID 通常以 'mermaid' 开头
          const svg = target.closest('svg[id^="mermaid"]') as SVGElement;
          // 支持普通图片查看
          const img = target.closest(".vp-doc img") as HTMLImageElement;

          if (svg || img) {
            e.preventDefault();
            e.stopPropagation();
            zoomScale = 1; // Reset scale on open

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
                // Remove wheel handler
                if (wheelHandler) {
                  document.removeEventListener("wheel", wheelHandler);
                  wheelHandler = null;
                }
                zoomScale = 1; // Reset zoom
                // Optional: clear content after transition
                setTimeout(() => {
                  overlay!.innerHTML = "";
                }, 300);
              });
            }

            // Clone Node (SVG or Image)
            let clonedNode: HTMLElement | SVGElement;
            if (svg) {
              clonedNode = svg.cloneNode(true) as SVGElement;
              // Ensure cloned SVG has no explicit width/height to allow scaling via CSS
              clonedNode.removeAttribute("width");
              clonedNode.removeAttribute("height");
            } else {
              clonedNode = img.cloneNode(true) as HTMLImageElement;
            }

            clonedNode.classList.add("mermaid-lightbox-image");
            clonedNode.removeAttribute("style");
            clonedNode.style.maxWidth = "90vw";
            clonedNode.style.maxHeight = "90vh";

            // 2. 阻止点击图片时关闭遮罩层
            clonedNode.addEventListener("click", (e) => {
              e.stopPropagation();
            });

            // Zoom handler function
            const applyZoom = (wheelEvent: WheelEvent) => {
              wheelEvent.preventDefault();
              wheelEvent.stopPropagation();

              const delta = wheelEvent.deltaY;
              const step = -delta * 0.002;
              zoomScale += step;

              // Limits
              if (zoomScale < 0.2) zoomScale = 0.2;
              if (zoomScale > 5) zoomScale = 5;

              clonedNode.style.transition = "none";
              clonedNode.style.transform = `scale(${zoomScale})`;
            };

            // 3. 支持滚轮缩放（直接绑定到图片上）
            clonedNode.addEventListener(
              "wheel",
              (e) => applyZoom(e as WheelEvent),
              { passive: false }
            );

            overlay.innerHTML = ""; // Clear previous
            overlay.appendChild(clonedNode);

            // Force reflow to enable transition
            void (overlay as HTMLElement).offsetHeight;

            overlay.classList.add("active");
            document.body.style.overflow = "hidden"; // 1. 禁止滚动

            // Remove previous wheel handler if exists
            if (wheelHandler) {
              document.removeEventListener("wheel", wheelHandler);
            }

            // Zoom Logic (Wheel) - Attach to document for overlay background scrolling
            wheelHandler = (e: Event) => {
              const wheelEvent = e as WheelEvent;
              const activeOverlay = document.querySelector(
                ".mermaid-lightbox-overlay.active"
              );
              if (!activeOverlay) return;

              applyZoom(wheelEvent);
            };

            document.addEventListener("wheel", wheelHandler, {
              passive: false,
            });
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
