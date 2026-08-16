import { PersonIcon, BuildingIcon } from '../components/icons/templates.jsx'
import {
  HeadIcon, FootIcon, FaceIcon, HeadacheIcon, SickIcon,
  DogIcon, FishIcon,
  TaxiIcon, BusIcon, TrainIcon,
  ParkIcon, UmbrellaIcon, RainIcon, SnowIcon, LeafIcon, WaveIcon,
  CoffeeIcon, TeaIcon, BreadIcon, WaterIcon, CandyIcon, SaltIcon,
  CupIcon, PlateIcon, SpoonIcon,
  HatIcon, ShirtIcon, CoatIcon, PantsIcon, SkirtIcon,
  BookIcon, NotebookIcon, PencilIcon, PenIcon, LongThinBundleIcon,
  MoneyIcon, CameraIcon, TvIcon, ChairIcon, TableIcon,
  ToiletIcon, RoadIcon, IntersectionIcon, WindowIcon, ElevatorIcon, StairsIcon, EntranceIcon,
  GuitarIcon, MovieIcon, SongIcon, PictureIcon, CakeIcon, PartyIcon, PondIcon,
  RiceBowlIcon, MealIcon, BentoIcon, RamenIcon, SakeIcon,
  DoorIcon, HeaterIcon, CalendarIcon, WalletIcon, RadioIcon, ShoppingBagIcon, DumbbellIcon,
  ButtonIcon, SweaterIcon, HandkerchiefIcon, NecktieIcon,
} from '../components/icons/simpleIcons.jsx'

