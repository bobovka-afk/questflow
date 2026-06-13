import { useState } from 'react';
import { SpaLink } from '@shared/lib/navigation';
import { DAILY_ACTIVITY_XP_MAX, XP_DAILY_CHECKIN } from '@entities/reward';
import {
  gamificationIntroIllustrationUrl,
  INTRO_ILLUSTRATION_HEIGHT,
  INTRO_ILLUSTRATION_WIDTH,
} from '@shared/assets/uiAssets';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function GamificationIntroModal(props: Props) {
  const [step, setStep] = useState<'about' | 'gamification'>('about');
  const handleClose = () => {
    setStep('about');
    props.onClose();
  };

  if (!props.open) return null;

  const canDismiss = step === 'about';

  return (
    <div
      className="trello-modal-backdrop"
      role="presentation"
      onClick={canDismiss ? handleClose : undefined}
    >
      <div
        className="trello-modal trello-gamification-intro-modal"
        role="dialog"
        aria-modal
        aria-labelledby="gamification-intro-title"
        onClick={(e) => e.stopPropagation()}
      >
        {canDismiss ? (
          <button
            type="button"
            className="trello-modal-close trello-gamification-intro-close"
            onClick={handleClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        ) : null}

        <div className="trello-modal-body trello-gamification-intro-body">
          <section className="trello-gamification-intro-hero">
            <img
              src={gamificationIntroIllustrationUrl()}
              width={INTRO_ILLUSTRATION_WIDTH}
              height={INTRO_ILLUSTRATION_HEIGHT}
              alt="Иллюстрация доски и персонажа"
              className="trello-gamification-intro-hero-img"
              loading="lazy"
              draggable={false}
            />
          </section>
          {step === 'about' ? (
            <>
              <h3 className="trello-gamification-intro-subtitle" id="gamification-intro-title">
                Что такое Questflow
              </h3>
              <section className="trello-gamification-intro-block">
                <p className="trello-gamification-intro-text">
                  <strong>Questflow</strong> — задачи для себя и команды с встроенной геймификацией.
                </p>
                <p className="trello-gamification-intro-text">
                  Ведите привычки, ежедневные дела и личные задачи в разделе «Привычки» или
                  организуйте проекты на досках: колонки, карточки, сроки, исполнители и
                  комментарии. За реальные действия растёт персонаж — опыт, квесты, сундуки и
                  достижения.
                </p>
              </section>
            </>
          ) : (
            <section className="trello-gamification-intro-rewards">
              <h3 className="trello-gamification-intro-title" id="gamification-intro-title">
                Награды за дела
              </h3>
              <p className="trello-gamification-intro-lead">
                Создайте персонажа — и получайте опыт за задачи на досках и в «Привычках», квесты и
                косметику в профиле.
              </p>
              <div className="trello-gamification-intro-steps">
                <article className="trello-gamification-intro-step">
                  <div className="trello-gamification-intro-step-badge" aria-hidden>
                    1
                  </div>
                  <div>
                    <div className="trello-gamification-intro-step-title">Делайте</div>
                    <p className="trello-gamification-intro-step-text">
                      Карточки, личные задачи, ежедневные, привычки. До{' '}
                      <strong>{DAILY_ACTIVITY_XP_MAX} XP</strong>/сутки, активность{' '}
                      <strong>+{XP_DAILY_CHECKIN} XP</strong>.
                    </p>
                  </div>
                </article>
                <article className="trello-gamification-intro-step">
                  <div className="trello-gamification-intro-step-badge" aria-hidden>
                    2
                  </div>
                  <div>
                    <div className="trello-gamification-intro-step-title">Следите</div>
                    <p className="trello-gamification-intro-step-text">
                      Отслеживайте уровень, здоровье и серию активных дней — регулярность укрепляет
                      прогресс.
                    </p>
                  </div>
                </article>
                <article className="trello-gamification-intro-step">
                  <div className="trello-gamification-intro-step-badge" aria-hidden>
                    3
                  </div>
                  <div>
                    <div className="trello-gamification-intro-step-title">Собирайте</div>
                    <p className="trello-gamification-intro-step-text">
                      Квесты → сундуки → косметика.
                    </p>
                  </div>
                </article>
              </div>
              <p className="trello-gamification-intro-footnote">
                Все правила — <strong>Профиль → Персонаж → Правила</strong>.
              </p>
            </section>
          )}
        </div>

        <div className="trello-modal-foot trello-modal-foot-center trello-gamification-intro-foot">
          {step === 'about' ? (
            <button
              type="button"
              className="trello-btn trello-btn-primary"
              onClick={() => setStep('gamification')}
            >
              Далее
            </button>
          ) : (
            <SpaLink
              className="trello-btn trello-btn-primary trello-gamification-intro-create-btn"
              to="/profile/character"
              onClick={handleClose}
            >
              Создать персонажа
            </SpaLink>
          )}
        </div>
      </div>
    </div>
  );
}
