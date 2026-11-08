import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Portrait } from '../components/character/TypeVisuals';
import { Icon } from '../components/ui/Icon';
import { Button, Card, IconButton, ProgressBar, ScreenHeader, SectionTitle } from '../components/ui/primitives';
import { SceneArt } from '../components/ui/SceneArt';
import { AT_INFO, CS_INFO } from '../data/groups';
import type { Answer } from '../data/model';
import { QUESTIONS } from '../data/questions';
import { computeResult, estimateTotal, MAX_TOTAL, MIN_TOTAL, nextQuestion } from '../logic/diagnosis';
import { useStore } from '../store/AppStore';

const SESSION_KEY = 'typy:session:v1';

interface Session {
  seed: number;
  answers: Answer[];
}

function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
function saveSession(s: Session | null) {
  try {
    if (s) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* noop */
  }
}

/* =========================================================
   診断トップ
   ========================================================= */
export function DiagnosisIntroScreen() {
  const nav = useNavigate();
  const resumable = loadSession();
  const start = () => {
    saveSession({ seed: Math.floor(Math.random() * 100000) + 1, answers: [] });
    nav('/diagnosis/play');
  };
  return (
    <div className="screen diag-intro">
      <ScreenHeader title="タイプ診断" />
      <div className="diag-intro__hero">
        <div className="diag-intro__cast">
          <Portrait code="ENFP-AC" crop="bust" className="diag-intro__c1" />
          <Portrait code="ISTJ-AS" crop="bust" className="diag-intro__c2" />
          <Portrait code="ESFJ-TC" crop="bust" className="diag-intro__c3" />
        </div>
      </div>
      <Card className="diag-intro__card">
        <p className="eyebrow">TYPY 64 TYPES</p>
        <h2 className="diag-intro__title">あなたは64タイプの、どの子？</h2>
        <p className="body-text">
          16のベースタイプに、TYPY独自の2つの指標「A/T」「C/S」を掛け合わせた64タイプで、あなたの“らしさ”を見つけます。
        </p>
        <ul className="diag-intro__facts">
          <li>
            <Icon name="quiz" size={18} />約{MIN_TOTAL}〜{MAX_TOTAL}問
          </li>
          <li>
            <Icon name="sparkle" size={16} />回答にあわせて質問が変わる
          </li>
          <li>
            <Icon name="history" size={18} />5分ほど
          </li>
        </ul>
      </Card>

      <div className="stack">
        <SectionTitle icon="sparkle">TYPY独自の指標</SectionTitle>
        <div className="axis-defs">
          {[AT_INFO.A, AT_INFO.T].map((i) => (
            <Card key={i.key} className="axis-def">
              <span className="axis-def__key">{i.key}</span>
              <div>
                <p className="axis-def__name">
                  {i.label}
                  <small>
                    {i.reading}・{i.short}
                  </small>
                </p>
                <p className="axis-def__desc">{i.description}</p>
              </div>
            </Card>
          ))}
          {[CS_INFO.C, CS_INFO.S].map((i) => (
            <Card key={i.key} className="axis-def axis-def--cs">
              <span className="axis-def__key">{i.key}</span>
              <div>
                <p className="axis-def__name">
                  {i.label}
                  <small>
                    {i.reading}・{i.short}
                  </small>
                </p>
                <p className="axis-def__desc">{i.description}</p>
              </div>
            </Card>
          ))}
        </div>
        <p className="disclaimer">
          ※ TYPYは自己理解を楽しむためのオリジナル診断です。公式のMBTI®や16Personalitiesの診断ではありません。
        </p>
      </div>

      <div className="sticky-cta">
        {resumable && resumable.answers.length > 0 && (
          <Button variant="soft" block onClick={() => nav('/diagnosis/play')}>
            続きから再開（{resumable.answers.length}問回答済み）
          </Button>
        )}
        <Button arrow block onClick={start}>
          診断をはじめる
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   質問画面
   ========================================================= */
export function QuestionScreen() {
  const nav = useNavigate();
  const { saveResult } = useStore();
  const [session, setSession] = useState<Session>(() => loadSession() ?? { seed: Math.floor(Math.random() * 100000) + 1, answers: [] });
  const [selected, setSelected] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const finished = useRef(false);

  useEffect(() => saveSession(session), [session]);

  const question = useMemo(() => nextQuestion(QUESTIONS, session.answers, session.seed), [session]);
  const total = estimateTotal(session.answers);
  const index = session.answers.length + 1;

  // 終了 → 結果へ
  useEffect(() => {
    if (question || finished.current) return;
    finished.current = true;
    const result = computeResult(session.answers);
    saveResult(result);
    saveSession(null);
    nav('/result', { replace: true, state: { fresh: true } });
  }, [question, session.answers, saveResult, nav]);

  if (!question) return null;

  const next = () => {
    const opt = question.options.find((o) => o.id === selected);
    if (!opt) return;
    setLeaving(true);
    window.setTimeout(() => {
      setSession((s) => ({
        ...s,
        answers: [...s.answers, { questionId: question.id, optionId: opt.id, axis: question.axis, value: opt.value }],
      }));
      setSelected(null);
      setLeaving(false);
    }, 180);
  };

  const back = () => {
    if (session.answers.length === 0) return nav('/diagnosis');
    const prev = session.answers[session.answers.length - 1];
    setSession((s) => ({ ...s, answers: s.answers.slice(0, -1) }));
    setSelected(prev.optionId);
  };

  return (
    <div className="screen question">
      <header className="question__head">
        <IconButton icon="chevron-left" label="前の質問へ" onClick={back} />
        <div className="question__progress">
          <span className="question__count">
            <b>{index}</b> / {total}
          </span>
          <ProgressBar value={index - 1} max={total} thin />
        </div>
        <IconButton icon="close" label="診断を中断" onClick={() => nav('/diagnosis')} />
      </header>

      <div className={`question__body ${leaving ? 'is-leaving' : ''}`} key={question.id}>
        <h1 className="question__text">{question.text}</h1>
        <div className="question__scene">
          <SceneArt scene={question.scene} />
        </div>
        <div className="options" role="radiogroup" aria-label={question.text}>
          {question.options.map((o) => (
            <button
              key={o.id}
              role="radio"
              aria-checked={selected === o.id}
              className={`option ${selected === o.id ? 'is-selected' : ''}`}
              onClick={() => setSelected(o.id)}
            >
              <span className="option__radio" />
              <span className="option__label">{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="question__foot">
        <Button arrow block disabled={!selected} onClick={next}>
          次へ
        </Button>
      </div>
    </div>
  );
}
