import { ImageSourcePropType } from 'react-native'
import type { FC } from 'react'
import type { SvgProps } from 'react-native-svg'

import AlbertPark2026 from '@/assets/images/circuit-simple/2026/albert_park.svg'
import Americas2026 from '@/assets/images/circuit-simple/2026/americas.svg'
import Bahrain2026 from '@/assets/images/circuit-simple/2026/bahrain.svg'
import Baku2026 from '@/assets/images/circuit-simple/2026/baku.svg'
import Catalunya2026 from '@/assets/images/circuit-simple/2026/catalunya.svg'
import Hungaroring2026 from '@/assets/images/circuit-simple/2026/hungaroring.svg'
import Interlagos2026 from '@/assets/images/circuit-simple/2026/interlagos.svg'
import Jeddah2026 from '@/assets/images/circuit-simple/2026/jeddah.svg'
import Losail2026 from '@/assets/images/circuit-simple/2026/losail.svg'
import Madring2026 from '@/assets/images/circuit-simple/2026/madring.svg'
import MarinaBay2026 from '@/assets/images/circuit-simple/2026/marina_bay.svg'
import Miami2026 from '@/assets/images/circuit-simple/2026/miami.svg'
import Monaco2026 from '@/assets/images/circuit-simple/2026/monaco.svg'
import Monza2026 from '@/assets/images/circuit-simple/2026/monza.svg'
import RedBullRing2026 from '@/assets/images/circuit-simple/2026/red_bull_ring.svg'
import Rodriguez2026 from '@/assets/images/circuit-simple/2026/rodriguez.svg'
import Shanghai2026 from '@/assets/images/circuit-simple/2026/shanghai.svg'
import Silverstone2026 from '@/assets/images/circuit-simple/2026/silverstone.svg'
import Spa2026 from '@/assets/images/circuit-simple/2026/spa.svg'
import Suzuka2026 from '@/assets/images/circuit-simple/2026/suzuka.svg'
import Vegas2026 from '@/assets/images/circuit-simple/2026/vegas.svg'
import Villeneuve2026 from '@/assets/images/circuit-simple/2026/villeneuve.svg'
import YasMarina2026 from '@/assets/images/circuit-simple/2026/yas_marina.svg'
import Zandvoort2026 from '@/assets/images/circuit-simple/2026/zandvoort.svg'

type CircuitSvgComponent = FC<SvgProps>

export type CircuitImageAsset =
  | { type: 'bitmap'; source: ImageSourcePropType }
  | { type: 'svg'; Svg: CircuitSvgComponent }

const circuitImageBitmapMapByYear: {
  [year: string]: { [key: string]: ImageSourcePropType }
} = {
  '2025': {
    albert_park: require('@/assets/images/circuit-simple/2025/albert_park.png'),
    americas: require('@/assets/images/circuit-simple/2025/americas.png'),
    bahrain: require('@/assets/images/circuit-simple/2025/bahrain.png'),
    baku: require('@/assets/images/circuit-simple/2025/baku.png'),
    catalunya: require('@/assets/images/circuit-simple/2025/catalunya.png'),
    hungaroring: require('@/assets/images/circuit-simple/2025/hungaroring.png'),
    imola: require('@/assets/images/circuit-simple/2025/imola.png'),
    interlagos: require('@/assets/images/circuit-simple/2025/interlagos.png'),
    jeddah: require('@/assets/images/circuit-simple/2025/jeddah.png'),
    losail: require('@/assets/images/circuit-simple/2025/losail.png'),
    marina_bay: require('@/assets/images/circuit-simple/2025/marina_bay.png'),
    miami: require('@/assets/images/circuit-simple/2025/miami.png'),
    monaco: require('@/assets/images/circuit-simple/2025/monaco.png'),
    monza: require('@/assets/images/circuit-simple/2025/monza.png'),
    red_bull_ring: require('@/assets/images/circuit-simple/2025/red_bull_ring.png'),
    rodriguez: require('@/assets/images/circuit-simple/2025/rodriguez.png'),
    shanghai: require('@/assets/images/circuit-simple/2025/shanghai.png'),
    silverstone: require('@/assets/images/circuit-simple/2025/silverstone.png'),
    spa: require('@/assets/images/circuit-simple/2025/spa.png'),
    suzuka: require('@/assets/images/circuit-simple/2025/suzuka.png'),
    vegas: require('@/assets/images/circuit-simple/2025/vegas.png'),
    villeneuve: require('@/assets/images/circuit-simple/2025/villeneuve.png'),
    yas_marina: require('@/assets/images/circuit-simple/2025/yas_marina.png'),
    zandvoort: require('@/assets/images/circuit-simple/2025/zandvoort.png'),
  },
}

