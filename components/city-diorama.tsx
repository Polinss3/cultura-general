import { useId } from 'react';
import { View, type ImageSourcePropType } from 'react-native';
import Svg, { Defs, G, Image, LinearGradient, Mask, Rect, Stop } from 'react-native-svg';
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
 * El mismo ancho y la misma línea inferior de la base se usan en las seis
 * ciudades. La escala es uniforme: los edificios no se estiran ni se recortan.
 * Recalibrar el perfil si cambia el PNG; no usar estas cifras con otra versión.
 */
export function CityDiorama({ cityId, source, accessibilityLabel }: Props) {
  const { normalized } = framing.images[cityId];
  const id = useId().replace(/:/g, '');
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
        backgroundColor: framing.frame.background,
        overflow: 'hidden',
      }}
    >
      <Svg accessible={false} width="100%" height="100%" viewBox="0 0 1254 1254">
        <Defs>
          {/* El fundido solo ocupa el borde vacío del PNG, antes de la base. */}
          <LinearGradient id={`${id}-horizontal`} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="white" stopOpacity={0} />
            <Stop offset="2%" stopColor="white" />
            <Stop offset="98%" stopColor="white" />
            <Stop offset="100%" stopColor="white" stopOpacity={0} />
          </LinearGradient>
          <LinearGradient id={`${id}-vertical`} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="white" stopOpacity={0} />
            <Stop offset="2%" stopColor="white" />
            <Stop offset="98%" stopColor="white" />
            <Stop offset="100%" stopColor="white" stopOpacity={0} />
          </LinearGradient>
          <Mask id={`${id}-x`} maskUnits="userSpaceOnUse" x={x} y={y} width={width} height={height}>
            <Rect x={x} y={y} width={width} height={height} fill={`url(#${id}-horizontal)`} />
          </Mask>
          <Mask id={`${id}-y`} maskUnits="userSpaceOnUse" x={x} y={y} width={width} height={height}>
            <Rect x={x} y={y} width={width} height={height} fill={`url(#${id}-vertical)`} />
          </Mask>
        </Defs>
        <G mask={`url(#${id}-x)`}>
          <Image
            key={cityId}
            href={source}
            x={x}
            y={y}
            width={width}
            height={height}
            mask={`url(#${id}-y)`}
            preserveAspectRatio="xMidYMid meet"
          />
        </G>
      </Svg>
    </View>
  );
}
