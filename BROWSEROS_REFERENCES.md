# BrowserOS textual references

This file lists textual occurrences of the token `BrowserOS` found in the repository. Use this list to review and decide which visible strings should be changed to `PAgentic Browser` and which internal identifiers should remain unchanged.

Format: - path:line — snippet

- `src/options/styles.css:5` — /* BrowserOS Settings - Theme Configuration */
- `public/browseros_first_run.html:156` — `<a class="btn btn-accent" href="https://bit.ly/BrowserOS-setup">Quick start guide</a>`
- `public/browseros_first_run.html:191` — `<a href="chrome://settings/browseros"><code>chrome://settings/browseros</code></a>` (URL / chrome internal path)
- `public/browseros_first_run.html:203` — `This page can be always accessed again at <a href="chrome://browseros-first-run"><code>chrome://browseros-first-run</code></a>`
- `public/browseros_first_run.html:262` — `<a href="https://github.com/browseros-ai/BrowserOS">` (external repo link)
- `public/browseros_first_run.html:271` — `<a href="https://x.com/browserOS_ai">` (social link)
- `README.md:3` — reference to upstream project: `https://github.com/browseros-ai/BrowserOS`
- `src/sidepanel/teachmode/BrowserUpgradeNotice.tsx:13` — `chrome.tabs.create({ url: 'https://github.com/browseros-ai/BrowserOS/releases/latest' })`
- `src/sidepanel/components/HelpSection.tsx:205` — `href="https://bit.ly/BrowserOS-setup"`
- `test-options.html:50` — `✅ BrowserOS API integration (getPref/setPref)`
- `src/options/hooks/useBrowserOSPrefs.ts:5` — `import { BrowserOSProvidersConfig } from '@/lib/llm/settings/browserOSTypes'` (type/import)
- `src/options/hooks/useBrowserOSPrefs.ts:9` — `const DEFAULT_BROWSEROS_PROVIDER: LLMProvider = {` (internal default provider id)
- `src/options/hooks/useBrowserOSPrefs.ts:10` — `id: 'browseros',`
- `src/options/hooks/useBrowserOSPrefs.ts:12` — `type: 'browseros',`
- `src/options/hooks/useBrowserOSPrefs.ts:19` — `export function useBrowserOSPrefs()` (hook name)
- `src/options/hooks/useBrowserOSPrefs.ts:20` — `const [providers, setProviders] = useState<LLMProvider[]>([DEFAULT_BROWSEROS_PROVIDER])`
- `src/options/hooks/useBrowserOSPrefs.ts:21` — `const [defaultProvider, setDefaultProviderState] = useState<string>('browseros')`
- `src/options/hooks/useBrowserOSPrefs.ts:29` — `console.warn('[useBrowserOSPrefs] Port not connected')` (log)
- `src/options/hooks/useBrowserOSPrefs.ts:52` — `console.error('[useBrowserOSPrefs] Error from background:', payload.error)`
- `src/options/hooks/useBrowserOSPrefs.ts:55` — `const config = payload.data.providersConfig as BrowserOSProvidersConfig` (typing)
- `src/options/hooks/useBrowserOSPrefs.ts:59` — `isDefault: p.isDefault !== undefined ? p.isDefault : (p.id === 'browseros')`
- `src/options/hooks/useBrowserOSPrefs.ts:62` — `setDefaultProviderState(config.defaultProviderId || 'browseros')`
- `src/options/hooks/useBrowserOSPrefs.ts:69` — `console.warn('[useBrowserOSPrefs] Port disconnected')`
- `src/options/hooks/useBrowserOSPrefs.ts:94` — `console.warn('[useBrowserOSPrefs] Heartbeat failed, port likely disconnected')`
- `src/options/hooks/useBrowserOSPrefs.ts:113` — `console.error('[useBrowserOSPrefs] Failed to send initial message:', error)`
- `src/options/hooks/useBrowserOSPrefs.ts:138` — `console.error('[useBrowserOSPrefs] Failed to setup port:', error)`
- `src/options/hooks/useBrowserOSPrefs.ts:172` — `console.error('[useBrowserOSPrefs] Port not connected, cannot save providers')`
- `src/options/hooks/useBrowserOSPrefs.ts:176` — `const config: BrowserOSProvidersConfig = {` (save config)
- `src/options/hooks/useBrowserOSPrefs.ts:190` — `console.error('[useBrowserOSPrefs] Failed to send save message:', error)`
- `src/options/hooks/useBrowserOSPrefs.ts:255` — `const browserOSProvider = remainingProviders.find(p => p.id === 'browseros')`
- `webpack.config.js:41` — `process.env.BRAINTRUST_PROJECT_NAME': JSON.stringify(envKeys.BRAINTRUST_PROJECT_NAME || 'browseros-agent-online')`
- `webpack.config.js:162` — `template: './browseros-settings.html',`
- `webpack.config.js:163` — `filename: 'browseros-settings.html',`
- `src/lib/utils/Logging.ts:3` — `import { getBrowserOSAdapter } from '@/lib/browser/BrowserOSAdapter'`
- `src/lib/utils/Logging.ts:39` — `private static browserOSAdapter = getBrowserOSAdapter()`
- `src/lib/utils/Logging.ts:157` — `* Log a metric event using the BrowserOS metrics API with PostHog fallback` (docstring)
- `src/lib/utils/Logging.ts:185` — `await this.browserOSAdapter.logMetric(prefixedEventName, enhancedProperties)`
- `src/lib/utils/Logging.ts:187` — `// BrowserOS failed, use PostHog fallback` (comment)
- `src/lib/utils/featureFlags.ts:1` — `import { getBrowserOSAdapter } from '@/lib/browser/BrowserOSAdapter'`
- `src/lib/utils/featureFlags.ts:51` — `const adapter = getBrowserOSAdapter()`
- `src/lib/utils/featureFlags.ts:54` — `Logging.log('FeatureFlags', `Initialized with BrowserOS version: ${this.browserVersion}`)`
- `src/lib/utils/featureFlags.ts:56` — `Logging.log('FeatureFlags', `Failed to get BrowserOS version, using defaults: ${error}`)`
- `src/lib/utils/confetti.ts:14` — `container.id = 'browseros-confetti-container';`
- `src/lib/utils/confetti.ts:43` — `style.id = 'browseros-confetti-styles';`
- `src/lib/utils/confetti.ts:61` — `const containerEl = document.getElementById('browseros-confetti-container');`
- `src/lib/utils/confetti.ts:62` — `const styleEl = document.getElementById('browseros-confetti-styles');`
- `src/types/chrome-browser-os.d.ts:1` — `// Type definitions for chrome.browserOS API`

---

Notes:
- I intentionally left internal identifiers and import names (like `id: 'browseros'`, types, adapters, API names, and webpack template/filename) unchanged in the codebase to avoid breaking runtime behavior. If you want a full rename (including internal ids and filenames), tell me and I will prepare a migration plan.
- If you'd like, I can now create a branch/PR that updates only the visible strings and documentation entries in this list (for example `public/*`, `README.md`, and any `bit.ly` / social links), leaving code identifiers intact.

To edit this list, open this file and update/remove entries as you finish rebranding decisions.
