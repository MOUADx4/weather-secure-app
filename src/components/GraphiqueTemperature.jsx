import React from 'react';
import { ScrollView, View } from 'react-native';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { LineChart as IconeCourbe } from 'lucide-react-native';

import { CarteVerre } from './CarteVerre';
import { Font } from '../theme/fonts';
import { formatHeure } from '../utils/formatMeteo';

const ESPACE = 58; // espacement horizontal entre deux points
const HAUTEUR = 130; // hauteur de la zone de tracé
const MARGE_HAUT = 26; // place pour l'étiquette de température
const MARGE_BAS = 22; // place pour l'étiquette d'heure

// Construit un tracé lissé (courbes de Bézier à tangentes horizontales).
function construireTrace(points) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prec = points[i - 1];
    const cur = points[i];
    const milieu = (prec.x + cur.x) / 2;
    d += ` C ${milieu} ${prec.y} ${milieu} ${cur.y} ${cur.x} ${cur.y}`;
  }
  return d;
}

export function GraphiqueTemperature({ liste, ambiance }) {
  if (!liste || liste.length < 2) return null;

  const data = liste.slice(0, 12);
  const temps = data.map((d) => Math.round(d.temperature));
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const amplitude = Math.max(max - min, 1);

  const largeur = data.length * ESPACE;
  const hauteurTotale = HAUTEUR + MARGE_HAUT + MARGE_BAS;

  const points = temps.map((t, i) => ({
    x: i * ESPACE + ESPACE / 2,
    y: MARGE_HAUT + (1 - (t - min) / amplitude) * HAUTEUR,
    t,
  }));

  const trace = construireTrace(points);
  const aire = `${trace} L ${points[points.length - 1].x} ${hauteurTotale} L ${points[0].x} ${hauteurTotale} Z`;

  return (
    <CarteVerre
      titre="Évolution de la température"
      ambiance={ambiance}
      icone={<IconeCourbe size={14} color={ambiance.texteDoux} />}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <Svg width={largeur} height={hauteurTotale}>
            <Defs>
              <SvgLinearGradient id="trait" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#7EB3FF" />
                <Stop offset="0.5" stopColor="#22D3EE" />
                <Stop offset="1" stopColor="#F59E0B" />
              </SvgLinearGradient>
              <SvgLinearGradient id="aire" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#22D3EE" stopOpacity="0.35" />
                <Stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>

            <Path d={aire} fill="url(#aire)" />
            <Path d={trace} stroke="url(#trait)" strokeWidth="3" fill="none" />

            {points.map((p, i) => (
              <React.Fragment key={i}>
                <Circle cx={p.x} cy={p.y} r="3.5" fill={ambiance.texte} />
                <SvgText
                  x={p.x}
                  y={p.y - 12}
                  fill={ambiance.texte}
                  fontSize="13"
                  fontFamily={Font.bold}
                  textAnchor="middle"
                >
                  {`${p.t}°`}
                </SvgText>
                <SvgText
                  x={p.x}
                  y={hauteurTotale - 6}
                  fill={ambiance.texteDoux}
                  fontSize="11"
                  fontFamily={Font.medium}
                  textAnchor="middle"
                >
                  {i === 0 ? 'Maint.' : formatHeure(data[i].date)}
                </SvgText>
              </React.Fragment>
            ))}
          </Svg>
        </View>
      </ScrollView>
    </CarteVerre>
  );
}
