import { Product } from '../types';
import { categories } from './categories';

// Simple seed-based pseudo-random number generator (mulberry32)
function createRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Category-specific image pools using Unsplash image IDs
// These are free-to-use images from Unsplash matching each product category
const kpopImagePools: Record<string, string[]> = {
  Albums: [
    'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop', // CD cases
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop', // vinyl
    'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop', // music collection
    'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=400&fit=crop', // CDs stacked
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', // record store
  ],
  Photocards: [
    'https://images.unsplash.com/photo-1583364995252-31cc0cce1498?w=400&h=400&fit=crop', // polaroid photos
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', // photo prints
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=400&fit=crop', // stacked photos
    'https://images.unsplash.com/photo-1531747056868-e1485941d831?w=400&h=400&fit=crop', // photo collection
    'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=400&h=400&fit=crop', // instant photos
  ],
  'Light Sticks': [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop', // concert lights
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop', // concert crowd
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=400&fit=crop', // concert stage
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=400&fit=crop', // lights show
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', // stage lights
  ],
  Apparel: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', // white tshirt
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', // hoodie
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop', // tshirt mockup
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop', // clothing rack
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop', // tshirt graphic
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop', // bracelet
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop', // necklace
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop', // rings
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop', // jewelry collection
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=400&fit=crop', // accessories
  ],
  Posters: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop', // art poster
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop', // wall art
    'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=400&h=400&fit=crop', // poster frame
    'https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=400&h=400&fit=crop', // music poster
    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=400&fit=crop', // poster mockup
  ],
  Stationery: [
    'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop', // notebook
    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop', // stationery set
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop', // diary
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop', // washi tape
    'https://images.unsplash.com/photo-1568205631088-46f8b4fde79c?w=400&h=400&fit=crop', // pen set
  ],
};

const webtoonImagePools: Record<string, string[]> = {
  Figures: [
    'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400&h=400&fit=crop', // action figure
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop', // anime figure
    'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=400&fit=crop', // collectible
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', // figure display
    'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&h=400&fit=crop', // toy figure
  ],
  'Art Books': [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', // book stack
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', // open book
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', // art book
    'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=400&fit=crop', // illustration
    'https://images.unsplash.com/photo-1553729459-afe8f2e2882d?w=400&h=400&fit=crop', // bookshelf
  ],
  Apparel: [
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop', // graphic tee
    'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=400&h=400&fit=crop', // anime style shirt
    'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400&h=400&fit=crop', // printed hoodie
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', // casual wear
    'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=400&h=400&fit=crop', // tshirt
  ],
  'Phone Cases': [
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop', // phone case
    'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=400&h=400&fit=crop', // phone accessories
    'https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=400&h=400&fit=crop', // phone cover
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', // smartphone case
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop', // phone mockup
  ],
  Stickers: [
    'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=400&h=400&fit=crop', // sticker laptop
    'https://images.unsplash.com/photo-1635048424329-a9bfb146d7aa?w=400&h=400&fit=crop', // cute stickers
    'https://images.unsplash.com/photo-1558244661-d248897f7bc4?w=400&h=400&fit=crop', // sticker set
    'https://images.unsplash.com/photo-1586717799252-bd134f5c1d68?w=400&h=400&fit=crop', // decorative
    'https://images.unsplash.com/photo-1605448723974-0d8e2b8a8e3d?w=400&h=400&fit=crop', // sticker pack
  ],
  Keychains: [
    'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop', // keychain
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop', // charm
    'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400&h=400&fit=crop', // key accessories
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', // trinkets
    'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=400&h=400&fit=crop', // metal keychain
  ],
  'Home Decor': [
    'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop', // wall decor
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', // room decor
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=400&fit=crop', // cushion
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', // cozy home
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&fit=crop', // living room
  ],
};

// Returns the product image path: first tries /products/{name}.jpg, falls back to Unsplash
function getProductImageUrl(_id: string, _mainCategory: string, _subCategory: string, _index: number, name: string): string {
  // Primary: local image in public/products/ folder matching product name
  // Supports .jpg, .jpeg, .png, .webp — fallback handled in ProductCard via onError
  return `${import.meta.env.BASE_URL}products/${name}.jpg`;
}

// Fallback URL when local image doesn't exist
export function getFallbackImageUrl(mainCategory: string, subCategory: string, index: number): string {
  const pools = mainCategory === 'K-POP Goods' ? kpopImagePools : webtoonImagePools;
  const images = pools[subCategory] || pools[Object.keys(pools)[0]];
  return images[index % images.length];
}

