export type CityId =
  | 'seoul'
  | 'suwon'
  | 'incheon'
  | 'daejeon'
  | 'daegu'
  | 'gwangju'
  | 'busan'
  | 'jeju';

export interface SubRegionOption {
  id: string;
  name: string;
  /** For Seoul, stores the parent 자치구 (e.g. 강남구) for easy filtering */
  gu?: string;
  lat: number;
  lon: number;
}

export interface CityOption {
  id: CityId;
  name: string;
  subUnitLabel: string;
  subRegions: SubRegionOption[];
}

export const CITIES: CityOption[] = [
  {
    id: 'seoul',
    name: '서울',
    subUnitLabel: '동 단위',
    subRegions: [
      // 종로구
      {id: 'seoul-cheongunhyoja', gu: '종로구', name: '청운효자동', lat: 37.5841, lon: 126.9706},
      {id: 'seoul-sajik', gu: '종로구', name: '사직동', lat: 37.5762, lon: 126.9688},
      {id: 'seoul-samcheong', gu: '종로구', name: '삼청동', lat: 37.5849, lon: 126.9818},
      {id: 'seoul-buam', gu: '종로구', name: '부암동', lat: 37.5924, lon: 126.9642},
      {id: 'seoul-jongno1234', gu: '종로구', name: '종로1·2·3·4가동', lat: 37.5704, lon: 126.9912},
      {id: 'seoul-hyehwa', gu: '종로구', name: '혜화동', lat: 37.5866, lon: 127.0017},
      // 중구
      {id: 'seoul-myeongdong', gu: '중구', name: '명동', lat: 37.5636, lon: 126.9834},
      {id: 'seoul-hoehyeon', gu: '중구', name: '회현동', lat: 37.5588, lon: 126.9784},
      {id: 'seoul-euljiro', gu: '중구', name: '을지로동', lat: 37.5665, lon: 126.9922},
      {id: 'seoul-sindang', gu: '중구', name: '신당동', lat: 37.5656, lon: 127.0195},
      {id: 'seoul-jangchung', gu: '중구', name: '장충동', lat: 37.5584, lon: 127.0057},
      // 용산구
      {id: 'seoul-itaewon1', gu: '용산구', name: '이태원1동', lat: 37.5345, lon: 126.9946},
      {id: 'seoul-hannam', gu: '용산구', name: '한남동', lat: 37.5352, lon: 127.0029},
      {id: 'seoul-ichon1', gu: '용산구', name: '이촌1동', lat: 37.5218, lon: 126.9746},
      {id: 'seoul-hangangno', gu: '용산구', name: '한강로동', lat: 37.5295, lon: 126.9682},
      {id: 'seoul-huam', gu: '용산구', name: '후암동', lat: 37.5494, lon: 126.9781},
      // 성동구
      {id: 'seoul-seongsu1', gu: '성동구', name: '성수1가1동', lat: 37.5416, lon: 127.0442},
      {id: 'seoul-seongsu2', gu: '성동구', name: '성수2가1동', lat: 37.5425, lon: 127.0566},
      {id: 'seoul-wangsimni', gu: '성동구', name: '왕십리도선동', lat: 37.5651, lon: 127.0297},
      {id: 'seoul-oksu', gu: '성동구', name: '옥수동', lat: 37.5419, lon: 127.0185},
      {id: 'seoul-geumho1', gu: '성동구', name: '금호1가동', lat: 37.5542, lon: 127.0226},
      // 광진구
      {id: 'seoul-jayang1', gu: '광진구', name: '자양1동', lat: 37.5344, lon: 127.0823},
      {id: 'seoul-hwayang', gu: '광진구', name: '화양동', lat: 37.5429, lon: 127.0714},
      {id: 'seoul-guui1', gu: '광진구', name: '구의1동', lat: 37.5425, lon: 127.0856},
      {id: 'seoul-gwangjang', gu: '광진구', name: '광장동', lat: 37.5484, lon: 127.1045},
      {id: 'seoul-gunja', gu: '광진구', name: '군자동', lat: 37.5562, lon: 127.0746},
      // 동대문구
      {id: 'seoul-hoegi', gu: '동대문구', name: '회기동', lat: 37.5908, lon: 127.0558},
      {id: 'seoul-cheongnyangni', gu: '동대문구', name: '청량리동', lat: 37.5806, lon: 127.0468},
      {id: 'seoul-jangan1', gu: '동대문구', name: '장안1동', lat: 37.5682, lon: 127.0715},
      {id: 'seoul-jegi', gu: '동대문구', name: '제기동', lat: 37.5784, lon: 127.0347},
      {id: 'seoul-dapsimni1', gu: '동대문구', name: '답십리1동', lat: 37.5699, lon: 127.0539},
      // 중랑구
      {id: 'seoul-sangbong1', gu: '중랑구', name: '상봉1동', lat: 37.5979, lon: 127.0888},
      {id: 'seoul-myeonmok', gu: '중랑구', name: '면목본동', lat: 37.5861, lon: 127.0875},
      {id: 'seoul-sinnae1', gu: '중랑구', name: '신내1동', lat: 37.6061, lon: 127.0991},
      {id: 'seoul-junghwa1', gu: '중랑구', name: '중화1동', lat: 37.6015, lon: 127.0793},
      // 성북구
      {id: 'seoul-seongbuk', gu: '성북구', name: '성북동', lat: 37.5931, lon: 126.9977},
      {id: 'seoul-anam', gu: '성북구', name: '안암동', lat: 37.5862, lon: 127.0258},
      {id: 'seoul-gireum1', gu: '성북구', name: '길음1동', lat: 37.6062, lon: 127.0229},
      {id: 'seoul-jeongneung1', gu: '성북구', name: '정릉1동', lat: 37.6041, lon: 127.0117},
      {id: 'seoul-wolgok1', gu: '성북구', name: '월곡1동', lat: 37.6054, lon: 127.0414},
      // 강북구
      {id: 'seoul-suyu1', gu: '강북구', name: '수유1동', lat: 37.6305, lon: 127.0173},
      {id: 'seoul-mia', gu: '강북구', name: '미아동', lat: 37.6248, lon: 127.0256},
      {id: 'seoul-ui', gu: '강북구', name: '우이동', lat: 37.6524, lon: 127.0119},
      {id: 'seoul-beon1', gu: '강북구', name: '번1동', lat: 37.6378, lon: 127.0297},
      // 도봉구
      {id: 'seoul-chang1', gu: '도봉구', name: '창1동', lat: 37.6484, lon: 127.0439},
      {id: 'seoul-ssangmun1', gu: '도봉구', name: '쌍문1동', lat: 37.6502, lon: 127.0289},
      {id: 'seoul-banghak1', gu: '도봉구', name: '방학1동', lat: 37.6652, lon: 127.0422},
      {id: 'seoul-dobong1', gu: '도봉구', name: '도봉1동', lat: 37.6795, lon: 127.0416},
      // 노원구
      {id: 'seoul-sanggye1', gu: '노원구', name: '상계1동', lat: 37.6789, lon: 127.0556},
      {id: 'seoul-junggye1', gu: '노원구', name: '중계1동', lat: 37.6525, lon: 127.0785},
      {id: 'seoul-hagye1', gu: '노원구', name: '하계1동', lat: 37.6395, lon: 127.0725},
      {id: 'seoul-gongneung1', gu: '노원구', name: '공릉1동', lat: 37.6246, lon: 127.0736},
      {id: 'seoul-wolgye1', gu: '노원구', name: '월계1동', lat: 37.6203, lon: 127.0616},
      // 은평구
      {id: 'seoul-bulgwang1', gu: '은평구', name: '불광1동', lat: 37.6146, lon: 126.9296},
      {id: 'seoul-yeonshinnae', gu: '은평구', name: '갈현1동', lat: 37.6231, lon: 126.9154},
      {id: 'seoul-eungam1', gu: '은평구', name: '응암1동', lat: 37.6001, lon: 126.9255},
      {id: 'seoul-jingwan', gu: '은평구', name: '진관동', lat: 37.6393, lon: 126.9203},
      // 서대문구
      {id: 'seoul-sinchon', gu: '서대문구', name: '신촌동', lat: 37.5598, lon: 126.9425},
      {id: 'seoul-yeonhui', gu: '서대문구', name: '연희동', lat: 37.5681, lon: 126.9317},
      {id: 'seoul-hongje1', gu: '서대문구', name: '홍제1동', lat: 37.5882, lon: 126.9481},
      {id: 'seoul-bukahyeon', gu: '서대문구', name: '북아현동', lat: 37.5613, lon: 126.9554},
      // 마포구
      {id: 'seoul-seogyo', gu: '마포구', name: '서교동', lat: 37.5546, lon: 126.9207},
      {id: 'seoul-yeonnam', gu: '마포구', name: '연남동', lat: 37.5624, lon: 126.9254},
      {id: 'seoul-hapjeong', gu: '마포구', name: '합정동', lat: 37.5495, lon: 126.9137},
      {id: 'seoul-gongdeok', gu: '마포구', name: '공덕동', lat: 37.5446, lon: 126.9517},
      {id: 'seoul-sangam', gu: '마포구', name: '상암동', lat: 37.5789, lon: 126.8902},
      // 양천구
      {id: 'seoul-mok1', gu: '양천구', name: '목1동', lat: 37.5299, lon: 126.8742},
      {id: 'seoul-mok5', gu: '양천구', name: '목5동', lat: 37.5356, lon: 126.8808},
      {id: 'seoul-sinjeong1', gu: '양천구', name: '신정1동', lat: 37.5194, lon: 126.8562},
      {id: 'seoul-sinwol1', gu: '양천구', name: '신월1동', lat: 37.5326, lon: 126.8291},
      // 강서구
      {id: 'seoul-gayang1', gu: '강서구', name: '가양1동', lat: 37.5656, lon: 126.8355},
      {id: 'seoul-hwagok1', gu: '강서구', name: '화곡1동', lat: 37.5322, lon: 126.8424},
      {id: 'seoul-balsan1', gu: '강서구', name: '발산1동', lat: 37.5529, lon: 126.8266},
      {id: 'seoul-deungchon1', gu: '강서구', name: '등촌1동', lat: 37.5524, lon: 126.8588},
      {id: 'seoul-banghwa1', gu: '강서구', name: '방화1동', lat: 37.5724, lon: 126.8143},
      // 구로구
      {id: 'seoul-sindorim', gu: '구로구', name: '신도림동', lat: 37.5099, lon: 126.8842},
      {id: 'seoul-guro1', gu: '구로구', name: '구로1동', lat: 37.4932, lon: 126.8732},
      {id: 'seoul-guro3', gu: '구로구', name: '구로3동', lat: 37.4847, lon: 126.8935},
      {id: 'seoul-gaebong1', gu: '구로구', name: '개봉1동', lat: 37.4998, lon: 126.8535},
      // 금천구
      {id: 'seoul-gasan', gu: '금천구', name: '가산동', lat: 37.4768, lon: 126.8835},
      {id: 'seoul-doksan1', gu: '금천구', name: '독산1동', lat: 37.4697, lon: 126.8943},
      {id: 'seoul-siheung1', gu: '금천구', name: '시흥1동', lat: 37.4525, lon: 126.9006},
      // 영등포구
      {id: 'seoul-yeouido', gu: '영등포구', name: '여의동', lat: 37.5262, lon: 126.9288},
      {id: 'seoul-dangsan1', gu: '영등포구', name: '당산1동', lat: 37.5261, lon: 126.8963},
      {id: 'seoul-yeongdeungpo', gu: '영등포구', name: '영등포동', lat: 37.5194, lon: 126.9073},
      {id: 'seoul-munrae', gu: '영등포구', name: '문래동', lat: 37.5174, lon: 126.8936},
      {id: 'seoul-singil1', gu: '영등포구', name: '신길1동', lat: 37.5123, lon: 126.9154},
      // 동작구
      {id: 'seoul-noryangjin1', gu: '동작구', name: '노량진1동', lat: 37.5126, lon: 126.9426},
      {id: 'seoul-sangdo1', gu: '동작구', name: '상도1동', lat: 37.5036, lon: 126.9522},
      {id: 'seoul-sadang1', gu: '동작구', name: '사당1동', lat: 37.4796, lon: 126.9794},
      {id: 'seoul-heukseok', gu: '동작구', name: '흑석동', lat: 37.5076, lon: 126.9617},
      // 관악구
      {id: 'seoul-bongcheon', gu: '관악구', name: '청룡동', lat: 37.4791, lon: 126.9416},
      {id: 'seoul-nakseongdae', gu: '관악구', name: '낙성대동', lat: 37.4763, lon: 126.9584},
      {id: 'seoul-sillim', gu: '관악구', name: '신림동', lat: 37.4847, lon: 126.9297},
      {id: 'seoul-daehak', gu: '관악구', name: '대학동', lat: 37.4706, lon: 126.9369},
      // 서초구
      {id: 'seoul-seocho1', gu: '서초구', name: '서초1동', lat: 37.4909, lon: 127.0196},
      {id: 'seoul-banpo1', gu: '서초구', name: '반포1동', lat: 37.5049, lon: 127.0138},
      {id: 'seoul-jamwon', gu: '서초구', name: '잠원동', lat: 37.5143, lon: 127.0127},
      {id: 'seoul-bangbae1', gu: '서초구', name: '방배1동', lat: 37.4829, lon: 126.9963},
      {id: 'seoul-yangjae1', gu: '서초구', name: '양재1동', lat: 37.4763, lon: 127.0282},
      // 강남구
      {id: 'seoul-yeoksam1', gu: '강남구', name: '역삼1동', lat: 37.4954, lon: 127.0332},
      {id: 'seoul-sinsa', gu: '강남구', name: '신사동', lat: 37.5236, lon: 127.0226},
      {id: 'seoul-apgujeong', gu: '강남구', name: '압구정동', lat: 37.5299, lon: 127.0309},
      {id: 'seoul-cheongdam', gu: '강남구', name: '청담동', lat: 37.5245, lon: 127.0493},
      {id: 'seoul-samseong1', gu: '강남구', name: '삼성1동', lat: 37.5145, lon: 127.0626},
      {id: 'seoul-daechi1', gu: '강남구', name: '대치1동', lat: 37.4933, lon: 127.0568},
      {id: 'seoul-dogok1', gu: '강남구', name: '도곡1동', lat: 37.4883, lon: 127.0389},
      {id: 'seoul-gaepo1', gu: '강남구', name: '개포1동', lat: 37.4819, lon: 127.0573},
      // 송파구
      {id: 'seoul-jamsil2', gu: '송파구', name: '잠실2동', lat: 37.5131, lon: 127.0867},
      {id: 'seoul-jamsil6', gu: '송파구', name: '잠실6동', lat: 37.5193, lon: 127.1011},
      {id: 'seoul-seokchon', gu: '송파구', name: '석촌동', lat: 37.5036, lon: 127.1032},
      {id: 'seoul-songpa1', gu: '송파구', name: '송파1동', lat: 37.5078, lon: 127.1088},
      {id: 'seoul-garak1', gu: '송파구', name: '가락1동', lat: 37.4946, lon: 127.1146},
      {id: 'seoul-munjeong1', gu: '송파구', name: '문정1동', lat: 37.4878, lon: 127.1257},
      {id: 'seoul-wirye', gu: '송파구', name: '위례동', lat: 37.4792, lon: 127.1419},
      // 강동구
      {id: 'seoul-cheonho1', gu: '강동구', name: '천호1동', lat: 37.5453, lon: 127.1369},
      {id: 'seoul-amsa1', gu: '강동구', name: '암사1동', lat: 37.5521, lon: 127.1319},
      {id: 'seoul-seongnae1', gu: '강동구', name: '성내1동', lat: 37.5284, lon: 127.1225},
      {id: 'seoul-gildong', gu: '강동구', name: '길동', lat: 37.5401, lon: 127.1458},
      {id: 'seoul-myeongil1', gu: '강동구', name: '명일1동', lat: 37.5515, lon: 127.1463},
      {id: 'seoul-godeok1', gu: '강동구', name: '고덕1동', lat: 37.5582, lon: 127.1526},
    ],
  },
  {
    id: 'suwon',
    name: '수원',
    subUnitLabel: '구 단위',
    subRegions: [
      {id: 'suwon-jangan', name: '장안구', lat: 37.3039, lon: 127.0103},
      {id: 'suwon-gwonseon', name: '권선구', lat: 37.2576, lon: 126.9718},
      {id: 'suwon-paldal', name: '팔달구', lat: 37.2826, lon: 127.0199},
      {id: 'suwon-yeongtong', name: '영통구', lat: 37.2596, lon: 127.0465},
    ],
  },
  {
    id: 'incheon',
    name: '인천',
    subUnitLabel: '군·구 단위',
    subRegions: [
      {id: 'incheon-jung', name: '중구', lat: 37.4737, lon: 126.6217},
      {id: 'incheon-dong', name: '동구', lat: 37.4739, lon: 126.6432},
      {id: 'incheon-michuhol', name: '미추홀구', lat: 37.4636, lon: 126.6503},
      {id: 'incheon-yeonsu', name: '연수구', lat: 37.4102, lon: 126.6783},
      {id: 'incheon-namdong', name: '남동구', lat: 37.4472, lon: 126.7316},
      {id: 'incheon-bupyeong', name: '부평구', lat: 37.5074, lon: 126.7218},
      {id: 'incheon-gyeyang', name: '계양구', lat: 37.5374, lon: 126.7377},
      {id: 'incheon-seo', name: '서구', lat: 37.5454, lon: 126.676},
      {id: 'incheon-ganghwa', name: '강화군', lat: 37.7465, lon: 126.4881},
      {id: 'incheon-ongjin', name: '옹진군', lat: 37.4465, lon: 126.6368},
    ],
  },
  {
    id: 'daejeon',
    name: '대전',
    subUnitLabel: '구 단위',
    subRegions: [
      {id: 'daejeon-dong', name: '동구', lat: 36.312, lon: 127.4548},
      {id: 'daejeon-jung', name: '중구', lat: 36.3258, lon: 127.4214},
      {id: 'daejeon-seo', name: '서구', lat: 36.3554, lon: 127.3836},
      {id: 'daejeon-yuseong', name: '유성구', lat: 36.3622, lon: 127.3561},
      {id: 'daejeon-daedeok', name: '대덕구', lat: 36.3466, lon: 127.4157},
    ],
  },
  {
    id: 'daegu',
    name: '대구',
    subUnitLabel: '군·구 단위',
    subRegions: [
      {id: 'daegu-jung', name: '중구', lat: 35.8693, lon: 128.6062},
      {id: 'daegu-dong', name: '동구', lat: 35.8866, lon: 128.6355},
      {id: 'daegu-seo', name: '서구', lat: 35.8719, lon: 128.5591},
      {id: 'daegu-nam', name: '남구', lat: 35.8461, lon: 128.5976},
      {id: 'daegu-buk', name: '북구', lat: 35.8858, lon: 128.5829},
      {id: 'daegu-suseong', name: '수성구', lat: 35.8582, lon: 128.6305},
      {id: 'daegu-dalseo', name: '달서구', lat: 35.8299, lon: 128.5327},
      {id: 'daegu-dalseong', name: '달성군', lat: 35.7746, lon: 128.4314},
      {id: 'daegu-gunwi', name: '군위군', lat: 36.2429, lon: 128.5728},
    ],
  },
  {
    id: 'gwangju',
    name: '광주',
    subUnitLabel: '구 단위',
    subRegions: [
      {id: 'gwangju-dong', name: '동구', lat: 35.1461, lon: 126.9231},
      {id: 'gwangju-seo', name: '서구', lat: 35.1519, lon: 126.8902},
      {id: 'gwangju-nam', name: '남구', lat: 35.1328, lon: 126.9024},
      {id: 'gwangju-buk', name: '북구', lat: 35.1742, lon: 126.912},
      {id: 'gwangju-gwangsan', name: '광산구', lat: 35.1396, lon: 126.7936},
    ],
  },
  {
    id: 'busan',
    name: '부산',
    subUnitLabel: '군·구 단위',
    subRegions: [
      {id: 'busan-jung', name: '중구', lat: 35.1066, lon: 129.0323},
      {id: 'busan-seo', name: '서구', lat: 35.0979, lon: 129.0243},
      {id: 'busan-dong', name: '동구', lat: 35.1293, lon: 129.0454},
      {id: 'busan-yeongdo', name: '영도구', lat: 35.0912, lon: 129.0679},
      {id: 'busan-busanjin', name: '부산진구', lat: 35.1631, lon: 129.0531},
      {id: 'busan-dongnae', name: '동래구', lat: 35.2048, lon: 129.0837},
      {id: 'busan-nam', name: '남구', lat: 35.1366, lon: 129.0844},
      {id: 'busan-buk', name: '북구', lat: 35.1972, lon: 128.9903},
      {id: 'busan-haeundae', name: '해운대구', lat: 35.1631, lon: 129.1636},
      {id: 'busan-saha', name: '사하구', lat: 35.1046, lon: 128.9747},
      {id: 'busan-geumjeong', name: '금정구', lat: 35.243, lon: 129.0921},
      {id: 'busan-gangseo', name: '강서구', lat: 35.2122, lon: 128.9806},
      {id: 'busan-yeonje', name: '연제구', lat: 35.1763, lon: 129.0797},
      {id: 'busan-suyeong', name: '수영구', lat: 35.1456, lon: 129.1131},
      {id: 'busan-sasang', name: '사상구', lat: 35.1526, lon: 128.9912},
      {id: 'busan-gijang', name: '기장군', lat: 35.2446, lon: 129.2223},
    ],
  },
  {
    id: 'jeju',
    name: '제주',
    subUnitLabel: '지역 단위',
    subRegions: [
      {id: 'jeju-city', name: '제주시', lat: 33.4996, lon: 126.5312},
      {id: 'jeju-aewol', name: '제주시 서부 (애월·한림)', lat: 33.4622, lon: 126.3292},
      {id: 'jeju-jocheon', name: '제주시 동부 (조천·구좌)', lat: 33.5348, lon: 126.6431},
      {id: 'jeju-seogwipo', name: '서귀포시', lat: 33.2541, lon: 126.5601},
      {id: 'jeju-seongsan', name: '서귀포시 동부 (성산·표선)', lat: 33.4417, lon: 126.9112},
      {id: 'jeju-daejeong', name: '서귀포시 서부 (중문·대정)', lat: 33.2269, lon: 126.2512},
    ],
  },
];

export const SEOUL_POPULAR_DONG_IDS = [
  'seoul-myeongdong',
  'seoul-yeoksam1',
  'seoul-seogyo',
  'seoul-yeouido',
  'seoul-jamsil2',
  'seoul-seongsu1',
  'seoul-itaewon1',
  'seoul-banpo1',
  'seoul-hyehwa',
  'seoul-sanggye1',
  'seoul-mok1',
  'seoul-cheonho1',
];

export const SEOUL_GU_LIST = Array.from(
  new Set(CITIES[0].subRegions.map((region) => region.gu).filter((gu): gu is string => Boolean(gu))),
);
