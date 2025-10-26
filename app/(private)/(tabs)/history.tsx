import Box from '@/src/components/ui/Box';
import Container from '@/src/components/ui/Container';
import ReportHistoryList from '@/src/components/ui/history/ReportHistoryList';
import RideHistoryList from '@/src/components/ui/history/RideHistoryList';
import HomeHeader from '@/src/components/ui/home/HomeHeader';
import Text from '@/src/components/ui/Text';
import { Theme } from '@/src/theme/theme';
import { useTheme } from '@shopify/restyle';
import { CircleAlert, HistoryIcon, LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

export type TabOption = {
  key: 'Ride' | 'Report';
  label: string;
  icon: LucideIcon;
  content: React.ReactNode;
};

export default function History() {
  const theme = useTheme<Theme>();
  const { secondaryLight, muted, mainBackground } = theme.colors;
  const [activeTab, setActiveTab] = useState<'Ride' | 'Report'>('Ride');

  const tabs: TabOption[] = [
    {
      key: 'Ride',
      label: 'Ride History',
      icon: HistoryIcon,
      content: <RideHistoryList />,
    },
    {
      key: 'Report',
      label: 'Report History',
      icon: CircleAlert,
      content: <ReportHistoryList />,
    },
  ];

  return (
    <Container style={styles.container}>
      <HomeHeader title="Ride History" description="Search Your Rides & Report History" />
      <Box flex={1} width="100%" paddingHorizontal="l" gap="l" style={{ marginTop: 220 }}>
        <Box
          flexDirection="row"
          borderRadius="xl"
          borderWidth={1}
          borderColor="muted"
          backgroundColor="mainBackground">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tab,
                  { backgroundColor: isActive ? secondaryLight : mainBackground },
                ]}>
                <Box flexDirection="row" alignItems="center" justifyContent="center" gap="s">
                  <Icon size={16} color={isActive ? 'white' : muted} />
                  <Text
                    color={isActive ? 'white' : 'muted'}
                    fontWeight={isActive ? '600' : '300'}
                    textAlign="center">
                    {tab.label}
                  </Text>
                </Box>
              </Pressable>
            );
          })}
        </Box>
        {tabs.find((tab) => tab.key === activeTab)!.content}
      </Box>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
  },
});