// K-POP artist/group names for product name generation
const kpopArtists = [
  'BTS', 'BLACKPINK', 'Stray Kids', 'TWICE', 'aespa',
  'NewJeans', 'IVE', 'LE SSERAFIM', 'SEVENTEEN', 'EXO',
  'Red Velvet', 'NCT', 'TXT', 'ATEEZ', 'ENHYPEN',
  '(G)I-DLE', 'ITZY', 'NMIXX', 'Dreamcatcher', 'MAMAMOO',
];

// K-WEBTOON titles for product name generation
const webtoonTitles = [
  '나 혼자만 레벨업', '신의 탑', '갓 오브 하이스쿨',
  '노블레스', '외모지상주의', '여신강림',
  '전지적 독자 시점', '바른연애 길잡이', '취사병 전설이 되다',
  '싸움독학', '화산귀환', '나노마신',
  '템빨', '재혼황후', '유미의 세포들',
  '독학마법사', '장씨세가 호위무사', '소년심판',
  '이태원 클라쓰', '스위트홈',
];

// Product type descriptors for each sub-category
const kpopProductTypes: Record<string, string[]> = {
  Albums: ['정규앨범', '미니앨범', '리패키지', '싱글앨범', '스페셜앨범'],
  Photocards: ['포토카드 세트', '랜덤 포토카드', '한정판 포토카드', '시즌 그리팅 포토카드', '팬미팅 포토카드'],
  'Light Sticks': ['공식 응원봉', '응원봉 ver.2', '미니 응원봉', '키링 응원봉', '스페셜 응원봉'],
  Apparel: ['콘서트 티셔츠', '후드티', '맨투맨', '자켓', '팬 유니폼'],
  Accessories: ['팔찌', '목걸이', '반지', '헤어핀', '키링'],
  Posters: ['공식 포스터', '콘서트 포스터', '팬사인회 포스터', '시즌 포스터', '한정판 포스터'],
  Stationery: ['다이어리', '스티커 세트', '마스킹 테이프', '메모지', '연필 세트'],
};

const webtoonProductTypes: Record<string, string[]> = {
  Figures: ['피규어', '넨도로이드', '아크릴 스탠드', '미니 피규어', '액션 피규어'],
  'Art Books': ['아트북', '일러스트 북', '설정집', '팬북', '화보집'],
  Apparel: ['티셔츠', '후드티', '맨투맨', '잠옷', '양말 세트'],
  'Phone Cases': ['하드케이스', '젤리케이스', '카드포켓 케이스', '그립톡 세트', '범퍼케이스'],
  Stickers: ['스티커 팩', '다이컷 스티커', '홀로그램 스티커', '데코 스티커', '방수 스티커'],
  Keychains: ['아크릴 키링', '메탈 키링', '러버 키링', '인형 키링', '쉐이커 키링'],
  'Home Decor': ['포스터', '담요', '쿠션', '무드등', '벽시계'],
};