// 단어(word|category)별 연상 이미지 아이콘 매핑. 아직 전체 315개가 아니라
// 구체적으로 그림이 잘 그려지는 단어 위주 1차분(가족/신체/건물/음식/의류/학용품 등)만 채워져 있다.
// 추상적인 단어(동사/조사/부사/시간표현 등)는 의도적으로 비워둠 — WordIcon이 알아서 렌더링을 생략한다.
export const WORD_ICON_MAP = {
  // 가족 — PersonIcon 템플릿에 헤어스타일/색만 바꿔서 10명 표현
  '兄|가족': { Icon: PersonIcon, props: { hair: 'short', bodyColor: 'var(--sky)' } },
  '姉|가족': { Icon: PersonIcon, props: { hair: 'long', bodyColor: 'var(--coral)' } },
  '妹|가족': { Icon: PersonIcon, props: { hair: 'twintail', bodyColor: 'var(--butter)', small: true } },
  'お父さん|가족': { Icon: PersonIcon, props: { hair: 'mustache', bodyColor: 'var(--accent-strong)' } },
  'お母さん|가족': { Icon: PersonIcon, props: { hair: 'bun', bodyColor: 'var(--coral-strong)' } },
  'お兄さん|가족': { Icon: PersonIcon, props: { hair: 'short', bodyColor: 'var(--accent)' } },
  'お姉さん|가족': { Icon: PersonIcon, props: { hair: 'long', bodyColor: 'var(--butter)' } },
  'おじいさん|가족': { Icon: PersonIcon, props: { hair: 'bald', bodyColor: 'var(--sky-strong)', glasses: true } },
  'おばあさん|가족': { Icon: PersonIcon, props: { hair: 'gray', bodyColor: 'var(--coral-bg)', glasses: true } },
  '奥さん|가족': { Icon: PersonIcon, props: { hair: 'bun', bodyColor: 'var(--accent-bg)' } },

  // 건물 — BuildingIcon 템플릿에 지붕 모양/창문 배치만 바꿔서 표현
  'ホテル|명사': { Icon: BuildingIcon, props: { roof: 'flag', rows: 2, cols: 3, wallColor: 'var(--sky-bg)', accent: 'var(--sky-strong)' } },
  'アパート|명사': { Icon: BuildingIcon, props: { roof: 'flat', rows: 4, cols: 2, wallColor: 'var(--accent-bg)', accent: 'var(--accent)' } },
  'ビル|명사': { Icon: BuildingIcon, props: { roof: 'flat', rows: 5, cols: 2, wallColor: 'var(--surface-2)', accent: 'var(--text-muted)' } },
  'デパート|명사': { Icon: BuildingIcon, props: { roof: 'flat', rows: 3, cols: 4, wallColor: 'var(--butter-bg)', accent: 'var(--butter-strong)' } },
  '家|명사': { Icon: BuildingIcon, props: { roof: 'peak', rows: 1, cols: 1, wallColor: 'var(--coral-bg)', accent: 'var(--coral-strong)' } },
  '店|명사': { Icon: BuildingIcon, props: { roof: 'awning', wallColor: 'var(--butter-bg)', accent: 'var(--butter-strong)' } },

  // 신체
  '頭|명사': { Icon: HeadIcon },
  '足|명사': { Icon: FootIcon },
  '顔|명사': { Icon: FaceIcon },
  '頭痛|명사': { Icon: HeadacheIcon },
  '病気|명사': { Icon: SickIcon },

  // 동물
  '犬|명사': { Icon: DogIcon },
  '魚|명사': { Icon: FishIcon },

  // 탈것
  'タクシー|명사': { Icon: TaxiIcon },
  'バス|명사': { Icon: BusIcon },
  '駅|명사': { Icon: TrainIcon },

  // 자연/날씨
  '公園|명사': { Icon: ParkIcon },
  '傘|명사': { Icon: UmbrellaIcon },
  '雨|명사': { Icon: RainIcon },
  '冬|명사': { Icon: SnowIcon },
  '秋|명사': { Icon: LeafIcon },
  '海|명사': { Icon: WaveIcon },

  // 음식/음료
  'コーヒー|명사': { Icon: CoffeeIcon },
  'お茶|명사': { Icon: TeaIcon },
  'パン|명사': { Icon: BreadIcon },
  '水|명사': { Icon: WaterIcon },
  'お菓子|명사': { Icon: CandyIcon },
  '塩|명사': { Icon: SaltIcon },

  // 식기
  'コップ|명사': { Icon: CupIcon },
  'お皿|명사': { Icon: PlateIcon },
  'スプーン|명사': { Icon: SpoonIcon },

  // 옷
  '帽子|명사': { Icon: HatIcon },
  'シャツ|명사': { Icon: ShirtIcon },
  'コート|명사': { Icon: CoatIcon },
  'ズボン|명사': { Icon: PantsIcon },
  'スカート|명사': { Icon: SkirtIcon },

  // 학용품
  '本|명사': { Icon: BookIcon },
  '本|조수사': { Icon: LongThinBundleIcon },
  'ノート|명사': { Icon: NotebookIcon },
  '鉛筆|명사': { Icon: PencilIcon },
  'ペン|명사': { Icon: PenIcon },

  // 기타
  'お金|명사': { Icon: MoneyIcon },
  'カメラ|명사': { Icon: CameraIcon },
  'テレビ|명사': { Icon: TvIcon },
  'いす|명사': { Icon: ChairIcon },
  'テーブル|명사': { Icon: TableIcon },

  // 사람 — PersonIcon 템플릿 재사용
  '学生|명사': { Icon: PersonIcon, props: { hair: 'short', bodyColor: 'var(--sky)', small: true } },
  '男の人|명사': { Icon: PersonIcon, props: { hair: 'short', bodyColor: 'var(--accent)' } },
  '女の人|명사': { Icon: PersonIcon, props: { hair: 'long', bodyColor: 'var(--coral)' } },
  '大人|명사': { Icon: PersonIcon, props: { hair: 'short', bodyColor: 'var(--text-muted)', glasses: true } },
  '男の子|명사': { Icon: PersonIcon, props: { hair: 'short', bodyColor: 'var(--sky-strong)', small: true } },
  '女の子|명사': { Icon: PersonIcon, props: { hair: 'twintail', bodyColor: 'var(--coral)', small: true } },
  '子ども|명사': { Icon: PersonIcon, props: { hair: 'short', bodyColor: 'var(--butter)', small: true } },
  'お客さん|명사': { Icon: PersonIcon, props: { hair: 'bun', bodyColor: 'var(--butter-strong)' } },
  '会社員|명사': { Icon: PersonIcon, props: { hair: 'short', bodyColor: 'var(--sky-strong)', glasses: true } },
  '外国人|명사': { Icon: PersonIcon, props: { hair: 'long', bodyColor: 'var(--accent-bg)', glasses: true } },
  '警官|명사': { Icon: PersonIcon, props: { hair: 'short', bodyColor: 'var(--text)' } },
  '医者|명사': { Icon: PersonIcon, props: { hair: 'bun', bodyColor: 'var(--sky-bg)', glasses: true } },

  // 건물 — BuildingIcon 템플릿 재사용
  '町|명사': { Icon: BuildingIcon, props: { roof: 'peak', rows: 1, cols: 2, wallColor: 'var(--butter-bg)', accent: 'var(--butter-strong)' } },
  '会社|명사': { Icon: BuildingIcon, props: { roof: 'flat', rows: 4, cols: 3, wallColor: 'var(--surface-2)', accent: 'var(--text-muted)' } },
  'レストラン|명사': { Icon: BuildingIcon, props: { roof: 'awning', wallColor: 'var(--coral-bg)', accent: 'var(--coral-strong)' } },

  // 장소/시설
  'トイレ|명사': { Icon: ToiletIcon },
  '道|명사': { Icon: RoadIcon },
  '交差点|명사': { Icon: IntersectionIcon },
  '窓|명사': { Icon: WindowIcon },
  'エレベーター|명사': { Icon: ElevatorIcon },
  '階段|명사': { Icon: StairsIcon },
  '入り口|명사': { Icon: EntranceIcon },

  // 취미/오락
  'ギター|명사': { Icon: GuitarIcon },
  '映画|명사': { Icon: MovieIcon },
  '歌|명사': { Icon: SongIcon },
  '絵|명사': { Icon: PictureIcon },
  'お誕生日|명사': { Icon: CakeIcon },
  'パーティー|명사': { Icon: PartyIcon },
  '池|명사': { Icon: PondIcon },

  // 음식(추가)
  'お茶わん|명사': { Icon: RiceBowlIcon },
  'カップ|명사': { Icon: CupIcon },
  '紅茶|명사': { Icon: TeaIcon },
  '昼ご飯|명사': { Icon: MealIcon, props: { accent: 'var(--butter-strong)', accentBg: 'var(--butter-bg)' } },
  '朝ご飯|명사': { Icon: MealIcon, props: { accent: 'var(--coral-strong)', accentBg: 'var(--coral-bg)' } },
  'お弁当|명사': { Icon: BentoIcon },
  'ラーメン|명사': { Icon: RamenIcon },
  'お酒|명사': { Icon: SakeIcon },

  // 생활용품
  'ドア|명사': { Icon: DoorIcon },
  'ストーブ|명사': { Icon: HeaterIcon },
  'カレンダー|명사': { Icon: CalendarIcon },
  '財布|명사': { Icon: WalletIcon },
  'ラジオ|명사': { Icon: RadioIcon },
  '買い物|명사': { Icon: ShoppingBagIcon },
  '運動|명사': { Icon: DumbbellIcon },
  '辞書|명사': { Icon: BookIcon },
  'ホールペン|명사': { Icon: PenIcon },

  // 옷(추가)
  '服|명사': { Icon: ShirtIcon },
  'セーター|명사': { Icon: SweaterIcon },
  'ボタン|명사': { Icon: ButtonIcon },
  'ハンカチ|명사': { Icon: HandkerchiefIcon },
  'ネクタイ|명사': { Icon: NecktieIcon },
}

export function getWordIconEntry(word) {
  return WORD_ICON_MAP[`${word.word}|${word.category}`] ?? null
}
