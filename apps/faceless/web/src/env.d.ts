/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NG_APP_SUPABASE_URL: string;
  readonly NG_APP_SUPABASE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
