import type { CSSProperties } from 'react';
import { characterPortraitUrl } from './lib/character';
import {
  cosmeticAssetUrl,
  portraitFrameFitVars,
  portraitFrameUrl,
} from './lib/cosmetics';

type Props = {
  avatarPreset: string;
  frameKey?: string | null;
  profileBackgroundKey?: string | null;
};

export function CharacterPortraitWithFrame(props: Props) {
  const portrait = characterPortraitUrl(props.avatarPreset);
  const frame = portraitFrameUrl(props.frameKey);
  const sceneBg = cosmeticAssetUrl(props.profileBackgroundKey);
  const layered = Boolean(frame) || Boolean(sceneBg);
  const frameFitStyle = portraitFrameFitVars(props.frameKey);

  const stackClass = [
    'trello-character-profile-portrait-stack',
    layered ? 'trello-character-profile-portrait-stack--layered' : '',
    frame ? 'trello-character-profile-portrait-stack--framed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={stackClass} style={frameFitStyle as CSSProperties | undefined}>
      {sceneBg && (
        <img
          src={sceneBg}
          alt=""
          className="trello-character-profile-portrait-scene-bg"
          loading="lazy"
        />
      )}
      <img
        src={portrait}
        alt=""
        className="trello-character-profile-portrait"
        loading="lazy"
      />
      {frame && (
        <img
          src={frame}
          alt=""
          className="trello-character-profile-portrait-frame"
          loading="lazy"
        />
      )}
    </div>
  );
}
