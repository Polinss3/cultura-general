import { View, type ImageSourcePropType } from 'react-native';
import Svg, { Image } from 'react-native-svg';
import framing from '@/constants/cityDioramaFraming.json';

export type CityDioramaId = keyof typeof framing.images;

interface Props {
  cityId: CityDioramaId;
  source: ImageSourcePropType;
  /** Describe los hitos visibles sin revelar el nombre de la ciudad. */
  accessibilityLabel: string;
}

/**
 * Registro del diorama en una tarjeta cuadrada, independiente de la pregunta.
 * El mismo ancho y la misma línea inferior de la base se usan en las 250
 * ciudades del catálogo. La escala es uniforme: los edificios no se estiran ni se recortan.
 * Recalibrar el perfil si cambia el PNG; no usar estas cifras con otra versión.
 */
export function CityDiorama({ cityId, source, accessibilityLabel }: Props) {
  const { normalized } = framing.images[cityId];
  const x = normalized.left * 1254;
  const y = normalized.top * 1254;
  const width = normalized.width * 1254;
  const height = normalized.height * 1254;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={{
        width: '100%',
        aspectRatio: framing.frame.aspectRatio,
        overflow: 'hidden',
      }}
    >
      <Svg accessible={false} width="100%" height="100%" viewBox="0 0 1254 1254">
        <Image
          key={cityId}
          href={source}
          x={x}
          y={y}
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid meet"
        />
      </Svg>
    </View>
  );
}
