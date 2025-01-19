'use client';

import { useServerInsertedHTML } from 'next/navigation';
import React, { useState } from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') {
    return <StyleSheetManager enableVendorPrefixes>{children}</StyleSheetManager>;
  }

  return (
    <StyleSheetManager sheet={sheet.instance} enableVendorPrefixes>
      {children}
    </StyleSheetManager>
  );
}
