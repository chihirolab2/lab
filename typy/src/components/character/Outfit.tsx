import type { CharacterSpec } from '../../data/model';
import { BODY_F, BODY_M } from './paths';

const SHIRT = '#fbfaff';
const SHIRT_SHADE = '#e6e2f3';
const LINE = 'rgba(70, 56, 110, 0.28)';

interface Props {
  spec: CharacterSpec;
  skin: string;
  skinShade: string;
}

/** 首元〜肩の衣装。CSバリアントの小物は CharacterArt 側で上に重ねる */
export function Outfit({ spec, skin, skinShade }: Props) {
  const body = spec.build === 'm' ? BODY_M : BODY_F;
  const main = spec.outfitMain;
  const sub = spec.outfitSub;

  // 共通：服の陰影（肩の丸み）
  const shading = (
    <path d={body} fill="url(#cloth-shade)" opacity={0.5} style={{ mixBlendMode: 'multiply' }} />
  );

  switch (spec.outfit) {
    case 'turtle-jacket':
      return (
        <g>
          <path d={body} fill={main} />
          <path d="M101,207 L120,284 L139,207 Q120,214 101,207 Z" fill={sub} />
          <path d="M104,186 Q120,194 136,186 L138,212 Q120,220 102,212 Z" fill={sub} />
          <path d="M104,192 Q120,200 136,192 M103,200 Q120,208 137,200" stroke="rgba(255,255,255,0.12)" fill="none" />
          <path d="M101,207 L92,226 L112,262 L120,284 M139,207 L148,226 L128,262 L120,284" stroke={LINE} strokeWidth={1.4} fill="none" />
          {shading}
        </g>
      );
    case 'cardigan':
    case 'sailor-cardigan':
      return (
        <g>
          <path d={body} fill={main} />
          <path d="M100,206 Q120,214 140,206 L132,284 L108,284 Z" fill={SHIRT} />
          {spec.outfit === 'sailor-cardigan' ? (
            <path d="M99,203 Q120,214 141,203 Q146,220 130,224 Q122,216 120,214 Q118,216 110,224 Q94,220 99,203 Z" fill={SHIRT} stroke={SHIRT_SHADE} strokeWidth={1.2} />
          ) : (
            <path d="M102,205 L113,226 L120,214 L127,226 L138,205" fill="none" stroke={SHIRT_SHADE} strokeWidth={1.4} />
          )}
          <path d="M100,206 L110,284 M140,206 L130,284" stroke={LINE} strokeWidth={1.4} fill="none" />
          <circle cx={112} cy={246} r={2.4} fill={sub} />
          <circle cx={113.5} cy={266} r={2.4} fill={sub} />
          {shading}
        </g>
      );
    case 'blazer-blouse':
    case 'suit-tie':
    case 'suit-open':
      return (
        <g>
          <path d={body} fill={main} />
          <path d="M101,206 L120,270 L139,206 Q120,214 101,206 Z" fill={SHIRT} />
          <path d="M101,206 L111,230 L120,214 L129,230 L139,206 Q120,214 101,206 Z" fill={SHIRT} stroke={SHIRT_SHADE} strokeWidth={1.2} />
          {spec.outfit === 'suit-tie' && (
            <path d="M116,216 L124,216 L126,224 L122,262 L120,268 L118,262 L114,224 Z" fill={sub} />
          )}
          {spec.outfit === 'blazer-blouse' && (
            <path d="M120,220 C112,214 106,220 110,226 C114,230 118,224 120,222 C122,224 126,230 130,226 C134,220 128,214 120,220 Z" fill={sub} />
          )}
          <path d="M101,206 L90,226 L108,246 L120,276 M139,206 L150,226 L132,246 L120,276" fill={main} stroke={LINE} strokeWidth={1.4} />
          {shading}
        </g>
      );
    case 'hoodie':
      return (
        <g>
          <path d={body} fill={main} />
          <path d="M76,218 Q120,186 164,218 Q152,234 120,230 Q88,234 76,218 Z" fill={sub} />
          <path d="M100,210 Q120,222 140,210" stroke={LINE} strokeWidth={1.4} fill="none" />
          <path d="M112,222 L110,256 M128,222 L130,256" stroke={SHIRT} strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={110} cy={258} r={2.6} fill={SHIRT} />
          <circle cx={130} cy={258} r={2.6} fill={SHIRT} />
          {shading}
        </g>
      );
    case 'ribbon-blouse':
    case 'collar-blouse':
    case 'frill-blouse':
      return (
        <g>
          <path d={body} fill={main} />
          {spec.outfit === 'frill-blouse' && (
            <path
              d="M96,206 Q100,214 106,210 Q110,218 116,212 Q120,220 124,212 Q130,218 134,210 Q140,214 144,206 Q120,216 96,206 Z"
              fill={SHIRT}
              stroke={SHIRT_SHADE}
              strokeWidth={1}
            />
          )}
          {spec.outfit === 'collar-blouse' && (
            <path d="M99,203 Q120,214 141,203 L142,214 L124,226 L120,216 L116,226 L98,214 Z" fill={SHIRT} stroke={SHIRT_SHADE} strokeWidth={1.2} />
          )}
          {spec.outfit === 'ribbon-blouse' && (
            <path d="M100,205 Q120,214 140,205" stroke={SHIRT_SHADE} strokeWidth={1.6} fill="none" />
          )}
          {spec.outfit !== 'frill-blouse' && (
            <g>
              <path d="M120,218 C106,206 96,214 100,224 C104,232 114,226 120,220 C126,226 136,232 140,224 C144,214 134,206 120,218 Z" fill={sub} />
              <path d="M118,220 L110,248 L117,244 L120,224 L123,244 L130,248 L122,220 Z" fill={sub} />
              <circle cx={120} cy={219} r={3.4} fill={sub} stroke="rgba(0,0,0,0.08)" />
            </g>
          )}
          <path d="M120,228 L120,284" stroke={SHIRT_SHADE} strokeWidth={1.2} />
          {shading}
        </g>
      );
    case 'vest-shirt':
      return (
        <g>
          <path d={body} fill={SHIRT} />
          <path d="M66,226 C72,216 86,210 98,214 L120,262 L142,214 C154,210 168,216 174,226 L182,284 L58,284 Z" fill={main} />
          <path d="M100,205 L111,226 L120,213 L129,226 L140,205" fill={SHIRT} stroke={SHIRT_SHADE} strokeWidth={1.2} />
          <path d="M116,216 L124,216 L125,224 L121,256 L119,256 L115,224 Z" fill={sub} />
          <circle cx={120} cy={270} r={2.2} fill={LINE} />
          {shading}
        </g>
      );
    case 'knit':
      return (
        <g>
          <path d={body} fill={main} />
          <path d="M99,204 Q120,222 141,204 L145,210 Q120,232 95,210 Z" fill={sub} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${80 + i * 16},232 q2,26 0,52`} stroke="rgba(255,255,255,0.18)" strokeWidth={3} fill="none" />
          ))}
          {shading}
        </g>
      );
    case 'off-shoulder':
      return (
        <g>
          <path d={body} fill={skin} />
          <path d="M106,212 Q120,220 134,212" stroke={skinShade} strokeWidth={1.2} fill="none" opacity={0.7} />
          <path d="M36,284 C38,262 44,244 58,236 Q120,252 182,236 C196,244 202,262 204,284 Z" fill={main} />
          <path d="M58,236 Q120,252 182,236 L184,244 Q120,262 56,244 Z" fill={sub} />
          {shading}
        </g>
      );
    case 'jacket-tee':
    case 'bomber':
      return (
        <g>
          <path d={body} fill={main} />
          <path d="M100,206 Q120,216 140,206 L132,284 L108,284 Z" fill={sub} />
          <path d="M101,206 Q120,218 139,206" stroke={LINE} strokeWidth={1.2} fill="none" />
          {spec.outfit === 'bomber' ? (
            <path d="M94,204 Q120,222 146,204 L150,212 Q120,232 90,212 Z" fill={shadeColor(main)} />
          ) : (
            <path d="M100,206 L90,224 L104,240 L108,284 M140,206 L150,224 L136,240 L132,284" fill={main} stroke={LINE} strokeWidth={1.4} />
          )}
          {shading}
        </g>
      );
    case 'camisole-jacket':
      return (
        <g>
          <path d={body} fill={main} />
          <path d="M100,206 Q120,216 140,206 L134,284 L106,284 Z" fill={skin} />
          <path d="M104,236 Q120,230 136,236 L134,284 L106,284 Z" fill={sub} />
          <path d="M100,206 L90,226 L104,242 L106,284 M140,206 L150,226 L136,242 L134,284" fill={main} stroke={LINE} strokeWidth={1.4} />
          {shading}
        </g>
      );
  }
}

/** 色を少し暗くする（#rrggbb 前提） */
export function shadeColor(hex: string, amount = 0.14): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
