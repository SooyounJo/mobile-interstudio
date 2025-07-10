import { createGlobalStyle } from 'styled-components';
import React, { useEffect, useState } from 'react';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  #__next {
    width: 100%;
    height: 100%;
  }

  /* 한글은 시스템 폰트, 영어(영문자/숫자/기호)는 Montserrat Black Italic */
  body, * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 500;
  }
  /* 영어(영문자, 숫자, 기호)만 Montserrat Black Italic 적용 */
  body, * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 500;
  }
  body, * {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 900;
    font-style: italic;
    unicode-range: U+0020-007E, U+00A0-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  /* 한글(유니코드 범위)만 시스템 폰트로 강제 */
  *:not(:lang(en)) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-style: normal;
    font-weight: 500;
  }
`;

function MyApp({ Component, pageProps }) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    // 최초 접속 시각 기록
    if (typeof window !== 'undefined') {
      const key = 'site_entry_time';
      let entry = localStorage.getItem(key);
      if (!entry) {
        localStorage.setItem(key, Date.now().toString());
        entry = Date.now().toString();
      }
      const checkExpire = () => {
        const now = Date.now();
        const diff = now - parseInt(localStorage.getItem(key), 10);
        if (diff > 3600 * 1000) {
          setExpired(true);
        }
      };
      checkExpire();
      const interval = setInterval(checkExpire, 10000); // 10초마다 체크
      return () => clearInterval(interval);
    }
  }, []);

  if (expired) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#111', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 20, zIndex: 9999 }}>
        <div style={{ maxWidth: 340, textAlign: 'center', lineHeight: 1.6 }}>
          <b>이 사이트는 체험용으로<br/>1시간만 이용하실 수 있습니다.</b><br/><br/>
          더 이용하고 싶으시면 새로고침(F5) 또는 브라우저를 새로 여세요.<br/>
          <span style={{ fontSize: 15, color: '#aaa', marginTop: 16, display: 'block' }}>
            (많은 분들과 경험을 공유하기 위한 제한입니다)
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 