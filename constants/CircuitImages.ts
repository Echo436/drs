import { ImageSourcePropType } from 'react-native'

// Mapping from circuitId to the required image source.
// NOTE: Add all circuit IDs and their corresponding image paths here.
const circuitImageMap: { [key: string]: ImageSourcePropType } = {
  albert_park: require('@/assets/images/circuit-simple/albert_park.png'),
  americas: require('@/assets/images/circuit-simple/americas.png'),
  bahrain: require('@/assets/images/circuit-simple/bahrain.png'),
  baku: require('@/assets/images/circuit-simple/baku.png'),
  catalunya: require('@/assets/images/circuit-simple/catalunya.png'),
  hungaroring: require('@/assets/images/circuit-simple/hungaroring.png'),
  imola: require('@/assets/images/circuit-simple/imola.png'),
  interlagos: require('@/assets/images/circuit-simple/interlagos.png'),
  jeddah: require('@/assets/images/circuit-simple/jeddah.png'),
  losail: require('@/assets/images/circuit-simple/losail.png'),
  marina_bay: require('@/assets/images/circuit-simple/marina_bay.png'),
  miami: require('@/assets/images/circuit-simple/miami.png'),
  monaco: require('@/assets/images/circuit-simple/monaco.png'),
  monza: require('@/assets/images/circuit-simple/monza.png'),
  red_bull_ring: require('@/assets/images/circuit-simple/red_bull_ring.png'),
  rodriguez: require('@/assets/images/circuit-simple/rodriguez.png'),
  shanghai: require('@/assets/images/circuit-simple/shanghai.png'),
  silverstone: require('@/assets/images/circuit-simple/silverstone.png'),
  spa: require('@/assets/images/circuit-simple/spa.png'),
  suzuka: require('@/assets/images/circuit-simple/suzuka.png'),
  vegas: require('@/assets/images/circuit-simple/vegas.png'),
  villeneuve: require('@/assets/images/circuit-simple/villeneuve.png'),
  yas_marina: require('@/assets/images/circuit-simple/yas_marina.png'),
  zandvoort: require('@/assets/images/circuit-simple/zandvoort.png'),
}

const circuitDetailMap: { [key: string]: ImageSourcePropType } = {
  albert_park: require('@/assets/images/circuit-detail/albert_park.png'),
  americas: require('@/assets/images/circuit-detail/americas.png'),
  bahrain: require('@/assets/images/circuit-detail/bahrain.png'),
  baku: require('@/assets/images/circuit-detail/baku.png'),
  catalunya: require('@/assets/images/circuit-detail/catalunya.png'),
  hungaroring: require('@/assets/images/circuit-detail/hungaroring.png'),
  imola: require('@/assets/images/circuit-detail/imola.png'),
  interlagos: require('@/assets/images/circuit-detail/interlagos.png'),
  jeddah: require('@/assets/images/circuit-detail/jeddah.png'),
  losail: require('@/assets/images/circuit-detail/losail.png'),
  marina_bay: require('@/assets/images/circuit-detail/marina_bay.png'),
  miami: require('@/assets/images/circuit-detail/miami.png'),
  monaco: require('@/assets/images/circuit-detail/monaco.png'),
  monza: require('@/assets/images/circuit-detail/monza.png'),
  red_bull_ring: require('@/assets/images/circuit-detail/red_bull_ring.png'),
  rodriguez: require('@/assets/images/circuit-detail/rodriguez.png'),
  shanghai: require('@/assets/images/circuit-detail/shanghai.png'),
  silverstone: require('@/assets/images/circuit-detail/silverstone.png'),
  spa: require('@/assets/images/circuit-detail/spa.png'),
  suzuka: require('@/assets/images/circuit-detail/suzuka.png'),
  vegas: require('@/assets/images/circuit-detail/vegas.png'),
  villeneuve: require('@/assets/images/circuit-detail/villeneuve.png'),
  yas_marina: require('@/assets/images/circuit-detail/yas_marina.png'),
  zandvoort: require('@/assets/images/circuit-detail/zandvoort.png'),
}

// Function to get the image source for a given circuitId.
// Returns undefined if the circuitId is not found.
export const getCircuitImage = (
  circuitId: string | undefined,
): ImageSourcePropType | undefined => {
  if (circuitId && circuitImageMap[circuitId]) {
    return circuitImageMap[circuitId]
  }
  // Return undefined if the circuitId is not found
  return undefined
}

export const getCircuitDetailImage = (
  circuitId: string | undefined,
): ImageSourcePropType | undefined => {
  if (circuitId && circuitDetailMap[circuitId]) {
    return circuitDetailMap[circuitId]
  }
  // Return undefined if the circuitId is not found
  return undefined
}
