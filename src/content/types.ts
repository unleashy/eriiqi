export interface FullDef {
  meaning: string;
  examples?: string[];
  children?: Array<string | FullDef>;
}

export type DefTree = Array<string | FullDef>;
