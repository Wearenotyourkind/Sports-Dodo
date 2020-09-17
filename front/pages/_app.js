import '../styles/globals.css';
import Head from 'next/head';
import MyLayout from '../components/MyLayout';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { wrapper } from '../store';
import { useEffect } from 'react';
import { LOAD_USER_REQUEST } from '../sagas/user';
import moment from 'moment';
require('moment-timezone');

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    const tokenValue = sessionStorage.getItem('sd');
    if (tokenValue) {
      axios.defaults.headers.common['x-access-token'] = tokenValue;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
    }
    moment.tz.setDefault('Asia/Seoul');
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
        ></link>
        {/* material ui 폰트 불러오기 로보토 폰트 */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        ></link>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
      <MyLayout>
        <Component {...pageProps} />
      </MyLayout>
    </>
  );
};

MyApp.getInitialProps = async (context) => {
  // 쿠키로 하는 가능성도 열어놨다.
  console.log(context);

  const cookie = new Cookies();
  const tokenValue = cookie.get('sd');
  if (tokenValue) {
    axios.defaults.headers.common['x-access-token'] = tokenValue;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }
  const { ctx } = context;
  const state = ctx.store.getState();
  // 서버일때만 쿠키 준다 (클라이언트일때는 알아서 쿠키 줌)
  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
      data: {
        me: true,
      },
    });
  }
};

export default wrapper.withRedux(MyApp);