// Product descriptions
const kpopDescriptions: Record<string, string[]> = {
  Albums: [
    '공식 정품 앨범. 포토북(80p 이상), 랜덤 포토카드 2장, 북마크, 스티커 시트 포함. 첫 번째 프레스 한정 홀로그램 슬리브 적용.',
    '타이틀곡 뮤직비디오 촬영 현장 비하인드 포토북과 멤버별 유닛 포토카드가 수록된 한정판 에디션입니다.',
    '디지팩 사양의 스페셜 앨범으로 미공개 셀카 포토카드와 접이식 포스터가 포함됩니다. 랜덤 발송.',
    '정규앨범 수록곡 전곡 + 보너스 트랙 2곡 포함. 180p 포토북에 콘셉트 사진과 가사가 수록되어 있습니다.',
    '미니앨범 패키지로 QR 포토카드, 엽서 세트, 미니 포스터가 구성되어 있습니다. 버전별 랜덤 발송.',
  ],
  Photocards: [
    '공식 트레이딩 포토카드 세트(8장). 고광택 인쇄에 라운드 코너 처리. 표준 규격 55×85mm.',
    '랜덤 포토카드 팩입니다. 팩당 2장 랜덤 포함, 멤버 지정 불가. 시즌 한정 디자인.',
    '팬미팅 현장에서만 배포되었던 한정 포토카드의 공식 리프린트입니다. 넘버링 없는 일반판.',
    '홀로그램 스페셜 포토카드 세트. UV 코팅 적용으로 빛 각도에 따라 멤버 이미지가 변합니다.',
    '시즌 그리팅 포토카드 컬렉션. 12장 세트(월별 콘셉트). PVC 소재의 투명 카드 포함.',
  ],
  'Light Sticks': [
    '공식 응원봉 ver.3 — Bluetooth 5.0 연동으로 콘서트장 좌석별 LED 컬러 동기화 지원. AAA 배터리 3개 포함.',
    '콘서트 필수템! 버튼 하나로 7가지 LED 색상 변경 가능. 손목 스트랩과 배터리 포함.',
    '미니 응원봉 키링 사이즈로 가방에 달기 좋은 크기입니다. LED 1색(공식 팬클럽 컬러) 고정.',
    '공식 응원봉 전용 데코 스티커 세트 포함 버전. 나만의 커스텀 응원봉을 만들 수 있습니다.',
    '무선 충전 지원 스페셜 에디션 응원봉. USB-C 충전 케이블 동봉. 최대 6시간 연속 사용.',
  ],
  Apparel: [
    '2024 월드투어 공식 머천다이즈 오버사이즈 티셔츠. 프론트 로고 + 백 투어 일정 프린팅. 면 100%.',
    '프리미엄 기모 후드티. 가슴에 아티스트 시그니처 자수 포인트. S/M/L/XL 사이즈.',
    '데일리로 입기 좋은 미니멀 디자인 맨투맨. 소매에 작은 로고 포인트. 유니섹스 핏.',
    '콘서트 한정 집업 자켓. 등판에 대형 그래픽 프린트. 방풍 소재로 야외 공연에 적합.',
    '아티스트 콜라보 크롭탑. 팬미팅 포토존용으로 제작된 한정판. 여성 프리사이즈.',
  ],
  Accessories: [
    '스테인리스 스틸 소재의 레이어드 팔찌. 아티스트 데뷔일이 각인되어 있습니다. 체인 길이 조절 가능.',
    '실버 925 소재 미니멀 목걸이. 펜던트에 팬클럽 심볼 모티브. 변색 방지 코팅 처리.',
    '아티스트 시그니처가 각인된 스테인리스 반지. 4호~22호 사이즈 선택 가능.',
    '아크릴 소재 헤어클립 세트(3개입). 앨범 콘셉트 컬러를 반영한 파스텔 톤 디자인.',
    '가죽 스트랩 키링. 메탈 참에 그룹 로고가 양각으로 새겨져 있습니다. 열쇠/가방 장식용.',
  ],
  Posters: [
    'A2 사이즈(420×594mm) 공식 콘셉트 포스터. 무광 코팅지에 고해상도 인쇄. 액자 미포함.',
    '양면 인쇄 포스터 — 앞면 그룹샷, 뒷면 개인 컷. 튜브 포장으로 배송.',
    '콘서트 투어 기념 한정판 포스터. 날짜와 도시명이 인쇄되어 있습니다. 넘버링 없음.',
    '시즌 화보 촬영 메이킹 포스터 세트(4장). B3 사이즈. 인테리어 소품으로 활용 가능.',
    '홀로그램 포스터 — 보는 각도에 따라 두 가지 이미지가 보입니다. A3 사이즈.',
  ],
  Stationery: [
    '하드커버 다이어리(A5). 월간/주간 스케줄러 + 프리 노트. 아티스트 일러스트 커버. 192페이지.',
    '데코 스티커 세트(5시트, 총 120장). 다이어리/폰케이스/노트북 꾸미기용. 방수 PVC 소재.',
    '마스킹 테이프 3종 세트. 폭 15mm, 각 10m. 앨범 콘셉트 컬러 + 패턴 디자인.',
    '떡메모지 세트(4패드, 각 100매). 아티스트 캐릭터 일러스트 + 격언 문구 포함.',
    '컬러 연필 12색 세트. 틴케이스 포장. 케이스에 그룹 포토 프린트.',
  ],
};

