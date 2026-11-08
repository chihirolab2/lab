import { useEffect, useState, type CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Portrait, TypeAvatar } from '../components/character/TypeVisuals';
import { TypePicker } from '../components/TypePicker';
import { Icon } from '../components/ui/Icon';
import { Button, Card, ScreenHeader, SectionTitle, Segment, Sheet } from '../components/ui/primitives';
import { getProfile, isTypeCode, splitCode } from '../data/catalog';
import { GROUP_ORDER, GROUPS } from '../data/groups';
import type { Friend, TypeCode } from '../data/model';
import { collectionStats } from '../logic/collection';
import { compatibility } from '../logic/compatibility';
import { useStore } from '../store/AppStore';

type Filter = 'all' | 'mine' | 'fav';

export function FriendsScreen() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const { profile } = useStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [adding, setAdding] = useState<TypeCode | null | false>(false);
  const [selected, setSelected] = useState<Friend | null>(null);
  const stats = collectionStats(profile.discovered);

  // /friends?add=INFP-TS で追加シートを開く
  useEffect(() => {
    const add = params.get('add');
    if (add !== null) {
      setAdding(isTypeCode(add) ? add : null);
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const myBase = profile.myCode ? splitCode(profile.myCode).base : null;
  const list = profile.friends.filter((f) =>
    filter === 'all' ? true : filter === 'fav' ? f.favorite : myBase !== null && splitCode(f.code).base === myBase,
  );

  return (
    <div className="screen friends">
      <ScreenHeader
        title="ともだちリスト"
        right={
          <button className="icon-btn" aria-label="相性診断へ" onClick={() => nav('/compat')}>
            <Icon name="heart" size={22} />
          </button>
        }
      />
      <Segment
        value={filter}
        onChange={setFilter}
        items={[
          { value: 'all', label: 'すべて' },
          { value: 'mine', label: '自分のタイプ' },
          { value: 'fav', label: '気になる人' },
        ]}
      />

      <div className="friends__grid">
        {list.map((f) => {
          const p = getProfile(f.code);
          return (
            <button key={f.id} className="person" onClick={() => setSelected(f)}>
              <span className="person__avatar">
                <TypeAvatar code={f.code} size={84} />
                {f.favorite && (
                  <span className="person__fav">
                    <Icon name="heart-fill" size={13} />
                  </span>
                )}
              </span>
              <b>{splitCode(f.code).base}</b>
              <small>
                {f.name}・{p.base.name}
              </small>
            </button>
          );
        })}
        <button className="person person--add" onClick={() => setAdding(null)}>
          <span className="person__plus">
            <Icon name="plus" size={26} />
          </span>
          <small>追加する</small>
        </button>
      </div>

      {list.length === 0 && (
        <p className="empty">
          {filter === 'mine' && !myBase ? '診断すると、同じタイプのともだちが表示されます。' : 'まだいません。'}
        </p>
      )}

      <Card className="progress-banner" onClick={() => nav('/zukan')}>
        <div className="progress-banner__art">
          <Portrait code="INFP-TS" crop="bust" />
        </div>
        <p>
          {stats.found >= stats.total / 2 ? '図鑑が半分に！' : `図鑑 ${stats.found}/${stats.total}`}
          <br />
          あと<b>{stats.remaining}</b>タイプでコンプリート♡
        </p>
        <Icon name="chevron-right" size={18} />
      </Card>

      <Distribution friends={profile.friends} myCode={profile.myCode} />

      <Sheet open={adding !== false} onClose={() => setAdding(false)} title="ともだちを追加">
        {adding !== false && <AddFriendForm initial={adding} onDone={() => setAdding(false)} />}
      </Sheet>

      <Sheet open={selected !== null} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && <FriendDetail friend={selected} onClose={() => setSelected(null)} />}
      </Sheet>
    </div>
  );
}

function AddFriendForm({ initial, onDone }: { initial: TypeCode | null; onDone: () => void }) {
  const { addFriend } = useStore();
  const [name, setName] = useState('');
  const [code, setCode] = useState<TypeCode | null>(initial);
  const valid = name.trim().length > 0 && code !== null;
  return (
    <div className="stack">
      <label className="field">
        <span className="field__label">なまえ・ニックネーム</span>
        <input className="field__input" value={name} maxLength={16} placeholder="例：ゆいちゃん" onChange={(e) => setName(e.target.value)} />
      </label>
      <div>
        <span className="field__label">タイプを選ぶ</span>
        <TypePicker value={code} onChange={setCode} />
      </div>
      <Button
        block
        arrow
        disabled={!valid}
        onClick={() => {
          if (!valid) return;
          addFriend(name.trim(), code!);
          onDone();
        }}
      >
        追加して図鑑に登録
      </Button>
    </div>
  );
}

function FriendDetail({ friend, onClose }: { friend: Friend; onClose: () => void }) {
  const nav = useNavigate();
  const { profile, updateFriend, removeFriend } = useStore();
  const [fav, setFav] = useState(friend.favorite);
  const p = getProfile(friend.code);
  const score = profile.myCode ? compatibility(profile.myCode, friend.code).score : null;
  return (
    <div className="stack friend-detail">
      <div className="friend-detail__head">
        <TypeAvatar code={friend.code} size={88} />
        <div>
          <p className="friend-detail__code">{splitCode(friend.code).base}<small>-{splitCode(friend.code).variant}</small></p>
          <p className="friend-detail__title">{p.title}</p>
          <p className="friend-detail__catch">{p.base.catch}</p>
        </div>
      </div>
      {score !== null && (
        <Card className="compat-mini" onClick={() => nav(`/compat?a=${profile.myCode}&b=${friend.code}`)}>
          <span className="eyebrow">あなたとの相性</span>
          <b className="compat-mini__score">{score}%</b>
          <Icon name="chevron-right" size={18} className="muted" />
        </Card>
      )}
      <div className="btn-row">
        <Button variant="soft" size="md" onClick={() => nav(`/type/${friend.code}`)}>
          タイプ詳細
        </Button>
        <Button
          variant={fav ? 'lavender' : 'soft'}
          size="md"
          onClick={() => {
            setFav(!fav);
            updateFriend(friend.id, { favorite: !fav });
          }}
        >
          <Icon name={fav ? 'heart-fill' : 'heart'} size={16} /> 気になる
        </Button>
      </div>
      <Button variant="primary" block arrow onClick={() => nav(`/compat?a=${profile.myCode ?? 'INTJ-AS'}&b=${friend.code}`)}>
        相性を見る
      </Button>
      <button
        className="text-link text-link--danger"
        onClick={() => {
          if (window.confirm(`${friend.name}さんをリストから削除しますか？`)) {
            removeFriend(friend.id);
            onClose();
          }
        }}
      >
        <Icon name="trash" size={15} /> リストから削除
      </button>
    </div>
  );
}

function Distribution({ friends, myCode }: { friends: Friend[]; myCode: TypeCode | null }) {
  const codes = [...friends.map((f) => f.code), ...(myCode ? [myCode] : [])];
  const total = codes.length || 1;
  const groupCount = Object.fromEntries(GROUP_ORDER.map((g) => [g, 0])) as Record<string, number>;
  const letter = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0, A: 0, Tn: 0, C: 0, St: 0 };
  for (const c of codes) {
    const p = getProfile(c);
    groupCount[p.group.id] += 1;
    const [e, s, t, j] = p.base.code.split('');
    letter[e as 'E' | 'I'] += 1;
    letter[s as 'S' | 'N'] += 1;
    letter[t as 'T' | 'F'] += 1;
    letter[j as 'J' | 'P'] += 1;
    if (p.at === 'A') letter.A += 1;
    else letter.Tn += 1;
    if (p.cs === 'C') letter.C += 1;
    else letter.St += 1;
  }
  const pairs: [string, number, string, number][] = [
    ['E 外向', letter.E, 'I 内向', letter.I],
    ['S 現実', letter.S, 'N 直感', letter.N],
    ['T 思考', letter.T, 'F 感情', letter.F],
    ['J 計画', letter.J, 'P 柔軟', letter.P],
    ['A 自信', letter.A, 'T 繊細', letter.Tn],
    ['C 挑戦', letter.C, 'S 安定', letter.St],
  ];
  // ドーナツチャート
  let acc = 0;
  const stops = GROUP_ORDER.map((g) => {
    const from = (acc / total) * 100;
    acc += groupCount[g];
    return `${GROUPS[g].color} ${from}% ${(acc / total) * 100}%`;
  }).join(', ');

  return (
    <section className="stack distribution">
      <SectionTitle icon="chart" color="#a9b8ef" right={<span className="muted-text">{codes.length}人</span>}>
        タイプ分布
      </SectionTitle>
      <Card className="dist-card">
        <div className="dist-card__donut" style={{ background: codes.length ? `conic-gradient(${stops})` : 'var(--lavender-100)' } as CSSProperties}>
          <span>
            <b>{codes.length}</b>
            <small>人</small>
          </span>
        </div>
        <ul className="dist-card__legend">
          {GROUP_ORDER.map((g) => (
            <li key={g}>
              <i style={{ background: GROUPS[g].color }} />
              {GROUPS[g].name}
              <b>{groupCount[g]}</b>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="dist-bars">
        {pairs.map(([l, lv, r, rv]) => {
          const sum = lv + rv || 1;
          return (
            <div key={l} className="dist-bar">
              <span className="dist-bar__l">{l}</span>
              <div className="dist-bar__track">
                <span className="dist-bar__left" style={{ width: `${(lv / sum) * 100}%` }} />
                <span className="dist-bar__right" style={{ width: `${(rv / sum) * 100}%` }} />
              </div>
              <span className="dist-bar__r">{r}</span>
            </div>
          );
        })}
      </Card>
    </section>
  );
}
