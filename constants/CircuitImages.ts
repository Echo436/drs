import { ImageSourcePropType } from 'react-native';

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
};

// Function to get the image source for a given circuitId.
// Returns undefined if the circuitId is not found.
export const getCircuitImage = (circuitId: string | undefined): ImageSourcePropType | undefined => {
    if (circuitId && circuitImageMap[circuitId]) {
        return circuitImageMap[circuitId];
    }
    // Return undefined if the circuitId is not found
    return undefined;
};