const webtoonDescriptions: Record<string, string[]> = {
  Figures: [
    '1/7 스케일 피규어. PVC·ABS 소재. 높이 약 23cm. 받침대 포함. 원작 작가 감수 하에 제작.',
    '넨도로이드 스타일 SD 피규어. 교체용 표정 파츠 3종 + 소품 세트 포함. 높이 10cm.',
    '아크릴 스탠드(15cm). 양면 인쇄로 뒷면에도 캐릭터 일러스트가 있습니다. 데스크 인테리어용.',
    '미니 피규어 가챠 시리즈. 전 6종 중 랜덤 1종 발송. 높이 5cm. 교환/환불 불가.',
    '디오라마 피규어 세트. 작품 내 명장면을 재현한 미니어처. 아크릴 배경판 포함.',
  ],
  'Art Books': [
    '공식 아트북 — 연재 1~100화 하이라이트 일러스트 120점 + 작가 코멘터리 수록. 하드커버 A4.',
    '캐릭터 설정집. 초기 콘셉트 스케치부터 최종 디자인까지의 변천 과정을 담았습니다. 240p.',
    '팬북 — 인기 투표 결과, 작가 Q&A, 미공개 4컷 만화, 캐릭터 프로필 카드 포함. B5 사이즈.',
    '원작 일러스트 화보집. 단행본 표지 + 잡지 표지 아트워크 전부 수록. 고급 무광 코팅.',
    '메이킹 오브 시즌2 — 스토리보드, 컬러 팔레트, 배경 원화 등 제작 비하인드를 공개합니다.',
  ],
  Apparel: [
    '캐릭터 프린트 오버사이즈 티셔츠. 원작 인기 장면 아트워크 적용. 면 100%. 유니섹스.',
    '기모 후드티. 가슴에 캐릭터 미니 자수 + 뒷면에 작품 로고. 겨울 홈웨어로도 좋습니다.',
    '잠옷 세트(상하의). 캐릭터 패턴 올오버 프린트. 부드러운 모달 소재. M/L 사이즈.',
    '양말 3족 세트. 캐릭터별 다른 디자인. 프리사이즈(230~270mm). 면혼방 소재.',
    '캐릭터 실루엣이 들어간 미니멀 맨투맨. 데일리 착용에 부담 없는 심플 디자인.',
  ],
  'Phone Cases': [
    '하드케이스(iPhone/Galaxy 호환). 캐릭터 풀 일러스트 UV 프린팅. 슬림핏으로 그립감 유지.',
    '투명 젤리케이스에 캐릭터 라인아트 인쇄. 케이스 뒤 폰 색상이 비칩니다. 충격 흡수 범퍼.',
    '카드포켓 케이스 — 뒷면에 카드 2장 수납 가능. 캐릭터 엠보싱 처리. 합성가죽 소재.',
    '그립톡 + 케이스 세트. 캐릭터 얼굴 모양 그립톡이 포함됩니다. 접착식 탈부착 가능.',
    '범퍼케이스. 4코너 에어쿠션으로 낙하 충격 보호. 뒷면 투명에 캐릭터 스티커 동봉.',
  ],
  Stickers: [
    '다이컷 스티커 팩(20장). 캐릭터 표정 + 명대사 + 아이템 모티브. 방수 비닐 소재.',
    '홀로그램 스티커 시트(A5). 빛에 따라 무지개빛 반짝임. 노트북/태블릿 꾸미기용.',
    '데코 스티커 세트(5시트, 총 80장). 다이어리/플래너 꾸미기에 최적화된 사이즈.',
    '투명 스티커 10장 세트. 폰케이스 안쪽에 넣어 사용 가능. 유광 코팅.',
    '와펜 스티커 3종. 의류/가방에 다리미로 부착 가능한 자수 패치 타입.',
  ],
  Keychains: [
    '아크릴 키링(양면 인쇄, 6cm). 캐릭터 SD 일러스트. 볼체인 + 랍스터 클립 이중 고리.',
    '메탈 키링. 다이캐스팅 합금에 에나멜 도색. 묵직한 질감으로 고급스러운 마감.',
    '러버 키링(실리콘 소재). 말랑한 촉감. 캐릭터 전신 형상. 방수/변형에 강합니다.',
    '인형 키링(10cm). 봉제 소재로 가방에 달면 미니 인형처럼 보입니다. 고리 회전식.',
    '쉐이커 키링 — 투명 아크릴 안에 글리터와 미니 캐릭터가 들어있어 흔들면 움직입니다.',
  ],
  'Home Decor': [
    '캔버스 포스터(A3). 원작 명장면을 캔버스 질감 용지에 인쇄. 우드 프레임 옵션 선택 가능.',
    '극세사 담요(100×150cm). 캐릭터 일러스트 풀프린트. 소파/침대 위 인테리어 + 실사용 겸용.',
    '캐릭터 쿠션(45×45cm). 벨벳 원단에 디지털 프린트. 솜 충전재 포함. 지퍼 분리 세탁 가능.',
    'LED 무드등. 캐릭터 실루엣이 아크릴판에 각인되어 불빛이 들어옵니다. USB 전원. 3색 변환.',
    '벽시계(25cm). 무소음 무브먼트 적용. 캐릭터 아트워크 인쇄 시계판. AA건전지 1개 사용.',
  ],
};

