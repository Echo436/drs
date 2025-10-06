import { SymbolView } from 'expo-symbols';
import * as React from "react";
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function CloseButton() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.back()}
      style={{ width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }}
      accessibilityRole="button"
    >
      <SymbolView
        style={{ width: 24, height: 24 }}
        name="xmark"
      />
    </Pressable>
  );
}
