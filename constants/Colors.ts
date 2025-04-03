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

/**
 * 
 * @param teamId 
 * @returns 对应 Color
 */
export function getTeamsColor(teamId: string): string {
  if (teamId in TeamColors) {
    return TeamColors[teamId as keyof typeof TeamColors];
  }
  return '';
}

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    tabSwitcherBackground: 'rgb(239, 239, 239)',
    headerBorder: 'rgba(180, 180, 180, 0.34)',
    listSeparator: 'rgba(210, 210, 210, 0.5)',
    cardBorder: 'rgba(139, 139, 139, 0.25)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#000000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    tabSwitcherBackground: 'rgb(41, 41, 41)',
    headerBorder: 'rgba(88, 88, 88, 0.34)',
    listSeparator: 'rgba(67, 67, 67, 0.5)',
    cardBorder: 'rgba(24, 24, 24, 0.34)',
  },
};
