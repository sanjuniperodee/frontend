/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_DOMAIN: string
  readonly VITE_SOCKET_URL: string
  readonly VITE_SEGMENT_WRITE_KEY: string
  readonly VITE_MAP_API_KEY: string
  readonly MODE: string
  readonly PROD: boolean
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}