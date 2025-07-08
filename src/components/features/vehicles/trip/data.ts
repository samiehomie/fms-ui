import type { TripSession } from './types'

// 6월 한 달간의 운행 기록을 가정한 더미 데이터입니다.
export const tripData: TripSession[] = [
  {
    id: 'trip-1',
    startLocation: '서울시 강남구',
    endLocation: '경기도 성남시 분당구',
    driveTime: 45,
    idleTime: 5,
    events: ['과속', '급정거'],
    path: [
      [37.4979, 127.0276],
      [37.485, 127.05],
      [37.4449, 127.1389],
    ],
  },
  {
    id: 'trip-2',
    startLocation: '경기도 성남시 분당구',
    endLocation: '인천국제공항',
    driveTime: 90,
    idleTime: 15,
    events: ['장시간 공회전'],
    path: [
      [37.4449, 127.1389],
      [37.48, 126.9],
      [37.45, 126.44],
      [37.4491, 126.4504],
    ],
  },
  {
    id: 'trip-3',
    startLocation: '서울시 마포구',
    endLocation: '경기도 파주시',
    driveTime: 60,
    idleTime: 10,
    events: ['지오펜스 진입'],
    path: [
      [37.5663, 126.9014],
      [37.6, 126.85],
      [37.7, 126.78],
      [37.766, 126.779],
    ],
  },
  {
    id: 'trip-4',
    startLocation: '경기도 수원시',
    endLocation: '충청남도 천안시',
    driveTime: 75,
    idleTime: 8,
    events: ['급가속'],
    path: [
      [37.2636, 127.0286],
      [37.1, 127.05],
      [36.9, 127.1],
      [36.815, 127.1139],
    ],
  },
  {
    id: 'trip-5',
    startLocation: '서울시 종로구',
    endLocation: '경기도 가평군',
    driveTime: 80,
    idleTime: 20,
    events: ['과속', '장시간 공회전'],
    path: [
      [37.572, 126.979],
      [37.6, 127.1],
      [37.7, 127.3],
      [37.826, 127.517],
    ],
  },
  {
    id: 'trip-6',
    startLocation: '부산시 해운대구',
    endLocation: '울산시 남구',
    driveTime: 55,
    idleTime: 7,
    events: ['급정거'],
    path: [
      [35.163, 129.16],
      [35.3, 129.2],
      [35.539, 129.311],
    ],
  },
  {
    id: 'trip-7',
    startLocation: '대구시 중구',
    endLocation: '경상북도 구미시',
    driveTime: 50,
    idleTime: 5,
    events: ['과속'],
    path: [
      [35.8714, 128.6014],
      [35.9, 128.5],
      [36.119, 128.344],
    ],
  },
  // ... 필요에 따라 약 30개의 데이터를 채울 수 있습니다.
]
