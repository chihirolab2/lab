import { useState } from 'react';
import { BASE_ORDER, BASE_TYPES } from '../data/baseTypes';
import { makeCode, parseCode } from '../data/catalog';
import { AT_INFO, CS_INFO } from '../data/groups';
import type { AT, BaseCode, CS, TypeCode } from '../data/model';
import { TypeAvatar } from './character/TypeVisuals';
import { Segment } from './ui/primitives';

/** 16ベース × A/T × C/S を選ぶピッカー */
export function TypePicker({ value, onChange }: { value: TypeCode | null; onChange: (c: TypeCode) => void }) {
  const init = value ? parseCode(value) : null;
  const [base, setBase] = useState<BaseCode | null>(init?.base ?? null);
  const [at, setAt] = useState<AT>(init?.at ?? 'A');
  const [cs, setCs] = useState<CS>(init?.cs ?? 'S');

  const emit = (b: BaseCode | null, a: AT, c: CS) => {
    if (b) onChange(makeCode(b, a, c));
  };

  return (
    <div className="type-picker">
      <div className="type-picker__grid">
        {BASE_ORDER.map((b) => (
          <button
            key={b}
            className={`type-picker__item ${base === b ? 'is-active' : ''}`}
            onClick={() => {
              setBase(b);
              emit(b, at, cs);
            }}
            aria-pressed={base === b}
          >
            <TypeAvatar code={makeCode(b, at, cs)} size={48} ring={false} />
            <b>{b}</b>
            <small>{BASE_TYPES[b].name}</small>
          </button>
        ))}
      </div>
      <div className="type-picker__variants">
        <Segment
          variant="tabs"
          ariaLabel="A/T"
          value={at}
          onChange={(v) => {
            setAt(v);
            emit(base, v, cs);
          }}
          items={(['A', 'T'] as AT[]).map((k) => ({ value: k, label: `${k} ${AT_INFO[k].short}` }))}
        />
        <Segment
          variant="tabs"
          ariaLabel="C/S"
          value={cs}
          onChange={(v) => {
            setCs(v);
            emit(base, at, v);
          }}
          items={(['C', 'S'] as CS[]).map((k) => ({ value: k, label: `${k} ${CS_INFO[k].short}` }))}
        />
      </div>
    </div>
  );
}
