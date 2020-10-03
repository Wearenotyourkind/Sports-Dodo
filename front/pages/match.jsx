import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import styled from 'styled-components';
import axios from 'axios';
import { BACKEND_URL } from '../sagas';
import MatchTest from '../components/MatchTest';
import Notification from '../components/Notification';
import { LOAD_BATTING_HISTORY_REQUEST } from '../sagas/batting';

import {
  notification,
  Alert,
  Space,
  Form,
  Input,
  Radio,
  Row,
  Col,
  Avatar,
  InputNumber,
  Button,
  Divider,
} from 'antd';
import {
  UpperDiv,
  LowerDiv,
  SportCategories,
  FlexDiv,
} from '../styles/styled-components';
import { AlignCenterOutlined, SyncOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

axios.defaults.baseURL = `${BACKEND_URL}/api`;
require('moment-timezone');

const fetchApi = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

// const getPercent = (home, draw, away) => {
//   // 계산
//   return {
//     homePercent,
//     drawPercent,
//     awayPercent,
//   };
// };

const match = () => {
  moment.tz.setDefault('Asia/Seoul');
  const nowTime = moment().format();

  const router = useRouter();
  const matchid = router.query.matchid;

  const { me } = useSelector((state) => state.user);
  const { battingHistory } = useSelector((state) => state.batting);
  const dispatch = useDispatch();
  // 리덕스 배팅 내역 부르는거 오류

  // const userPoint = me ? me.point : 0;
  const [userPoint, setUserPoint] = useState(0);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [match, setMatch] = useState(null);
  const [bpoint, setBpoint] = useState([]);
  const [choose, setChoose] = useState('Home');
  const [battingpoint, setBattingpoint] = useState(10);

  const [homeImg, setHomeImg] = useState('/images/epl_logo.png');
  const [awayImg, setAwayImg] = useState('/images/epl_logo.png');

  // dispatch({
  //   type: LOAD_BATTING_HISTORY_REQUEST, data: { matchid },
  // });

  // console.log(battingHistory);
  useEffect(() => {
    setUserPoint(me?.point);
    if (!me) {
      // Notification('로그인이 필요합니다!');
      // <Alert message="로그인이 필요합니다!" type="warning" showIcon closable />;
      // alert('로그인이 필요합니다!');
      // router.push('/');
    }
    if (matchid) {
      const match = fetchApi(`/match/${matchid}`);
      const point = fetchApi(`/match/${matchid}/batting`);

      Promise.all([match, point]).then((v) => {
        setMatch(v[0].data);
        setHomeImg(v[0].data.homeTeamLogoUrl);
        setAwayImg(v[0].data.awayTeamLogoUrl);
        setBpoint(v[1]);
      });
    }
  }, [matchid, me]);

  const homeTeam = match?.homeTeam;
  const awayTeam = match?.awayTeam;

  const startTime = moment(match?.startTime).format('MM/DD hh:mm');
  const deadLine = moment(match?.startTime).subtract(5, 'minutes').format();

  const goalsHomeTeam = match?.goalsHomeTeam;
  const goalsAwayTeam = match?.goalsAwayTeam;

  const homeTotalPoint = bpoint?.battingPoints?.homeTotalPoint;
  const awayTotalPoint = bpoint?.battingPoints?.awayTotalPoint;
  const drawTotalPoint = bpoint?.battingPoints?.drawTotalPoint;
  const totalPoint = homeTotalPoint + awayTotalPoint + drawTotalPoint;

  //배당률 백분율
  const home1 = Math.floor((100 / totalPoint) * homeTotalPoint + 10) + '%';
  const home2 = Math.floor((100 / totalPoint) * drawTotalPoint + 10) + '%';
  const home3 = Math.floor((100 / totalPoint) * awayTotalPoint + 10) + '%';

  //배당률 전체/
  // testnum.toFixed(0);  소수점 버리기 반올림

  const homeOdds =
    homeTotalPoint === 0 ? 0 : (totalPoint / homeTotalPoint).toFixed(2);
  const awayOdds =
    awayTotalPoint === 0 ? 0 : (totalPoint / awayTotalPoint).toFixed(2);
  const drawOdds =
    drawTotalPoint === 0 ? 0 : (totalPoint / drawTotalPoint).toFixed(2);
  //적중률
  const hitOdds =
    choose === 'Home'
      ? (homeOdds * battingpoint).toFixed(2)
      : choose === 'Away'
      ? (awayOdds * battingpoint).toFixed(2)
      : (drawOdds * battingpoint).toFixed(2);

  const round = match?.round;
  // const referee = if;
  const referee = () => {
    if (match?.referee === null) {
      return '미정';
    } else {
      return match?.referee;
    }
  };
  const venue = match?.venue;

  const handleChooseChange = (e) => {
    setChoose(e.target.value);
  };

  const handlebattingpointChange = (e) => {
    if (e > userPoint) {
      Notification('가진 포인트보다 배팅을 많이 했습니다.');
    } else {
      setBattingpoint(e);
    }
  };

  const handleSubmit = () => {
    axios
      .post(`/match/${matchid}/batting`, {
        homeTeamName: homeTeam,
        awayTeamName: awayTeam,
        chooseHomeAwayDraw: choose,
        battingPoint: battingpoint,
      })
      .then((res) => {
        console.log(res);
        Notification('배팅을 완료 하였습니다!');
        // <Alert message="배팅을 완료 하였습니다." type="success" showIcon />;
        router.reload();
      })
      .catch((err) => {
        console.log(err);
        Notification('배팅에 오류가 발생 하였습니다!');
        router.reload();
        // <Alert message="배팅 시간이 지났습니다." type="error" showIcon />;
      });
  };

  return (
    <div style={{ height: 'calc(100vh - 57px)' }}>
      <Row
        style={{
          backgroundColor: 'white',
          height: '100%',
        }}
      >
        <Row style={{ margin: '2rem' }}>
          <strong>{round}</strong>
        </Row>
        <Row
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            //수직 가운데 정렬
          }}
        >
          <Col span={10}>
            <Row>
              <Avatar
                size={100}
                src={homeImg}
                style={{ backgroundColor: 'white' }}
              />
            </Row>
            <Row>
              <h2>{homeTeam}</h2>
            </Row>
            <Row>
              <h4>11승 1무 3패</h4>
            </Row>
            <Row>
              <h4>{goalsHomeTeam}</h4>
            </Row>
          </Col>
          <Col span={4}>
            {/* <Row>{round}</Row> */}
            <Row>
              <h1>VS</h1>
            </Row>
            <Row>
              <h4>{startTime}</h4>
            </Row>
            {/* <Row>
              <h4>마감시간 {deadLine}</h4>
            </Row> */}

            {/* 장소 */}
          </Col>
          <Col span={10}>
            <Row>
              <Avatar
                size={100}
                src={awayImg}
                style={{ backgroundColor: 'white' }}
              />
            </Row>
            <Row>
              <h2>{awayTeam}</h2>
            </Row>
            <Row>
              <h4>16승 0무 0패</h4>
            </Row>
            <Row>
              <h4>{goalsAwayTeam}</h4>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginBottom: '2rem' }}>
          <Row>{venue}</Row>
          <Row>주심 : {referee()}</Row>
        </Row>
        <Row
          style={{
            marginBottom: '1rem',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 24/total *a */}
          <div
            style={{
              width: '30%',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#e55039',
                width: home1,
              }}
            >
              {homeTotalPoint} p
            </div>

            <div
              style={{
                backgroundColor: '#4a69bd',
                width: home2,
              }}
            >
              {drawTotalPoint} p
            </div>

            <div
              style={{
                backgroundColor: '#78e08f',
                width: home3,
              }}
            >
              {awayTotalPoint} p
            </div>
          </div>
        </Row>
        <Row
          style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '30%',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
            }}
          >
            <Col span={7}>
              <Button
                type="primary"
                danger
                style={{ backgroundColor: '#e55039' }}
              >
                {homeOdds}
              </Button>
            </Col>
            <Col span={7}>
              <Button
                type="primary"
                danger
                style={{ backgroundColor: '#4a69bd' }}
              >
                {drawOdds}
              </Button>
            </Col>
            <Col span={7}>
              <Button
                type="primary"
                danger
                style={{ backgroundColor: '#78e08f' }}
              >
                {awayOdds}
              </Button>
            </Col>
          </div>
        </Row>
        <Divider />
        {/*  새 컴포넌트 만들기 */}
        <Form onFinish={handleSubmit}>
          <Row>
            {/* style={{ paddingTop: '2rem' }} */}
            <Radio.Group defaultValue="Home" buttonStyle="solid">
              <Radio.Button value="Home" onChange={handleChooseChange}>
                홈 승 {homeOdds}
              </Radio.Button>
              <Radio.Button value="Draw" onChange={handleChooseChange}>
                홈 무 {drawOdds}
              </Radio.Button>
              <Radio.Button value="Away" onChange={handleChooseChange}>
                홈 패 {awayOdds}
              </Radio.Button>
            </Radio.Group>
          </Row>
          <Row style={{ paddingTop: '1rem' }}>
            <InputNumber
              defaultValue={10}
              min={10}
              max={userPoint}
              step={10}
              onChange={handlebattingpointChange}
            />
          </Row>
          <Row style={{ paddingTop: '1rem' }}>
            예상 배당 포인트 : {hitOdds} p
          </Row>
          <Row style={{ padding: '1rem' }}>
            {nowTime > deadLine ? (
              <Button type="primary" danger>
                마감
              </Button>
            ) : (
              <Button type="primary" danger htmlType="submit">
                배팅
              </Button>
            )}
          </Row>
        </Form>
        <Divider>배팅한 사람들</Divider>
        {/* 디바이더 사용하기 */}
        <Row align="center">
          <Col span={7}>1 승</Col>
          {/* 홈팀 배팅한 사람들 */}
          <Col span={1}>
            <Divider type="vertical" />
          </Col>
          <Col span={7}>2 무</Col>
          <Col span={1}>
            <Divider type="vertical" />
          </Col>
          <Col span={7}>3 패</Col>
        </Row>
      </Row>
    </div>
  );
};
//match/id 검색
// user/userid/  >> filter((e)=>e.matchid ===match)   // chooseHomeAwayDraw
export default match;
