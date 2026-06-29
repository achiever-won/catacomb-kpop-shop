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

function getPlaceholderUrl(mainCategory: string, subCategory: string, index: number): string {
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
    '공식 정품 앨범입니다. 포토북, 포토카드, 스티커 등 다양한 구성품이 포함되어 있습니다.',
    '한정판 앨범으로 특별 포토카드가 포함됩니다.',
    '팬들을 위한 스페셜 패키지 구성입니다.',
  ],
  Photocards: [
    '공식 포토카드로 고화질 인쇄가 적용되었습니다.',
    '랜덤 포토카드 세트입니다. 멤버 지정이 불가합니다.',
    '한정 수량 제작된 스페셜 포토카드입니다.',
  ],
  'Light Sticks': [
    '공식 응원봉으로 Bluetooth 연동이 가능합니다.',
    '콘서트장에서 사용 가능한 공식 응원 아이템입니다.',
    '배터리 포함, LED 색상 변경 가능한 응원봉입니다.',
  ],
  Apparel: [
    '공식 콘서트 머천다이즈 의류입니다.',
    '프리미엄 원단으로 제작된 팬 의류입니다.',
    '편안한 착용감의 캐주얼 팬 의류입니다.',
  ],
  Accessories: [
    '아티스트 공식 굿즈 액세서리입니다.',
    '고급 소재로 제작된 팬 액세서리입니다.',
    '일상에서 착용 가능한 감각적인 디자인입니다.',
  ],
  Posters: [
    '고화질 인쇄의 공식 포스터입니다.',
    '인테리어에 어울리는 프리미엄 포스터입니다.',
    '한정판 넘버링 포스터입니다.',
  ],
  Stationery: [
    '일상에서 사용하기 좋은 아티스트 문구입니다.',
    '고급 종이에 인쇄된 디자인 문구 세트입니다.',
    '팬을 위한 감각적인 문구 아이템입니다.',
  ],
};

const webtoonDescriptions: Record<string, string[]> = {
  Figures: [
    '인기 웹툰 캐릭터를 정밀하게 재현한 피규어입니다.',
    '디테일한 조형과 채색이 돋보이는 고퀄리티 피규어입니다.',
    '책상 위에 놓기 좋은 미니 사이즈 피규어입니다.',
  ],
  'Art Books': [
    '작가의 일러스트와 미공개 스케치가 담긴 아트북입니다.',
    '작품의 세계관을 깊이 있게 담은 설정집입니다.',
    '팬아트와 공식 일러스트가 수록된 화보집입니다.',
  ],
  Apparel: [
    '웹툰 캐릭터가 프린트된 캐주얼 의류입니다.',
    '편안한 착용감의 캐릭터 홈웨어입니다.',
    '유니크한 디자인의 웹툰 팬 의류입니다.',
  ],
  'Phone Cases': [
    '웹툰 캐릭터 일러스트가 적용된 폰케이스입니다.',
    '튼튼한 보호 기능과 감각적인 디자인을 갖춘 케이스입니다.',
    '다양한 기종에 호환되는 캐릭터 케이스입니다.',
  ],
  Stickers: [
    '웹툰 장면과 캐릭터가 담긴 스티커 세트입니다.',
    '노트북, 태블릿 등에 붙이기 좋은 방수 스티커입니다.',
    '귀여운 캐릭터 다이컷 스티커 팩입니다.',
  ],
  Keychains: [
    '웹툰 캐릭터를 형상화한 키링입니다.',
    '고급 소재로 제작된 메탈 캐릭터 키링입니다.',
    '가방이나 열쇠에 달기 좋은 아크릴 키링입니다.',
  ],
  'Home Decor': [
    '인테리어에 어울리는 웹툰 캐릭터 홈 데코 아이템입니다.',
    '따뜻한 분위기를 만들어주는 캐릭터 소품입니다.',
    '웹툰 팬을 위한 감각적인 인테리어 아이템입니다.',
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

      products.push({
        id,
        name: `${artist} ${productType}`,
        description: `${artist} - ${description}`,
        price,
        imageUrl: getPlaceholderUrl('K-POP Goods', subCategory, kpopIndex),
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

      products.push({
        id,
        name: `${webtoon} ${productType}`,
        description: `${webtoon} - ${description}`,
        price,
        imageUrl: getPlaceholderUrl('K-WEBTOON Goods', subCategory, webtoonIndex),
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
