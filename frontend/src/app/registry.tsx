'use client';

import { useServerInsertedHTML } from 'next/navigation';
import React from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [sheet] = React.useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  // If we're on the client, just render children
  if (typeof window !== 'undefined') {
    return <>{children}</>;
  }

  // If we're on the server, wrap children in StyleSheetManager
  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
}
