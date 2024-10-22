export interface Example {
  hs: string;
  en: string;
}

export interface FullDef {
  meaning: string;
  examples?: Example[];
  labels?: string[];
  children?: Array<string | FullDef>;
}

export type DefTree = Array<string | FullDef>;
