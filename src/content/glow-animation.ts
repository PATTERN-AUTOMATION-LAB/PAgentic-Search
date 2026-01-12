/**
 * Glow animation content script
 * Provides visual feedback during agent execution
 */

(() => {
  const GLOW_OVERLAY_ID = 'nxtscape-glow-overlay'
  const GLOW_STYLES_ID = 'nxtscape-glow-styles'
  const GLOW_INITIALIZED_KEY = 'nxtscape-glow-initialized'
  const GLOW_ENABLED_KEY = 'nxtscape-glow-enabled'  // Stored in chrome.storage.local
  
  // Check if already initialized to prevent duplicate listeners
  if ((window as any)[GLOW_INITIALIZED_KEY]) {
    console.log('[Nxtscape] Glow animation already initialized')
    return
  }
  (window as any)[GLOW_INITIALIZED_KEY] = true
  
  /**
   * Create and inject glow animation styles
   */
  function injectStyles(): void {
    if (document.getElementById(GLOW_STYLES_ID)) {
      return
    }
    
    const style = document.createElement('style')
    style.id = GLOW_STYLES_ID
    style.textContent = `
      @keyframes nxtscape-glow-pulse {
        0% {
          box-shadow:
            inset 0 0 42px 19px transparent,
            inset 0 0 36px 16px rgba(251, 102, 24, 0.06),
            inset 0 0 30px 13px rgba(251, 102, 24, 0.12),
            inset 0 0 24px 10px rgba(251, 102, 24, 0.18);
        }
        50% {
          box-shadow:
            inset 0 0 52px 25px transparent,
            inset 0 0 46px 23px rgba(251, 102, 24, 0.10),
            inset 0 0 39px 19px rgba(251, 102, 24, 0.18),
            inset 0 0 33px 16px rgba(251, 102, 24, 0.24);
        }
        100% {
          box-shadow:
            inset 0 0 42px 19px transparent,
            inset 0 0 36px 16px rgba(251, 102, 24, 0.06),
            inset 0 0 30px 13px rgba(251, 102, 24, 0.12),
            inset 0 0 24px 10px rgba(251, 102, 24, 0.18);
        }
      }
      
      @keyframes nxtscape-glow-fade-in {
        from { opacity: 0; }
        to { opacity: 0.6; }
      }
      
      #${GLOW_OVERLAY_ID} {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none !important;
        z-index: 2147483647 !important;
        opacity: 0;
        will-change: opacity;
        animation: 
          nxtscape-glow-pulse 3s ease-in-out infinite,
          nxtscape-glow-fade-in 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards !important;
      }
    `
    document.head.appendChild(style)
  }
  
  /**
   * Start glow animation
   */
  function startGlow(): void {
    // Remove existing overlay if present
    stopGlow()
    
    // Inject styles
    injectStyles()
    
    // Create overlay
    const overlay = document.createElement('div')
    overlay.id = GLOW_OVERLAY_ID
    document.body.appendChild(overlay)
    
    console.log('[Nxtscape] Glow animation started')
  }
  
  /**
   * Stop glow animation
   */
  function stopGlow(): void {
    const overlay = document.getElementById(GLOW_OVERLAY_ID)
    if (overlay) {
      overlay.remove()
      console.log('[Nxtscape] Glow animation stopped')
    }
  }

  /**
   * Read whether glow is enabled (default true)
   */
  function isGlowEnabled (): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        chrome.storage?.local?.get(GLOW_ENABLED_KEY, (result) => {
          // If key is missing, treat as enabled by default
          const enabled = result && Object.prototype.hasOwnProperty.call(result, GLOW_ENABLED_KEY)
            ? result[GLOW_ENABLED_KEY] !== false
            : true
          resolve(enabled)
        })
      } catch (_e) {
        // Fail-open to avoid breaking flows
        resolve(true)
      }
    })
  }

  /**
   * Extract interactive elements from the page (fallback for chrome.browserOS)
   */
  async function extractInteractiveElements(options: any = {}): Promise<any> {
    const startTime = performance.now();
    
    try {
      // Select interactive elements with more comprehensive selectors
      const interactiveSelectors = [
        'button',
        'input[type="button"], input[type="submit"], input[type="reset"]',
        'input[type="text"], input[type="email"], input[type="password"], input[type="search"]',
        'input[type="number"], input[type="tel"], input[type="url"], input[type="date"]',
        'input[type="checkbox"], input[type="radio"]',
        'select',
        'textarea',
        'a[href]',
        'a[role="button"]',
        '[role="button"]',
        '[role="link"]',
        '[role="menuitem"]',
        '[role="tab"]',
        '[onclick]',
        '[onmousedown]',
        '[onmouseup]',
        '[tabindex]:not([tabindex="-1"])',
        // Common clickable classes and elements
        '.btn', '.button', '.click', '.clickable',
        '[data-testid*="button"]',
        '[data-test*="button"]',
        '[class*="button"]',
        '[class*="btn"]',
        // Form elements
        'form input:not([type="hidden"])',
        'form button',
        'form select',
        'form textarea'
      ].join(', ');

      console.log('[extractInteractiveElements] Using selectors:', interactiveSelectors);

      const elements = document.querySelectorAll(interactiveSelectors);
      const interactiveNodes: any[] = [];

      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const styles = getComputedStyle(element);
        
        // More lenient visibility check - only skip if completely hidden
        const isHidden = styles.display === 'none' || 
                        styles.visibility === 'hidden' || 
                        styles.opacity === '0' ||
                        (rect.width === 0 && rect.height === 0);
        
        if (isHidden) {
          return;
        }

        // Apply viewport filter if requested, but be more lenient
        if (options.viewportOnly) {
          // Allow elements that are partially visible or just outside viewport
          const buffer = 100; // 100px buffer
          if (rect.bottom < -buffer || rect.top > window.innerHeight + buffer ||
              rect.right < -buffer || rect.left > window.innerWidth + buffer) {
            return;
          }
        }

        interactiveNodes.push({
          nodeId: index + 1,
          tagName: element.tagName.toLowerCase(),
          type: getElementType(element),
          text: getElementText(element),
          placeholder: (element as HTMLInputElement).placeholder || '',
          value: (element as HTMLInputElement).value || '',
          href: (element as HTMLAnchorElement).href || '',
          boundingRect: {
            left: Math.round(rect.left),
            top: Math.round(rect.top),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          },
          attributes: getElementAttributes(element)
        });
      });

      const processingTime = performance.now() - startTime;

      console.log(`[extractInteractiveElements] Found ${elements.length} total elements, ${interactiveNodes.length} interactive elements`);
      
      return {
        elements: interactiveNodes,
        hierarchicalStructure: generateHierarchicalText(),
        processingTime: Math.round(processingTime),
        debug: {
          totalElementsFound: elements.length,
          interactiveElementsFound: interactiveNodes.length,
          url: window.location.href,
          title: document.title
        }
      };
    } catch (error) {
      console.error('[extractInteractiveElements] Error:', error);
      return {
        elements: [],
        hierarchicalStructure: '',
        processingTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  function getElementType(element: Element): string {
    const tagName = element.tagName.toLowerCase();
    const type = (element as HTMLInputElement).type;
    const role = element.getAttribute('role');

    if (role) return role;
    if (tagName === 'input' && type) return type;
    return tagName;
  }

  function getElementText(element: Element): string {
    // Get visible text content
    const text = element.textContent?.trim() || '';
    if (text) return text;

    // Fallback to common attributes for text
    const alt = element.getAttribute('alt');
    const title = element.getAttribute('title');
    const ariaLabel = element.getAttribute('aria-label');
    
    return alt || title || ariaLabel || '';
  }

  function getElementAttributes(element: Element): Record<string, string> {
    const attrs: Record<string, string> = {};
    const importantAttrs = ['id', 'class', 'name', 'role', 'aria-label', 'title', 'alt'];
    
    importantAttrs.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) attrs[attr] = value;
    });

    return attrs;
  }

  function generateHierarchicalText(): string {
    // Simple hierarchical text representation
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const paragraphs = document.querySelectorAll('p');
    
    let text = document.title ? `Title: ${document.title}\n` : '';
    
    headings.forEach(heading => {
      const level = heading.tagName.toLowerCase();
      const content = heading.textContent?.trim();
      if (content) {
        text += `${level.toUpperCase()}: ${content}\n`;
      }
    });

    return text || 'Page content extraction not available';
  }
  
  /**
   * Message listener
   */
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Handle GET_INTERACTIVE_ELEMENTS for snapshot fallback
    if (request.type === 'GET_INTERACTIVE_ELEMENTS') {
      console.log('[Content Script] Received GET_INTERACTIVE_ELEMENTS request:', request);
      extractInteractiveElements(request.options)
        .then(result => {
          console.log('[Content Script] Extracted elements:', result);
          sendResponse(result);
        })
        .catch(error => {
          console.error('[Content Script] Error extracting elements:', error);
          sendResponse({ error: error.message, elements: [] });
        });
      return true; // Will respond asynchronously
    }

    if (request.source !== 'GlowAnimationService') {
      return
    }
    
    switch (request.action) {
      case 'startGlow': {
        // Gate on persisted setting
        isGlowEnabled().then((enabled) => {
          if (enabled) {
            startGlow()
          }
          sendResponse({ success: true, skipped: !enabled })
        })
        return true
      }
        
      case 'stopGlow':
        stopGlow()
        sendResponse({ success: true })
        break
        
      default:
        sendResponse({ success: false, error: 'Unknown action' })
    }
    
    return true  // Keep message channel open for async response
  })
  
  // Clean up on page unload
  window.addEventListener('beforeunload', stopGlow)
  
  // Also clean up on visibility change (tab switch)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopGlow()
    }
  })
  
  // Start glow immediately if we're being re-injected after navigation
  // The service will send a start message right after injection
})()