const circuitImageSvgMapByYear: {
  [year: string]: { [key: string]: CircuitSvgComponent }
} = {
  '2026': {
    albert_park: AlbertPark2026,
    americas: Americas2026,
    bahrain: Bahrain2026,
    baku: Baku2026,
    catalunya: Catalunya2026,
    hungaroring: Hungaroring2026,
    interlagos: Interlagos2026,
    jeddah: Jeddah2026,
    losail: Losail2026,
    madring: Madring2026,
    marina_bay: MarinaBay2026,
    miami: Miami2026,
    monaco: Monaco2026,
    monza: Monza2026,
    red_bull_ring: RedBullRing2026,
    rodriguez: Rodriguez2026,
    shanghai: Shanghai2026,
    silverstone: Silverstone2026,
    spa: Spa2026,
    suzuka: Suzuka2026,
    vegas: Vegas2026,
    villeneuve: Villeneuve2026,
    yas_marina: YasMarina2026,
    zandvoort: Zandvoort2026,
  },
}

const circuitDetailMapByYear: {
  [year: string]: { [key: string]: ImageSourcePropType }
} = {
  '2025': {
    albert_park: require('@/assets/images/circuit-detail/2025/albert_park.png'),
    americas: require('@/assets/images/circuit-detail/2025/americas.png'),
    bahrain: require('@/assets/images/circuit-detail/2025/bahrain.png'),
    baku: require('@/assets/images/circuit-detail/2025/baku.png'),
    catalunya: require('@/assets/images/circuit-detail/2025/catalunya.png'),
    hungaroring: require('@/assets/images/circuit-detail/2025/hungaroring.png'),
    imola: require('@/assets/images/circuit-detail/2025/imola.png'),
    interlagos: require('@/assets/images/circuit-detail/2025/interlagos.png'),
    jeddah: require('@/assets/images/circuit-detail/2025/jeddah.png'),
    losail: require('@/assets/images/circuit-detail/2025/losail.png'),
    marina_bay: require('@/assets/images/circuit-detail/2025/marina_bay.png'),
    miami: require('@/assets/images/circuit-detail/2025/miami.png'),
    monaco: require('@/assets/images/circuit-detail/2025/monaco.png'),
    monza: require('@/assets/images/circuit-detail/2025/monza.png'),
    red_bull_ring: require('@/assets/images/circuit-detail/2025/red_bull_ring.png'),
    rodriguez: require('@/assets/images/circuit-detail/2025/rodriguez.png'),
    shanghai: require('@/assets/images/circuit-detail/2025/shanghai.png'),
    silverstone: require('@/assets/images/circuit-detail/2025/silverstone.png'),
    spa: require('@/assets/images/circuit-detail/2025/spa.png'),
    suzuka: require('@/assets/images/circuit-detail/2025/suzuka.png'),
    vegas: require('@/assets/images/circuit-detail/2025/vegas.png'),
    villeneuve: require('@/assets/images/circuit-detail/2025/villeneuve.png'),
    yas_marina: require('@/assets/images/circuit-detail/2025/yas_marina.png'),
    zandvoort: require('@/assets/images/circuit-detail/2025/zandvoort.png'),
  },
  '2026': {
    albert_park: require('@/assets/images/circuit-detail/2026/2026trackmelbournedetailed.webp.avif'),
    americas: require('@/assets/images/circuit-detail/2026/2026trackaustindetailed.webp.avif'),
    bahrain: require('@/assets/images/circuit-detail/2026/2026tracksakhirdetailed.webp.avif'),
    baku: require('@/assets/images/circuit-detail/2026/2026trackbakudetailed.webp.avif'),
    catalunya: require('@/assets/images/circuit-detail/2026/2026trackcatalunyadetailed.webp.avif'),
    hungaroring: require('@/assets/images/circuit-detail/2026/2026trackhungaroringdetailed.webp.avif'),
    interlagos: require('@/assets/images/circuit-detail/2026/2026trackinterlagosdetailed.webp.avif'),
    jeddah: require('@/assets/images/circuit-detail/2026/2026trackjeddahdetailed.webp.avif'),
    losail: require('@/assets/images/circuit-detail/2026/2026tracklusaildetailed.webp.avif'),
    madring: require('@/assets/images/circuit-detail/2026/2026trackmadringdetailed.webp.avif'),
    marina_bay: require('@/assets/images/circuit-detail/2026/2026tracksingaporedetailed.webp.avif'),
    miami: require('@/assets/images/circuit-detail/2026/2026trackmiamidetailed.webp.avif'),
    monaco: require('@/assets/images/circuit-detail/2026/2026trackmontecarlodetailed.webp.avif'),
    monza: require('@/assets/images/circuit-detail/2026/2026trackmonzadetailed.webp.avif'),
    red_bull_ring: require('@/assets/images/circuit-detail/2026/2026trackspielbergdetailed.webp.avif'),
    rodriguez: require('@/assets/images/circuit-detail/2026/2026trackmexicocitydetailed.webp.avif'),
    shanghai: require('@/assets/images/circuit-detail/2026/2026trackshanghaidetailed.webp.avif'),
    silverstone: require('@/assets/images/circuit-detail/2026/2026tracksilverstonedetailed.webp.avif'),
    spa: require('@/assets/images/circuit-detail/2026/2026trackspafrancorchampsdetailed.webp.avif'),
    suzuka: require('@/assets/images/circuit-detail/2026/2026tracksuzukadetailed.webp.avif'),
    vegas: require('@/assets/images/circuit-detail/2026/2026tracklasvegasdetailed.webp.avif'),
    villeneuve: require('@/assets/images/circuit-detail/2026/2026trackmontrealdetailed.webp.avif'),
    yas_marina: require('@/assets/images/circuit-detail/2026/2026trackyasmarinacircuitdetailed.webp.avif'),
    zandvoort: require('@/assets/images/circuit-detail/2026/2026trackzandvoortdetailed.webp.avif'),
  },
}

