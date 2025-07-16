import { Button, View, ScrollView } from "react-native";
import { layoutStyles } from "@/components/ui/Styles";
import { ThemedText } from "@/components/ThemedText";

import { useAppSelector, useAppDispatch } from '@/hooks/useReduxHooks';
import { setPrimaryColor } from '@/storage/themeSlice';
import { getLoadedFonts } from "expo-font";

import { getTeamsColor } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";

export default function Settings() {
  const primaryColor = useAppSelector(state => state.theme.primaryColor);
  const dispatch = useAppDispatch();
  return (
    <ThemedView style={[layoutStyles.centerContainer, {justifyContent: 'center'}]}>
      <ThemedText>点击切换主题颜色</ThemedText>
      <Button title="法拉利" onPress={() => {
        dispatch(setPrimaryColor(getTeamsColor('ferrari')));
      }} />
      <Button title="迈凯轮" onPress={() => {
        dispatch(setPrimaryColor(getTeamsColor('mclaren')));
      }} />
      <Button title="红牛" onPress={() => {
        dispatch(setPrimaryColor(getTeamsColor('red_bull')));
      }} />
      <Button title="梅赛德斯" onPress={() => {
        dispatch(setPrimaryColor(getTeamsColor('mercedes')));
      }} />
    </ThemedView>
  );
}