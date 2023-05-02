import React, { useEffect, useRef, useState } from 'react';

const GRAFANA_LOGS_QUERY = {
  datasource: 'KfuseLogsDatasource',
  queries: [{ refId: 'A' }],
  range: { from: 'now-1h', to: 'now' },
};
const GrafanaLogs = () => {
  const iframeRef = useRef(null);
  const [size, setSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const onResize = () => {
      setSize({ height: window.innerHeight - 60, width: window.innerWidth });
    };

    onResize();

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const updateSigninUrl = () => {
    const iframe = iframeRef.current;

    const allUrls = iframe.contentDocument.getElementsByTagName('a');
    for (let i = 0; i < allUrls.length; i++) {
      const element = allUrls[i];
      const href = element.href;

      if (href.includes('orgId=1&forceLogin=true')) {
        element.href = '/grafana/login';
      }

      if (href.includes('forceLogin=true')) {
        element.href = '/grafana/login';
      }
    }
  };

  const listenToSignInHover = (element: HTMLAnchorElement) => {
    element.addEventListener('mouseenter', (e) => {
      updateSigninUrl();
    });
  };

  const onLoad = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      const blogPanel = iframe.contentDocument.getElementById('4');

      if (blogPanel) {
        blogPanel.parentNode.removeChild(blogPanel);
      }

      const allUrls = iframe.contentDocument.getElementsByTagName('a');
      for (let i = 0; i < allUrls.length; i++) {
        const element = allUrls[i];
        if (element.href.includes('forceLogin=true')) {
          element.href = '/grafana/login';
          listenToSignInHover(element);
        }
      }
    }
  };

  return (
    <div className="grafana">
      <iframe
        className="grafana__iframe"
        height={size.height}
        width={size.width}
        onLoad={onLoad}
        ref={iframeRef}
        src={`/grafana/explore?orgId=1&left=${encodeURIComponent(
          JSON.stringify(GRAFANA_LOGS_QUERY),
        )}`}
      />
    </div>
  );
};

export default GrafanaLogs;
