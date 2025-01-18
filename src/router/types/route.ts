import { ComponentType } from 'react';

export interface Route {
  path: string;
  component: ComponentType<any>;
  layout?: boolean;
  params?: string[];
}

export interface RouterResult {
  Component: ComponentType<any> | null;
  params: Record<string, string>;
  useLayout: boolean;
}