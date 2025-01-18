import React from 'react';

export function GoogleTag() {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=GT-WPFJ6RGW" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GT-WPFJ6RGW');
          `,
        }}
      />
    </>
  );
}