function generateProducts(): Product[] {
  const rng = createRng(42); // Fixed seed for reproducible data
  const products: Product[] = [];

  // Generate K-POP products
  const kpopCategory = categories[0];
  let kpopIndex = 0;

  for (const subCategory of kpopCategory.subCategories) {
    const productCount = 29; // ~200 / 7 ≈ 28.57, use 29 to get ~203 total
    const types = kpopProductTypes[subCategory];
    const descriptions = kpopDescriptions[subCategory];

    for (let i = 0; i < productCount; i++) {
      const artist = kpopArtists[Math.floor(rng() * kpopArtists.length)];
      const productType = types[Math.floor(rng() * types.length)];
      const description = descriptions[Math.floor(rng() * descriptions.length)];
      const price = (Math.floor(rng() * 29 + 1) * 5000); // ₩5,000 – ₩150,000 in 5000 steps
      const inStock = rng() > 0.1; // ~10% out of stock

      // Generate a date within the last 6 months for sorting
      const daysAgo = Math.floor(rng() * 180);
      const createdDate = new Date(2024, 5, 1); // June 1, 2024 as base
      createdDate.setDate(createdDate.getDate() - daysAgo);

      kpopIndex++;
      const id = `kpop-${subCategory.toLowerCase().replace(/\s+/g, '-')}-${String(kpopIndex).padStart(3, '0')}`;

      const productName = `${artist} ${productType}`;

      products.push({
        id,
        name: productName,
        description: `${artist} - ${description}`,
        price,
        imageUrl: getProductImageUrl(id, 'K-POP Goods', subCategory, kpopIndex, productName),
        mainCategory: 'K-POP Goods',
        subCategory,
        inStock,
        createdAt: createdDate.toISOString(),
      });
    }
  }

  // Generate K-WEBTOON products
  let webtoonIndex = 0;

  for (const subCategory of categories[1].subCategories) {
    const productCount = 29; // ~200 / 7 ≈ 28.57, use 29 to get ~203 total
    const types = webtoonProductTypes[subCategory];
    const descriptions = webtoonDescriptions[subCategory];

    for (let i = 0; i < productCount; i++) {
      const webtoon = webtoonTitles[Math.floor(rng() * webtoonTitles.length)];
      const productType = types[Math.floor(rng() * types.length)];
      const description = descriptions[Math.floor(rng() * descriptions.length)];
      const price = (Math.floor(rng() * 29 + 1) * 5000); // ₩5,000 – ₩150,000 in 5000 steps
      const inStock = rng() > 0.1; // ~10% out of stock

      // Generate a date within the last 6 months
      const daysAgo = Math.floor(rng() * 180);
      const createdDate = new Date(2024, 5, 1);
      createdDate.setDate(createdDate.getDate() - daysAgo);

      webtoonIndex++;
      const id = `webtoon-${subCategory.toLowerCase().replace(/\s+/g, '-')}-${String(webtoonIndex).padStart(3, '0')}`;

      const productName = `${webtoon} ${productType}`;

      products.push({
        id,
        name: productName,
        description: `${webtoon} - ${description}`,
        price,
        imageUrl: getProductImageUrl(id, 'K-WEBTOON Goods', subCategory, webtoonIndex, productName),
        mainCategory: 'K-WEBTOON Goods',
        subCategory,
        inStock,
        createdAt: createdDate.toISOString(),
      });
    }
  }

  return products;
}

export const products: Product[] = generateProducts();

// Helper to get products by category
export function getProductsByMainCategory(mainCategory: string): Product[] {
  return products.filter((p) => p.mainCategory === mainCategory);
}

export function getProductsBySubCategory(mainCategory: string, subCategory: string): Product[] {
  return products.filter(
    (p) => p.mainCategory === mainCategory && p.subCategory === subCategory
  );
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
