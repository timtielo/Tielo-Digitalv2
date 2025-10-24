import React from 'react';

export function VoiceflowChatbot() {
  return (
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
          (function(d, t) {
            var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
            v.onload = function() {
              window.voiceflow.chat.load({
                verify: { projectID: '674d9b91083c81389079bb36' },
                url: 'https://general-runtime.voiceflow.com',
                versionID: 'production'
              });
            }
            v.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
            v.type = "text/javascript";
            s.parentNode.insertBefore(v, s);
          })(document, 'script');
        `
      }}
    />
  );
}
