import {
  Music, Headphones, Mic, Guitar, Piano, LayoutGrid,
  Zap, Flame, Moon, Sparkles, Target, BarChart,
  Home, User, AlertTriangle, Heart, Volume2,
  Settings, Award, TrendingUp, Building2, MessageCircle,
  Radio, Disc, Sliders, Waves, Speaker, PlayCircle
} from 'lucide-react'

export const iconMap = {
  // Music & Audio
  music: Music,
  headphones: Headphones,
  mic: Mic,
  guitar: Guitar,
  piano: Piano,
  speaker: Speaker,
  disc: Disc,
  radio: Radio,
  volume: Volume2,

  // Genres & Styles
  house: Home,
  hiphop: Mic,
  lofi: Moon,
  edm: Zap,
  techno: Flame,

  // DJ Actions & Controls
  sparkles: Sparkles,
  target: Target,
  chart: BarChart,
  flame: Flame,
  heart: Heart,
  alert: AlertTriangle,
  play: PlayCircle,

  // Lessons & Learning
  controls: Settings,
  structure: Building2,
  advanced: Award,
  trending: TrendingUp,
  sliders: Sliders,
  waves: Waves,

  // Social
  comment: MessageCircle,
  profile: User,
  grid: LayoutGrid
}

export type IconName = keyof typeof iconMap