const resolveYearMap = <T>(
  mapByYear: { [year: string]: { [key: string]: T } },
  year: string | number | undefined,
): { [key: string]: T } | undefined => {
  if (year === undefined || year === null) {
    return undefined
  }

  return mapByYear[String(year)]
}

// Function to get the image source for a given circuitId.
// Returns undefined if the circuitId is not found.
export const getCircuitImage = (
  circuitId: string | undefined,
  year: string | number | undefined,
): CircuitImageAsset | undefined => {
  const bitmapYearMap = resolveYearMap(circuitImageBitmapMapByYear, year)
  if (circuitId && bitmapYearMap?.[circuitId]) {
    return {
      type: 'bitmap',
      source: bitmapYearMap[circuitId],
    }
  }

  const svgYearMap = resolveYearMap(circuitImageSvgMapByYear, year)
  if (circuitId && svgYearMap?.[circuitId]) {
    return {
      type: 'svg',
      Svg: svgYearMap[circuitId],
    }
  }

  console.log('missing circuit image', { circuitId, year })
  return undefined
}

export const getCircuitDetailImage = (
  circuitId: string | undefined,
  year: string | number | undefined,
): ImageSourcePropType | undefined => {
  const yearMap = resolveYearMap(circuitDetailMapByYear, year)
  if (circuitId && yearMap?.[circuitId]) {
    return yearMap[circuitId]
  }

  console.log('missing circuit detail image', { circuitId, year })
  return undefined
}
