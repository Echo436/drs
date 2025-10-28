import { ThemedText } from '@/components/ThemedText'
import { ConstructorStanding, useF1Data } from '@/context/F1DataContext'
import React from 'react'
import {
  View,
  StyleSheet,
  RefreshControl,
  useColorScheme,
  TouchableOpacity,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { t } from '@/i18n/utils'
import renderSeparator from '@/components/ui/RenderSeparator'
import { layoutStyles } from '@/components/ui/Styles'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { getTeamsColor } from '@/constants/Colors'
import { Link } from 'expo-router'

export default function ConstructorList() {
  const theme = useColorScheme()

  const {
    constructorList,
    driverStandingList,
    constructorListLoading,
    fetchConstructorListData,
    selectedSeason,
  } = useF1Data()

  const onRefresh = React.useCallback(async () => {
    fetchConstructorListData(selectedSeason)
  }, [fetchConstructorListData, selectedSeason])

  const renderItem = ({ item }: { item: ConstructorStanding }) => {
    const driverList = driverStandingList.filter(
      (driver) =>
        driver.Constructors[driver.Constructors.length - 1].constructorId ===
        item.Constructor.constructorId,
    )
    const teamColor = getTeamsColor(item.Constructor.constructorId)
    return (
      <Link
        href={{
          pathname: '/constructors/team',
          params: {
            year: selectedSeason,
            initialData: JSON.stringify(item),
            driverList: JSON.stringify(driverList),
          },
        }}
        asChild
      >
        <TouchableOpacity style={styles.itemContainer}>
          <View style={styles.positionContainer}>
            <ThemedText style={styles.posisionText}>
              {String(item.position || '--').padStart(2, '0')}
            </ThemedText>
          </View>
          <View style={styles.teamInfoContainer}>
            <ThemedText type="itemtitle" style={{ color: teamColor }}>
              {t(item.Constructor.name, 'team')}
            </ThemedText>
            <View style={styles.driversContainer}>
              {driverList.map((driver) => (
                <ThemedText
                  key={driver.Driver.driverId}
                  type="itemsubtitle"
                  style={styles.driverNameText}
                >
                  {driver.Driver.code || driver.Driver.familyName}
                </ThemedText>
              ))}
            </View>
          </View>
          <View style={styles.pointsContainer}>
            <ThemedText style={styles.pointText}>
              {item.points || '-'}
            </ThemedText>
          </View>
          <View style={styles.chevronContainer}>
            <IconSymbol
              name="chevron.right"
              size={10}
              color={'gray'}
            ></IconSymbol>
          </View>
        </TouchableOpacity>
      </Link>
    )
  }

  // 渲染大奖赛列表
  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={constructorList}
      renderItem={renderItem}
      keyExtractor={(item) => item.Constructor.constructorId}
      ItemSeparatorComponent={renderSeparator}
      contentContainerStyle={layoutStyles.listContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={constructorListLoading}
          onRefresh={onRefresh}
        />
      }
      style={{ backgroundColor: theme === 'dark' ? 'black' : 'white' }}
    />
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingLeft: 13,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionContainer: {
    width: 30,
    marginRight: 15,
  },
  posisionText: {
    fontFamily: 'Formula1-Display-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  driversContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  driverNameText: {
    fontFamily: 'Formula1-Display-Regular',
  },
  teamInfoContainer: {
    flex: 1,
  },
  pointsContainer: {
    width: 50,
  },
  pointText: {
    fontFamily: 'Formula1-Display-Bold',
    fontSize: 14,
    textAlign: 'center',
  },
  chevronContainer: {
    marginRight: 3,
  },
})
