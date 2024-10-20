export interface Example {
  hs: string;
  en: string;
}

export interface FullDef {
  meaning: string;
  examples?: Example[];
  children?: Array<string | FullDef>;
}

export type DefTree = Array<string | FullDef>;
