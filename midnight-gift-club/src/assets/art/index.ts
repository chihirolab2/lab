import type { ThemeKey } from '../../types';
import illusCafe from './illus-cafe.png';
import illusTravel from './illus-travel.png';
import illusMovie from './illus-movie.png';
import illusDinner from './illus-dinner.png';
import illusRelax from './illus-relax.png';
import illusSecret from './illus-secret.png';

export { default as heroGift } from './hero-gift.jpg';
export { default as premiumBox } from './premium-box.jpg';
export { default as bowPink } from './bow-pink.png';
export { default as ribbonSwirl } from './ribbon-swirl.png';
export { default as catArt } from './cat.png';

/** チケットの絵柄（素材ボードから切り出し）。PREMIUM は絵柄なし（クラウンを描画） */
export const TICKET_ART: Partial<Record<ThemeKey, string>> = {
  CAFE: illusCafe,
  TRAVEL: illusTravel,
  MOVIE: illusMovie,
  DINNER: illusDinner,
  RELAX: illusRelax,
  SECRET: illusSecret,
};
