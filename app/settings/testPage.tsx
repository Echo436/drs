import {
  Form,
  Host,
  HStack,
  Section,
  Spacer,
  Switch,
  Text,
} from '@expo/ui/swift-ui';
import { useState } from 'react';

export default function SettingsView() {
  const [isAirplaneMode, setIsAirplaneMode] = useState(true);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <HStack>
            <Text>123</Text>
            <Spacer />
            <Switch value={isAirplaneMode} onValueChange={setIsAirplaneMode} />
          </HStack>
        </Section>
      </Form>
    </Host>
  );
}
