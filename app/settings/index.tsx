// import { CircularProgress, Host } from '@expo/ui/swift-ui';
// import { View, Text } from 'react-native';

// export default function LoadingView() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Host matchContents>
//         <CircularProgress />
//       </Host>
//       <Text>Loading...</Text>
//     </View>
//   );
// }

import {
  Button,
  Form,
  Host,
  HStack,
  Image,
  Section,
  Spacer,
  Switch,
  Text,
} from '@expo/ui/swift-ui';
import { background, clipShape, frame } from '@expo/ui/swift-ui/modifiers';
import { Link } from 'expo-router';
import { useState } from 'react';

export default function SettingsView() {
  const [isAirplaneMode, setIsAirplaneMode] = useState(true);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <HStack spacing={8}>
            <Image
              systemName="airplane"
              color="white"
              size={18}
              modifiers={[
                frame({ width: 28, height: 28 }),
                background('#ffa500'),
                clipShape('roundedRectangle'),
              ]}
            />
            <Text>测试</Text>
            <Spacer />
            <Switch value={isAirplaneMode} onValueChange={setIsAirplaneMode} />
          </HStack>

          <Link href="/settings/testPage" asChild>
            <Button>
              <HStack spacing={8}>
                <Image
                  systemName="wifi"
                  color="white"
                  size={18}
                  modifiers={[
                    frame({ width: 28, height: 28 }),
                    background('#007aff'),
                    clipShape('roundedRectangle'),
                  ]}
                />
                <Text color="primary">这是一个测试按钮</Text>
                <Spacer />
                <Image systemName="chevron.right" size={14} color="secondary" />
              </HStack>
            </Button>
          </Link>
        </Section>
      </Form>
    </Host>
  );
}
