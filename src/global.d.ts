import { MemoryRouterProps } from 'react-router-dom';

declare module '@testing-library/react' {
  interface RenderOptions {
    memoryRouter?: MemoryRouterProps;
  }

  interface RenderHookOptions {
    memoryRouter?: MemoryRouterProps;
  }
}
