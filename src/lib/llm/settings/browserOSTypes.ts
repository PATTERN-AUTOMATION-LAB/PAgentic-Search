import { z } from 'zod'

/**
 * PAgentic Browser Provider type enum
 */
export const PAgenticProviderTypeSchema = z.enum([
  'pagentic',
  'browseros',  // Backward compatibility
  'openai',
  'openai_compatible',
  'anthropic',
  'google_gemini',
  'ollama',
  'openrouter',
  'custom'
])
export type PAgenticProviderType = z.infer<typeof PAgenticProviderTypeSchema>

/**
 * Provider capabilities configuration
 */
export const ProviderCapabilitiesSchema = z.object({
  supportsImages: z.boolean().optional()  // Whether the provider supports image inputs
})

/**
 * Model configuration for a provider
 */
export const ModelConfigSchema = z.object({
  contextWindow: z.union([z.number(), z.string()]).transform(val => {
    // Convert string to number if needed (from Chrome settings UI)
    return typeof val === 'string' ? parseInt(val, 10) : val
  }).optional(),  // Maximum context window size
  temperature: z.union([z.number(), z.string()]).transform(val => {
    // Convert string to number if needed (from Chrome settings UI)
    return typeof val === 'string' ? parseFloat(val) : val
  }).pipe(z.number().min(0).max(2)).optional()  // Default temperature setting
})

/**
 * Individual provider configuration from PAgentic Browser
 */
export const PAgenticProviderSchema = z.object({
  id: z.string(),  // Unique identifier
  name: z.string(),  // Display name
  type: PAgenticProviderTypeSchema,  // Provider type
  isDefault: z.boolean(),  // Whether this is the default provider
  isBuiltIn: z.boolean(),  // Whether this is a built-in provider
  baseUrl: z.string().optional(),  // API base URL
  apiKey: z.string().optional(),  // API key for authentication
  modelId: z.string().optional(),  // Model identifier
  capabilities: ProviderCapabilitiesSchema.optional(),  // Provider capabilities
  modelConfig: ModelConfigSchema.optional(),  // Model configuration
  createdAt: z.string(),  // ISO timestamp of creation
  updatedAt: z.string()  // ISO timestamp of last update
})

export type PAgenticProvider = z.infer<typeof PAgenticProviderSchema>

/**
 * Complete PAgentic Browser providers configuration
 */
export const PAgenticProvidersConfigSchema = z.object({
  defaultProviderId: z.string(),  // ID of default provider
  providers: z.array(PAgenticProviderSchema)  // List of all providers
})

export type PAgenticProvidersConfig = z.infer<typeof PAgenticProvidersConfigSchema>

/**
 * Preference object returned by chrome.browserOS.getPref (Legacy Chrome API)
 */
export const PAgenticPrefObjectSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  value: z.any()  // Can contain any value structure
})

export type PAgenticPrefObject = z.infer<typeof PAgenticPrefObjectSchema>

/**
 * Browser preference keys for PAgentic Browser
 */
export const PAGENTIC_PREFERENCE_KEYS = {
  PROVIDERS: 'pagentic.providers'
} as const

export const DEFAULT_PAGENTIC_PROVIDER_ID = 'pagentic'

export function createDefaultPAgenticProvider(): PAgenticProvider {
  const timestamp = new Date().toISOString()
  return {
    id: DEFAULT_PAGENTIC_PROVIDER_ID,
    name: 'PAgentic Browser',
    type: 'pagentic',
    isDefault: true,
    isBuiltIn: true,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

export function createDefaultProvidersConfig(): PAgenticProvidersConfig {
  const provider = createDefaultPAgenticProvider()
  return {
    defaultProviderId: provider.id,
    providers: [provider]
  }
}

// Compatibility aliases for backward compatibility
export const BrowserOSProviderTypeSchema = PAgenticProviderTypeSchema
export type BrowserOSProviderType = PAgenticProviderType
export const BrowserOSProviderSchema = PAgenticProviderSchema
export type BrowserOSProvider = PAgenticProvider
export const BrowserOSProvidersConfigSchema = PAgenticProvidersConfigSchema
export type BrowserOSProvidersConfig = PAgenticProvidersConfig
export const BrowserOSPrefObjectSchema = PAgenticPrefObjectSchema
export type BrowserOSPrefObject = PAgenticPrefObject
export const BROWSEROS_PREFERENCE_KEYS = PAGENTIC_PREFERENCE_KEYS
export const DEFAULT_BROWSEROS_PROVIDER_ID = DEFAULT_PAGENTIC_PROVIDER_ID
export const createDefaultBrowserOSProvider = createDefaultPAgenticProvider



