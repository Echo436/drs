/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */


const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

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
};

export function getTeamsColor(team: string): string {
  if (team in TeamColors) {
    return TeamColors[team as keyof typeof TeamColors];
  }
  // 返回一个默认颜色或抛出错误
  return ''; // 默认颜色
}

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
