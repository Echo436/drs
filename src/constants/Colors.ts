/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4'
const tintColorDark = '#fff'

export const TeamColors = {
  mercedes: '#22D6B8',
  ferrari: '#E80020',
  red_bull: '#3671C6',
  alpine: '#0093CC',
  mclaren: '#FF8000',
  aston_martin: '#229971',
  sauber: '#52E252',
  haas: '#9FA3A5',
  williams: '#64C4FF',
  rb: '#6692FF',
  alphatauri: '#20394C',
  alfa: '#1A2643',
  renault: '#000000',
  toro_rosso: '#00144A',
  racing_point: '#005CAA',
  force_india: '#F27836',
  manor: '#006DC1',
  marussia: '#013E81',
  lotus_f1: '#86995B',
  lotus_racing: '#86995B',
  caterham: '#005030',
  hrt: '#A6904F',
  toyota: '#EB0A1E',
  bmw_sauber: '#638CB3',
  brawn: '#FFF500',
  honda: '#FF0000',
  super_aguri: '#E20010',
  spyker: '#F88017',
  spyker_mf1: '#F88017',
  mf1: '#FF0000',
  bar: '#001C66',
  jordan: '#ebeb00ff',
  jaguar: '#040404',
  arrows: '#db261e',
  prost: '#26478b',
}

/**
 *
 * @param teamId
 * @returns 对应 Color
 */
export function getTeamsColor(teamId: string): string {
  if (teamId in TeamColors) {
    return TeamColors[teamId as keyof typeof TeamColors]
  }
  return ''
}

export const Colors = {
  light: {
    text: '#000000',
    gray: '#85858a',
    background: '#f2f2f8',
    itemBackground: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#9b9b9b',
    tabIconSelected: tintColorLight,
    tabSwitcherBackground: 'rgba(183, 183, 183, 0.3)',
    headerBorder: 'rgb(232, 232, 232)',
    listSeparator: 'rgba(210, 210, 210, 0.5)',
    cardBorder: 'rgba(139, 139, 139, 0.25)',
  },
  dark: {
    text: '#ffffffff',
    gray: '#8d8d93',
    background: '#000000',
    itemBackground: '#1c1c1e',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#5f5f5f',
    tabIconSelected: tintColorDark,
    tabSwitcherBackground: 'rgba(80, 80, 80, 0.3)',
    headerBorder: 'rgb(36, 36, 36)',
    listSeparator: 'rgba(67, 67, 67, 0.5)',
    cardBorder: 'rgba(24, 24, 24, 0.34)',
  },
}
