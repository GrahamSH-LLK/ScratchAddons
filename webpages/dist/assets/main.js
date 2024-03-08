import {
  _ as ve,
  r as Nt,
  w as R,
  v as ee,
  o as p,
  c as v,
  a,
  t as k,
  b as tt,
  d as We,
  e as Uo,
  f as Ln,
  g as Ho,
  h as Wo,
  i as Go,
  j as A,
  F as z,
  k as X,
  l as re,
  m as me,
  n as we,
  p as U,
  q as Pt,
  s as pe,
  u as lo,
  x as nt,
  y as Ie,
  z as Nn,
  A as co,
  T as Vo,
  B as Xo,
  C as Yo,
  D as qo
} from "./main2.js";
import {
  _ as xn
} from "./popout.js";
const Ko = (e, t) => {
  const n = document.createElement("a");
  if (document.body.appendChild(n), navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(t, e);
      return
  }
  if ("download" in HTMLAnchorElement.prototype) {
      const o = window.URL.createObjectURL(t);
      n.href = o, n.download = e, n.type = t.type, n.click(), window.setTimeout(() => {
          document.body.removeChild(n), window.URL.revokeObjectURL(o)
      }, 1e3)
  } else {
      let o = window.open("", "_blank");
      const s = new FileReader;
      s.onloadend = function() {
          o.location.href = s.result, o = null
      }, s.readAsDataURL(t)
  }
};

function Me(e) {
  return Array.isArray ? Array.isArray(e) : go(e) === "[object Array]"
}

function _e(e) {
  return typeof e == "string"
}

function uo(e) {
  return typeof e == "number"
}

function Jo(e) {
  return e === !0 || e === !1 || function(t) {
      return ho(t) && t !== null
  }(e) && go(e) == "[object Boolean]"
}

function ho(e) {
  return typeof e == "object"
}

function ce(e) {
  return e != null
}

function Gt(e) {
  return !e.trim().length
}

function go(e) {
  return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e)
}
const Pn = Object.prototype.hasOwnProperty;
class Zo {
  constructor(t) {
      this._keys = [], this._keyMap = {};
      let n = 0;
      t.forEach(o => {
          let s = mo(o);
          n += s.weight, this._keys.push(s), this._keyMap[s.id] = s, n += s.weight
      }), this._keys.forEach(o => {
          o.weight /= n
      })
  }
  get(t) {
      return this._keyMap[t]
  }
  keys() {
      return this._keys
  }
  toJSON() {
      return JSON.stringify(this._keys)
  }
}

function mo(e) {
  let t = null,
      n = null,
      o = null,
      s = 1,
      i = null;
  if (_e(e) || Me(e)) o = e, t = Fn(e), n = gn(e);
  else {
      if (!Pn.call(e, "name")) throw new Error((d => `Missing ${d} property in key`)("name"));
      const r = e.name;
      if (o = r, Pn.call(e, "weight") && (s = e.weight, s <= 0)) throw new Error((d => `Property 'weight' in key '${d}' must be a positive integer`)(r));
      t = Fn(r), n = gn(r), i = e.getFn
  }
  return {
      path: t,
      id: n,
      weight: s,
      src: o,
      getFn: i
  }
}

function Fn(e) {
  return Me(e) ? e : e.split(".")
}

function gn(e) {
  return Me(e) ? e.join(".") : e
}
var T = {
  isCaseSensitive: !1,
  includeScore: !1,
  keys: [],
  shouldSort: !0,
  sortFn: (e, t) => e.score === t.score ? e.idx < t.idx ? -1 : 1 : e.score < t.score ? -1 : 1,
  includeMatches: !1,
  findAllMatches: !1,
  minMatchCharLength: 1,
  location: 0,
  threshold: .6,
  distance: 100,
  useExtendedSearch: !1,
  getFn: function(e, t) {
      let n = [],
          o = !1;
      const s = (i, r, d) => {
          if (ce(i))
              if (r[d]) {
                  const l = i[r[d]];
                  if (!ce(l)) return;
                  if (d === r.length - 1 && (_e(l) || uo(l) || Jo(l))) n.push(function(c) {
                      return c == null ? "" : function(m) {
                          if (typeof m == "string") return m;
                          let h = m + "";
                          return h == "0" && 1 / m == -1 / 0 ? "-0" : h
                      }(c)
                  }(l));
                  else if (Me(l)) {
                      o = !0;
                      for (let c = 0, m = l.length; c < m; c += 1) s(l[c], r, d + 1)
                  } else r.length && s(l, r, d + 1)
              } else n.push(i)
      };
      return s(e, _e(t) ? t.split(".") : t, 0), o ? n : n[0]
  },
  ignoreLocation: !1,
  ignoreFieldNorm: !1,
  fieldNormWeight: 1
};
const Qo = /[^ ]+/g;
class kn {
  constructor({
      getFn: t = T.getFn,
      fieldNormWeight: n = T.fieldNormWeight
  } = {}) {
      this.norm = function(o = 1, s = 3) {
          const i = new Map,
              r = Math.pow(10, s);
          return {
              get(d) {
                  const l = d.match(Qo).length;
                  if (i.has(l)) return i.get(l);
                  const c = 1 / Math.pow(l, .5 * o),
                      m = parseFloat(Math.round(c * r) / r);
                  return i.set(l, m), m
              },
              clear() {
                  i.clear()
              }
          }
      }(n, 3), this.getFn = t, this.isCreated = !1, this.setIndexRecords()
  }
  setSources(t = []) {
      this.docs = t
  }
  setIndexRecords(t = []) {
      this.records = t
  }
  setKeys(t = []) {
      this.keys = t, this._keysMap = {}, t.forEach((n, o) => {
          this._keysMap[n.id] = o
      })
  }
  create() {
      !this.isCreated && this.docs.length && (this.isCreated = !0, _e(this.docs[0]) ? this.docs.forEach((t, n) => {
          this._addString(t, n)
      }) : this.docs.forEach((t, n) => {
          this._addObject(t, n)
      }), this.norm.clear())
  }
  add(t) {
      const n = this.size();
      _e(t) ? this._addString(t, n) : this._addObject(t, n)
  }
  removeAt(t) {
      this.records.splice(t, 1);
      for (let n = t, o = this.size(); n < o; n += 1) this.records[n].i -= 1
  }
  getValueForItemAtKeyId(t, n) {
      return t[this._keysMap[n]]
  }
  size() {
      return this.records.length
  }
  _addString(t, n) {
      if (!ce(t) || Gt(t)) return;
      let o = {
          v: t,
          i: n,
          n: this.norm.get(t)
      };
      this.records.push(o)
  }
  _addObject(t, n) {
      let o = {
          i: n,
          $: {}
      };
      this.keys.forEach((s, i) => {
          let r = s.getFn ? s.getFn(t) : this.getFn(t, s.path);
          if (ce(r)) {
              if (Me(r)) {
                  let d = [];
                  const l = [{
                      nestedArrIndex: -1,
                      value: r
                  }];
                  for (; l.length;) {
                      const {
                          nestedArrIndex: c,
                          value: m
                      } = l.pop();
                      if (ce(m))
                          if (_e(m) && !Gt(m)) {
                              let h = {
                                  v: m,
                                  i: c,
                                  n: this.norm.get(m)
                              };
                              d.push(h)
                          } else Me(m) && m.forEach((h, g) => {
                              l.push({
                                  nestedArrIndex: g,
                                  value: h
                              })
                          })
                  }
                  o.$[i] = d
              } else if (_e(r) && !Gt(r)) {
                  let d = {
                      v: r,
                      n: this.norm.get(r)
                  };
                  o.$[i] = d
              }
          }
      }), this.records.push(o)
  }
  toJSON() {
      return {
          keys: this.keys,
          records: this.records
      }
  }
}

function po(e, t, {
  getFn: n = T.getFn,
  fieldNormWeight: o = T.fieldNormWeight
} = {}) {
  const s = new kn({
      getFn: n,
      fieldNormWeight: o
  });
  return s.setKeys(e.map(mo)), s.setSources(t), s.create(), s
}

function vt(e, {
  errors: t = 0,
  currentLocation: n = 0,
  expectedLocation: o = 0,
  distance: s = T.distance,
  ignoreLocation: i = T.ignoreLocation
} = {}) {
  const r = t / e.length;
  if (i) return r;
  const d = Math.abs(o - n);
  return s ? r + d / s : d ? 1 : r
}

function es(e, t, n, {
  location: o = T.location,
  distance: s = T.distance,
  threshold: i = T.threshold,
  findAllMatches: r = T.findAllMatches,
  minMatchCharLength: d = T.minMatchCharLength,
  includeMatches: l = T.includeMatches,
  ignoreLocation: c = T.ignoreLocation
} = {}) {
  if (t.length > 32) throw new Error("Pattern length exceeds max of 32.");
  const m = t.length,
      h = e.length,
      g = Math.max(0, Math.min(o, h));
  let u = i,
      f = g;
  const b = d > 1 || l,
      E = b ? Array(h) : [];
  let w;
  for (;
      (w = e.indexOf(t, f)) > -1;) {
      let j = vt(t, {
          currentLocation: w,
          expectedLocation: g,
          distance: s,
          ignoreLocation: c
      });
      if (u = Math.min(j, u), f = w + m, b) {
          let Y = 0;
          for (; Y < m;) E[w + Y] = 1, Y += 1
      }
  }
  f = -1;
  let I = [],
      $ = 1,
      L = m + h;
  const W = 1 << m - 1;
  for (let j = 0; j < m; j += 1) {
      let Y = 0,
          B = L;
      for (; Y < B;) vt(t, {
          errors: j,
          currentLocation: g + B,
          expectedLocation: g,
          distance: s,
          ignoreLocation: c
      }) <= u ? Y = B : L = B, B = Math.floor((L - Y) / 2 + Y);
      L = B;
      let ne = Math.max(1, g - B + 1),
          _ = r ? h : Math.min(g + B, h) + m,
          S = Array(_ + 2);
      S[_ + 1] = (1 << j) - 1;
      for (let x = _; x >= ne; x -= 1) {
          let O = x - 1,
              N = n[e.charAt(O)];
          if (b && (E[O] = +!!N), S[x] = (S[x + 1] << 1 | 1) & N, j && (S[x] |= (I[x + 1] | I[x]) << 1 | 1 | I[x + 1]), S[x] & W && ($ = vt(t, {
                  errors: j,
                  currentLocation: O,
                  expectedLocation: g,
                  distance: s,
                  ignoreLocation: c
              }), $ <= u)) {
              if (u = $, f = O, f <= g) break;
              ne = Math.max(1, 2 * g - f)
          }
      }
      if (vt(t, {
              errors: j + 1,
              currentLocation: g,
              expectedLocation: g,
              distance: s,
              ignoreLocation: c
          }) > u) break;
      I = S
  }
  const J = {
      isMatch: f >= 0,
      score: Math.max(.001, $)
  };
  if (b) {
      const j = function(Y = [], B = T.minMatchCharLength) {
          let ne = [],
              _ = -1,
              S = -1,
              x = 0;
          for (let O = Y.length; x < O; x += 1) {
              let N = Y[x];
              N && _ === -1 ? _ = x : N || _ === -1 || (S = x - 1, S - _ + 1 >= B && ne.push([_, S]), _ = -1)
          }
          return Y[x - 1] && x - _ >= B && ne.push([_, x - 1]), ne
      }(E, d);
      j.length ? l && (J.indices = j) : J.isMatch = !1
  }
  return J
}

function ts(e) {
  let t = {};
  for (let n = 0, o = e.length; n < o; n += 1) {
      const s = e.charAt(n);
      t[s] = (t[s] || 0) | 1 << o - n - 1
  }
  return t
}
let fo = class {
      constructor(t, {
          location: n = T.location,
          threshold: o = T.threshold,
          distance: s = T.distance,
          includeMatches: i = T.includeMatches,
          findAllMatches: r = T.findAllMatches,
          minMatchCharLength: d = T.minMatchCharLength,
          isCaseSensitive: l = T.isCaseSensitive,
          ignoreLocation: c = T.ignoreLocation
      } = {}) {
          if (this.options = {
                  location: n,
                  threshold: o,
                  distance: s,
                  includeMatches: i,
                  findAllMatches: r,
                  minMatchCharLength: d,
                  isCaseSensitive: l,
                  ignoreLocation: c
              }, this.pattern = l ? t : t.toLowerCase(), this.chunks = [], !this.pattern.length) return;
          const m = (g, u) => {
                  this.chunks.push({
                      pattern: g,
                      alphabet: ts(g),
                      startIndex: u
                  })
              },
              h = this.pattern.length;
          if (h > 32) {
              let g = 0;
              const u = h % 32,
                  f = h - u;
              for (; g < f;) m(this.pattern.substr(g, 32), g), g += 32;
              if (u) {
                  const b = h - 32;
                  m(this.pattern.substr(b), b)
              }
          } else m(this.pattern, 0)
      }
      searchIn(t) {
          const {
              isCaseSensitive: n,
              includeMatches: o
          } = this.options;
          if (n || (t = t.toLowerCase()), this.pattern === t) {
              let f = {
                  isMatch: !0,
                  score: 0
              };
              return o && (f.indices = [
                  [0, t.length - 1]
              ]), f
          }
          const {
              location: s,
              distance: i,
              threshold: r,
              findAllMatches: d,
              minMatchCharLength: l,
              ignoreLocation: c
          } = this.options;
          let m = [],
              h = 0,
              g = !1;
          this.chunks.forEach(({
              pattern: f,
              alphabet: b,
              startIndex: E
          }) => {
              const {
                  isMatch: w,
                  score: I,
                  indices: $
              } = es(t, f, b, {
                  location: s + E,
                  distance: i,
                  threshold: r,
                  findAllMatches: d,
                  minMatchCharLength: l,
                  includeMatches: o,
                  ignoreLocation: c
              });
              w && (g = !0), h += I, w && $ && (m = [...m, ...$])
          });
          let u = {
              isMatch: g,
              score: g ? h / this.chunks.length : 1
          };
          return g && o && (u.indices = m), u
      }
  },
  De = class {
      constructor(t) {
          this.pattern = t
      }
      static isMultiMatch(t) {
          return Rn(t, this.multiRegex)
      }
      static isSingleMatch(t) {
          return Rn(t, this.singleRegex)
      }
      search() {}
  };

function Rn(e, t) {
  const n = e.match(t);
  return n ? n[1] : null
}
class vo extends De {
  constructor(t, {
      location: n = T.location,
      threshold: o = T.threshold,
      distance: s = T.distance,
      includeMatches: i = T.includeMatches,
      findAllMatches: r = T.findAllMatches,
      minMatchCharLength: d = T.minMatchCharLength,
      isCaseSensitive: l = T.isCaseSensitive,
      ignoreLocation: c = T.ignoreLocation
  } = {}) {
      super(t), this._bitapSearch = new fo(t, {
          location: n,
          threshold: o,
          distance: s,
          includeMatches: i,
          findAllMatches: r,
          minMatchCharLength: d,
          isCaseSensitive: l,
          ignoreLocation: c
      })
  }
  static get type() {
      return "fuzzy"
  }
  static get multiRegex() {
      return /^"(.*)"$/
  }
  static get singleRegex() {
      return /^(.*)$/
  }
  search(t) {
      return this._bitapSearch.searchIn(t)
  }
}
let bo = class extends De {
  constructor(t) {
      super(t)
  }
  static get type() {
      return "include"
  }
  static get multiRegex() {
      return /^'"(.*)"$/
  }
  static get singleRegex() {
      return /^'(.*)$/
  }
  search(t) {
      let n, o = 0;
      const s = [],
          i = this.pattern.length;
      for (;
          (n = t.indexOf(this.pattern, o)) > -1;) o = n + i, s.push([n, o - 1]);
      const r = !!s.length;
      return {
          isMatch: r,
          score: r ? 0 : 1,
          indices: s
      }
  }
};
const mn = [class extends De {
      constructor(e) {
          super(e)
      }
      static get type() {
          return "exact"
      }
      static get multiRegex() {
          return /^="(.*)"$/
      }
      static get singleRegex() {
          return /^=(.*)$/
      }
      search(e) {
          const t = e === this.pattern;
          return {
              isMatch: t,
              score: t ? 0 : 1,
              indices: [0, this.pattern.length - 1]
          }
      }
  }, bo, class extends De {
      constructor(e) {
          super(e)
      }
      static get type() {
          return "prefix-exact"
      }
      static get multiRegex() {
          return /^\^"(.*)"$/
      }
      static get singleRegex() {
          return /^\^(.*)$/
      }
      search(e) {
          const t = e.startsWith(this.pattern);
          return {
              isMatch: t,
              score: t ? 0 : 1,
              indices: [0, this.pattern.length - 1]
          }
      }
  }, class extends De {
      constructor(e) {
          super(e)
      }
      static get type() {
          return "inverse-prefix-exact"
      }
      static get multiRegex() {
          return /^!\^"(.*)"$/
      }
      static get singleRegex() {
          return /^!\^(.*)$/
      }
      search(e) {
          const t = !e.startsWith(this.pattern);
          return {
              isMatch: t,
              score: t ? 0 : 1,
              indices: [0, e.length - 1]
          }
      }
  }, class extends De {
      constructor(e) {
          super(e)
      }
      static get type() {
          return "inverse-suffix-exact"
      }
      static get multiRegex() {
          return /^!"(.*)"\$$/
      }
      static get singleRegex() {
          return /^!(.*)\$$/
      }
      search(e) {
          const t = !e.endsWith(this.pattern);
          return {
              isMatch: t,
              score: t ? 0 : 1,
              indices: [0, e.length - 1]
          }
      }
  }, class extends De {
      constructor(e) {
          super(e)
      }
      static get type() {
          return "suffix-exact"
      }
      static get multiRegex() {
          return /^"(.*)"\$$/
      }
      static get singleRegex() {
          return /^(.*)\$$/
      }
      search(e) {
          const t = e.endsWith(this.pattern);
          return {
              isMatch: t,
              score: t ? 0 : 1,
              indices: [e.length - this.pattern.length, e.length - 1]
          }
      }
  }, class extends De {
      constructor(e) {
          super(e)
      }
      static get type() {
          return "inverse-exact"
      }
      static get multiRegex() {
          return /^!"(.*)"$/
      }
      static get singleRegex() {
          return /^!(.*)$/
      }
      search(e) {
          const t = e.indexOf(this.pattern) === -1;
          return {
              isMatch: t,
              score: t ? 0 : 1,
              indices: [0, e.length - 1]
          }
      }
  }, vo],
  jn = mn.length,
  ns = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,
  os = new Set([vo.type, bo.type]);
let ss = class {
  constructor(t, {
      isCaseSensitive: n = T.isCaseSensitive,
      includeMatches: o = T.includeMatches,
      minMatchCharLength: s = T.minMatchCharLength,
      ignoreLocation: i = T.ignoreLocation,
      findAllMatches: r = T.findAllMatches,
      location: d = T.location,
      threshold: l = T.threshold,
      distance: c = T.distance
  } = {}) {
      this.query = null, this.options = {
          isCaseSensitive: n,
          includeMatches: o,
          minMatchCharLength: s,
          findAllMatches: r,
          ignoreLocation: i,
          location: d,
          threshold: l,
          distance: c
      }, this.pattern = n ? t : t.toLowerCase(), this.query = function(m, h = {}) {
          return m.split("|").map(g => {
              let u = g.trim().split(ns).filter(b => b && !!b.trim()),
                  f = [];
              for (let b = 0, E = u.length; b < E; b += 1) {
                  const w = u[b];
                  let I = !1,
                      $ = -1;
                  for (; !I && ++$ < jn;) {
                      const L = mn[$];
                      let W = L.isMultiMatch(w);
                      W && (f.push(new L(W, h)), I = !0)
                  }
                  if (!I)
                      for ($ = -1; ++$ < jn;) {
                          const L = mn[$];
                          let W = L.isSingleMatch(w);
                          if (W) {
                              f.push(new L(W, h));
                              break
                          }
                      }
              }
              return f
          })
      }(this.pattern, this.options)
  }
  static condition(t, n) {
      return n.useExtendedSearch
  }
  searchIn(t) {
      const n = this.query;
      if (!n) return {
          isMatch: !1,
          score: 1
      };
      const {
          includeMatches: o,
          isCaseSensitive: s
      } = this.options;
      t = s ? t : t.toLowerCase();
      let i = 0,
          r = [],
          d = 0;
      for (let l = 0, c = n.length; l < c; l += 1) {
          const m = n[l];
          r.length = 0, i = 0;
          for (let h = 0, g = m.length; h < g; h += 1) {
              const u = m[h],
                  {
                      isMatch: f,
                      indices: b,
                      score: E
                  } = u.search(t);
              if (!f) {
                  d = 0, i = 0, r.length = 0;
                  break
              }
              if (i += 1, d += E, o) {
                  const w = u.constructor.type;
                  os.has(w) ? r = [...r, ...b] : r.push(b)
              }
          }
          if (i) {
              let h = {
                  isMatch: !0,
                  score: d / i
              };
              return o && (h.indices = r), h
          }
      }
      return {
          isMatch: !1,
          score: 1
      }
  }
};
const pn = [];

function fn(e, t) {
  for (let n = 0, o = pn.length; n < o; n += 1) {
      let s = pn[n];
      if (s.condition(e, t)) return new s(e, t)
  }
  return new fo(e, t)
}
const En = "$and",
  is = "$or",
  Bn = "$path",
  rs = "$val",
  Vt = e => !(!e[En] && !e[is]),
  zn = e => ({
      [En]: Object.keys(e).map(t => ({
          [t]: e[t]
      }))
  });

function as(e, t, {
  auto: n = !0
} = {}) {
  const o = s => {
      let i = Object.keys(s);
      const r = (l => !!l[Bn])(s);
      if (!r && i.length > 1 && !Vt(s)) return o(zn(s));
      if ((l => !Me(l) && ho(l) && !Vt(l))(s)) {
          const l = r ? s[Bn] : i[0],
              c = r ? s[rs] : s[l];
          if (!_e(c)) throw new Error((h => `Invalid value for key ${h}`)(l));
          const m = {
              keyId: gn(l),
              pattern: c
          };
          return n && (m.searcher = fn(c, t)), m
      }
      let d = {
          children: [],
          operator: i[0]
      };
      return i.forEach(l => {
          const c = s[l];
          Me(c) && c.forEach(m => {
              d.children.push(o(m))
          })
      }), d
  };
  return Vt(e) || (e = zn(e)), o(e)
}

function ls(e, t) {
  const n = e.matches;
  t.matches = [], ce(n) && n.forEach(o => {
      if (!ce(o.indices) || !o.indices.length) return;
      const {
          indices: s,
          value: i
      } = o;
      let r = {
          indices: s,
          value: i
      };
      o.key && (r.key = o.key.src), o.idx > -1 && (r.refIndex = o.idx), t.matches.push(r)
  })
}

function ds(e, t) {
  t.score = e.score
}
let ot = class {
  constructor(t, n = {}, o) {
      this.options = {
          ...T,
          ...n
      }, this.options.useExtendedSearch, this._keyStore = new Zo(this.options.keys), this.setCollection(t, o)
  }
  setCollection(t, n) {
      if (this._docs = t, n && !(n instanceof kn)) throw new Error("Incorrect 'index' type");
      this._myIndex = n || po(this.options.keys, this._docs, {
          getFn: this.options.getFn,
          fieldNormWeight: this.options.fieldNormWeight
      })
  }
  add(t) {
      ce(t) && (this._docs.push(t), this._myIndex.add(t))
  }
  remove(t = () => !1) {
      const n = [];
      for (let o = 0, s = this._docs.length; o < s; o += 1) {
          const i = this._docs[o];
          t(i, o) && (this.removeAt(o), o -= 1, s -= 1, n.push(i))
      }
      return n
  }
  removeAt(t) {
      this._docs.splice(t, 1), this._myIndex.removeAt(t)
  }
  getIndex() {
      return this._myIndex
  }
  search(t, {
      limit: n = -1
  } = {}) {
      const {
          includeMatches: o,
          includeScore: s,
          shouldSort: i,
          sortFn: r,
          ignoreFieldNorm: d
      } = this.options;
      let l = _e(t) ? _e(this._docs[0]) ? this._searchStringList(t) : this._searchObjectList(t) : this._searchLogical(t);
      return function(c, {
              ignoreFieldNorm: m = T.ignoreFieldNorm
          }) {
              c.forEach(h => {
                  let g = 1;
                  h.matches.forEach(({
                      key: u,
                      norm: f,
                      score: b
                  }) => {
                      const E = u ? u.weight : null;
                      g *= Math.pow(b === 0 && E ? Number.EPSILON : b, (E || 1) * (m ? 1 : f))
                  }), h.score = g
              })
          }(l, {
              ignoreFieldNorm: d
          }), i && l.sort(r), uo(n) && n > -1 && (l = l.slice(0, n)),
          function(c, m, {
              includeMatches: h = T.includeMatches,
              includeScore: g = T.includeScore
          } = {}) {
              const u = [];
              return h && u.push(ls), g && u.push(ds), c.map(f => {
                  const {
                      idx: b
                  } = f, E = {
                      item: m[b],
                      refIndex: b
                  };
                  return u.length && u.forEach(w => {
                      w(f, E)
                  }), E
              })
          }(l, this._docs, {
              includeMatches: o,
              includeScore: s
          })
  }
  _searchStringList(t) {
      const n = fn(t, this.options),
          {
              records: o
          } = this._myIndex,
          s = [];
      return o.forEach(({
          v: i,
          i: r,
          n: d
      }) => {
          if (!ce(i)) return;
          const {
              isMatch: l,
              score: c,
              indices: m
          } = n.searchIn(i);
          l && s.push({
              item: i,
              idx: r,
              matches: [{
                  score: c,
                  value: i,
                  norm: d,
                  indices: m
              }]
          })
      }), s
  }
  _searchLogical(t) {
      const n = as(t, this.options),
          o = (d, l, c) => {
              if (!d.children) {
                  const {
                      keyId: h,
                      searcher: g
                  } = d, u = this._findMatches({
                      key: this._keyStore.get(h),
                      value: this._myIndex.getValueForItemAtKeyId(l, h),
                      searcher: g
                  });
                  return u && u.length ? [{
                      idx: c,
                      item: l,
                      matches: u
                  }] : []
              }
              const m = [];
              for (let h = 0, g = d.children.length; h < g; h += 1) {
                  const u = d.children[h],
                      f = o(u, l, c);
                  if (f.length) m.push(...f);
                  else if (d.operator === En) return []
              }
              return m
          },
          s = this._myIndex.records,
          i = {},
          r = [];
      return s.forEach(({
          $: d,
          i: l
      }) => {
          if (ce(d)) {
              let c = o(n, d, l);
              c.length && (i[l] || (i[l] = {
                  idx: l,
                  item: d,
                  matches: []
              }, r.push(i[l])), c.forEach(({
                  matches: m
              }) => {
                  i[l].matches.push(...m)
              }))
          }
      }), r
  }
  _searchObjectList(t) {
      const n = fn(t, this.options),
          {
              keys: o,
              records: s
          } = this._myIndex,
          i = [];
      return s.forEach(({
          $: r,
          i: d
      }) => {
          if (!ce(r)) return;
          let l = [];
          o.forEach((c, m) => {
              l.push(...this._findMatches({
                  key: c,
                  value: r[m],
                  searcher: n
              }))
          }), l.length && i.push({
              idx: d,
              item: r,
              matches: l
          })
      }), i
  }
  _findMatches({
      key: t,
      value: n,
      searcher: o
  }) {
      if (!ce(n)) return [];
      let s = [];
      if (Me(n)) n.forEach(({
          v: i,
          i: r,
          n: d
      }) => {
          if (!ce(i)) return;
          const {
              isMatch: l,
              score: c,
              indices: m
          } = o.searchIn(i);
          l && s.push({
              score: c,
              key: t,
              value: i,
              idx: r,
              norm: d,
              indices: m
          })
      });
      else {
          const {
              v: i,
              n: r
          } = n, {
              isMatch: d,
              score: l,
              indices: c
          } = o.searchIn(i);
          d && s.push({
              score: l,
              key: t,
              value: i,
              norm: r,
              indices: c
          })
      }
      return s
  }
};
ot.version = "6.6.2", ot.createIndex = po, ot.parseIndex = function(e, {
      getFn: t = T.getFn,
      fieldNormWeight: n = T.fieldNormWeight
  } = {}) {
      const {
          keys: o,
          records: s
      } = e, i = new kn({
          getFn: t,
          fieldNormWeight: n
      });
      return i.setKeys(o), i.setIndexRecords(s), i
  }, ot.config = T,
  function(...e) {
      pn.push(...e)
  }(ss);
const Un = [{
      id: "recentlyUsed",
      name: chrome.i18n.getMessage("recentlyUsed"),
      addonIds: [],
      expanded: !0,
      iframeShow: !0,
      fullscreenShow: !1
  }, {
      id: "runningOnTab",
      name: chrome.i18n.getMessage("runningOnThisPage"),
      addonIds: [],
      expanded: !0,
      iframeShow: !0,
      fullscreenShow: !1
  }, {
      id: "_iframeSearch",
      name: "",
      addonIds: [],
      expanded: !0,
      iframeShow: !0,
      fullscreenShow: !1
  }, {
      id: "featuredNew",
      name: chrome.i18n.getMessage("featuredNew"),
      addonIds: [],
      expanded: !0,
      iframeShow: !1,
      fullscreenShow: !0,
      customOrder: ["new", "updated"]
  }, {
      id: "new",
      name: chrome.i18n.getMessage("newGroup"),
      addonIds: [],
      expanded: new URLSearchParams(window.location.search).get("source") === "updatenotif",
      iframeShow: !1,
      fullscreenShow: !0,
      customOrder: ["new", "updated"]
  }, {
      id: "enabled",
      name: chrome.i18n.getMessage("enabled"),
      addonIds: [],
      expanded: !0,
      iframeShow: !0,
      fullscreenShow: !0
  }, {
      id: "recommended",
      name: chrome.i18n.getMessage("recommended"),
      addonIds: [],
      expanded: !0,
      iframeShow: !1,
      fullscreenShow: !0
  }, {
      id: "featured",
      name: chrome.i18n.getMessage("featured"),
      addonIds: [],
      expanded: !0,
      iframeShow: !1,
      fullscreenShow: !0
  }, {
      id: "forums",
      name: chrome.i18n.getMessage("forums"),
      addonIds: [],
      expanded: !1,
      iframeShow: !1,
      fullscreenShow: !0
  }, {
      id: "others",
      name: chrome.i18n.getMessage("others"),
      addonIds: [],
      expanded: !0,
      iframeShow: !1,
      fullscreenShow: !0
  }, {
      id: "beta",
      name: chrome.i18n.getMessage("beta"),
      addonIds: [],
      expanded: !1,
      iframeShow: !1,
      fullscreenShow: !0
  }],
  cs = [{
      id: "all",
      icon: "list",
      name: chrome.i18n.getMessage("all")
  }, {
      id: "editor",
      icon: "puzzle",
      name: chrome.i18n.getMessage("editorFeatures")
  }, {
      id: "codeEditor",
      parent: "editor",
      icon: "code",
      name: chrome.i18n.getMessage("codeEditorFeatures")
  }, {
      id: "costumeEditor",
      parent: "editor",
      icon: "brush2",
      name: chrome.i18n.getMessage("costumeEditorFeatures")
  }, {
      id: "projectPlayer",
      parent: "editor",
      icon: "player",
      name: chrome.i18n.getMessage("projectPlayerFeatures")
  }, {
      id: "editorOthers",
      parent: "editor",
      icon: "dots",
      name: chrome.i18n.getMessage("others")
  }, {
      id: "community",
      icon: "web",
      name: chrome.i18n.getMessage("websiteFeatures")
  }, {
      id: "projectPage",
      parent: "community",
      icon: "projectpage",
      name: chrome.i18n.getMessage("projectPageFeatures")
  }, {
      id: "profiles",
      parent: "community",
      icon: "users",
      name: chrome.i18n.getMessage("profilesFeatures")
  }, {
      id: "forums",
      parent: "community",
      icon: "forum",
      name: chrome.i18n.getMessage("forums")
  }, {
      id: "communityOthers",
      parent: "community",
      icon: "dots",
      name: chrome.i18n.getMessage("others")
  }, {
      id: "theme",
      icon: "brush",
      name: chrome.i18n.getMessage("themes")
  }, {
      id: "themesForEditor",
      parent: "theme",
      icon: "puzzle",
      name: chrome.i18n.getMessage("editorThemes")
  }, {
      id: "themesForWebsite",
      parent: "theme",
      icon: "web",
      name: chrome.i18n.getMessage("websiteThemes")
  }, {
      id: "popup",
      icon: "popup",
      name: chrome.i18n.getMessage("popupFeatures"),
      marginBottom: !0
  }],
  us = {
      name: "",
      description: "",
      tags: [],
      _categories: ["editor"],
      _icon: "editor",
      _displayedAddonId: "",
      _enabled: !0,
      _addonId: "example",
      _groups: ["enabled"]
  },
  yo = [{
      name: "danger",
      tooltipText: "dangerTooltip",
      matchName: "danger",
      color: "darkred",
      iframeAlwaysShow: !0
  }, {
      name: "recommended",
      tooltipText: "recommendedTooltip",
      matchName: "recommended",
      color: "blue"
  }, {
      name: "new",
      matchName: "new",
      color: "purple"
  }, {
      name: "updated",
      matchName: "updated",
      color: "purple"
  }, {
      name: "updatedWithSettings",
      matchName: "updatedWithSettings",
      color: "purple"
  }, {
      name: "beta",
      tooltipText: "betaTooltip",
      matchName: "beta",
      color: "red",
      iframeAlwaysShow: !0
  }, {
      name: "forums",
      tooltipText: "forumsTooltip",
      matchName: "forums",
      color: "green"
  }, {
      name: "forEditor",
      matchName: "editor",
      color: "darkgreen",
      addonTabShow: {
          theme: !0
      }
  }, {
      name: "forWebsite",
      matchName: "community",
      color: "yellow",
      addonTabShow: {
          theme: !0
      }
  }],
  hs = {
      includeScore: !0,
      threshold: .35,
      ignoreLocation: !0,
      useExtendedSearch: !0,
      keys: [{
          name: "name",
          weight: 1
      }, {
          name: "_addonId",
          weight: 1
      }, {
          name: "description",
          weight: .5
      }, {
          name: "_english.name",
          weight: .8
      }, {
          name: "_english.description",
          weight: .3
      }, {
          name: "credits.name",
          weight: .2
      }, {
          name: "info.text",
          weight: .1
      }]
  },
  Hn = [];

function Mn(e) {
  const t = e.split("-")[0];
  return Hn.includes(e) || Hn.includes(t) ? "rtl" : "ltr"
}

function gs(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
}
var Cn = {
  exports: {}
};

function In() {}
In.prototype = {
  on: function(e, t, n) {
      var o = this.e || (this.e = {});
      return (o[e] || (o[e] = [])).push({
          fn: t,
          ctx: n
      }), this
  },
  once: function(e, t, n) {
      var o = this;

      function s() {
          o.off(e, s), t.apply(n, arguments)
      }
      return s._ = t, this.on(e, s, n)
  },
  emit: function(e) {
      var t = [].slice.call(arguments, 1),
          n = ((this.e || (this.e = {}))[e] || []).slice(),
          o = 0,
          s = n.length;
      for (o; o < s; o++) n[o].fn.apply(n[o].ctx, t);
      return this
  },
  off: function(e, t) {
      var n = this.e || (this.e = {}),
          o = n[e],
          s = [];
      if (o && t)
          for (var i = 0, r = o.length; i < r; i++) o[i].fn !== t && o[i].fn._ !== t && s.push(o[i]);
      return s.length ? n[e] = s : delete n[e], this
  }
};
Cn.exports = In;
Cn.exports.TinyEmitter = In;
var ms = Cn.exports,
  ps = ms,
  fs = new ps;
const bt = gs(fs),
  Pe = {
      $on: (...e) => bt.on(...e),
      $once: (...e) => bt.once(...e),
      $off: (...e) => bt.off(...e),
      $emit: (...e) => bt.emit(...e)
  },
  vs = (e, t) => new Promise(n => {
      chrome.tabs.query({
          currentWindow: !0,
          active: !0
      }, o => {
          o[0].id && chrome.tabs.sendMessage(o[0].id, "getRunningAddons", {
              frameId: 0
          }, s => {
              chrome.runtime.lastError;
              const i = s ? [...s.userscripts, ...s.userstyles] : [],
                  r = s ? s.disabledDynamicAddons : [];
              n({
                  addonsCurrentlyOnTab: i,
                  addonsPreviouslyOnTab: r
              })
          })
      })
  }),
  bs = /\d|[a-d]/,
  ys = /[e-k]/,
  ws = (e, t) => {
      var i;
      const n = JSON.parse(JSON.stringify(e)),
          o = t && t.reduce((r, d) => (r[d._addonId || d.addonId] = d.manifest || d, r), {}),
          s = {
              addonSettings1: {},
              addonSettings2: {},
              addonSettings3: {}
          };
      for (const [r, d] of Object.entries(n)) {
          if (o && !o[r]) delete n[r];
          else {
              for (const l of Object.keys(d)) o && !l.startsWith("_") && !((i = o[r].settings) != null && i.some(c => l === c.id)) && delete d[l];
              Object.keys(d).length === 0 && delete n[r]
          }
          r[0].match(bs) ? s.addonSettings1[r] = n[r] : r[0].match(ys) ? s.addonSettings2[r] = n[r] : s.addonSettings3[r] = n[r]
      }
      return s
  },
  Tt = e => (...t) => new Promise(n => e(...t, n)),
  Ut = ["notifications"];
typeof browser < "u" && Ut.push("clipboardWrite");
let Ze = null;
const _s = async (e, t, n) => {
  const o = JSON.parse(e),
      s = Tt(chrome.storage.sync.get.bind(chrome.storage.sync)),
      i = Tt(chrome.storage.sync.set.bind(chrome.storage.sync)),
      {
          addonsEnabled: r,
          ...d
      } = await s(["addonSettings1", "addonSettings2", "addonSettings3", "addonsEnabled"]),
      l = {
          ...d.addonSettings1,
          ...d.addonSettings2,
          ...d.addonSettings3
      },
      c = {};
  for (const g of Object.keys(o.addons)) {
      const u = o.addons[g],
          f = t.find(w => w._addonId === g);
      if (!f) continue;
      const E = (f.permissions || []).filter(w => Ut.includes(w));
      u.enabled && E.length ? c[g] = E : r[g] = u.enabled, l[g] = Object.assign({}, l[g]), delete l[g]._version, Object.assign(l[g], u.settings)
  }
  Ze && n.removeEventListener("click", Ze, {
      once: !0
  });
  let m = null;
  const h = new Promise(g => {
      m = g
  });
  return Ze = async () => {
      if (Ze = null, Object.keys(c).length) {
          const u = await Tt(chrome.permissions.request.bind(chrome.permissions))({
              permissions: Object.values(c).flat()
          });
          Object.keys(c).forEach(f => {
              r[f] = u
          })
      }
      const g = chrome.runtime.getManifest().version_name.endsWith("-prerelease");
      await i({
          globalTheme: !!o.core.lightTheme,
          addonsEnabled: r,
          ...ws(l, g ? null : t)
      }), m()
  }, n.classList.remove("hidden-button"), n.addEventListener("click", Ze, {
      once: !0
  }), h
}, Wn = async () => {
  const t = await Tt(chrome.storage.sync.get.bind(chrome.storage.sync))(["globalTheme", "addonSettings1", "addonSettings2", "addonSettings3", "addonsEnabled"]),
      n = {
          ...t.addonSettings1,
          ...t.addonSettings2,
          ...t.addonSettings3
      },
      o = {
          core: {
              lightTheme: t.globalTheme,
              version: chrome.runtime.getManifest().version_name
          },
          addons: {}
      };
  for (const s of Object.keys(t.addonsEnabled)) o.addons[s] = {
      enabled: t.addonsEnabled[s],
      settings: n[s] || {}
  };
  return JSON.stringify(o)
}, wo = "/webpages/dist/assets/close.svg";
const Ss = {
      props: ["modelValue", "title"],
      data() {
          return {
              canCloseOutside: !1
          }
      },
      watch: {
          modelValue(e) {
              e ? setTimeout(() => {
                  this.canCloseOutside = !0
              }, 100) : this.canCloseOutside = !1
          }
      },
      computed: {
          isOpen: {
              get() {
                  return this.modelValue
              },
              set(e) {
                  this.$emit("update:modelValue", e)
              }
          }
      },
      methods: {
          msg(...e) {
              return this.$root.msg(...e)
          },
          clickOutside(e) {
              this.isOpen && this.canCloseOutside && e.isTrusted && (this.isOpen = !1)
          }
      }
  },
  xs = {
      class: "modal"
  },
  ks = {
      class: "modal-content"
  },
  Es = ["title"];

function Ms(e, t, n, o, s, i) {
  const r = Nt("click-outside");
  return R((p(), v("div", xs, [R((p(), v("div", ks, [a("div", null, [a("img", {
      onClick: t[0] || (t[0] = d => i.isOpen = !1),
      class: "close",
      title: i.msg("close"),
      src: wo
  }, null, 8, Es), a("h1", null, k(n.title), 1)]), tt(e.$slots, "default")])), [
      [r, i.clickOutside]
  ])], 512)), [
      [ee, i.isOpen]
  ])
}
const Cs = ve(Ss, [
  ["render", Ms]
]);

function Be(e, t, n) {
  return Math.max(t, Math.min(e, n))
}

function se(e, t = 2) {
  return e.toFixed(t).replace(/\.?0+$/, "")
}

function Gn(e) {
  return e.endsWith(".") ? NaN : (parseFloat(e) % 360 + 360) % 360 / 360
}

function Vn(e) {
  return se(360 * e)
}

function Ye(e) {
  if (!e.endsWith("%")) return NaN;
  const t = e.substring(0, e.length - 1);
  if (t.endsWith(".")) return NaN;
  const n = parseFloat(t);
  return Number.isNaN(n) ? NaN : Be(n, 0, 100) / 100
}

function yt(e) {
  return se(100 * e) + "%"
}

function Xt(e) {
  if (e.endsWith("%")) return Ye(e);
  if (e.endsWith(".")) return NaN;
  const t = parseFloat(e);
  return Number.isNaN(t) ? NaN : Be(t, 0, 255) / 255
}

function Yt(e) {
  return se(255 * e)
}

function qt(e) {
  return e.endsWith("%") ? Ye(e) : Be(parseFloat(e), 0, 1)
}

function Kt(e) {
  return String(e)
}
const vn = {
  hsl: {
      h: {
          to: Vn,
          from: Gn
      },
      s: {
          to: yt,
          from: Ye
      },
      l: {
          to: yt,
          from: Ye
      },
      a: {
          to: Kt,
          from: qt
      }
  },
  hwb: {
      h: {
          to: Vn,
          from: Gn
      },
      w: {
          to: yt,
          from: Ye
      },
      b: {
          to: yt,
          from: Ye
      },
      a: {
          to: Kt,
          from: qt
      }
  },
  rgb: {
      r: {
          to: Yt,
          from: Xt
      },
      g: {
          to: Yt,
          from: Xt
      },
      b: {
          to: Yt,
          from: Xt
      },
      a: {
          to: Kt,
          from: qt
      }
  }
};

function wt(e) {
  const t = e.replace(/^#/, ""),
      n = [],
      o = t.length > 4 ? 2 : 1;
  for (let i = 0; i < t.length; i += o) {
      const r = t.slice(i, i + o);
      n.push(r.repeat(o % 2 + 1))
  }
  n.length === 3 && n.push("ff");
  const s = n.map(i => parseInt(i, 16) / 255);
  return {
      r: s[0],
      g: s[1],
      b: s[2],
      a: s[3]
  }
}

function Jt(e) {
  const t = e.l < .5 ? e.l * (1 + e.s) : e.l + e.s - e.l * e.s,
      n = 2 * e.l - t;
  return {
      r: Zt(n, t, e.h + 1 / 3),
      g: Zt(n, t, e.h),
      b: Zt(n, t, e.h - 1 / 3),
      a: e.a
  }
}

function Zt(e, t, n) {
  return n < 0 ? n += 1 : n > 1 && (n -= 1), n < 1 / 6 ? e + 6 * (t - e) * n : n < .5 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e
}

function Qe(e) {
  return {
      r: Qt(5, e),
      g: Qt(3, e),
      b: Qt(1, e),
      a: e.a
  }
}

function Qt(e, t) {
  const n = (e + 6 * t.h) % 6;
  return t.v - t.v * t.s * Math.max(0, Math.min(n, 4 - n, 1))
}

function ze(e) {
  return {
      h: e.h,
      s: e.b === 1 ? 0 : 1 - e.w / (1 - e.b),
      v: 1 - e.b,
      a: e.a
  }
}

function Ge(e) {
  const t = Math.min(e.r, e.g, e.b),
      n = Math.max(e.r, e.g, e.b);
  let o;
  return o = n === t ? 0 : n === e.r ? (0 + (e.g - e.b) / (n - t)) / 6 : n === e.g ? (2 + (e.b - e.r) / (n - t)) / 6 : (4 + (e.r - e.g) / (n - t)) / 6, o < 0 && (o += 1), {
      h: o,
      w: t,
      b: 1 - n,
      a: e.a
  }
}

function en(e) {
  const t = Ge(e),
      n = t.w,
      o = 1 - t.b,
      s = (o + n) / 2;
  let i;
  return i = o === 0 || n === 1 ? 0 : (o - s) / Math.min(s, 1 - s), {
      h: t.h,
      s: i,
      l: s,
      a: e.a
  }
}

function _t(e) {
  return "#" + Object.values(e).map(t => {
      const n = 255 * t,
          o = Math.round(n).toString(16);
      return o.length === 1 ? "0" + o : o
  }).join("")
}
const Is = {
  hex: [
      ["hsl", e => be(e, [wt, en])],
      ["hsv", e => be(e, [wt, Ge, ze])],
      ["hwb", e => be(e, [wt, Ge])],
      ["rgb", wt]
  ],
  hsl: [
      ["hex", e => be(e, [Jt, _t])],
      ["hsv", function(e) {
          const t = e.l + e.s * Math.min(e.l, 1 - e.l),
              n = t === 0 ? 0 : 2 - 2 * e.l / t;
          return {
              h: e.h,
              s: n,
              v: t,
              a: e.a
          }
      }],
      ["hwb", e => be(e, [Jt, Ge])],
      ["rgb", Jt]
  ],
  hsv: [
      ["hex", e => be(e, [Qe, _t])],
      ["hsl", function(e) {
          const t = e.v - e.v * e.s / 2,
              n = Math.min(t, 1 - t),
              o = n === 0 ? 0 : (e.v - t) / n;
          return {
              h: e.h,
              s: o,
              l: t,
              a: e.a
          }
      }],
      ["hwb", function(e) {
          return {
              h: e.h,
              w: (1 - e.s) * e.v,
              b: 1 - e.v,
              a: e.a
          }
      }],
      ["rgb", Qe]
  ],
  hwb: [
      ["hex", e => be(e, [ze, Qe, _t])],
      ["hsl", e => be(e, [ze, Qe, en])],
      ["hsv", ze],
      ["rgb", e => be(e, [ze, Qe])]
  ],
  rgb: [
      ["hex", _t],
      ["hsl", en],
      ["hsv", e => be(e, [Ge, ze])],
      ["hwb", Ge]
  ]
};

function be(e, t) {
  return t.reduce((n, o) => o(n), e)
}

function St(e) {
  const t = {};
  for (const n in e) t[n] = e[n];
  return t
}
const Ts = {
  hex: (e, t) => t && [5, 9].includes(e.length) ? e.substring(0, e.length - (e.length - 1) / 4) : e,
  hsl: (e, t) => `hsl(${se(360*e.h)} ${se(100*e.s)}% ${se(100*e.l)}%` + (t ? ")" : ` / ${se(e.a)})`),
  hwb: (e, t) => `hwb(${se(360*e.h)} ${se(100*e.w)}% ${se(100*e.b)}%` + (t ? ")" : ` / ${se(e.a)})`),
  rgb: (e, t) => `rgb(${se(255*e.r)} ${se(255*e.g)} ${se(255*e.b)}` + (t ? ")" : ` / ${se(e.a)})`)
};

function Xn(e, t, n) {
  return Ts[t](e, n)
}

function _o(e) {
  return /^#(?:(?:[A-F0-9]{2}){3,4}|[A-F0-9]{3,4})$/i.test(e)
}

function $s(e) {
  if (typeof e != "string") return {
      format: function(l) {
          return Object.prototype.hasOwnProperty.call(l, "r") ? "rgb" : Object.prototype.hasOwnProperty.call(l, "w") ? "hwb" : Object.prototype.hasOwnProperty.call(l, "v") ? "hsv" : "hsl"
      }(e),
      color: e
  };
  if (_o(e)) return {
      format: "hex",
      color: e
  };
  if (!e.includes("(")) {
      const d = document.createElement("canvas").getContext("2d");
      d.fillStyle = e;
      const l = d.fillStyle;
      return l === "#000000" && e !== "black" ? null : {
          format: "hex",
          color: l
      }
  }
  const [t, n] = e.split("("), o = t.substring(0, 3), s = n.replace(/[,/)]/g, " ").replace(/\s+/g, " ").trim().split(" ");
  s.length === 3 && s.push("1");
  const i = (o + "a").split(""),
      r = Object.fromEntries(i.map((d, l) => [d, vn[o][d].from(s[l])]));
  return {
      format: o,
      color: r
  }
}
const tn = ["hex", "hsl", "hwb", "rgb"],
  Os = ["show", "hide"],
  Ds = {
      class: "vacp-range-input-group"
  },
  As = ["for"],
  Ls = {
      class: "vacp-range-input-label-text vacp-range-input-label-text--hue"
  },
  Ns = ["id", "value"],
  Ps = ["for"],
  Fs = {
      class: "vacp-range-input-label-text vacp-range-input-label-text--alpha"
  },
  Rs = ["id", "value"],
  js = a("span", {
      class: "vacp-visually-hidden"
  }, "Copy color", -1),
  Bs = a("svg", {
      class: "vacp-icon",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true",
      width: "24",
      height: "24",
      viewBox: "0 0 32 32"
  }, [a("path", {
      d: "M25.313 28v-18.688h-14.625v18.688h14.625zM25.313 6.688c1.438 0 2.688 1.188 2.688 2.625v18.688c0 1.438-1.25 2.688-2.688 2.688h-14.625c-1.438 0-2.688-1.25-2.688-2.688v-18.688c0-1.438 1.25-2.625 2.688-2.625h14.625zM21.313 1.313v2.688h-16v18.688h-2.625v-18.688c0-1.438 1.188-2.688 2.625-2.688h16z",
      fill: "currentColor"
  })], -1),
  zs = {
      class: "vacp-color-inputs"
  },
  Us = {
      class: "vacp-color-input-group"
  },
  Hs = ["for"],
  Ws = a("span", {
      class: "vacp-color-input-label-text"
  }, " Hex ", -1),
  Gs = ["id", "value"],
  Vs = ["id", "for", "onInput"],
  Xs = {
      class: "vacp-color-input-label-text"
  },
  Ys = ["id", "value", "onInput"],
  qs = a("span", {
      class: "vacp-visually-hidden"
  }, "Switch format", -1),
  Ks = a("svg", {
      class: "vacp-icon",
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "15"
  }, [a("path", {
      d: "M8 15l5-5-1-1-4 2-4-2-1 1zm4-9l1-1-5-5-5 5 1 1 4-2z",
      fill: "currentColor"
  })], -1);
var So = {
  __name: "ColorPicker",
  props: {
      color: {
          type: [String, Object],
          default: "#ffffffff"
      },
      id: {
          type: String,
          default: "color-picker"
      },
      visibleFormats: {
          type: Array,
          default: () => tn,
          validator: e => e.length > 0 && e.every(t => tn.includes(t))
      },
      defaultFormat: {
          type: String,
          default: "hsl",
          validator: e => tn.includes(e)
      },
      alphaChannel: {
          type: String,
          default: "show",
          validator: e => Os.includes(e)
      }
  },
  emits: ["color-change"],
  setup(e, {
      emit: t
  }) {
      const n = e,
          o = We(null),
          s = We(null),
          i = We(null),
          r = We(!1),
          d = We(n.visibleFormats.includes(n.defaultFormat) ? n.defaultFormat : n.visibleFormats[0]),
          l = Uo({
              hex: "#ffffffff",
              hsl: {
                  h: 0,
                  s: 0,
                  l: 1,
                  a: 1
              },
              hsv: {
                  h: 0,
                  s: 0,
                  v: 1,
                  a: 1
              },
              hwb: {
                  h: 0,
                  w: 1,
                  b: 0,
                  a: 1
              },
              rgb: {
                  r: 1,
                  g: 1,
                  b: 1,
                  a: 1
              }
          }),
          c = Ln(function() {
              const _ = Object.keys(l[d.value]);
              return d.value !== "hex" && n.alphaChannel === "hide" ? _.slice(0, 3) : _
          }),
          m = Ln(function() {
              return n.alphaChannel === "hide" && [5, 9].includes(l.hex.length) ? l.hex.substring(0, l.hex.length - (l.hex.length - 1) / 4) : l.hex
          });

      function h() {
          const _ = (n.visibleFormats.findIndex(S => S === d.value) + 1) % n.visibleFormats.length;
          d.value = n.visibleFormats[_]
      }

      function g(_) {
          r.value = !0, b(_)
      }

      function u(_) {
          r.value = !0, E(_)
      }

      function f() {
          r.value = !1
      }

      function b(_) {
          _.buttons === 1 && r.value !== !1 && s.value instanceof HTMLElement && w(s.value, _.clientX, _.clientY)
      }

      function E(_) {
          if (r.value === !1 || !(s.value instanceof HTMLElement)) return;
          _.preventDefault();
          const S = _.touches[0];
          w(s.value, S.clientX, S.clientY)
      }

      function w(_, S, x) {
          const O = function(q, $e, ke) {
                  const Oe = q.getBoundingClientRect(),
                      An = $e - Oe.left,
                      ft = ke - Oe.top;
                  return {
                      x: Oe.width === 0 ? 0 : Be(An / Oe.width, 0, 1),
                      y: Oe.height === 0 ? 0 : Be(1 - ft / Oe.height, 0, 1)
                  }
              }(_, S, x),
              N = St(l.hsv);
          N.s = O.x, N.v = O.y, j("hsv", N)
      }

      function I(_) {
          if (!["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(_.key)) return;
          _.preventDefault();
          const S = ["ArrowLeft", "ArrowDown"].includes(_.key) ? -1 : 1,
              x = ["ArrowLeft", "ArrowRight"].includes(_.key) ? "s" : "v",
              O = _.shiftKey ? 10 : 1,
              N = l.hsv[x] + S * O * .01,
              q = St(l.hsv);
          q[x] = Be(N, 0, 1), j("hsv", q)
      }

      function $(_) {
          const S = $s(_);
          S !== null && j(S.format, S.color)
      }

      function L(_, S) {
          const x = _.currentTarget,
              O = St(l.hsv);
          O[S] = parseInt(x.value) / parseInt(x.max), j("hsv", O)
      }

      function W(_) {
          const S = _.target;
          _o(S.value) && j("hex", S.value)
      }

      function J(_, S) {
          const x = _.target,
              O = St(l[d.value]),
              N = vn[d.value][S].from(x.value);
          Number.isNaN(N) || N === void 0 || (O[S] = N, j(d.value, O))
      }

      function j(_, S) {
          let x = S;
          if (n.alphaChannel === "hide")
              if (typeof S != "string") S.a = 1, x = S;
              else if ([5, 9].includes(S.length)) {
              const O = (S.length - 1) / 4;
              x = S.substring(0, S.length - O) + "f".repeat(O)
          } else [4, 7].includes(S.length) && (x = S + "f".repeat((S.length - 1) / 3));
          if (! function(O, N) {
                  if (typeof O == "string" || typeof N == "string") return O === N;
                  for (const q in O)
                      if (O[q] !== N[q]) return !1;
                  return !0
              }(l[_], x)) {
              (function(N, q) {
                  l[N] = q;
                  for (const [$e, ke] of Is[N]) l[$e] = ke(l[N])
              })(_, x);
              const O = function() {
                  const N = n.alphaChannel === "hide",
                      q = Xn(l[d.value], d.value, N);
                  return {
                      colors: l,
                      cssColor: q
                  }
              }();
              t("color-change", O)
          }(function() {
              o.value instanceof HTMLElement && s.value instanceof HTMLElement && i.value instanceof HTMLElement && (o.value.style.setProperty("--vacp-hsl-h", String(l.hsl.h)), o.value.style.setProperty("--vacp-hsl-s", String(l.hsl.s)), o.value.style.setProperty("--vacp-hsl-l", String(l.hsl.l)), o.value.style.setProperty("--vacp-hsl-a", String(l.hsl.a)), s.value.style.position = "relative", s.value.style.backgroundColor = "hsl(calc(var(--vacp-hsl-h) * 360) 100% 50%)", s.value.style.backgroundImage = "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)", i.value.style.boxSizing = "border-box", i.value.style.position = "absolute", i.value.style.left = 100 * l.hsv.s + "%", i.value.style.bottom = 100 * l.hsv.v + "%")
          })()
      }
      async function Y() {
          const _ = l[d.value],
              S = n.alphaChannel === "hide",
              x = Xn(_, d.value, S);
          await window.navigator.clipboard.writeText(x)
      }

      function B(_, S) {
          return vn[_][S].to(l[_][S])
      }

      function ne(_) {
          if (!["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(_.key) || !_.shiftKey) return;
          const S = _.currentTarget,
              x = parseFloat(S.step),
              O = ["ArrowLeft", "ArrowDown"].includes(_.key) ? -1 : 1,
              N = Be(parseFloat(S.value) + O * x * 10, parseInt(S.min), parseInt(S.max));
          S.value = String(N - O * x)
      }
      return Ho(() => n.color, $), Wo(function() {
          document.addEventListener("mousemove", b, {
              passive: !1
          }), document.addEventListener("touchmove", E, {
              passive: !1
          }), document.addEventListener("mouseup", f), document.addEventListener("touchend", f), $(n.color)
      }), Go(function() {
          document.removeEventListener("mousemove", b), document.removeEventListener("touchmove", E), document.removeEventListener("mouseup", f), document.removeEventListener("touchend", f)
      }), (_, S) => (p(), v("div", {
          ref_key: "colorPicker",
          ref: o,
          class: "vacp-color-picker"
      }, [a("div", {
          ref_key: "colorSpace",
          ref: s,
          class: "vacp-color-space",
          onMousedown: g,
          onTouchstart: u
      }, [a("div", {
          ref_key: "thumb",
          ref: i,
          class: "vacp-color-space-thumb",
          tabindex: "0",
          "aria-label": "Color space thumb",
          onKeydown: I
      }, null, 544)], 544), a("div", Ds, [a("label", {
          class: "vacp-range-input-label vacp-range-input-label--hue",
          for: `${e.id}-hue-slider`
      }, [a("span", Ls, [tt(_.$slots, "hue-range-input-label", {}, () => [re("Hue")])]), a("input", {
          id: `${e.id}-hue-slider`,
          class: "vacp-range-input vacp-range-input--hue",
          value: 360 * l.hsv.h,
          type: "range",
          min: "0",
          max: "360",
          step: "1",
          onKeydownPassive: ne,
          onInput: S[0] || (S[0] = x => L(x, "h"))
      }, null, 40, Ns)], 8, As), e.alphaChannel === "show" ? (p(), v("label", {
          key: 0,
          class: "vacp-range-input-label vacp-range-input-label--alpha",
          for: `${e.id}-alpha-slider`
      }, [a("span", Fs, [tt(_.$slots, "alpha-range-input-label", {}, () => [re("Alpha")])]), a("input", {
          id: `${e.id}-alpha-slider`,
          class: "vacp-range-input vacp-range-input--alpha",
          value: 100 * l.hsv.a,
          type: "range",
          min: "0",
          max: "100",
          step: "1",
          onKeydownPassive: ne,
          onInput: S[1] || (S[1] = x => L(x, "a"))
      }, null, 40, Rs)], 8, Ps)) : A("v-if", !0)]), a("button", {
          class: "vacp-copy-button",
          type: "button",
          onClick: Y
      }, [tt(_.$slots, "copy-button", {}, () => [js, Bs])]), a("div", zs, [a("div", Us, [d.value === "hex" ? (p(), v("label", {
          key: 0,
          class: "vacp-color-input-label",
          for: `${e.id}-color-hex`
      }, [Ws, a("input", {
          id: `${e.id}-color-hex`,
          class: "vacp-color-input",
          type: "text",
          value: m.value,
          onInput: W
      }, null, 40, Gs)], 8, Hs)) : (p(!0), v(z, {
          key: 1
      }, X(c.value, x => (p(), v("label", {
          id: `${e.id}-color-${d.value}-${x}-label`,
          key: `${e.id}-color-${d.value}-${x}-label`,
          class: "vacp-color-input-label",
          for: `${e.id}-color-${d.value}-${x}`,
          onInput: O => J(O, x)
      }, [a("span", Xs, k(x.toUpperCase()), 1), a("input", {
          id: `${e.id}-color-${d.value}-${x}`,
          class: "vacp-color-input",
          type: "text",
          value: B(d.value, x),
          onInput: O => J(O, x)
      }, null, 40, Ys)], 40, Vs))), 128))]), e.visibleFormats.length > 1 ? (p(), v("button", {
          key: 0,
          class: "vacp-format-switch-button",
          type: "button",
          onClick: h
      }, [tt(_.$slots, "format-switch-button", {}, () => [qs, Ks])])) : A("v-if", !0)])], 512))
  }
};
(function(e, t) {
  t === void 0 && (t = {});
  var n = t.insertAt;
  if (e && typeof document < "u") {
      var o = document.head || document.getElementsByTagName("head")[0],
          s = document.createElement("style");
      s.type = "text/css", n === "top" && o.firstChild ? o.insertBefore(s, o.firstChild) : o.appendChild(s), s.styleSheet ? s.styleSheet.cssText = e : s.appendChild(document.createTextNode(e))
  }
})(".vacp-color-picker{--vacp-color:hsl(calc(var(--vacp-hsl-h)*360) calc(var(--vacp-hsl-s)*100%) calc(var(--vacp-hsl-l)*100%)/var(--vacp-hsl-a));--vacp-focus-color:#19f;--vacp-focus-outline:2px solid var(--vacp-focus-color);--vacp-border-width:1px;--vacp-border-color:#000;--vacp-border:var(--vacp-border-width) solid var(--vacp-border-color);--vacp-color-space-width:300px;--vacp-spacing:6px;grid-gap:var(--vacp-spacing);background-color:#fff;display:grid;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;font-size:.8em;grid-template-columns:1fr min-content;max-width:var(--vacp-color-space-width);padding:var(--vacp-spacing)}.vacp-color-picker *,.vacp-color-picker :after,.vacp-color-picker :before{box-sizing:border-box}.vacp-color-picker button::-moz-focus-inner{border:none;padding:0}.vacp-color-picker :focus{outline:var(--vacp-focus-outline)}.vacp-color-space{grid-column:1/-1;height:calc(var(--vacp-color-space-width)*.6);overflow:hidden}.vacp-color-space-thumb{--vacp-thumb-size:calc(var(--vacp-spacing)*4);border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 var(--vacp-border-width) var(--vacp-border-color);height:var(--vacp-thumb-size);margin-bottom:calc(var(--vacp-thumb-size)*-1/2);margin-left:calc(var(--vacp-thumb-size)*-1/2);transform:rotate(0);width:var(--vacp-thumb-size)}.vacp-color-space-thumb:focus{box-shadow:0 0 0 var(--vacp-border-width) var(--vacp-border-color),0 0 0 3px var(--vacp-focus-color);outline-color:transparent}.vacp-range-input-label{--vacp-slider-track-width:100%;--vacp-slider-track-height:calc(var(--vacp-spacing)*3);display:block}.vacp-range-input-group{display:flex;flex-direction:column;justify-content:center}.vacp-range-input-group>:not(:first-child){margin-top:var(--vacp-spacing)}.vacp-range-input,.vacp-range-input::-webkit-slider-thumb{-webkit-appearance:none}.vacp-range-input{background:none;border:none;display:block;height:var(--vacp-slider-track-height);margin-bottom:calc(var(--vacp-spacing)/2 + 1px);margin-left:0;margin-right:0;margin-top:calc(var(--vacp-spacing)/2 + 1px);padding:0;width:var(--vacp-slider-track-width)}.vacp-range-input:focus{outline:none}.vacp-range-input::-moz-focus-outer{border:none}.vacp-range-input--alpha{background-color:#fff;background-image:linear-gradient(45deg,#eee 25%,transparent 0,transparent 75%,#eee 0,#eee),linear-gradient(45deg,#eee 25%,transparent 0,transparent 75%,#eee 0,#eee);background-position:0 0,var(--vacp-spacing) var(--vacp-spacing);background-size:calc(var(--vacp-spacing)*2) calc(var(--vacp-spacing)*2)}.vacp-range-input::-moz-range-track{border:var(--vacp-border);box-sizing:content-box;height:var(--vacp-slider-track-height);width:var(--vacp-slider-track-width)}.vacp-range-input::-webkit-slider-runnable-track{border:var(--vacp-border);box-sizing:content-box;height:var(--vacp-slider-track-height);width:var(--vacp-slider-track-width)}.vacp-range-input::-ms-track{border:var(--vacp-border);box-sizing:content-box;height:var(--vacp-slider-track-height);width:var(--vacp-slider-track-width)}.vacp-range-input:focus::-moz-range-track{outline:var(--vacp-focus-outline)}.vacp-range-input:focus::-webkit-slider-runnable-track{outline:var(--vacp-focus-outline)}.vacp-range-input:focus::-ms-track{outline:var(--vacp-focus-outline)}.vacp-range-input--alpha::-moz-range-track{background-image:linear-gradient(to right,transparent,var(--vacp-color))}.vacp-range-input--alpha::-webkit-slider-runnable-track{background-image:linear-gradient(to right,transparent,var(--vacp-color))}.vacp-range-input--alpha::-ms-track{background-image:linear-gradient(to right,transparent,var(--vacp-color))}.vacp-range-input--hue::-moz-range-track{background-image:linear-gradient(90deg,red 0,#ff0 16.66667%,#0f0 33.33333%,#0ff 50%,#00f 66.66667%,#f0f 83.33333%,red 100%)}.vacp-range-input--hue::-webkit-slider-runnable-track{background-image:linear-gradient(90deg,red 0,#ff0 16.66667%,#0f0 33.33333%,#0ff 50%,#00f 66.66667%,#f0f 83.33333%,red 100%)}.vacp-range-input--hue::-ms-track{background-image:linear-gradient(90deg,red 0,#ff0 16.66667%,#0f0 33.33333%,#0ff 50%,#00f 66.66667%,#f0f 83.33333%,red 100%)}.vacp-range-input::-moz-range-thumb{background-color:transparent;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 var(--vacp-border-width) var(--vacp-border-color);box-sizing:content-box;height:var(--vacp-slider-track-height);isolation:isolate;width:var(--vacp-slider-track-height)}.vacp-range-input::-webkit-slider-thumb{background-color:transparent;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 var(--vacp-border-width) var(--vacp-border-color);box-sizing:content-box;height:var(--vacp-slider-track-height);isolation:isolate;margin-top:calc((var(--vacp-spacing)/2)*-1);width:var(--vacp-slider-track-height)}.vacp-range-input::-ms-thumb{background-color:transparent;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 var(--vacp-border-width) var(--vacp-border-color);box-sizing:content-box;height:var(--vacp-slider-track-height);isolation:isolate;margin-top:calc((var(--vacp-spacing)/2)*-1);width:var(--vacp-slider-track-height)}.vacp-copy-button{align-items:center;align-self:center;background-color:#fff;border:var(--vacp-border-width) solid transparent;border-radius:50%;display:flex;height:calc(var(--vacp-spacing)*6);justify-content:center;justify-self:center;overflow:hidden;position:relative;width:calc(var(--vacp-spacing)*6)}.vacp-copy-button:enabled:focus{border-color:var(--vacp-border-color);box-shadow:0 0 0 2px var(--vacp-focus-color);outline:none}.vacp-copy-button:enabled:hover{background-color:#0002}.vacp-color-inputs{align-items:center;display:flex;grid-column:1/-1}.vacp-color-inputs>:not(:first-child){margin-left:var(--vacp-spacing)}.vacp-color-input-group{column-gap:var(--vacp-spacing);display:grid;flex-grow:1;grid-auto-flow:column}.vacp-color-input-label{text-align:center}.vacp-color-input{border:var(--vacp-border);margin:0;margin-top:calc(var(--vacp-spacing)/2);text-align:center;width:100%}.vacp-color-input,.vacp-format-switch-button{background-color:#fff;color:inherit;font:inherit;padding:var(--vacp-spacing)}.vacp-format-switch-button{align-items:center;border:var(--vacp-border-width) solid transparent;border-radius:50%;display:flex;justify-content:center;margin:0}.vacp-format-switch-button:enabled:focus{border-color:var(--vacp-border-color)}.vacp-format-switch-button:enabled:hover{background-color:#0002}.vacp-visually-hidden{clip:rect(0 0 0 0);border:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}"), So.__file = "src/ColorPicker.vue";

function Js(e, t, n) {
  var o, s, i, r, d;
  t == null && (t = 100);

  function l() {
      var m = Date.now() - r;
      m < t && m >= 0 ? o = setTimeout(l, t - m) : (o = null, n || (d = e.apply(i, s), i = s = null))
  }
  var c = function() {
      i = this, s = arguments, r = Date.now();
      var m = n && !o;
      return o || (o = setTimeout(l, t)), m && (d = e.apply(i, s), i = s = null), d
  };
  return c.clear = function() {
      o && (clearTimeout(o), o = null)
  }, c.flush = function() {
      o && (d = e.apply(i, s), i = s = null, clearTimeout(o), o = null)
  }, c
}
const Zs = {
  components: {
      ColorPicker: So
  },
  props: ["addon", "setting", "modelValue", "alphaEnabled"],
  emits: ["update:modelValue"],
  computed: {
      dir() {
          return Mn()
      }
  },
  data() {
      return {
          isOpen: !1,
          canCloseOutside: !1
      }
  },
  computed: {
      color: {
          get() {
              return this.modelValue
          },
          set(e) {
              this.$emit("update:modelValue", e)
          }
      }
  },
  mounted() {
      Pe.$on("close-pickers", e => {
          if (this.isOpen && this !== e) {
              const t = this.$parent.addon,
                  n = this.$parent.setting;
              this.toggle(t, n, !1, {
                  callCloseDropdowns: !1,
                  callClosePickers: !1
              })
          }
      })
  },
  methods: {
      toggle(e, t, n = !this.isOpen, {
          callCloseDropdowns: o = !0,
          callClosePickers: s = !0
      } = {}) {
          this.isOpen = n, this.opening = !0, s && this.$root.closePickers({
              isTrusted: !0
          }, this, {
              callCloseDropdowns: !1
          }), o && this.$root.closeResetDropdowns({
              isTrusted: !0
          }), this.opening = !1, this.$parent.addonSettings[t.id] = this.color, this.$parent.updateSettings(e, {
              wait: 250,
              settingId: t.id
          }), this.canCloseOutside = !1, setTimeout(() => {
              this.canCloseOutside = !0
          }, 0)
      },
      change: Js(function(e) {
          const t = e.colors.hex;
          this.$parent.addonSettings[this.setting.id] = t, this.$parent.updateSettings(this.addon, {
              wait: 250,
              settingId: this.setting.id
          }), this.color = t
      }, 250)
  }
};

function Qs(e, t, n, o, s, i) {
  const r = me("ColorPicker");
  return p(), v("div", {
      class: "color-container",
      key: e.value
  }, [a("button", {
      style: we({
          "background-color": i.color
      }),
      class: U(["setting-input color", {
          "action-disabled": !n.addon._enabled,
          open: s.isOpen
      }]),
      onClick: t[0] || (t[0] = d => i.toggle(n.addon, n.setting))
  }, null, 6), a("form", null, [R(Pt(r, {
      color: i.color,
      "alpha-channel": n.alphaEnabled ? "show" : "hide",
      dir: i.dir,
      onColorChange: i.change
  }, null, 8, ["color", "alpha-channel", "dir", "onColorChange"]), [
      [ee, s.isOpen]
  ])])])
}
const ei = ve(Zs, [
      ["render", Qs],
      ["__scopeId", "data-v-c44b0b64"]
  ]),
  Ht = "/webpages/dist/assets/expand.svg",
  ti = {
      props: ["enabled", "setting", "presets"],
      data() {
          return {
              isResetDropdown: !0,
              isOpen: !1
          }
      },
      mounted() {
          Pe.$on("close-reset-dropdowns", e => {
              this.isOpen && this.setting.id !== e && (this.isOpen = !1)
          })
      },
      methods: {
          toggle() {
              this.isOpen = !this.isOpen, this.$root.closePickers({
                  isTrusted: !0
              }, null, {
                  callCloseDropdowns: !1
              }), this.$root.closeResetDropdowns({
                  isTrusted: !0
              }, this.setting.id)
          },
          resetToDefault() {
              this.$parent.addonSettings[this.setting.id] = this.setting.default, this.$parent.updateSettings(this.addon, {
                  settingId: this.setting.id
              }), this.toggle()
          },
          resetToPreset(e) {
              this.$parent.addonSettings[this.setting.id] = e.values[this.setting.id], this.$parent.updateSettings(this.addon, {
                  settingId: this.setting.id
              }), this.toggle()
          },
          msg(...e) {
              return this.$root.msg(...e)
          }
      }
  },
  ni = ["disabled", "title"],
  oi = a("img", {
      src: Ht,
      class: "icon-type"
  }, null, -1),
  si = [oi],
  ii = {
      key: 0,
      class: "color-preview"
  },
  ri = {
      key: 1,
      class: "text-preview"
  },
  ai = ["onClick"],
  li = {
      key: 0,
      class: "color-preview"
  },
  di = {
      key: 1,
      class: "text-preview"
  };

function ci(e, t, n, o, s, i) {
  return p(), v("div", {
      class: U({
          "setting-dropdown": !0,
          open: s.isOpen
      })
  }, [a("button", {
      type: "button",
      class: "large-button clear-button",
      disabled: !n.enabled,
      onClick: t[0] || (t[0] = (...r) => i.toggle && i.toggle(...r)),
      title: i.msg("reset")
  }, si, 8, ni), a("ul", null, [a("li", {
      onClick: t[1] || (t[1] = (...r) => i.resetToDefault && i.resetToDefault(...r))
  }, [n.setting.type === "color" ? (p(), v("span", ii, [a("span", {
      style: we({
          backgroundColor: n.setting.default
      })
  }, null, 4)])) : A("", !0), a("span", null, k(i.msg("default")), 1), n.setting.type !== "color" ? (p(), v("span", ri, k(n.setting.default), 1)) : A("", !0)]), (p(!0), v(z, null, X(n.presets, r => (p(), v(z, null, [(r.values.hasOwnProperty(n.setting.id) && n.setting.type === "color" ? r.values[n.setting.id].toLowerCase() !== n.setting.default.toLowerCase() : r.values[n.setting.id] !== n.setting.default) ? (p(), v("li", {
      key: 0,
      onClick: d => i.resetToPreset(r)
  }, [n.setting.type === "color" ? (p(), v("span", li, [a("span", {
      style: we({
          backgroundColor: r.values[n.setting.id]
      })
  }, null, 4)])) : A("", !0), a("span", null, k(r.name), 1), n.setting.type !== "color" ? (p(), v("span", di, k(r.values[n.setting.id]), 1)) : A("", !0)], 8, ai)) : A("", !0)], 64))), 256))])], 2)
}
const ui = ve(ti, [
  ["render", ci]
]);
/**!
* Sortable 1.15.0
* @author	RubaXa   <trash@rubaxa.org>
* @author	owenm    <owen23355@gmail.com>
* @license MIT
*/
function Yn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      t && (o = o.filter(function(s) {
          return Object.getOwnPropertyDescriptor(e, s).enumerable
      })), n.push.apply(n, o)
  }
  return n
}

function xe(e) {
  for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t] != null ? arguments[t] : {};
      t % 2 ? Yn(Object(n), !0).forEach(function(o) {
          hi(e, o, n[o])
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Yn(Object(n)).forEach(function(o) {
          Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o))
      })
  }
  return e
}

function $t(e) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? $t = function(t) {
      return typeof t
  } : $t = function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
  }, $t(e)
}

function hi(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
  }) : e[t] = n, e
}

function Ce() {
  return Ce = Object.assign || function(e) {
      for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o])
      }
      return e
  }, Ce.apply(this, arguments)
}

function gi(e, t) {
  if (e == null) return {};
  var n = {},
      o = Object.keys(e),
      s, i;
  for (i = 0; i < o.length; i++) s = o[i], !(t.indexOf(s) >= 0) && (n[s] = e[s]);
  return n
}

function mi(e, t) {
  if (e == null) return {};
  var n = gi(e, t),
      o, s;
  if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      for (s = 0; s < i.length; s++) o = i[s], !(t.indexOf(o) >= 0) && Object.prototype.propertyIsEnumerable.call(e, o) && (n[o] = e[o])
  }
  return n
}
var pi = "1.15.0";

function Ee(e) {
  if (typeof window < "u" && window.navigator) return !!navigator.userAgent.match(e)
}
var Te = Ee(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),
  gt = Ee(/Edge/i),
  qn = Ee(/firefox/i),
  lt = Ee(/safari/i) && !Ee(/chrome/i) && !Ee(/android/i),
  xo = Ee(/iP(ad|od|hone)/i),
  ko = Ee(/chrome/i) && Ee(/android/i),
  Eo = {
      capture: !1,
      passive: !1
  };

function F(e, t, n) {
  e.addEventListener(t, n, !Te && Eo)
}

function P(e, t, n) {
  e.removeEventListener(t, n, !Te && Eo)
}

function Ft(e, t) {
  if (t) {
      if (t[0] === ">" && (t = t.substring(1)), e) try {
          if (e.matches) return e.matches(t);
          if (e.msMatchesSelector) return e.msMatchesSelector(t);
          if (e.webkitMatchesSelector) return e.webkitMatchesSelector(t)
      } catch {
          return !1
      }
      return !1
  }
}

function fi(e) {
  return e.host && e !== document && e.host.nodeType ? e.host : e.parentNode
}

function ye(e, t, n, o) {
  if (e) {
      n = n || document;
      do {
          if (t != null && (t[0] === ">" ? e.parentNode === n && Ft(e, t) : Ft(e, t)) || o && e === n) return e;
          if (e === n) break
      } while (e = fi(e))
  }
  return null
}
var Kn = /\s+/g;

function le(e, t, n) {
  if (e && t)
      if (e.classList) e.classList[n ? "add" : "remove"](t);
      else {
          var o = (" " + e.className + " ").replace(Kn, " ").replace(" " + t + " ", " ");
          e.className = (o + (n ? " " + t : "")).replace(Kn, " ")
      }
}

function M(e, t, n) {
  var o = e && e.style;
  if (o) {
      if (n === void 0) return document.defaultView && document.defaultView.getComputedStyle ? n = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (n = e.currentStyle), t === void 0 ? n : n[t];
      !(t in o) && t.indexOf("webkit") === -1 && (t = "-webkit-" + t), o[t] = n + (typeof n == "string" ? "" : "px")
  }
}

function Ke(e, t) {
  var n = "";
  if (typeof e == "string") n = e;
  else
      do {
          var o = M(e, "transform");
          o && o !== "none" && (n = o + " " + n)
      } while (!t && (e = e.parentNode));
  var s = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return s && new s(n)
}

function Mo(e, t, n) {
  if (e) {
      var o = e.getElementsByTagName(t),
          s = 0,
          i = o.length;
      if (n)
          for (; s < i; s++) n(o[s], s);
      return o
  }
  return []
}

function Se() {
  var e = document.scrollingElement;
  return e || document.documentElement
}

function Z(e, t, n, o, s) {
  if (!(!e.getBoundingClientRect && e !== window)) {
      var i, r, d, l, c, m, h;
      if (e !== window && e.parentNode && e !== Se() ? (i = e.getBoundingClientRect(), r = i.top, d = i.left, l = i.bottom, c = i.right, m = i.height, h = i.width) : (r = 0, d = 0, l = window.innerHeight, c = window.innerWidth, m = window.innerHeight, h = window.innerWidth), (t || n) && e !== window && (s = s || e.parentNode, !Te))
          do
              if (s && s.getBoundingClientRect && (M(s, "transform") !== "none" || n && M(s, "position") !== "static")) {
                  var g = s.getBoundingClientRect();
                  r -= g.top + parseInt(M(s, "border-top-width")), d -= g.left + parseInt(M(s, "border-left-width")), l = r + i.height, c = d + i.width;
                  break
              } while (s = s.parentNode);
      if (o && e !== window) {
          var u = Ke(s || e),
              f = u && u.a,
              b = u && u.d;
          u && (r /= b, d /= f, h /= f, m /= b, l = r + m, c = d + h)
      }
      return {
          top: r,
          left: d,
          bottom: l,
          right: c,
          width: h,
          height: m
      }
  }
}

function Jn(e, t, n) {
  for (var o = Ne(e, !0), s = Z(e)[t]; o;) {
      var i = Z(o)[n],
          r = void 0;
      if (n === "top" || n === "left" ? r = s >= i : r = s <= i, !r) return o;
      if (o === Se()) break;
      o = Ne(o, !1)
  }
  return !1
}

function Je(e, t, n, o) {
  for (var s = 0, i = 0, r = e.children; i < r.length;) {
      if (r[i].style.display !== "none" && r[i] !== C.ghost && (o || r[i] !== C.dragged) && ye(r[i], n.draggable, e, !1)) {
          if (s === t) return r[i];
          s++
      }
      i++
  }
  return null
}

function Tn(e, t) {
  for (var n = e.lastElementChild; n && (n === C.ghost || M(n, "display") === "none" || t && !Ft(n, t));) n = n.previousElementSibling;
  return n || null
}

function he(e, t) {
  var n = 0;
  if (!e || !e.parentNode) return -1;
  for (; e = e.previousElementSibling;) e.nodeName.toUpperCase() !== "TEMPLATE" && e !== C.clone && (!t || Ft(e, t)) && n++;
  return n
}

function Zn(e) {
  var t = 0,
      n = 0,
      o = Se();
  if (e)
      do {
          var s = Ke(e),
              i = s.a,
              r = s.d;
          t += e.scrollLeft * i, n += e.scrollTop * r
      } while (e !== o && (e = e.parentNode));
  return [t, n]
}

function vi(e, t) {
  for (var n in e)
      if (e.hasOwnProperty(n)) {
          for (var o in t)
              if (t.hasOwnProperty(o) && t[o] === e[n][o]) return Number(n)
      } return -1
}

function Ne(e, t) {
  if (!e || !e.getBoundingClientRect) return Se();
  var n = e,
      o = !1;
  do
      if (n.clientWidth < n.scrollWidth || n.clientHeight < n.scrollHeight) {
          var s = M(n);
          if (n.clientWidth < n.scrollWidth && (s.overflowX == "auto" || s.overflowX == "scroll") || n.clientHeight < n.scrollHeight && (s.overflowY == "auto" || s.overflowY == "scroll")) {
              if (!n.getBoundingClientRect || n === document.body) return Se();
              if (o || t) return n;
              o = !0
          }
      } while (n = n.parentNode);
  return Se()
}

function bi(e, t) {
  if (e && t)
      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
  return e
}

function nn(e, t) {
  return Math.round(e.top) === Math.round(t.top) && Math.round(e.left) === Math.round(t.left) && Math.round(e.height) === Math.round(t.height) && Math.round(e.width) === Math.round(t.width)
}
var dt;

function Co(e, t) {
  return function() {
      if (!dt) {
          var n = arguments,
              o = this;
          n.length === 1 ? e.call(o, n[0]) : e.apply(o, n), dt = setTimeout(function() {
              dt = void 0
          }, t)
      }
  }
}

function yi() {
  clearTimeout(dt), dt = void 0
}

function Io(e, t, n) {
  e.scrollLeft += t, e.scrollTop += n
}

function To(e) {
  var t = window.Polymer,
      n = window.jQuery || window.Zepto;
  return t && t.dom ? t.dom(e).cloneNode(!0) : n ? n(e).clone(!0)[0] : e.cloneNode(!0)
}
var ue = "Sortable" + new Date().getTime();

function wi() {
  var e = [],
      t;
  return {
      captureAnimationState: function() {
          if (e = [], !!this.options.animation) {
              var o = [].slice.call(this.el.children);
              o.forEach(function(s) {
                  if (!(M(s, "display") === "none" || s === C.ghost)) {
                      e.push({
                          target: s,
                          rect: Z(s)
                      });
                      var i = xe({}, e[e.length - 1].rect);
                      if (s.thisAnimationDuration) {
                          var r = Ke(s, !0);
                          r && (i.top -= r.f, i.left -= r.e)
                      }
                      s.fromRect = i
                  }
              })
          }
      },
      addAnimationState: function(o) {
          e.push(o)
      },
      removeAnimationState: function(o) {
          e.splice(vi(e, {
              target: o
          }), 1)
      },
      animateAll: function(o) {
          var s = this;
          if (!this.options.animation) {
              clearTimeout(t), typeof o == "function" && o();
              return
          }
          var i = !1,
              r = 0;
          e.forEach(function(d) {
              var l = 0,
                  c = d.target,
                  m = c.fromRect,
                  h = Z(c),
                  g = c.prevFromRect,
                  u = c.prevToRect,
                  f = d.rect,
                  b = Ke(c, !0);
              b && (h.top -= b.f, h.left -= b.e), c.toRect = h, c.thisAnimationDuration && nn(g, h) && !nn(m, h) && (f.top - h.top) / (f.left - h.left) === (m.top - h.top) / (m.left - h.left) && (l = Si(f, g, u, s.options)), nn(h, m) || (c.prevFromRect = m, c.prevToRect = h, l || (l = s.options.animation), s.animate(c, f, h, l)), l && (i = !0, r = Math.max(r, l), clearTimeout(c.animationResetTimer), c.animationResetTimer = setTimeout(function() {
                  c.animationTime = 0, c.prevFromRect = null, c.fromRect = null, c.prevToRect = null, c.thisAnimationDuration = null
              }, l), c.thisAnimationDuration = l)
          }), clearTimeout(t), i ? t = setTimeout(function() {
              typeof o == "function" && o()
          }, r) : typeof o == "function" && o(), e = []
      },
      animate: function(o, s, i, r) {
          if (r) {
              M(o, "transition", ""), M(o, "transform", "");
              var d = Ke(this.el),
                  l = d && d.a,
                  c = d && d.d,
                  m = (s.left - i.left) / (l || 1),
                  h = (s.top - i.top) / (c || 1);
              o.animatingX = !!m, o.animatingY = !!h, M(o, "transform", "translate3d(" + m + "px," + h + "px,0)"), this.forRepaintDummy = _i(o), M(o, "transition", "transform " + r + "ms" + (this.options.easing ? " " + this.options.easing : "")), M(o, "transform", "translate3d(0,0,0)"), typeof o.animated == "number" && clearTimeout(o.animated), o.animated = setTimeout(function() {
                  M(o, "transition", ""), M(o, "transform", ""), o.animated = !1, o.animatingX = !1, o.animatingY = !1
              }, r)
          }
      }
  }
}

function _i(e) {
  return e.offsetWidth
}

function Si(e, t, n, o) {
  return Math.sqrt(Math.pow(t.top - e.top, 2) + Math.pow(t.left - e.left, 2)) / Math.sqrt(Math.pow(t.top - n.top, 2) + Math.pow(t.left - n.left, 2)) * o.animation
}
var Ue = [],
  on = {
      initializeByDefault: !0
  },
  mt = {
      mount: function(t) {
          for (var n in on) on.hasOwnProperty(n) && !(n in t) && (t[n] = on[n]);
          Ue.forEach(function(o) {
              if (o.pluginName === t.pluginName) throw "Sortable: Cannot mount plugin ".concat(t.pluginName, " more than once")
          }), Ue.push(t)
      },
      pluginEvent: function(t, n, o) {
          var s = this;
          this.eventCanceled = !1, o.cancel = function() {
              s.eventCanceled = !0
          };
          var i = t + "Global";
          Ue.forEach(function(r) {
              n[r.pluginName] && (n[r.pluginName][i] && n[r.pluginName][i](xe({
                  sortable: n
              }, o)), n.options[r.pluginName] && n[r.pluginName][t] && n[r.pluginName][t](xe({
                  sortable: n
              }, o)))
          })
      },
      initializePlugins: function(t, n, o, s) {
          Ue.forEach(function(d) {
              var l = d.pluginName;
              if (!(!t.options[l] && !d.initializeByDefault)) {
                  var c = new d(t, n, t.options);
                  c.sortable = t, c.options = t.options, t[l] = c, Ce(o, c.defaults)
              }
          });
          for (var i in t.options)
              if (t.options.hasOwnProperty(i)) {
                  var r = this.modifyOption(t, i, t.options[i]);
                  typeof r < "u" && (t.options[i] = r)
              }
      },
      getEventProperties: function(t, n) {
          var o = {};
          return Ue.forEach(function(s) {
              typeof s.eventProperties == "function" && Ce(o, s.eventProperties.call(n[s.pluginName], t))
          }), o
      },
      modifyOption: function(t, n, o) {
          var s;
          return Ue.forEach(function(i) {
              t[i.pluginName] && i.optionListeners && typeof i.optionListeners[n] == "function" && (s = i.optionListeners[n].call(t[i.pluginName], o))
          }), s
      }
  };

function xi(e) {
  var t = e.sortable,
      n = e.rootEl,
      o = e.name,
      s = e.targetEl,
      i = e.cloneEl,
      r = e.toEl,
      d = e.fromEl,
      l = e.oldIndex,
      c = e.newIndex,
      m = e.oldDraggableIndex,
      h = e.newDraggableIndex,
      g = e.originalEvent,
      u = e.putSortable,
      f = e.extraEventProperties;
  if (t = t || n && n[ue], !!t) {
      var b, E = t.options,
          w = "on" + o.charAt(0).toUpperCase() + o.substr(1);
      window.CustomEvent && !Te && !gt ? b = new CustomEvent(o, {
          bubbles: !0,
          cancelable: !0
      }) : (b = document.createEvent("Event"), b.initEvent(o, !0, !0)), b.to = r || n, b.from = d || n, b.item = s || n, b.clone = i, b.oldIndex = l, b.newIndex = c, b.oldDraggableIndex = m, b.newDraggableIndex = h, b.originalEvent = g, b.pullMode = u ? u.lastPutMode : void 0;
      var I = xe(xe({}, f), mt.getEventProperties(o, t));
      for (var $ in I) b[$] = I[$];
      n && n.dispatchEvent(b), E[w] && E[w].call(t, b)
  }
}
var ki = ["evt"],
  ie = function(t, n) {
      var o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
          s = o.evt,
          i = mi(o, ki);
      mt.pluginEvent.bind(C)(t, n, xe({
          dragEl: y,
          parentEl: V,
          ghostEl: D,
          rootEl: H,
          nextEl: je,
          lastDownEl: Ot,
          cloneEl: G,
          cloneHidden: Le,
          dragStarted: st,
          putSortable: Q,
          activeSortable: C.active,
          originalEvent: s,
          oldIndex: qe,
          oldDraggableIndex: ct,
          newIndex: de,
          newDraggableIndex: Ae,
          hideGhostForTarget: Ao,
          unhideGhostForTarget: Lo,
          cloneNowHidden: function() {
              Le = !0
          },
          cloneNowShown: function() {
              Le = !1
          },
          dispatchSortableEvent: function(d) {
              oe({
                  sortable: n,
                  name: d,
                  originalEvent: s
              })
          }
      }, i))
  };

function oe(e) {
  xi(xe({
      putSortable: Q,
      cloneEl: G,
      targetEl: y,
      rootEl: H,
      oldIndex: qe,
      oldDraggableIndex: ct,
      newIndex: de,
      newDraggableIndex: Ae
  }, e))
}
var y, V, D, H, je, Ot, G, Le, qe, de, ct, Ae, xt, Q, Ve = !1,
  Rt = !1,
  jt = [],
  Fe, ge, sn, rn, Qn, eo, st, He, ut, ht = !1,
  kt = !1,
  Dt, te, an = [],
  bn = !1,
  Bt = [],
  Wt = typeof document < "u",
  Et = xo,
  to = gt || Te ? "cssFloat" : "float",
  Ei = Wt && !ko && !xo && "draggable" in document.createElement("div"),
  $o = function() {
      if (Wt) {
          if (Te) return !1;
          var e = document.createElement("x");
          return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto"
      }
  }(),
  Oo = function(t, n) {
      var o = M(t),
          s = parseInt(o.width) - parseInt(o.paddingLeft) - parseInt(o.paddingRight) - parseInt(o.borderLeftWidth) - parseInt(o.borderRightWidth),
          i = Je(t, 0, n),
          r = Je(t, 1, n),
          d = i && M(i),
          l = r && M(r),
          c = d && parseInt(d.marginLeft) + parseInt(d.marginRight) + Z(i).width,
          m = l && parseInt(l.marginLeft) + parseInt(l.marginRight) + Z(r).width;
      if (o.display === "flex") return o.flexDirection === "column" || o.flexDirection === "column-reverse" ? "vertical" : "horizontal";
      if (o.display === "grid") return o.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
      if (i && d.float && d.float !== "none") {
          var h = d.float === "left" ? "left" : "right";
          return r && (l.clear === "both" || l.clear === h) ? "vertical" : "horizontal"
      }
      return i && (d.display === "block" || d.display === "flex" || d.display === "table" || d.display === "grid" || c >= s && o[to] === "none" || r && o[to] === "none" && c + m > s) ? "vertical" : "horizontal"
  },
  Mi = function(t, n, o) {
      var s = o ? t.left : t.top,
          i = o ? t.right : t.bottom,
          r = o ? t.width : t.height,
          d = o ? n.left : n.top,
          l = o ? n.right : n.bottom,
          c = o ? n.width : n.height;
      return s === d || i === l || s + r / 2 === d + c / 2
  },
  Ci = function(t, n) {
      var o;
      return jt.some(function(s) {
          var i = s[ue].options.emptyInsertThreshold;
          if (!(!i || Tn(s))) {
              var r = Z(s),
                  d = t >= r.left - i && t <= r.right + i,
                  l = n >= r.top - i && n <= r.bottom + i;
              if (d && l) return o = s
          }
      }), o
  },
  Do = function(t) {
      function n(i, r) {
          return function(d, l, c, m) {
              var h = d.options.group.name && l.options.group.name && d.options.group.name === l.options.group.name;
              if (i == null && (r || h)) return !0;
              if (i == null || i === !1) return !1;
              if (r && i === "clone") return i;
              if (typeof i == "function") return n(i(d, l, c, m), r)(d, l, c, m);
              var g = (r ? d : l).options.group.name;
              return i === !0 || typeof i == "string" && i === g || i.join && i.indexOf(g) > -1
          }
      }
      var o = {},
          s = t.group;
      (!s || $t(s) != "object") && (s = {
          name: s
      }), o.name = s.name, o.checkPull = n(s.pull, !0), o.checkPut = n(s.put), o.revertClone = s.revertClone, t.group = o
  },
  Ao = function() {
      !$o && D && M(D, "display", "none")
  },
  Lo = function() {
      !$o && D && M(D, "display", "")
  };
Wt && !ko && document.addEventListener("click", function(e) {
  if (Rt) return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Rt = !1, !1
}, !0);
var Re = function(t) {
      if (y) {
          t = t.touches ? t.touches[0] : t;
          var n = Ci(t.clientX, t.clientY);
          if (n) {
              var o = {};
              for (var s in t) t.hasOwnProperty(s) && (o[s] = t[s]);
              o.target = o.rootEl = n, o.preventDefault = void 0, o.stopPropagation = void 0, n[ue]._onDragOver(o)
          }
      }
  },
  Ii = function(t) {
      y && y.parentNode[ue]._isOutsideThisEl(t.target)
  };

function C(e, t) {
  if (!(e && e.nodeType && e.nodeType === 1)) throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = t = Ce({}, t), e[ue] = this;
  var n = {
      group: null,
      sort: !0,
      disabled: !1,
      store: null,
      handle: null,
      draggable: /^[uo]l$/i.test(e.nodeName) ? ">li" : ">*",
      swapThreshold: 1,
      invertSwap: !1,
      invertedSwapThreshold: null,
      removeCloneOnHide: !0,
      direction: function() {
          return Oo(e, this.options)
      },
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      ignore: "a, img",
      filter: null,
      preventOnFilter: !0,
      animation: 0,
      easing: null,
      setData: function(r, d) {
          r.setData("Text", d.textContent)
      },
      dropBubble: !1,
      dragoverBubble: !1,
      dataIdAttr: "data-id",
      delay: 0,
      delayOnTouchOnly: !1,
      touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
      forceFallback: !1,
      fallbackClass: "sortable-fallback",
      fallbackOnBody: !1,
      fallbackTolerance: 0,
      fallbackOffset: {
          x: 0,
          y: 0
      },
      supportPointer: C.supportPointer !== !1 && "PointerEvent" in window && !lt,
      emptyInsertThreshold: 5
  };
  mt.initializePlugins(this, e, n);
  for (var o in n) !(o in t) && (t[o] = n[o]);
  Do(t);
  for (var s in this) s.charAt(0) === "_" && typeof this[s] == "function" && (this[s] = this[s].bind(this));
  this.nativeDraggable = t.forceFallback ? !1 : Ei, this.nativeDraggable && (this.options.touchStartThreshold = 1), t.supportPointer ? F(e, "pointerdown", this._onTapStart) : (F(e, "mousedown", this._onTapStart), F(e, "touchstart", this._onTapStart)), this.nativeDraggable && (F(e, "dragover", this), F(e, "dragenter", this)), jt.push(this.el), t.store && t.store.get && this.sort(t.store.get(this) || []), Ce(this, wi())
}
C.prototype = {
  constructor: C,
  _isOutsideThisEl: function(t) {
      !this.el.contains(t) && t !== this.el && (He = null)
  },
  _getDirection: function(t, n) {
      return typeof this.options.direction == "function" ? this.options.direction.call(this, t, n, y) : this.options.direction
  },
  _onTapStart: function(t) {
      if (t.cancelable) {
          var n = this,
              o = this.el,
              s = this.options,
              i = s.preventOnFilter,
              r = t.type,
              d = t.touches && t.touches[0] || t.pointerType && t.pointerType === "touch" && t,
              l = (d || t).target,
              c = t.target.shadowRoot && (t.path && t.path[0] || t.composedPath && t.composedPath()[0]) || l,
              m = s.filter;
          if (Pi(o), !y && !(/mousedown|pointerdown/.test(r) && t.button !== 0 || s.disabled) && !c.isContentEditable && !(!this.nativeDraggable && lt && l && l.tagName.toUpperCase() === "SELECT") && (l = ye(l, s.draggable, o, !1), !(l && l.animated) && Ot !== l)) {
              if (qe = he(l), ct = he(l, s.draggable), typeof m == "function") {
                  if (m.call(this, t, l, this)) {
                      oe({
                          sortable: n,
                          rootEl: c,
                          name: "filter",
                          targetEl: l,
                          toEl: o,
                          fromEl: o
                      }), ie("filter", n, {
                          evt: t
                      }), i && t.cancelable && t.preventDefault();
                      return
                  }
              } else if (m && (m = m.split(",").some(function(h) {
                      if (h = ye(c, h.trim(), o, !1), h) return oe({
                          sortable: n,
                          rootEl: h,
                          name: "filter",
                          targetEl: l,
                          fromEl: o,
                          toEl: o
                      }), ie("filter", n, {
                          evt: t
                      }), !0
                  }), m)) {
                  i && t.cancelable && t.preventDefault();
                  return
              }
              s.handle && !ye(c, s.handle, o, !1) || this._prepareDragStart(t, d, l)
          }
      }
  },
  _prepareDragStart: function(t, n, o) {
      var s = this,
          i = s.el,
          r = s.options,
          d = i.ownerDocument,
          l;
      if (o && !y && o.parentNode === i) {
          var c = Z(o);
          if (H = i, y = o, V = y.parentNode, je = y.nextSibling, Ot = o, xt = r.group, C.dragged = y, Fe = {
                  target: y,
                  clientX: (n || t).clientX,
                  clientY: (n || t).clientY
              }, Qn = Fe.clientX - c.left, eo = Fe.clientY - c.top, this._lastX = (n || t).clientX, this._lastY = (n || t).clientY, y.style["will-change"] = "all", l = function() {
                  if (ie("delayEnded", s, {
                          evt: t
                      }), C.eventCanceled) {
                      s._onDrop();
                      return
                  }
                  s._disableDelayedDragEvents(), !qn && s.nativeDraggable && (y.draggable = !0), s._triggerDragStart(t, n), oe({
                      sortable: s,
                      name: "choose",
                      originalEvent: t
                  }), le(y, r.chosenClass, !0)
              }, r.ignore.split(",").forEach(function(m) {
                  Mo(y, m.trim(), ln)
              }), F(d, "dragover", Re), F(d, "mousemove", Re), F(d, "touchmove", Re), F(d, "mouseup", s._onDrop), F(d, "touchend", s._onDrop), F(d, "touchcancel", s._onDrop), qn && this.nativeDraggable && (this.options.touchStartThreshold = 4, y.draggable = !0), ie("delayStart", this, {
                  evt: t
              }), r.delay && (!r.delayOnTouchOnly || n) && (!this.nativeDraggable || !(gt || Te))) {
              if (C.eventCanceled) {
                  this._onDrop();
                  return
              }
              F(d, "mouseup", s._disableDelayedDrag), F(d, "touchend", s._disableDelayedDrag), F(d, "touchcancel", s._disableDelayedDrag), F(d, "mousemove", s._delayedDragTouchMoveHandler), F(d, "touchmove", s._delayedDragTouchMoveHandler), r.supportPointer && F(d, "pointermove", s._delayedDragTouchMoveHandler), s._dragStartTimer = setTimeout(l, r.delay)
          } else l()
      }
  },
  _delayedDragTouchMoveHandler: function(t) {
      var n = t.touches ? t.touches[0] : t;
      Math.max(Math.abs(n.clientX - this._lastX), Math.abs(n.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag()
  },
  _disableDelayedDrag: function() {
      y && ln(y), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents()
  },
  _disableDelayedDragEvents: function() {
      var t = this.el.ownerDocument;
      P(t, "mouseup", this._disableDelayedDrag), P(t, "touchend", this._disableDelayedDrag), P(t, "touchcancel", this._disableDelayedDrag), P(t, "mousemove", this._delayedDragTouchMoveHandler), P(t, "touchmove", this._delayedDragTouchMoveHandler), P(t, "pointermove", this._delayedDragTouchMoveHandler)
  },
  _triggerDragStart: function(t, n) {
      n = n || t.pointerType == "touch" && t, !this.nativeDraggable || n ? this.options.supportPointer ? F(document, "pointermove", this._onTouchMove) : n ? F(document, "touchmove", this._onTouchMove) : F(document, "mousemove", this._onTouchMove) : (F(y, "dragend", this), F(H, "dragstart", this._onDragStart));
      try {
          document.selection ? At(function() {
              document.selection.empty()
          }) : window.getSelection().removeAllRanges()
      } catch {}
  },
  _dragStarted: function(t, n) {
      if (Ve = !1, H && y) {
          ie("dragStarted", this, {
              evt: n
          }), this.nativeDraggable && F(document, "dragover", Ii);
          var o = this.options;
          !t && le(y, o.dragClass, !1), le(y, o.ghostClass, !0), C.active = this, t && this._appendGhost(), oe({
              sortable: this,
              name: "start",
              originalEvent: n
          })
      } else this._nulling()
  },
  _emulateDragOver: function() {
      if (ge) {
          this._lastX = ge.clientX, this._lastY = ge.clientY, Ao();
          for (var t = document.elementFromPoint(ge.clientX, ge.clientY), n = t; t && t.shadowRoot && (t = t.shadowRoot.elementFromPoint(ge.clientX, ge.clientY), t !== n);) n = t;
          if (y.parentNode[ue]._isOutsideThisEl(t), n)
              do {
                  if (n[ue]) {
                      var o = void 0;
                      if (o = n[ue]._onDragOver({
                              clientX: ge.clientX,
                              clientY: ge.clientY,
                              target: t,
                              rootEl: n
                          }), o && !this.options.dragoverBubble) break
                  }
                  t = n
              } while (n = n.parentNode);
          Lo()
      }
  },
  _onTouchMove: function(t) {
      if (Fe) {
          var n = this.options,
              o = n.fallbackTolerance,
              s = n.fallbackOffset,
              i = t.touches ? t.touches[0] : t,
              r = D && Ke(D, !0),
              d = D && r && r.a,
              l = D && r && r.d,
              c = Et && te && Zn(te),
              m = (i.clientX - Fe.clientX + s.x) / (d || 1) + (c ? c[0] - an[0] : 0) / (d || 1),
              h = (i.clientY - Fe.clientY + s.y) / (l || 1) + (c ? c[1] - an[1] : 0) / (l || 1);
          if (!C.active && !Ve) {
              if (o && Math.max(Math.abs(i.clientX - this._lastX), Math.abs(i.clientY - this._lastY)) < o) return;
              this._onDragStart(t, !0)
          }
          if (D) {
              r ? (r.e += m - (sn || 0), r.f += h - (rn || 0)) : r = {
                  a: 1,
                  b: 0,
                  c: 0,
                  d: 1,
                  e: m,
                  f: h
              };
              var g = "matrix(".concat(r.a, ",").concat(r.b, ",").concat(r.c, ",").concat(r.d, ",").concat(r.e, ",").concat(r.f, ")");
              M(D, "webkitTransform", g), M(D, "mozTransform", g), M(D, "msTransform", g), M(D, "transform", g), sn = m, rn = h, ge = i
          }
          t.cancelable && t.preventDefault()
      }
  },
  _appendGhost: function() {
      if (!D) {
          var t = this.options.fallbackOnBody ? document.body : H,
              n = Z(y, !0, Et, !0, t),
              o = this.options;
          if (Et) {
              for (te = t; M(te, "position") === "static" && M(te, "transform") === "none" && te !== document;) te = te.parentNode;
              te !== document.body && te !== document.documentElement ? (te === document && (te = Se()), n.top += te.scrollTop, n.left += te.scrollLeft) : te = Se(), an = Zn(te)
          }
          D = y.cloneNode(!0), le(D, o.ghostClass, !1), le(D, o.fallbackClass, !0), le(D, o.dragClass, !0), M(D, "transition", ""), M(D, "transform", ""), M(D, "box-sizing", "border-box"), M(D, "margin", 0), M(D, "top", n.top), M(D, "left", n.left), M(D, "width", n.width), M(D, "height", n.height), M(D, "opacity", "0.8"), M(D, "position", Et ? "absolute" : "fixed"), M(D, "zIndex", "100000"), M(D, "pointerEvents", "none"), C.ghost = D, t.appendChild(D), M(D, "transform-origin", Qn / parseInt(D.style.width) * 100 + "% " + eo / parseInt(D.style.height) * 100 + "%")
      }
  },
  _onDragStart: function(t, n) {
      var o = this,
          s = t.dataTransfer,
          i = o.options;
      if (ie("dragStart", this, {
              evt: t
          }), C.eventCanceled) {
          this._onDrop();
          return
      }
      ie("setupClone", this), C.eventCanceled || (G = To(y), G.removeAttribute("id"), G.draggable = !1, G.style["will-change"] = "", this._hideClone(), le(G, this.options.chosenClass, !1), C.clone = G), o.cloneId = At(function() {
          ie("clone", o), !C.eventCanceled && (o.options.removeCloneOnHide || H.insertBefore(G, y), o._hideClone(), oe({
              sortable: o,
              name: "clone"
          }))
      }), !n && le(y, i.dragClass, !0), n ? (Rt = !0, o._loopId = setInterval(o._emulateDragOver, 50)) : (P(document, "mouseup", o._onDrop), P(document, "touchend", o._onDrop), P(document, "touchcancel", o._onDrop), s && (s.effectAllowed = "move", i.setData && i.setData.call(o, s, y)), F(document, "drop", o), M(y, "transform", "translateZ(0)")), Ve = !0, o._dragStartId = At(o._dragStarted.bind(o, n, t)), F(document, "selectstart", o), st = !0, lt && M(document.body, "user-select", "none")
  },
  _onDragOver: function(t) {
      var n = this.el,
          o = t.target,
          s, i, r, d = this.options,
          l = d.group,
          c = C.active,
          m = xt === l,
          h = d.sort,
          g = Q || c,
          u, f = this,
          b = !1;
      if (bn) return;

      function E(ke, Oe) {
          ie(ke, f, xe({
              evt: t,
              isOwner: m,
              axis: u ? "vertical" : "horizontal",
              revert: r,
              dragRect: s,
              targetRect: i,
              canSort: h,
              fromSortable: g,
              target: o,
              completed: I,
              onMove: function(ft, zo) {
                  return Mt(H, n, y, s, ft, Z(ft), t, zo)
              },
              changed: $
          }, Oe))
      }

      function w() {
          E("dragOverAnimationCapture"), f.captureAnimationState(), f !== g && g.captureAnimationState()
      }

      function I(ke) {
          return E("dragOverCompleted", {
              insertion: ke
          }), ke && (m ? c._hideClone() : c._showClone(f), f !== g && (le(y, Q ? Q.options.ghostClass : c.options.ghostClass, !1), le(y, d.ghostClass, !0)), Q !== f && f !== C.active ? Q = f : f === C.active && Q && (Q = null), g === f && (f._ignoreWhileAnimating = o), f.animateAll(function() {
              E("dragOverAnimationComplete"), f._ignoreWhileAnimating = null
          }), f !== g && (g.animateAll(), g._ignoreWhileAnimating = null)), (o === y && !y.animated || o === n && !o.animated) && (He = null), !d.dragoverBubble && !t.rootEl && o !== document && (y.parentNode[ue]._isOutsideThisEl(t.target), !ke && Re(t)), !d.dragoverBubble && t.stopPropagation && t.stopPropagation(), b = !0
      }

      function $() {
          de = he(y), Ae = he(y, d.draggable), oe({
              sortable: f,
              name: "change",
              toEl: n,
              newIndex: de,
              newDraggableIndex: Ae,
              originalEvent: t
          })
      }
      if (t.preventDefault !== void 0 && t.cancelable && t.preventDefault(), o = ye(o, d.draggable, n, !0), E("dragOver"), C.eventCanceled) return b;
      if (y.contains(t.target) || o.animated && o.animatingX && o.animatingY || f._ignoreWhileAnimating === o) return I(!1);
      if (Rt = !1, c && !d.disabled && (m ? h || (r = V !== H) : Q === this || (this.lastPutMode = xt.checkPull(this, c, y, t)) && l.checkPut(this, c, y, t))) {
          if (u = this._getDirection(t, o) === "vertical", s = Z(y), E("dragOverValid"), C.eventCanceled) return b;
          if (r) return V = H, w(), this._hideClone(), E("revert"), C.eventCanceled || (je ? H.insertBefore(y, je) : H.appendChild(y)), I(!0);
          var L = Tn(n, d.draggable);
          if (!L || Di(t, u, this) && !L.animated) {
              if (L === y) return I(!1);
              if (L && n === t.target && (o = L), o && (i = Z(o)), Mt(H, n, y, s, o, i, t, !!o) !== !1) return w(), L && L.nextSibling ? n.insertBefore(y, L.nextSibling) : n.appendChild(y), V = n, $(), I(!0)
          } else if (L && Oi(t, u, this)) {
              var W = Je(n, 0, d, !0);
              if (W === y) return I(!1);
              if (o = W, i = Z(o), Mt(H, n, y, s, o, i, t, !1) !== !1) return w(), n.insertBefore(y, W), V = n, $(), I(!0)
          } else if (o.parentNode === n) {
              i = Z(o);
              var J = 0,
                  j, Y = y.parentNode !== n,
                  B = !Mi(y.animated && y.toRect || s, o.animated && o.toRect || i, u),
                  ne = u ? "top" : "left",
                  _ = Jn(o, "top", "top") || Jn(y, "top", "top"),
                  S = _ ? _.scrollTop : void 0;
              He !== o && (j = i[ne], ht = !1, kt = !B && d.invertSwap || Y), J = Ai(t, o, i, u, B ? 1 : d.swapThreshold, d.invertedSwapThreshold == null ? d.swapThreshold : d.invertedSwapThreshold, kt, He === o);
              var x;
              if (J !== 0) {
                  var O = he(y);
                  do O -= J, x = V.children[O]; while (x && (M(x, "display") === "none" || x === D))
              }
              if (J === 0 || x === o) return I(!1);
              He = o, ut = J;
              var N = o.nextElementSibling,
                  q = !1;
              q = J === 1;
              var $e = Mt(H, n, y, s, o, i, t, q);
              if ($e !== !1) return ($e === 1 || $e === -1) && (q = $e === 1), bn = !0, setTimeout($i, 30), w(), q && !N ? n.appendChild(y) : o.parentNode.insertBefore(y, q ? N : o), _ && Io(_, 0, S - _.scrollTop), V = y.parentNode, j !== void 0 && !kt && (Dt = Math.abs(j - Z(o)[ne])), $(), I(!0)
          }
          if (n.contains(y)) return I(!1)
      }
      return !1
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
      P(document, "mousemove", this._onTouchMove), P(document, "touchmove", this._onTouchMove), P(document, "pointermove", this._onTouchMove), P(document, "dragover", Re), P(document, "mousemove", Re), P(document, "touchmove", Re)
  },
  _offUpEvents: function() {
      var t = this.el.ownerDocument;
      P(t, "mouseup", this._onDrop), P(t, "touchend", this._onDrop), P(t, "pointerup", this._onDrop), P(t, "touchcancel", this._onDrop), P(document, "selectstart", this)
  },
  _onDrop: function(t) {
      var n = this.el,
          o = this.options;
      if (de = he(y), Ae = he(y, o.draggable), ie("drop", this, {
              evt: t
          }), V = y && y.parentNode, de = he(y), Ae = he(y, o.draggable), C.eventCanceled) {
          this._nulling();
          return
      }
      Ve = !1, kt = !1, ht = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), yn(this.cloneId), yn(this._dragStartId), this.nativeDraggable && (P(document, "drop", this), P(n, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), lt && M(document.body, "user-select", ""), M(y, "transform", ""), t && (st && (t.cancelable && t.preventDefault(), !o.dropBubble && t.stopPropagation()), D && D.parentNode && D.parentNode.removeChild(D), (H === V || Q && Q.lastPutMode !== "clone") && G && G.parentNode && G.parentNode.removeChild(G), y && (this.nativeDraggable && P(y, "dragend", this), ln(y), y.style["will-change"] = "", st && !Ve && le(y, Q ? Q.options.ghostClass : this.options.ghostClass, !1), le(y, this.options.chosenClass, !1), oe({
          sortable: this,
          name: "unchoose",
          toEl: V,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: t
      }), H !== V ? (de >= 0 && (oe({
          rootEl: V,
          name: "add",
          toEl: V,
          fromEl: H,
          originalEvent: t
      }), oe({
          sortable: this,
          name: "remove",
          toEl: V,
          originalEvent: t
      }), oe({
          rootEl: V,
          name: "sort",
          toEl: V,
          fromEl: H,
          originalEvent: t
      }), oe({
          sortable: this,
          name: "sort",
          toEl: V,
          originalEvent: t
      })), Q && Q.save()) : de !== qe && de >= 0 && (oe({
          sortable: this,
          name: "update",
          toEl: V,
          originalEvent: t
      }), oe({
          sortable: this,
          name: "sort",
          toEl: V,
          originalEvent: t
      })), C.active && ((de == null || de === -1) && (de = qe, Ae = ct), oe({
          sortable: this,
          name: "end",
          toEl: V,
          originalEvent: t
      }), this.save()))), this._nulling()
  },
  _nulling: function() {
      ie("nulling", this), H = y = V = D = je = G = Ot = Le = Fe = ge = st = de = Ae = qe = ct = He = ut = Q = xt = C.dragged = C.ghost = C.clone = C.active = null, Bt.forEach(function(t) {
          t.checked = !0
      }), Bt.length = sn = rn = 0
  },
  handleEvent: function(t) {
      switch (t.type) {
          case "drop":
          case "dragend":
              this._onDrop(t);
              break;
          case "dragenter":
          case "dragover":
              y && (this._onDragOver(t), Ti(t));
              break;
          case "selectstart":
              t.preventDefault();
              break
      }
  },
  toArray: function() {
      for (var t = [], n, o = this.el.children, s = 0, i = o.length, r = this.options; s < i; s++) n = o[s], ye(n, r.draggable, this.el, !1) && t.push(n.getAttribute(r.dataIdAttr) || Ni(n));
      return t
  },
  sort: function(t, n) {
      var o = {},
          s = this.el;
      this.toArray().forEach(function(i, r) {
          var d = s.children[r];
          ye(d, this.options.draggable, s, !1) && (o[i] = d)
      }, this), n && this.captureAnimationState(), t.forEach(function(i) {
          o[i] && (s.removeChild(o[i]), s.appendChild(o[i]))
      }), n && this.animateAll()
  },
  save: function() {
      var t = this.options.store;
      t && t.set && t.set(this)
  },
  closest: function(t, n) {
      return ye(t, n || this.options.draggable, this.el, !1)
  },
  option: function(t, n) {
      var o = this.options;
      if (n === void 0) return o[t];
      var s = mt.modifyOption(this, t, n);
      typeof s < "u" ? o[t] = s : o[t] = n, t === "group" && Do(o)
  },
  destroy: function() {
      ie("destroy", this);
      var t = this.el;
      t[ue] = null, P(t, "mousedown", this._onTapStart), P(t, "touchstart", this._onTapStart), P(t, "pointerdown", this._onTapStart), this.nativeDraggable && (P(t, "dragover", this), P(t, "dragenter", this)), Array.prototype.forEach.call(t.querySelectorAll("[draggable]"), function(n) {
          n.removeAttribute("draggable")
      }), this._onDrop(), this._disableDelayedDragEvents(), jt.splice(jt.indexOf(this.el), 1), this.el = t = null
  },
  _hideClone: function() {
      if (!Le) {
          if (ie("hideClone", this), C.eventCanceled) return;
          M(G, "display", "none"), this.options.removeCloneOnHide && G.parentNode && G.parentNode.removeChild(G), Le = !0
      }
  },
  _showClone: function(t) {
      if (t.lastPutMode !== "clone") {
          this._hideClone();
          return
      }
      if (Le) {
          if (ie("showClone", this), C.eventCanceled) return;
          y.parentNode == H && !this.options.group.revertClone ? H.insertBefore(G, y) : je ? H.insertBefore(G, je) : H.appendChild(G), this.options.group.revertClone && this.animate(y, G), M(G, "display", ""), Le = !1
      }
  }
};

function Ti(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault()
}

function Mt(e, t, n, o, s, i, r, d) {
  var l, c = e[ue],
      m = c.options.onMove,
      h;
  return window.CustomEvent && !Te && !gt ? l = new CustomEvent("move", {
      bubbles: !0,
      cancelable: !0
  }) : (l = document.createEvent("Event"), l.initEvent("move", !0, !0)), l.to = t, l.from = e, l.dragged = n, l.draggedRect = o, l.related = s || t, l.relatedRect = i || Z(t), l.willInsertAfter = d, l.originalEvent = r, e.dispatchEvent(l), m && (h = m.call(c, l, r)), h
}

function ln(e) {
  e.draggable = !1
}

function $i() {
  bn = !1
}

function Oi(e, t, n) {
  var o = Z(Je(n.el, 0, n.options, !0)),
      s = 10;
  return t ? e.clientX < o.left - s || e.clientY < o.top && e.clientX < o.right : e.clientY < o.top - s || e.clientY < o.bottom && e.clientX < o.left
}

function Di(e, t, n) {
  var o = Z(Tn(n.el, n.options.draggable)),
      s = 10;
  return t ? e.clientX > o.right + s || e.clientX <= o.right && e.clientY > o.bottom && e.clientX >= o.left : e.clientX > o.right && e.clientY > o.top || e.clientX <= o.right && e.clientY > o.bottom + s
}

function Ai(e, t, n, o, s, i, r, d) {
  var l = o ? e.clientY : e.clientX,
      c = o ? n.height : n.width,
      m = o ? n.top : n.left,
      h = o ? n.bottom : n.right,
      g = !1;
  if (!r) {
      if (d && Dt < c * s) {
          if (!ht && (ut === 1 ? l > m + c * i / 2 : l < h - c * i / 2) && (ht = !0), ht) g = !0;
          else if (ut === 1 ? l < m + Dt : l > h - Dt) return -ut
      } else if (l > m + c * (1 - s) / 2 && l < h - c * (1 - s) / 2) return Li(t)
  }
  return g = g || r, g && (l < m + c * i / 2 || l > h - c * i / 2) ? l > m + c / 2 ? 1 : -1 : 0
}

function Li(e) {
  return he(y) < he(e) ? 1 : -1
}

function Ni(e) {
  for (var t = e.tagName + e.className + e.src + e.href + e.textContent, n = t.length, o = 0; n--;) o += t.charCodeAt(n);
  return o.toString(36)
}

function Pi(e) {
  Bt.length = 0;
  for (var t = e.getElementsByTagName("input"), n = t.length; n--;) {
      var o = t[n];
      o.checked && Bt.push(o)
  }
}

function At(e) {
  return setTimeout(e, 0)
}

function yn(e) {
  return clearTimeout(e)
}
Wt && F(document, "touchmove", function(e) {
  (C.active || Ve) && e.cancelable && e.preventDefault()
});
C.utils = {
  on: F,
  off: P,
  css: M,
  find: Mo,
  is: function(t, n) {
      return !!ye(t, n, t, !1)
  },
  extend: bi,
  throttle: Co,
  closest: ye,
  toggleClass: le,
  clone: To,
  index: he,
  nextTick: At,
  cancelNextTick: yn,
  detectDirection: Oo,
  getChild: Je
};
C.get = function(e) {
  return e[ue]
};
C.mount = function() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
  t[0].constructor === Array && (t = t[0]), t.forEach(function(o) {
      if (!o.prototype || !o.prototype.constructor) throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(o));
      o.utils && (C.utils = xe(xe({}, C.utils), o.utils)), mt.mount(o)
  })
};
C.create = function(e, t) {
  return new C(e, t)
};
C.version = pi;
var K = [],
  it, wn, _n = !1,
  dn, cn, zt, rt;

function Fi() {
  function e() {
      this.defaults = {
          scroll: !0,
          forceAutoScrollFallback: !1,
          scrollSensitivity: 30,
          scrollSpeed: 10,
          bubbleScroll: !0
      };
      for (var t in this) t.charAt(0) === "_" && typeof this[t] == "function" && (this[t] = this[t].bind(this))
  }
  return e.prototype = {
      dragStarted: function(n) {
          var o = n.originalEvent;
          this.sortable.nativeDraggable ? F(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? F(document, "pointermove", this._handleFallbackAutoScroll) : o.touches ? F(document, "touchmove", this._handleFallbackAutoScroll) : F(document, "mousemove", this._handleFallbackAutoScroll)
      },
      dragOverCompleted: function(n) {
          var o = n.originalEvent;
          !this.options.dragOverBubble && !o.rootEl && this._handleAutoScroll(o)
      },
      drop: function() {
          this.sortable.nativeDraggable ? P(document, "dragover", this._handleAutoScroll) : (P(document, "pointermove", this._handleFallbackAutoScroll), P(document, "touchmove", this._handleFallbackAutoScroll), P(document, "mousemove", this._handleFallbackAutoScroll)), no(), Lt(), yi()
      },
      nulling: function() {
          zt = wn = it = _n = rt = dn = cn = null, K.length = 0
      },
      _handleFallbackAutoScroll: function(n) {
          this._handleAutoScroll(n, !0)
      },
      _handleAutoScroll: function(n, o) {
          var s = this,
              i = (n.touches ? n.touches[0] : n).clientX,
              r = (n.touches ? n.touches[0] : n).clientY,
              d = document.elementFromPoint(i, r);
          if (zt = n, o || this.options.forceAutoScrollFallback || gt || Te || lt) {
              un(n, this.options, d, o);
              var l = Ne(d, !0);
              _n && (!rt || i !== dn || r !== cn) && (rt && no(), rt = setInterval(function() {
                  var c = Ne(document.elementFromPoint(i, r), !0);
                  c !== l && (l = c, Lt()), un(n, s.options, c, o)
              }, 10), dn = i, cn = r)
          } else {
              if (!this.options.bubbleScroll || Ne(d, !0) === Se()) {
                  Lt();
                  return
              }
              un(n, this.options, Ne(d, !1), !1)
          }
      }
  }, Ce(e, {
      pluginName: "scroll",
      initializeByDefault: !0
  })
}

function Lt() {
  K.forEach(function(e) {
      clearInterval(e.pid)
  }), K = []
}

function no() {
  clearInterval(rt)
}
var un = Co(function(e, t, n, o) {
      if (t.scroll) {
          var s = (e.touches ? e.touches[0] : e).clientX,
              i = (e.touches ? e.touches[0] : e).clientY,
              r = t.scrollSensitivity,
              d = t.scrollSpeed,
              l = Se(),
              c = !1,
              m;
          wn !== n && (wn = n, Lt(), it = t.scroll, m = t.scrollFn, it === !0 && (it = Ne(n, !0)));
          var h = 0,
              g = it;
          do {
              var u = g,
                  f = Z(u),
                  b = f.top,
                  E = f.bottom,
                  w = f.left,
                  I = f.right,
                  $ = f.width,
                  L = f.height,
                  W = void 0,
                  J = void 0,
                  j = u.scrollWidth,
                  Y = u.scrollHeight,
                  B = M(u),
                  ne = u.scrollLeft,
                  _ = u.scrollTop;
              u === l ? (W = $ < j && (B.overflowX === "auto" || B.overflowX === "scroll" || B.overflowX === "visible"), J = L < Y && (B.overflowY === "auto" || B.overflowY === "scroll" || B.overflowY === "visible")) : (W = $ < j && (B.overflowX === "auto" || B.overflowX === "scroll"), J = L < Y && (B.overflowY === "auto" || B.overflowY === "scroll"));
              var S = W && (Math.abs(I - s) <= r && ne + $ < j) - (Math.abs(w - s) <= r && !!ne),
                  x = J && (Math.abs(E - i) <= r && _ + L < Y) - (Math.abs(b - i) <= r && !!_);
              if (!K[h])
                  for (var O = 0; O <= h; O++) K[O] || (K[O] = {});
              (K[h].vx != S || K[h].vy != x || K[h].el !== u) && (K[h].el = u, K[h].vx = S, K[h].vy = x, clearInterval(K[h].pid), (S != 0 || x != 0) && (c = !0, K[h].pid = setInterval((function() {
                  o && this.layer === 0 && C.active._onTouchMove(zt);
                  var N = K[this.layer].vy ? K[this.layer].vy * d : 0,
                      q = K[this.layer].vx ? K[this.layer].vx * d : 0;
                  typeof m == "function" && m.call(C.dragged.parentNode[ue], q, N, e, zt, K[this.layer].el) !== "continue" || Io(K[this.layer].el, q, N)
              }).bind({
                  layer: h
              }), 24))), h++
          } while (t.bubbleScroll && g !== l && (g = Ne(g, !1)));
          _n = c
      }
  }, 30),
  No = function(t) {
      var n = t.originalEvent,
          o = t.putSortable,
          s = t.dragEl,
          i = t.activeSortable,
          r = t.dispatchSortableEvent,
          d = t.hideGhostForTarget,
          l = t.unhideGhostForTarget;
      if (n) {
          var c = o || i;
          d();
          var m = n.changedTouches && n.changedTouches.length ? n.changedTouches[0] : n,
              h = document.elementFromPoint(m.clientX, m.clientY);
          l(), c && !c.el.contains(h) && (r("spill"), this.onSpill({
              dragEl: s,
              putSortable: o
          }))
      }
  };

function $n() {}
$n.prototype = {
  startIndex: null,
  dragStart: function(t) {
      var n = t.oldDraggableIndex;
      this.startIndex = n
  },
  onSpill: function(t) {
      var n = t.dragEl,
          o = t.putSortable;
      this.sortable.captureAnimationState(), o && o.captureAnimationState();
      var s = Je(this.sortable.el, this.startIndex, this.options);
      s ? this.sortable.el.insertBefore(n, s) : this.sortable.el.appendChild(n), this.sortable.animateAll(), o && o.animateAll()
  },
  drop: No
};
Ce($n, {
  pluginName: "revertOnSpill"
});

function On() {}
On.prototype = {
  onSpill: function(t) {
      var n = t.dragEl,
          o = t.putSortable,
          s = o || this.sortable;
      s.captureAnimationState(), n.parentNode && n.parentNode.removeChild(n), s.animateAll()
  },
  drop: No
};
Ce(On, {
  pluginName: "removeOnSpill"
});
C.mount(new Fi);
C.mount(On, $n);
const Ri = "/webpages/dist/assets/drag.svg",
  ji = "/webpages/dist/assets/plus.svg",
  Po = "/webpages/dist/assets/undo.svg";
const Bi = {
      components: {
          Picker: ei,
          ResetDropdown: ui
      },
      props: ["addon", "tableChild", "setting", "addon-settings"],
      data() {
          var e;
          return {
              rowDropdownOpen: !1,
              noResetDropdown: ["table", "boolean", "select"].includes((e = this.setting) == null ? void 0 : e.type)
          }
      },
      mounted() {
          Pe.$on("close-reset-dropdowns", e => {
              this.rowDropdownOpen && this.setting.id !== e && (this.rowDropdownOpen = !1)
          })
      },
      computed: {
          show() {
              return !!(!this.setting.if || this.setting.if.addonEnabled && (Array.isArray(this.setting.if.addonEnabled) ? this.setting.if.addonEnabled : [this.setting.if.addonEnabled]).some(t => this.$root.manifestsById[t]._enabled === !0) || this.setting.if.settings && Object.keys(this.setting.if.settings).some(t => (Array.isArray(this.setting.if.settings[t]) ? this.setting.if.settings[t] : [this.setting.if.settings[t]]).some(o => {
                  var s, i;
                  return this.addonSettings[t] === o || ((i = (s = this.$parent) == null ? void 0 : s.addonSettings) == null ? void 0 : i[t]) === o
              })) === !0)
          },
          showResetDropdown() {
              return !this.tableChild && this.addon.presets && this.addon.presets.some(e => Object.prototype.hasOwnProperty.call(e.values, this.setting.id) && (this.setting.type === "color" ? e.values[this.setting.id].toLowerCase() !== this.setting.default.toLowerCase() : e.values[this.setting.id] !== this.setting.default))
          },
          isNewOption() {
              if (!this.addon.latestUpdate) return !1;
              const [e, t, n] = this.$root.version.split("."), [o, s, i] = this.addon.latestUpdate.version.split(".");
              return e === o && t === s ? !!(this.addon.latestUpdate.newSettings && this.addon.latestUpdate.newSettings.includes(this.setting.id)) : !1
          }
      },
      methods: {
          updateTable(e) {
              let t = this.addonSettings[this.setting.id];
              t.splice(e.newIndex, 0, t.splice(e.oldIndex, 1)[0]), this.updateSettings()
          },
          settingsName(e) {
              const t = this.setting.name,
                  n = /([\\]*)(@|#)([a-zA-Z0-9.\-\/_]*)/g;
              return t.replace(n, o => {
                  if (o[0] === "\\") return o.slice(1);
                  if (o[0] === "@") return `<img class="inline-icon" src="../../images/icons/${o.split("@")[1]}"/>`;
                  if (o[0] === "#") return `<img class="inline-icon" src="../../addons/${e._addonId}/${o.split("#")[1]}"/>`
              })
          },
          checkValidity(e) {
              let t = e.target;
              this.addonSettings[this.setting.id] = t.validity.valid ? t.value : this.setting.default
          },
          keySettingKeyDown(e) {
              e.preventDefault(), e.target.value = e.ctrlKey ? "Ctrl" + (e.shiftKey ? " + Shift" : "") + (e.key === "Control" || e.key === "Shift" ? "" : (e.ctrlKey ? " + " : "") + (e.key.toUpperCase() === e.key ? e.code.includes("Digit") ? e.code.substring(5, e.code.length) : e.key : e.key.toUpperCase())) : ""
          },
          keySettingKeyUp(e) {
              e.target.value === "Ctrl" && (e.target.value = ""), this.updateOption(e.target.value)
          },
          getTableSetting(e) {
              return this.setting.row.find(t => t.id === e)
          },
          deleteTableRow(e) {
              this.addonSettings[this.setting.id].splice(e, 1), this.updateSettings()
          },
          addTableRow(e = {}) {
              const t = Object.assign({}, this.setting.row.reduce((n, o) => (n[o.id] = o.default, n), {}), e);
              this.addonSettings[this.setting.id].push(t), this.updateSettings(), this.rowDropdownOpen && this.toggleRowDropdown()
          },
          toggleRowDropdown() {
              this.rowDropdownOpen = !this.rowDropdownOpen, this.$root.closePickers({
                  isTrusted: !0
              }, null, {
                  callCloseDropdowns: !1
              }), this.$root.closeResetDropdowns({
                  isTrusted: !0
              }, this.setting.id)
          },
          msg(...e) {
              return this.$root.msg(...e)
          },
          updateSettings(...e) {
              e[0] || (e[0] = this.addon), this.$root.updateSettings(...e)
          },
          updateOption(e) {
              this.addonSettings[this.setting.id] = e, this.updateSettings()
          },
          closePickers(...e) {
              return this.$root.closePickers(...e)
          },
          closeResetDropdowns(...e) {
              return this.$root.closeResetDropdowns(...e)
          }
      },
      directives: {
          sortable: {
              mounted: (e, t, n) => {
                  const o = new C(e, {
                      handle: ".handle",
                      animation: 300,
                      onUpdate: t.value.update,
                      disabled: !t.value.enabled
                  });
                  Pe.$on(`toggle-addon-request-${t.value.id}`, s => {
                      o.option("disabled", !s)
                  })
              }
          }
      }
  },
  zi = {
      class: "setting-label-container"
  },
  Ui = ["innerHTML"],
  Hi = {
      key: 0,
      class: "setting-table"
  },
  Wi = {
      class: "setting-table-list"
  },
  Gi = {
      class: "setting-table-row"
  },
  Vi = {
      class: "setting-table-options"
  },
  Xi = ["disabled", "onClick"],
  Yi = a("img", {
      class: "icon-type",
      src: wo
  }, null, -1),
  qi = [Yi],
  Ki = ["disabled"],
  Ji = a("img", {
      class: "icon-type",
      src: Ri
  }, null, -1),
  Zi = [Ji],
  Qi = {
      class: "setting-table-row-settings"
  },
  er = ["disabled"],
  tr = a("img", {
      class: "icon-type",
      src: ji
  }, null, -1),
  nr = [tr],
  or = ["disabled"],
  sr = a("img", {
      class: "icon-type",
      src: Ht
  }, null, -1),
  ir = [sr],
  rr = ["onClick"],
  ar = ["disabled"],
  lr = {
      key: 2,
      class: "filter-options"
  },
  dr = ["onClick"],
  cr = ["disabled"],
  ur = ["disabled", "min", "max"],
  hr = ["disabled", "placeholder", "maxlength", "minlength", "required"],
  gr = ["disabled", "placeholder"],
  mr = ["disabled", "title"],
  pr = a("img", {
      src: Po,
      class: "icon-type"
  }, null, -1),
  fr = [pr];

function vr(e, t, n, o, s, i) {
  const r = me("addon-tag"),
      d = me("AddonSetting", !0),
      l = me("picker"),
      c = me("reset-dropdown"),
      m = Nt("sortable"),
      h = Nt("click-outside");
  return R((p(), v("div", {
      class: U(["addon-setting", {
          "boolean-setting": n.setting.type === "boolean",
          "number-setting": n.setting.type === "integer" || n.setting.type === "positive_integer"
      }])
  }, [a("div", zi, [a("div", {
      class: "setting-label",
      innerHTML: i.settingsName(n.addon)
  }, null, 8, Ui), i.isNewOption ? (p(), pe(r, {
      key: 0,
      tag: "new"
  })) : A("", !0)]), s.noResetDropdown ? (p(), v(z, {
      key: 0
  }, [n.setting.type === "table" ? (p(), v("div", Hi, [R((p(), v("div", Wi, [(p(!0), v(z, null, X(e.addonSettings[n.setting.id], (g, u) => (p(), v("div", Gi, [a("div", Vi, [a("button", {
      disabled: !n.addon._enabled,
      class: "addon-buttons",
      onClick: f => i.deleteTableRow(u)
  }, qi, 8, Xi), a("button", {
      disabled: !n.addon._enabled,
      class: "addon-buttons handle"
  }, Zi, 8, Ki)]), a("div", Qi, [(p(!0), v(z, null, X(g, (f, b) => (p(), pe(d, {
      addon: n.addon,
      "table-child": !0,
      setting: i.getTableSetting(b),
      "addon-settings": g
  }, null, 8, ["addon", "setting", "addon-settings"]))), 256))])]))), 256))])), [
      [m, {
          update: i.updateTable,
          enabled: n.addon._enabled,
          id: n.addon.id
      }]
  ]), a("div", {
      class: U(["addon-split-button setting-table-dropdown", {
          open: s.rowDropdownOpen
      }])
  }, [a("button", {
      disabled: !n.addon._enabled,
      class: "addon-buttons addon-split-button-button",
      onClick: t[0] || (t[0] = g => i.addTableRow())
  }, nr, 8, er), R((p(), v("div", null, [a("button", {
      disabled: !n.addon._enabled,
      class: "addon-buttons addon-split-button-dropdown",
      onClick: t[1] || (t[1] = (...g) => i.toggleRowDropdown && i.toggleRowDropdown(...g))
  }, ir, 8, or), a("ul", null, [(p(!0), v(z, null, X(n.setting.presets, g => (p(), v("li", {
      onClick: u => i.addTableRow(g.values)
  }, k(g.name), 9, rr))), 256))])])), [
      [h, i.closeResetDropdowns]
  ])], 2)])) : A("", !0), n.setting.type === "boolean" ? R((p(), v("input", {
      key: 1,
      type: "checkbox",
      class: "setting-input check",
      "onUpdate:modelValue": t[2] || (t[2] = g => e.addonSettings[n.setting.id] = g),
      onChange: t[3] || (t[3] = g => i.updateSettings()),
      disabled: !n.addon._enabled
  }, null, 40, ar)), [
      [lo, e.addonSettings[n.setting.id]]
  ]) : A("", !0), n.setting.type === "select" ? (p(), v("div", lr, [(p(!0), v(z, null, X(n.setting.potentialValues, g => (p(), v("div", {
      class: U(["filter-option", {
          sel: e.addonSettings[n.setting.id] === g.id,
          disabled: !n.addon._enabled
      }]),
      onClick: u => i.updateOption(g.id)
  }, k(g.name), 11, dr))), 256))])) : A("", !0)], 64)) : (p(), v("div", {
      key: 1,
      class: U(["setting-input-container", {
          "full-radius": n.tableChild
      }])
  }, [n.setting.type === "positive_integer" ? R((p(), v("input", {
      key: 0,
      type: "number",
      class: "setting-input number",
      "onUpdate:modelValue": t[4] || (t[4] = g => e.addonSettings[n.setting.id] = g),
      onChange: t[5] || (t[5] = g => i.checkValidity(g) || i.updateSettings()),
      disabled: !n.addon._enabled,
      min: "0",
      number: ""
  }, null, 40, cr)), [
      [nt, e.addonSettings[n.setting.id]]
  ]) : A("", !0), n.setting.type === "integer" ? R((p(), v("input", {
      key: 1,
      type: "number",
      class: "setting-input number",
      "onUpdate:modelValue": t[6] || (t[6] = g => e.addonSettings[n.setting.id] = g),
      onChange: t[7] || (t[7] = g => i.checkValidity(g) || i.updateSettings()),
      disabled: !n.addon._enabled,
      min: n.setting.min,
      max: n.setting.max,
      number: ""
  }, null, 40, ur)), [
      [nt, e.addonSettings[n.setting.id]]
  ]) : A("", !0), n.setting.type === "string" || n.setting.type === "untranslated" ? R((p(), v("input", {
      key: 2,
      type: "text",
      class: "setting-input string",
      "onUpdate:modelValue": t[8] || (t[8] = g => e.addonSettings[n.setting.id] = g),
      onChange: t[9] || (t[9] = g => i.checkValidity(g) || i.updateSettings()),
      disabled: !n.addon._enabled,
      placeholder: n.setting.default,
      maxlength: n.setting.max || 100,
      minlength: n.setting.min || 0,
      required: !!n.setting.min
  }, null, 40, hr)), [
      [nt, e.addonSettings[n.setting.id]]
  ]) : A("", !0), n.setting.type === "key" ? R((p(), v("input", {
      key: 3,
      type: "text",
      class: "setting-input",
      "onUpdate:modelValue": t[10] || (t[10] = g => e.addonSettings[n.setting.id] = g),
      onInput: t[11] || (t[11] = (...g) => i.updateSettings && i.updateSettings(...g)),
      onKeydown: t[12] || (t[12] = (...g) => i.keySettingKeyDown && i.keySettingKeyDown(...g)),
      onKeyup: t[13] || (t[13] = (...g) => i.keySettingKeyUp && i.keySettingKeyUp(...g)),
      disabled: !n.addon._enabled,
      placeholder: n.setting.default,
      maxlength: "100",
      spellcheck: "false"
  }, null, 40, gr)), [
      [nt, e.addonSettings[n.setting.id]]
  ]) : A("", !0), n.setting.type === "color" ? R((p(), pe(l, {
      key: 4,
      modelValue: e.addonSettings[n.setting.id],
      "onUpdate:modelValue": t[14] || (t[14] = g => e.addonSettings[n.setting.id] = g),
      setting: n.setting,
      addon: n.addon,
      alphaEnabled: n.setting.allowTransparency
  }, null, 8, ["modelValue", "setting", "addon", "alphaEnabled"])), [
      [h, i.closePickers]
  ]) : A("", !0), i.showResetDropdown ? R((p(), pe(c, {
      key: 5,
      setting: n.setting,
      enabled: n.addon._enabled,
      presets: n.addon.presets
  }, null, 8, ["setting", "enabled", "presets"])), [
      [h, i.closeResetDropdowns]
  ]) : A("", !0), !n.tableChild && !i.showResetDropdown ? (p(), v("button", {
      key: 6,
      type: "button",
      class: "large-button clear-button",
      disabled: !n.addon._enabled,
      title: i.msg("reset"),
      onClick: t[15] || (t[15] = g => i.updateOption(n.setting.default || ""))
  }, fr, 8, mr)) : A("", !0)], 2))], 2)), [
      [ee, i.show]
  ])
}
const br = ve(Bi, [
  ["render", vr]
]);
const yr = window.parent !== window,
  wr = {
      props: ["tag"],
      data() {
          return {}
      },
      computed: {
          tagInfo() {
              return yo.find(e => e.matchName === this.tag)
          },
          shouldShow() {
              return yr ? this.tagInfo && this.tagInfo.iframeAlwaysShow : this.tagInfo && (!this.tagInfo.addonTabShow || this.tagInfo.addonTabShow[this.$root.selectedCategory])
          },
          tagName() {
              return chrome.i18n.getMessage(this.tagInfo.name)
          },
          tagTooltip() {
              return chrome.i18n.getMessage(this.tagInfo.tooltipText)
          }
      }
  },
  _r = {
      key: 0,
      class: "tooltiptext"
  };

function Sr(e, t, n, o, s, i) {
  return i.shouldShow ? (p(), v("div", {
      key: 0,
      class: U(["badge", {
          tooltip: i.tagInfo.tooltipText,
          blue: i.tagInfo.color === "blue",
          yellow: i.tagInfo.color === "yellow",
          red: i.tagInfo.color === "red",
          darkred: i.tagInfo.color === "darkred",
          green: i.tagInfo.color === "green",
          darkgreen: i.tagInfo.color === "darkgreen",
          purple: i.tagInfo.color === "purple"
      }])
  }, [re(k(i.tagName) + " ", 1), i.tagInfo.tooltipText ? (p(), v("span", _r, k(i.tagTooltip), 1)) : A("", !0)], 2)) : A("", !0)
}
const xr = ve(wr, [
  ["render", Sr]
]);

function fe(e) {
  return {
      r: parseInt(e.substring(1, 3), 16),
      g: parseInt(e.substring(3, 5), 16),
      b: parseInt(e.substring(5, 7), 16),
      a: e.length >= 9 ? parseInt(e.substring(7, 9), 16) / 255 : 1
  }
}

function Ct(e) {
  return e = Math.round(e).toString(16), e.length === 1 ? `0${e}` : e
}

function pt(e) {
  const t = Ct(e.r),
      n = Ct(e.g),
      o = Ct(e.b),
      s = e.a !== void 0 ? Ct(255 * e.a) : "";
  return `#${t}${n}${o}${s}`
}

function Fo({
  h: e,
  s: t,
  v: n
}) {
  if (t === 0) return {
      r: 255 * n,
      g: 255 * n,
      b: 255 * n
  };
  e %= 360, e < 0 && (e += 360);
  const o = e / 60,
      s = Math.floor(o),
      i = n * (1 - t * (1 - o + s)),
      r = n * (1 - t * (o - s)),
      d = n * (1 - t);
  switch (s) {
      case 0:
          return {
              r: 255 * n, g: 255 * i, b: 255 * d
          };
      case 1:
          return {
              r: 255 * r, g: 255 * n, b: 255 * d
          };
      case 2:
          return {
              r: 255 * d, g: 255 * n, b: 255 * i
          };
      case 3:
          return {
              r: 255 * d, g: 255 * r, b: 255 * n
          };
      case 4:
          return {
              r: 255 * i, g: 255 * d, b: 255 * n
          };
      case 5:
          return {
              r: 255 * n, g: 255 * d, b: 255 * r
          }
  }
}

function at({
  r: e,
  g: t,
  b: n
}) {
  e /= 255, t /= 255, n /= 255;
  const o = Math.max(e, t, n),
      s = o - Math.min(e, t, n);
  if (s === 0) return {
      h: 0,
      s: 0,
      v: o
  };
  const i = s / o,
      r = (o - e) / s,
      d = (o - t) / s,
      l = (o - n) / s;
  let c;
  return r ? d ? l || (c = 4 + d - r) : c = 2 + r - l : c = l - d, {
      h: 60 * c % 360,
      s: i,
      v: o
  }
}

function Sn(e) {
  const {
      r: t,
      g: n,
      b: o
  } = fe(e);
  return t * .299 + n * .587 + o * .114
}

function kr(e, t, n, o) {
  return o = o !== void 0 ? o : 170, typeof o != "number" && (o = Sn(o)), Sn(e) > o ? t !== void 0 ? t : "#575e75" : n !== void 0 ? n : "#ffffff"
}

function Er(e, t) {
  const {
      r: n,
      g: o,
      b: s,
      a: i
  } = fe(e);
  return t.r === void 0 && (t.r = 1), t.g === void 0 && (t.g = 1), t.b === void 0 && (t.b = 1), t.a === void 0 && (t.a = 1), pt({
      r: t.r * n,
      g: t.g * o,
      b: t.b * s,
      a: t.a * i
  })
}

function Mr(e, t) {
  const {
      r: n,
      g: o,
      b: s,
      a: i
  } = fe(e);
  return t.r === void 0 && (t.r = 1), t.g === void 0 && (t.g = 1), t.b === void 0 && (t.b = 1), t.a === void 0 && (t.a = 1), pt({
      r: (1 - t.r) * 255 + t.r * n,
      g: (1 - t.g) * 255 + t.g * o,
      b: (1 - t.b) * 255 + t.b * s,
      a: 1 - t.a + t.a * i
  })
}

function Cr(e, t) {
  const {
      r: n,
      g: o,
      b: s
  } = fe(e), {
      r: i,
      g: r,
      b: d,
      a: l
  } = fe(t);
  return pt({
      r: (1 - l) * n + l * i,
      g: (1 - l) * o + l * r,
      b: (1 - l) * s + l * d
  })
}

function Ir(e) {
  return e.substring(0, 7)
}

function Tr(e, t, n) {
  const o = typeof e == "number" ? e : at(fe(e)).h,
      s = typeof e != "number" && at(fe(e)).s === 0 ? 0 : typeof t == "number" ? t : at(fe(t)).s,
      i = typeof n == "number" ? n : at(fe(n)).v;
  return pt(Fo({
      h: o,
      s,
      v: i
  }))
}

function $r(e) {
  const {
      r: t,
      g: n,
      b: o
  } = fe(e);
  return `url("data:image/svg+xml,
  <svg xmlns='http://www.w3.org/2000/svg'>
    <filter id='recolor'>
      <feColorMatrix color-interpolation-filters='sRGB' values='
        0 0 0 0 ${t/255}
        0 0 0 0 ${n/255}
        0 0 0 0 ${o/255}
        0 0 0 1 0
      '/>
    </filter>
  </svg>#recolor
")`.split(`
`).join("")
}
globalThis.__scratchAddonsTextColor = {
  parseHex: fe,
  convertToHex: pt,
  convertFromHsv: Fo,
  convertToHsv: at,
  brightness: Sn,
  textColor: kr,
  multiply: Er,
  brighten: Mr,
  alphaBlend: Cr,
  removeAlpha: Ir,
  makeHsv: Tr,
  recolorFilter: $r
};
const {
  parseHex: Lc,
  convertToHex: Nc,
  convertFromHsv: Pc,
  convertToHsv: Fc,
  brightness: Rc,
  textColor: ae,
  multiply: et,
  brighten: jc,
  alphaBlend: oo,
  removeAlpha: Bc,
  makeHsv: so,
  recolorFilter: zc
} = globalThis.__scratchAddonsTextColor;
const Or = {
      props: ["options", "settings", "hoveredSettingId"],
      data() {
          return {
              tabs: [{
                  id: "code",
                  textLength: 4
              }, {
                  id: "costumes",
                  textLength: 8
              }, {
                  id: "sounds",
                  textLength: 6
              }],
              selectedTab: "code",
              fullScreenView: !1,
              blockCategories: [{
                  primary: "#4c97ff",
                  tertiary: "#3373cc",
                  textLength: [6]
              }, {
                  primary: "#9966ff",
                  tertiary: "#774dcb",
                  textLength: [5]
              }, {
                  primary: "#cf63cf",
                  tertiary: "#bd42bd",
                  textLength: [5]
              }, {
                  primary: "#ffd500",
                  tertiary: "#cc9900",
                  textLength: [6]
              }, {
                  primary: "#ffab19",
                  tertiary: "#cf8b17",
                  textLength: [7]
              }, {
                  primary: "#5cb1d6",
                  tertiary: "#2e8eb8",
                  textLength: [7]
              }, {
                  primary: "#59c059",
                  tertiary: "#389438",
                  textLength: [9]
              }, {
                  primary: "#ff8c1a",
                  tertiary: "#db6e00",
                  textLength: [9]
              }, {
                  primary: "#ff6680",
                  tertiary: "#ff3355",
                  textLength: [2, 6]
              }],
              soundEffects: [{
                  textLength: [6]
              }, {
                  textLength: [6]
              }, {
                  textLength: [6]
              }, {
                  textLength: [6]
              }, {
                  textLength: [4]
              }, {
                  textLength: [4, 2]
              }, {
                  textLength: [4, 3]
              }, {
                  textLength: [7]
              }, {
                  textLength: [7]
              }]
          }
      },
      computed: {
          colors() {
              return {
                  primaryText: ae(this.settings.primary),
                  menuBarText: ae(this.settings.menuBar),
                  accentText: ae(this.settings.accent),
                  inputText: ae(this.settings.input),
                  categoryMenuText: ae(this.settings.categoryMenu),
                  selectorText: ae(this.settings.selector),
                  selector2Text: ae(this.settings.selector2),
                  pageText: ae(this.settings.page, "rgba(87, 94, 117, 0.75)", "rgba(255, 255, 255, 0.75)"),
                  menuBarBorder: ae(this.settings.menuBar, "rgba(0, 0, 0, 0.15)", "rgba(255, 255, 255, 0.15)", 60),
                  accentTransparentText: ae(this.settings.accent, "rgba(87, 94, 117, 0.75)", "rgba(255, 255, 255, 0.75)"),
                  accentArtboard: this.settings.affectPaper ? this.settings.accent : "#ffffff",
                  accentCheckerboard: this.settings.affectPaper ? et(ae(this.settings.accent, oo(this.settings.accent, et(so(this.settings.primary, 1, .67), {
                      a: .15
                  })), oo(this.settings.accent, et(so(this.settings.primary, .5, 1), {
                      a: .15
                  })), 112), {
                      a: .55
                  }) : "#d9e3f28c",
                  tabText: ae(this.settings.tab, "rgba(87, 94, 117, 0.75)", "rgba(255, 255, 255, 0.75)"),
                  categoryMenuSelection: ae(this.settings.categoryMenu, "rgba(87, 124, 155, 0.13)", "rgba(255, 255, 255, 0.05)"),
                  primaryTransparent: et(this.settings.primary, {
                      a: .35
                  }),
                  inputTransparent: et(this.settings.input, {
                      a: .25
                  })
              }
          }
      },
      methods: {
          selectTab(e) {
              this.selectedTab = e, this.$emit("areahover", "activeTab")
          },
          toggleFullScreenView() {
              this.fullScreenView = !this.fullScreenView
          },
          cssVariables(e) {
              return Object.entries(e).map(([t, n]) => `${t}: ${n};`).join(`
`)
          }
      }
  },
  Dr = ["data-setting-hovered"],
  Ar = Ie('<div class="edm-logo-placeholder"></div><div class="edm-menu-bar-menu edm-icon-placeholder edm-icon-placeholder-20px"></div><div class="edm-menu-bar-menu edm-icon-placeholder edm-icon-placeholder-20px"></div><div class="edm-menu-bar-menu edm-icon-placeholder edm-icon-placeholder-20px"></div><div class="edm-menu-bar-input"><div class="edm-text-placeholder" style="--length:8;"></div><div class="edm-text-placeholder" style="--length:1;"></div></div><div class="edm-menu-bar-button edm-menu-bar-share"><div class="edm-text-placeholder" style="--length:5;"></div></div><div class="edm-menu-bar-button"><div class="edm-icon-placeholder edm-icon-placeholder-20px"></div><div class="edm-text-placeholder" style="--length:3;"></div><div class="edm-text-placeholder" style="--length:7;"></div><div class="edm-text-placeholder" style="--length:4;"></div></div><div class="edm-menu-bar-separator"></div><div class="edm-menu-bar-menu"><div class="edm-icon-placeholder edm-icon-placeholder-20px"></div><div class="edm-text-placeholder" style="--length:9;"></div></div><div class="edm-spacer"></div><div class="edm-menu-bar-menu edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-menu-bar-menu"><div class="edm-menu-bar-button edm-avatar-placeholder"></div><div class="edm-text-placeholder" style="--length:10;"></div></div>', 12),
  Lr = [Ar],
  Nr = {
      class: "edm-main"
  },
  Pr = {
      class: "edm-left"
  },
  Fr = {
      class: "edm-tabs"
  },
  Rr = ["onMouseenter", "onClick"],
  jr = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px"
  }, null, -1),
  Br = {
      key: 0,
      class: "edm-tab-content edm-workspace"
  },
  zr = {
      class: "edm-category-label"
  },
  Ur = a("div", {
      class: "edm-spacer"
  }, null, -1),
  Hr = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-24px"
  }, null, -1),
  Wr = [Hr],
  Gr = a("div", {
      class: "edm-asset-image"
  }, [a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-24px"
  })], -1),
  Vr = a("div", {
      class: "edm-text-placeholder edm-text-placeholder-small",
      style: {
          "--length": "7"
      }
  }, null, -1),
  Xr = [Vr],
  Yr = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px"
  }, null, -1),
  qr = [Yr],
  Kr = Ie('<div class="edm-asset edm-asset"><div class="edm-asset-image"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div></div><div class="edm-asset-name"><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:5;"></div></div></div><div class="edm-asset edm-asset"><div class="edm-asset-image"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div></div><div class="edm-asset-name"><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:3;"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:1;"></div></div></div>', 2),
  Jr = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-24px"
  }, null, -1),
  Zr = [Jr],
  Qr = {
      key: 0,
      class: "edm-asset-editor"
  },
  ea = {
      class: "edm-toolbar"
  },
  ta = a("div", {
      class: "edm-text-placeholder edm-text-placeholder-small",
      style: {
          "--length": "7"
      }
  }, null, -1),
  na = a("div", {
      class: "edm-text-placeholder edm-text-placeholder-small",
      style: {
          "--length": "8"
      }
  }, null, -1),
  oa = [na],
  sa = Ie('<div><div class="edm-outlined-button edm-outlined-button-first edm-outlined-button-colored-icon"><div class="edm-icon-placeholder edm-icon-placeholder-20px"></div></div><div class="edm-outlined-button edm-outlined-button-last edm-outlined-button-colored-icon"><div class="edm-icon-placeholder edm-icon-placeholder-20px"></div></div></div><div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:6;"></div></div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:8;"></div></div></div><div class="edm-toolbar-separator"></div><div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:7;"></div></div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:8;"></div></div></div><div class="edm-toolbar-separator"></div><div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:5;"></div></div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:4;"></div></div></div>', 6),
  ia = {
      class: "edm-toolbar"
  },
  ra = a("div", null, [a("div", {
      class: "edm-text-placeholder edm-text-placeholder-small",
      style: {
          "--length": "4"
      }
  }), a("div", {
      class: "edm-outlined-button edm-outlined-button-first edm-paint-picker-color"
  }), a("div", {
      class: "edm-outlined-button edm-outlined-button-last edm-paint-picker-arrow"
  })], -1),
  aa = a("div", {
      class: "edm-text-placeholder edm-text-placeholder-small",
      style: {
          "--length": "7"
      }
  }, null, -1),
  la = a("div", {
      class: "edm-outlined-button edm-outlined-button-first edm-paint-picker-color"
  }, null, -1),
  da = a("div", {
      class: "edm-outlined-button edm-outlined-button-last edm-paint-picker-arrow"
  }, null, -1),
  ca = a("div", {
      class: "edm-text-placeholder edm-text-placeholder-small",
      style: {
          "--length": "2"
      }
  }, null, -1),
  ua = [ca],
  ha = Ie('<div class="edm-toolbar-separator"></div><div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:4;"></div></div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:5;"></div></div></div><div class="edm-toolbar-separator"></div><div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:6;"></div></div></div><div class="edm-toolbar-separator"></div><div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:4;"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:10;"></div></div></div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:4;"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:8;"></div></div></div></div>', 6),
  ga = {
      class: "edm-paint-bottom"
  },
  ma = {
      class: "edm-paint-tool-column"
  },
  pa = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-24px"
  }, null, -1),
  fa = [pa],
  va = {
      class: "edm-paint-tool"
  },
  ba = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-24px"
  }, null, -1),
  ya = [ba],
  wa = {
      class: "edm-paint-tool-column"
  },
  _a = {
      class: "edm-paint-tool"
  },
  Sa = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-24px"
  }, null, -1),
  xa = [Sa],
  ka = {
      class: "edm-paint-canvas-and-controls"
  },
  Ea = a("div", {
      class: "edm-paint-canvas"
  }, null, -1),
  Ma = {
      class: "edm-paint-controls"
  },
  Ca = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px"
  }, null, -1),
  Ia = a("div", {
      class: "edm-text-placeholder",
      style: {
          "--length": "7"
      }
  }, null, -1),
  Ta = a("div", {
      class: "edm-text-placeholder",
      style: {
          "--length": "2"
      }
  }, null, -1),
  $a = a("div", {
      class: "edm-text-placeholder",
      style: {
          "--length": "6"
      }
  }, null, -1),
  Oa = [Ca, Ia, Ta, $a],
  Da = Ie('<div class="edm-paint-zoom"><div class="edm-outlined-button edm-outlined-button-first"><div class="edm-icon-placeholder edm-icon-placeholder-20px"></div></div><div class="edm-outlined-button edm-outlined-button-middle"><div class="edm-icon-placeholder edm-icon-placeholder-20px"></div></div><div class="edm-outlined-button edm-outlined-button-last"><div class="edm-icon-placeholder edm-icon-placeholder-20px"></div></div></div>', 1),
  Aa = {
      key: 1,
      class: "edm-asset-editor"
  },
  La = {
      class: "edm-toolbar"
  },
  Na = a("div", {
      class: "edm-text-placeholder edm-text-placeholder-small",
      style: {
          "--length": "5"
      }
  }, null, -1),
  Pa = a("div", {
      class: "edm-text-placeholder edm-text-placeholder-small",
      style: {
          "--length": "4"
      }
  }, null, -1),
  Fa = [Pa],
  Ra = Ie('<div><div class="edm-outlined-button edm-outlined-button-first edm-outlined-button-colored-icon"><div class="edm-icon-placeholder edm-icon-placeholder-20px"></div></div><div class="edm-outlined-button edm-outlined-button-last edm-outlined-button-colored-icon"><div class="edm-icon-placeholder edm-icon-placeholder-20px"></div></div></div><div class="edm-toolbar-separator"></div><div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:4;"></div></div></div><div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:5;"></div></div></div><div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:4;"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:2;"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:3;"></div></div></div></div><div class="edm-toolbar-separator"></div><div><div class="edm-tool-button"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:6;"></div></div></div>', 7),
  ja = a("div", {
      class: "edm-waveform"
  }, null, -1),
  Ba = {
      class: "edm-toolbar edm-sound-effects"
  },
  za = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px"
  }, null, -1),
  Ua = [za],
  Ha = a("div", {
      class: "edm-toolbar-separator"
  }, null, -1),
  Wa = {
      class: "edm-tool-button"
  },
  Ga = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px"
  }, null, -1),
  Va = a("div", {
      class: "edm-text-placeholder",
      style: {
          "--length": "8"
      }
  }, null, -1),
  Xa = [Va],
  Ya = {
      class: "edm-right"
  },
  qa = {
      class: "edm-stage-header"
  },
  Ka = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px edm-green-flag"
  }, null, -1),
  Ja = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px edm-stop-sign"
  }, null, -1),
  Za = a("div", {
      class: "edm-spacer"
  }, null, -1),
  Qa = a("div", {
      class: "edm-outlined-button edm-outlined-button-first edm-outlined-button-selected"
  }, [a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px"
  })], -1),
  el = a("div", {
      class: "edm-outlined-button edm-outlined-button-last edm-outlined-button-unselected"
  }, [a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px"
  })], -1),
  tl = [Qa, el],
  nl = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px"
  }, null, -1),
  ol = [nl],
  sl = {
      class: "edm-targets"
  },
  il = {
      class: "edm-sprite-selector"
  },
  rl = Ie('<div class="edm-sprite-info-row"><div><div class="edm-input"><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:7;"></div></div></div></div><div class="edm-sprite-info-row"><div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:1;"></div><div class="edm-input edm-input-number"><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:1;"></div></div></div><div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:1;"></div><div class="edm-input edm-input-number"><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:1;"></div></div></div></div>', 2),
  al = [rl],
  ll = {
      class: "edm-sprite-list"
  },
  dl = a("div", {
      class: "edm-asset-image"
  }, [a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-24px"
  })], -1),
  cl = a("div", {
      class: "edm-text-placeholder edm-text-placeholder-small",
      style: {
          "--length": "7"
      }
  }, null, -1),
  ul = [cl],
  hl = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px"
  }, null, -1),
  gl = [hl],
  ml = Ie('<div class="edm-asset edm-asset"><div class="edm-asset-image"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div></div><div class="edm-asset-name"><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:5;"></div></div></div><div class="edm-asset edm-asset"><div class="edm-asset-image"><div class="edm-icon-placeholder edm-icon-placeholder-24px"></div></div><div class="edm-asset-name"><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:3;"></div><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:1;"></div></div></div>', 2),
  pl = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-24px"
  }, null, -1),
  fl = [pl],
  vl = Ie('<div class="edm-stage-title"><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:5;"></div></div><div class="edm-stage-image"></div><div class="edm-stage-info"><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:9;"></div></div><div class="edm-stage-info"><div class="edm-text-placeholder edm-text-placeholder-small" style="--length:1;"></div></div>', 4),
  bl = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-24px"
  }, null, -1),
  yl = [bl],
  wl = {
      class: "edm-fullscreen-controls-inner"
  },
  _l = a("div", null, [a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px edm-green-flag"
  }), a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px edm-stop-sign"
  })], -1),
  Sl = a("div", {
      class: "edm-icon-placeholder edm-icon-placeholder-20px"
  }, null, -1),
  xl = [Sl];

function kl(e, t, n, o, s, i) {
  return p(), v("div", {
      role: "presentation",
      class: "edm-preview",
      "data-setting-hovered": n.hoveredSettingId,
      onMouseenter: t[69] || (t[69] = r => e.$emit("areahover", "page")),
      onMouseleave: t[70] || (t[70] = r => e.$emit("areahover", null)),
      style: we(i.cssVariables({
          "--page": n.settings.page,
          "--page-text": i.colors.pageText,
          "--primary": n.settings.primary,
          "--primary-transparent15": i.colors.primaryTransparent15,
          "--primary-transparent35": i.colors.primaryTransparent35,
          "--primary-text": i.colors.primaryText,
          "--highlightText": n.settings.highlightText,
          "--menuBar": n.settings.menuBar,
          "--menuBar-text": i.colors.menuBarText,
          "--menuBar-border": i.colors.menuBarBorder,
          "--accent": n.settings.accent,
          "--accent-text": i.colors.accentText,
          "--accent-transparentText": i.colors.accentTransparentText,
          "--accent-artboard": i.colors.accentArtboard,
          "--accent-checkerboard": i.colors.accentCheckerboard,
          "--input": n.settings.input,
          "--input-transparent": i.colors.inputTransparent,
          "--input-text": i.colors.inputText,
          "--tab": n.settings.tab,
          "--tab-text": i.colors.tabText,
          "--activeTab": n.settings.activeTab,
          "--workspace": n.settings.workspace,
          "--categoryMenu": n.settings.categoryMenu,
          "--categoryMenu-text": i.colors.categoryMenuText,
          "--categoryMenu-selection": i.colors.categoryMenuSelection,
          "--palette": n.settings.palette,
          "--selector": n.settings.selector,
          "--selector-text": i.colors.selectorText,
          "--selector2": n.settings.selector2,
          "--selector2-text": i.colors.selector2Text,
          "--selectorSelection": n.settings.selectorSelection,
          "--fullscreen": n.settings.fullscreen,
          "--stageHeader": n.settings.stageHeader,
          "--border": n.hoveredSettingId === "border" ? "var(--orange)" : n.settings.border
      }))
  }, [a("div", {
      class: "edm-menu-bar",
      onMouseenter: t[0] || (t[0] = r => e.$emit("areahover", "menuBar")),
      onMouseleave: t[1] || (t[1] = r => e.$emit("areahover", "page"))
  }, Lr, 32), a("div", Nr, [a("div", Pr, [a("div", Fr, [(p(!0), v(z, null, X(s.tabs, r => (p(), v("div", {
      class: U(["edm-tab", {
          "edm-tab-selected": s.selectedTab === r.id
      }]),
      onMouseenter: d => e.$emit("areahover", s.selectedTab === r.id ? "activeTab" : "tab"),
      onMouseleave: t[2] || (t[2] = d => e.$emit("areahover", "page")),
      onClick: d => i.selectTab(r.id)
  }, [jr, a("div", {
      class: "edm-text-placeholder",
      style: we(i.cssVariables({
          "--length": r.textLength
      }))
  }, null, 4)], 42, Rr))), 256))]), s.selectedTab === "code" ? (p(), v("div", Br, [a("div", {
      class: "edm-category-menu",
      onMouseenter: t[5] || (t[5] = r => e.$emit("areahover", "categoryMenu")),
      onMouseleave: t[6] || (t[6] = r => e.$emit("areahover", "page"))
  }, [(p(!0), v(z, null, X(s.blockCategories, r => (p(), v("div", {
      class: U(["edm-category", {
          "edm-category-selected": e.$index === 0
      }])
  }, [a("div", {
      class: "edm-category-bubble",
      style: we({
          backgroundColor: r.primary,
          borderColor: r.tertiary
      })
  }, null, 4), a("div", zr, [(p(!0), v(z, null, X(r.textLength, d => (p(), v("div", {
      class: "edm-text-placeholder edm-text-placeholder-small",
      style: we(i.cssVariables({
          "--length": d
      }))
  }, null, 4))), 256))])], 2))), 256)), Ur, a("div", {
      class: "edm-add-extension",
      onMouseenter: t[3] || (t[3] = r => e.$emit("areahover", "primary")),
      onMouseleave: t[4] || (t[4] = r => e.$emit("areahover", "categoryMenu"))
  }, Wr, 32)], 32), a("div", {
      class: "edm-palette",
      onMouseenter: t[7] || (t[7] = r => e.$emit("areahover", "palette")),
      onMouseleave: t[8] || (t[8] = r => e.$emit("areahover", "page"))
  }, null, 32), a("div", {
      class: "edm-workspace-hover-target",
      onMouseenter: t[9] || (t[9] = r => e.$emit("areahover", "workspace")),
      onMouseleave: t[10] || (t[10] = r => e.$emit("areahover", "page"))
  }, null, 32)])) : (p(), v("div", {
      key: 1,
      class: "edm-tab-content edm-asset-tab",
      onMouseenter: t[33] || (t[33] = r => e.$emit("areahover", "accent")),
      onMouseleave: t[34] || (t[34] = r => e.$emit("areahover", "page"))
  }, [a("div", {
      class: U(["edm-asset-list", {
          "edm-sound-list": s.selectedTab === "sounds"
      }]),
      onMouseenter: t[19] || (t[19] = r => e.$emit("areahover", "selector2")),
      onMouseleave: t[20] || (t[20] = r => e.$emit("areahover", "accent"))
  }, [a("div", {
      class: "edm-asset edm-asset-selected",
      onMouseenter: t[15] || (t[15] = r => e.$emit("areahover", "selectorSelection")),
      onMouseleave: t[16] || (t[16] = r => e.$emit("areahover", "selector2"))
  }, [Gr, a("div", {
      class: "edm-asset-name",
      onMouseenter: t[11] || (t[11] = r => e.$emit("areahover", "primary")),
      onMouseleave: t[12] || (t[12] = r => e.$emit("areahover", "selectorSelection"))
  }, Xr, 32), a("div", {
      class: "edm-asset-delete",
      onMouseenter: t[13] || (t[13] = r => e.$emit("areahover", "primary")),
      onMouseleave: t[14] || (t[14] = r => e.$emit("areahover", "selectorSelection"))
  }, qr, 32)], 32), Kr, a("div", {
      class: "edm-asset-new",
      onMouseenter: t[17] || (t[17] = r => e.$emit("areahover", "primary")),
      onMouseleave: t[18] || (t[18] = r => e.$emit("areahover", "selector2"))
  }, Zr, 32)], 34), s.selectedTab === "costumes" ? (p(), v("div", Qr, [a("div", ea, [a("div", null, [ta, a("div", {
      class: "edm-input",
      onMouseenter: t[21] || (t[21] = r => e.$emit("areahover", "input")),
      onMouseleave: t[22] || (t[22] = r => e.$emit("areahover", "accent"))
  }, oa, 32)]), sa]), a("div", ia, [ra, a("div", null, [aa, la, da, a("div", {
      class: "edm-input edm-input-number",
      onMouseenter: t[23] || (t[23] = r => e.$emit("areahover", "input")),
      onMouseleave: t[24] || (t[24] = r => e.$emit("areahover", "accent"))
  }, ua, 32)]), ha]), a("div", ga, [a("div", ma, [a("div", {
      class: "edm-paint-tool edm-paint-tool-selected",
      onMouseenter: t[25] || (t[25] = r => e.$emit("areahover", "primary")),
      onMouseleave: t[26] || (t[26] = r => e.$emit("areahover", "accent"))
  }, fa, 32), (p(), v(z, null, X([0, 1, 2, 3], r => a("div", va, ya)), 64))]), a("div", wa, [(p(), v(z, null, X([0, 1, 2, 3], r => a("div", _a, xa)), 64))]), a("div", ka, [Ea, a("div", Ma, [a("div", {
      class: "edm-button",
      onMouseenter: t[27] || (t[27] = r => e.$emit("areahover", "primary")),
      onMouseleave: t[28] || (t[28] = r => e.$emit("areahover", "accent"))
  }, Oa, 32), Da])])])])) : A("", !0), s.selectedTab === "sounds" ? (p(), v("div", Aa, [a("div", La, [a("div", null, [Na, a("div", {
      class: "edm-input",
      onMouseenter: t[29] || (t[29] = r => e.$emit("areahover", "input")),
      onMouseleave: t[30] || (t[30] = r => e.$emit("areahover", "accent"))
  }, Fa, 32)]), Ra]), ja, a("div", Ba, [a("div", null, [a("div", {
      class: "edm-play-button",
      onMouseenter: t[31] || (t[31] = r => e.$emit("areahover", "primary")),
      onMouseleave: t[32] || (t[32] = r => e.$emit("areahover", "accent"))
  }, Ua, 32)]), Ha, a("div", null, [(p(!0), v(z, null, X(s.soundEffects, r => (p(), v("div", Wa, [Ga, a("div", null, [(p(!0), v(z, null, X(r.textLength, d => (p(), v("div", {
      class: "edm-text-placeholder edm-text-placeholder-small",
      style: we(i.cssVariables({
          "--length": d
      }))
  }, null, 4))), 256))])]))), 256))])])])) : A("", !0)], 32)), a("div", {
      class: "edm-backpack",
      onMouseenter: t[35] || (t[35] = r => e.$emit("areahover", "accent")),
      onMouseleave: t[36] || (t[36] = r => e.$emit("areahover", "page"))
  }, Xa, 32)]), a("div", Ya, [a("div", qa, [Ka, Ja, Za, a("div", {
      class: "edm-outlined-button-group",
      onMouseenter: t[37] || (t[37] = r => e.$emit("areahover", "accent")),
      onMouseleave: t[38] || (t[38] = r => e.$emit("areahover", "page"))
  }, tl, 32), a("div", {
      class: "edm-outlined-button-group",
      onMouseenter: t[40] || (t[40] = r => e.$emit("areahover", "accent")),
      onMouseleave: t[41] || (t[41] = r => e.$emit("areahover", "page"))
  }, [a("div", {
      class: "edm-outlined-button edm-fullscreen-toggle",
      onClick: t[39] || (t[39] = r => i.toggleFullScreenView())
  }, ol)], 32)]), a("div", {
      class: "edm-stage",
      onMouseenter: t[42] || (t[42] = r => e.$emit("areahover", null)),
      onMouseleave: t[43] || (t[43] = r => e.$emit("areahover", "page"))
  }, null, 32), a("div", sl, [a("div", il, [a("div", {
      class: "edm-sprite-info",
      onMouseenter: t[44] || (t[44] = r => e.$emit("areahover", "accent")),
      onMouseleave: t[45] || (t[45] = r => e.$emit("areahover", "page"))
  }, al, 32), a("div", {
      class: "edm-sprite-list-container",
      onMouseenter: t[54] || (t[54] = r => e.$emit("areahover", "selector")),
      onMouseleave: t[55] || (t[55] = r => e.$emit("areahover", "page"))
  }, [a("div", ll, [a("div", {
      class: "edm-asset edm-asset-selected",
      onMouseenter: t[50] || (t[50] = r => e.$emit("areahover", "selectorSelection")),
      onMouseleave: t[51] || (t[51] = r => e.$emit("areahover", "selector"))
  }, [dl, a("div", {
      class: "edm-asset-name",
      onMouseenter: t[46] || (t[46] = r => e.$emit("areahover", "primary")),
      onMouseleave: t[47] || (t[47] = r => e.$emit("areahover", "selectorSelection"))
  }, ul, 32), a("div", {
      class: "edm-asset-delete",
      onMouseenter: t[48] || (t[48] = r => e.$emit("areahover", "primary")),
      onMouseleave: t[49] || (t[49] = r => e.$emit("areahover", "selectorSelection"))
  }, gl, 32)], 32), ml]), a("div", {
      class: "edm-asset-new",
      onMouseenter: t[52] || (t[52] = r => e.$emit("areahover", "primary")),
      onMouseleave: t[53] || (t[53] = r => e.$emit("areahover", "selector"))
  }, fl, 32)], 32)]), a("div", {
      class: "edm-stage-selector",
      onMouseenter: t[58] || (t[58] = r => e.$emit("areahover", "accent")),
      onMouseleave: t[59] || (t[59] = r => e.$emit("areahover", "page"))
  }, [vl, a("div", {
      class: "edm-asset-new",
      onMouseenter: t[56] || (t[56] = r => e.$emit("areahover", "primary")),
      onMouseleave: t[57] || (t[57] = r => e.$emit("areahover", "accent"))
  }, yl, 32)], 32)])])]), s.fullScreenView ? (p(), v("div", {
      key: 0,
      class: "edm-fullscreen-view",
      onMouseenter: t[67] || (t[67] = r => e.$emit("areahover", "fullscreen")),
      onMouseleave: t[68] || (t[68] = r => e.$emit("areahover", "page"))
  }, [a("div", {
      class: "edm-fullscreen-controls",
      onMouseenter: t[63] || (t[63] = r => e.$emit("areahover", "stageHeader")),
      onMouseleave: t[64] || (t[64] = r => e.$emit("areahover", "fullscreen"))
  }, [a("div", wl, [_l, a("div", {
      class: "edm-outlined-button-group",
      onMouseenter: t[61] || (t[61] = r => e.$emit("areahover", "accent")),
      onMouseleave: t[62] || (t[62] = r => e.$emit("areahover", "page"))
  }, [a("div", {
      class: "edm-outlined-button edm-fullscreen-toggle",
      onClick: t[60] || (t[60] = r => i.toggleFullScreenView())
  }, xl)], 32)])], 32), a("div", {
      class: "edm-fullscreen-stage",
      onMouseenter: t[65] || (t[65] = r => e.$emit("areahover", null)),
      onMouseleave: t[66] || (t[66] = r => e.$emit("areahover", "fullscreen"))
  }, null, 32)], 32)) : A("", !0)], 44, Dr)
}
const El = ve(Or, [
  ["render", kl]
]);
const Ml = {
      props: ["options", "settingData", "settings"],
      methods: {
          settingName(e) {
              return this.settingData.find(t => t.id === e).name
          }
      }
  },
  Cl = {
      class: "preset-palette"
  },
  Il = ["title"];

function Tl(e, t, n, o, s, i) {
  return p(), v("span", Cl, [(p(!0), v(z, null, X(n.options.colors, r => (p(), v("span", {
      style: we({
          backgroundColor: n.settings[r]
      }),
      title: i.settingName(r) + ": " + n.settings[r]
  }, null, 12, Il))), 256))])
}
const $l = ve(Ml, [
  ["render", Tl]
]);
const It = window.parent !== window,
  Ol = {
      components: {
          AddonTag: xr,
          AddonSetting: br,
          EditorDarkMode: El,
          PreviewPalette: $l
      },
      props: ["addon", "groupId", "groupExpanded", "visible"],
      data() {
          return {
              isIframe: It,
              expanded: this.getDefaultExpanded(),
              everExpanded: this.getDefaultExpanded(),
              hoveredSettingId: null,
              highlightedSettingId: null
          }
      },
      computed: {
          shouldShow() {
              return this.visible && (this.$root.searchInput === "" ? this.groupExpanded : !0)
          },
          addonIconSrc() {
              return `../../../images/icons/${{editor:"puzzle",community:"web",theme:"brush",easterEgg:"egg-easter",popup:"popup"}[this.addon._icon]}.svg`
          },
          addonSettings() {
              return this.$root.addonSettings[this.addon._addonId]
          },
          devMode() {
              return this.$root.devMode
          },
          showUpdateNotice() {
              if (!this.addon.latestUpdate || !this.addon.latestUpdate.temporaryNotice) return !1;
              const [e, t, n] = this.$root.version.split("."), [o, s, i] = this.addon.latestUpdate.version.split(".");
              return e === o && t === s
          }
      },
      methods: {
          getDefaultExpanded() {
              return It ? !1 : this.groupId === "enabled"
          },
          loadPreset(e) {
              if (window.confirm(chrome.i18n.getMessage("confirmPreset"))) {
                  for (const t of Object.keys(e.values)) this.addonSettings[t] = e.values[t];
                  this.$root.updateSettings(this.addon), console.log(`Loaded preset ${e.id} for ${this.addon._addonId}`)
              }
          },
          loadDefaults() {
              if (window.confirm(chrome.i18n.getMessage("confirmReset"))) {
                  for (const e of this.addon.settings) this.addonSettings[e.id] = JSON.parse(JSON.stringify(e.default));
                  this.$root.updateSettings(this.addon), console.log(`Loaded default values for ${this.addon._addonId}`)
              }
          },
          toggleAddonRequest(e) {
              const t = () => {
                      e.preventDefault();
                      const o = !this.addon._enabled;
                      this.addon._wasEverEnabled = this.addon._enabled || o, this.addon._enabled = o, this.expanded = It && !this.expanded && (this.addon.info || []).every(s => s.type !== "warning") || e.shiftKey ? !1 : o, chrome.runtime.sendMessage({
                          changeEnabledState: {
                              addonId: this.addon._addonId,
                              newState: o
                          }
                      }), Pe.$emit(`toggle-addon-request-${this.addon.id}`, o)
                  },
                  n = (this.addon.permissions || []).filter(o => this.$root.browserLevelPermissions.includes(o));
              !this.addon._enabled && this.addon.tags.includes("danger") && !confirm(chrome.i18n.getMessage("dangerWarning", [this.addon.name])) || (!this.addon._enabled && n.length && n.every(s => this.$root.grantedOptionalPermissions.includes(s)) === !1 ? It ? (this.$root.addonToEnable = this.addon, document.querySelector(".popup").style.animation = "dropDown 0.35s 1", this.$root.showPopupModal = !0) : chrome.permissions.request({
                  permissions: n
              }, s => {
                  s && (console.log("Permissions granted!"), t())
              }) : t())
          },
          highlightSetting(e) {
              this.highlightedSettingId = e
          },
          msg(...e) {
              return this.$root.msg(...e)
          }
      },
      watch: {
          groupId(e) {
              this.expanded = this.getDefaultExpanded()
          },
          searchInput(e) {
              e === "" ? this.expanded = this.getDefaultExpanded() : this.expanded = !1
          },
          expanded(e) {
              e === !0 && (this.everExpanded = !0)
          }
      },
      mounted() {
          const e = () => {
              location.hash.replace(/^#addon-/, "") === this.addon._addonId && (this.expanded = !0)
          };
          window.addEventListener("hashchange", e, {
              capture: !1
          }), setTimeout(e, 0)
      }
  },
  Dl = ["id"],
  Al = {
      class: "addon-topbar"
  },
  Ll = {
      class: "btn-dropdown"
  },
  Nl = {
      class: "addon-name tooltip"
  },
  Pl = ["src"],
  Fl = {
      key: 0,
      class: "tooltiptext"
  },
  Rl = {
      class: "addon-check"
  },
  jl = a("img", {
      src: Po,
      class: "icon-type"
  }, null, -1),
  Bl = [jl],
  zl = ["state"],
  Ul = {
      key: 0,
      class: "addon-settings"
  },
  Hl = {
      class: "addon-description-full"
  },
  Wl = {
      key: 0,
      class: "addon-message addon-update"
  },
  Gl = {
      id: "info"
  },
  Vl = ["src"],
  Xl = {
      key: 1,
      class: "addon-credits"
  },
  Yl = {
      key: 0
  },
  ql = ["href"],
  Kl = {
      key: 1
  },
  Jl = {
      key: 2
  },
  Zl = {
      key: 2,
      class: "addon-license"
  },
  Ql = ["href"],
  ed = {
      class: "setting-label"
  },
  td = {
      class: "setting-label"
  },
  nd = {
      class: "addon-setting"
  },
  od = ["disabled", "onClick", "title"],
  sd = {
      class: "preset-preview"
  };

function id(e, t, n, o, s, i) {
  const r = me("addon-tag"),
      d = me("addon-setting");
  return R((p(), v("div", {
      class: "addon-body",
      id: "addon-" + n.addon._addonId
  }, [a("div", Al, [a("div", {
      class: "clickable-area",
      onClick: t[0] || (t[0] = l => s.expanded = !s.expanded)
  }, [a("div", Ll, [a("img", {
      src: Ht,
      alt: "v",
      class: U({
          reverted: s.expanded
      })
  }, null, 2)]), a("div", Nl, [a("img", {
      src: i.addonIconSrc,
      class: "icon-type"
  }, null, 8, Pl), a("span", null, k(n.addon.name), 1), i.devMode ? (p(), v("span", Fl, k(n.addon._addonId), 1)) : A("", !0)]), (p(!0), v(z, null, X(n.addon.tags, l => (p(), pe(r, {
      tag: l
  }, null, 8, ["tag"]))), 256))]), R(a("div", {
      class: "addon-description",
      dir: "auto"
  }, k(n.addon.description), 513), [
      [ee, !s.expanded]
  ]), a("div", Rl, [n.addon.settings ? R((p(), v("div", {
      key: 0,
      class: "addon-buttons",
      title: "{{ msg('resetToDefault') }}",
      onClick: t[1] || (t[1] = (...l) => i.loadDefaults && i.loadDefaults(...l))
  }, Bl, 512)), [
      [ee, s.expanded && n.addon._enabled]
  ]) : A("", !0), a("div", {
      class: "switch",
      state: n.addon._enabled ? "on" : "off",
      onClick: t[2] || (t[2] = (...l) => i.toggleAddonRequest && i.toggleAddonRequest(...l))
  }, null, 8, zl)])]), s.everExpanded ? R((p(), v("div", Ul, [a("div", Hl, k(n.addon.description), 1), i.showUpdateNotice ? (p(), v("div", Wl, [Pt(r, {
      tag: "new"
  }), re(" " + k(n.addon.latestUpdate.temporaryNotice), 1)])) : A("", !0), (p(!0), v(z, null, X(n.addon.info, l => (p(), v("div", Gl, [a("div", {
      class: U(["addon-message", "addon-" + (l.type || "info")])
  }, [a("img", {
      src: "../../../images/icons/" + {
          warning: "warning.svg",
          notice: "notice.svg",
          info: "help.svg"
      } [l.type || "info"]
  }, null, 8, Vl), re(k(l.text), 1)], 2)]))), 256)), n.addon.credits ? (p(), v("div", Xl, [a("span", null, k(i.msg("creditTo")), 1), (p(!0), v(z, null, X(n.addon.credits, l => (p(), v("span", null, [l.link ? (p(), v("span", Yl, [a("a", {
      href: l.link,
      rel: "noreferrer noopener",
      target: "_blank"
  }, k(l.name), 9, ql)])) : (p(), v("span", Kl, k(l.name), 1)), l.note ? (p(), v("span", Jl, " (" + k(l.note) + ")", 1)) : A("", !0)]))), 256))])) : A("", !0), n.addon.libraries && n.addon.libraries.length ? (p(), v("div", Zl, [a("a", {
      target: "_blank",
      href: `./licenses.html?libraries=${n.addon.libraries.join(",")}`
  }, k(i.msg("viewLicenses")), 9, Ql)])) : A("", !0), n.addon.addonPreview && !s.isIframe ? (p(), v("div", {
      key: 3,
      class: U(["preview-column", [n.addon._enabled ? "" : "disabled"]])
  }, [a("div", ed, k(i.msg("preview")), 1), (p(), pe(Nn(n.addon.addonPreview.type), {
      options: n.addon.addonPreview,
      settings: i.addonSettings,
      "hovered-setting-id": s.hoveredSettingId,
      onAreahover: i.highlightSetting
  }, null, 40, ["options", "settings", "hovered-setting-id", "onAreahover"]))], 2)) : A("", !0), a("div", {
      class: U(["settings-column", [n.addon._enabled ? "" : "disabled"]])
  }, [(p(!0), v(z, null, X(n.addon.settings, l => (p(), pe(d, {
      class: U({
          "setting-highlighted": s.highlightedSettingId === l.id
      }),
      addon: n.addon,
      setting: l,
      "addon-settings": i.addonSettings,
      onMouseenter: c => s.hoveredSettingId = l.id,
      onMouseleave: t[3] || (t[3] = c => s.hoveredSettingId = null)
  }, null, 8, ["class", "addon", "setting", "addon-settings", "onMouseenter"]))), 256))], 2), n.addon.presets ? (p(), v("div", {
      key: 4,
      class: U(["presets-column", [n.addon._enabled ? "" : "disabled"]])
  }, [a("div", td, k(i.msg("presets")), 1), (p(!0), v(z, null, X(n.addon.presets, l => (p(), v("div", nd, [a("button", {
      type: "preset-button",
      class: "large-button",
      disabled: !n.addon._enabled,
      onClick: c => i.loadPreset(l),
      title: l.description
  }, [a("span", sd, [n.addon.presetPreview ? (p(), pe(Nn("preview-" + n.addon.presetPreview.type), {
      key: 0,
      options: n.addon.presetPreview,
      "setting-data": n.addon.settings,
      settings: l.values
  }, null, 8, ["options", "setting-data", "settings"])) : A("", !0)]), a("span", null, k(l.name), 1)], 8, od)]))), 256))], 2)) : A("", !0)], 512)), [
      [ee, s.expanded]
  ]) : A("", !0)], 8, Dl)), [
      [ee, i.shouldShow]
  ])
}
const rd = ve(Ol, [
  ["render", id]
]);
const ad = {
  props: ["group", "shownCount", "marginAbove"],
  data() {
      return {}
  },
  computed: {
      shouldShow() {
          return this.$root.searchInput !== "" ? !1 : this.shownCount > 0
      },
      manifestsById() {
          return this.$root.manifestsById
      }
  },
  methods: {
      toggle() {
          this.group.expanded = !this.group.expanded
      }
  }
};

function ld(e, t, n, o, s, i) {
  return R((p(), v("div", {
      class: U(["addon-group", {
          "margin-above": n.marginAbove
      }]),
      onClick: t[0] || (t[0] = (...r) => i.toggle && i.toggle(...r))
  }, [a("img", {
      src: Ht,
      alt: "v",
      class: U({
          reverted: n.group.expanded
      })
  }, null, 2), re(" " + k(n.group.name) + " (" + k(n.shownCount) + ") ", 1)], 2)), [
      [ee, i.shouldShow]
  ])
}
const dd = ve(ad, [
  ["render", ld]
]);
const cd = {
      props: ["category"],
      data() {
          return {
              lastClick: 0
          }
      },
      computed: {
          selectedCategory() {
              return this.$root.selectedCategory
          },
          shouldShow() {
              const e = this.$root.categories.filter(t => t.parent === this.category.parent).map(t => t.id);
              return !this.category.parent || [this.category.parent, ...e].includes(this.selectedCategory)
          }
      },
      methods: {
          onClick(e) {
              e.stopPropagation(), this.selectedCategory === this.category.id && !this.category.parent && Date.now() - this.lastClick > 350 ? this.$root.selectedCategory = "all" : this.$root.selectedCategory = this.category.id, this.lastClick = Date.now()
          }
      }
  },
  ud = ["src"];

function hd(e, t, n, o, s, i) {
  return p(), pe(Vo, {
      name: "expand",
      mode: "in-out"
  }, {
      default: co(() => [R(a("div", {
          class: U(["category", {
              sel: n.category.id === i.selectedCategory,
              hasParent: n.category.parent
          }]),
          style: we({
              marginBottom: n.category.marginBottom ? "12px" : 0
          }),
          onClick: t[0] || (t[0] = r => i.onClick(r))
      }, [a("img", {
          src: "../../../images/icons/" + n.category.icon + ".svg"
      }, null, 8, ud), a("span", null, k(n.category.name), 1)], 6), [
          [ee, i.shouldShow]
      ])]),
      _: 1
  })
}
const gd = ve(cd, [
  ["render", hd]
]);
let Ro = [];
const Dn = () => chrome.permissions.getAll(({
  permissions: e
}) => {
  Ro = e.filter(t => Ut.includes(t))
});
Dn();
var ro;
(ro = chrome.permissions.onAdded) == null || ro.addListener(Dn);
var ao;
(ao = chrome.permissions.onRemoved) == null || ao.addListener(Dn);
let hn, io, Xe = !1;
window.parent !== window && (document.body.classList.add("iframe"), Xe = !0);
const md = {
      components: {
          Modal: Cs,
          AddonBody: rd,
          AddonGroupHeader: dd,
          CategorySelector: gd
      },
      data() {
          return {
              bus: Pe,
              smallMode: !1,
              devMode: !1,
              forceEnglishSetting: null,
              forceEnglishSettingInitial: null,
              switchPath: "../../images/icons/switch.svg",
              moreSettingsOpen: !1,
              categoryOpen: !0,
              loaded: !1,
              searchLoaded: !1,
              manifests: [],
              manifestsById: {},
              selectedCategory: "all",
              searchInput: "",
              searchInputReal: "",
              addonSettings: {},
              addonToEnable: null,
              showPopupModal: !1,
              isIframe: Xe,
              addonGroups: Un.filter(e => Xe ? e.iframeShow : e.fullscreenShow),
              categories: cs,
              searchMsg: this.msg("search"),
              browserLevelPermissions: Ut,
              grantedOptionalPermissions: Ro,
              addonListObjs: [],
              sidebarUrls: (() => {
                  const e = chrome.i18n.getUILanguage(),
                      t = e.startsWith("en") ? "" : `${e.split("-")[0]}/`,
                      n = chrome.runtime.getManifest().version,
                      o = chrome.runtime.getManifest().version_name,
                      s = `utm_source=extension&utm_medium=settingspage&utm_campaign=v${n}`;
                  return {
                      contributors: `https://scratchaddons.com/${t}credits?${s}`,
                      feedback: `https://scratchaddons.com/${t}feedback/?ext_version=${o}&${s}`,
                      changelog: `https://scratchaddons.com/${t}changelog?${s}`
                  }
              })()
          }
      },
      created() {
          chrome.runtime.sendMessage("getSettingsInfo", async ({
              manifests: e,
              addonsEnabled: t,
              addonSettings: n
          }) => {
              var h, g;
              this.addonSettings = n;
              const o = [];
              let s;
              Xe && (s = await vs());
              const i = u => JSON.parse(JSON.stringify(u));
              for (const {
                      manifest: u,
                      addonId: f
                  }
                  of e) {
                  u._categories = [], u._categories[0] = u.tags.includes("popup") ? "popup" : u.tags.includes("easterEgg") ? "easterEgg" : u.tags.includes("theme") ? "theme" : u.tags.includes("community") ? "community" : "editor";
                  const b = w => {
                      let I = 0;
                      for (const $ of w) {
                          const L = typeof $ == "object" ? $.tag : $,
                              W = typeof $ == "object" ? $.category : L;
                          u.tags.includes(L) && (u._categories.push(W), I++)
                      }
                      return I
                  };
                  if (u._categories[0] === "theme" ? b([{
                          tag: "editor",
                          category: "themesForEditor"
                      }]) || b([{
                          tag: "community",
                          category: "themesForWebsite"
                      }]) : u._categories[0] === "editor" ? b(["codeEditor", "costumeEditor", "projectPlayer"]) === 0 && u._categories.push("editorOthers") : u._categories[0] === "community" && b(["profiles", "projectPage", "forums"]) === 0 && u._categories.push("communityOthers"), f === "cat-blocks" && u._categories.push("easterEgg"), u._icon = u._categories[0], u._enabled = t[f], u._wasEverEnabled = u._enabled, u._addonId = f, u._groups = [], u.versionAdded) {
                      const [w, I, $] = this.version.split("."), [L, W, J] = u.versionAdded.split(".");
                      w === L && I === W && (u.tags.push("new"), u._groups.push(u.tags.includes("recommended") || u.tags.includes("featured") ? "featuredNew" : "new"))
                  }
                  if (u.latestUpdate) {
                      const [w, I, $] = this.version.split("."), [L, W, J] = u.latestUpdate.version.split(".");
                      w === L && I === W && (u.tags.push((h = u.latestUpdate.newSettings) != null && h.length ? "updatedWithSettings" : "updated"), u._groups.push(u.latestUpdate.isMajor ? "featuredNew" : "new"))
                  }
                  const E = yo.map(w => w.matchName);
                  u.tags.sort((w, I) => E.indexOf(w) - E.indexOf(I)), s != null && s.addonsCurrentlyOnTab.includes(f) ? u._groups.push("runningOnTab") : s != null && s.addonsPreviouslyOnTab.includes(f) && u._groups.push("recentlyUsed"), u._enabled ? u._groups.push("enabled") : u.tags.includes("recommended") ? u._groups.push("recommended") : u.tags.includes("featured") ? u._groups.push("featured") : u.tags.includes("beta") || u.tags.includes("danger") ? u._groups.push("beta") : u.tags.includes("forums") ? u._groups.push("forums") : u._groups.push("others");
                  for (const w of u._groups)(g = this.addonGroups.find(I => I.id === w)) == null || g.addonIds.push(u._addonId);
                  o.push(i(u))
              }
              for (const {
                      manifest: u
                  }
                  of e) this.manifestsById[u._addonId] = u;
              this.manifests = e.map(({
                  manifest: u
              }) => u), hn = new ot(o, hs);
              const r = (u, f, b) => {
                      const E = Array.isArray(u) ? u : [u],
                          w = E.some($ => f.tags.includes($)),
                          I = E.some($ => b.tags.includes($));
                      return w ^ I ? I - w : w && I ? f.name.localeCompare(b.name) : null
                  },
                  d = [
                      ["danger", "beta"], "editor", "community", "popup"
                  ];
              if (this.addonGroups.forEach(u => {
                      u.addonIds = u.addonIds.map(f => this.manifestsById[f]).sort((f, b) => {
                          for (const E of u.customOrder || d) {
                              const w = r(E, f, b);
                              if (w !== null) return w
                          }
                          return 0
                      }).map(f => f._addonId)
                  }), Xe) {
                  const u = [];
                  for (const b of this.addonGroups) b.addonIds.forEach(E => u.push(E));
                  const f = this.addonGroups.find(b => b.id === "_iframeSearch");
                  f.addonIds = Object.keys(this.manifestsById).filter(b => u.indexOf(b) === -1)
              }
              let l = 0;
              for (const u of this.addonGroups) u.addonIds.forEach((f, b) => {
                  const E = this.addonListObjs.find($ => $.manifest._addonId === "example"),
                      w = E || {};
                  w.duplicate = !!this.addonListObjs.find($ => $.manifest._addonId === f), w.manifest = this.manifestsById[f], w.group = u, w.matchesSearch = !1;
                  const I = w.manifest._categories[0] === "easterEgg" && w.manifest._enabled === !1;
                  w.matchesCategory = !I, w.naturalIndex = l, w.headerAbove = b === 0, w.footerBelow = b === u.addonIds.length - 1, E || this.addonListObjs.push(w), l++
              });
              this.addonListObjs = this.addonListObjs.filter(u => u.manifest._addonId !== "example"), this.loaded = !0, setTimeout(() => {
                  const u = window.location.hash;
                  if (u.startsWith("#addon-")) {
                      const f = u.substring(7),
                          b = this.addonGroups.find(w => w.addonIds.includes(f));
                      if (!b) return;
                      b.expanded = !0;
                      const E = this.manifestsById[f];
                      this.selectedCategory = E != null && E.tags.includes("easterEgg") ? "easterEgg" : "all", setTimeout(() => {
                          const w = document.getElementById("addon-" + f);
                          w && (w.scrollIntoView(), w.classList.add("addon-blink"), setTimeout(() => w.classList.remove("addon-blink"), 2001))
                      }, 0)
                  }
              }, 0);
              let c = "";
              e.forEach(({
                  addonId: u
              }) => c += t[u] === !0 ? "1" : "0");
              const m = BigInt(`0b${c}`).toString(36);
              this.sidebarUrls.feedback += `#_${m}`
          })
      },
      computed: {
          themePath() {
              return this.theme ? "../../images/icons/moon.svg" : "../../images/icons/theme.svg"
          },
          addonList() {
              if (!this.searchInput) return this.addonListObjs.forEach(o => {
                  o.matchesSearch = o.group.id !== "_iframeSearch"
              }), this.addonListObjs.sort((o, s) => o.naturalIndex - s.naturalIndex);
              if (!hn) return [];
              const e = Object.values(this.addonListObjs.reduce((o, s) => ((!o[s.manifest._addonId] || o[s.manifest._addonId] && s.group.id !== "featuredNew" && s.group.id !== "new") && (o[s.manifest._addonId] = s), o), Object.create(null))),
                  n = hn.search(this.searchInput).sort((o, s) => o.score < .1 ^ s.score < .1 ? o.score < .1 ? -1 : 1 : s.item._enabled - o.item._enabled).map(o => e.find(s => s.manifest._addonId === o.item._addonId));
              for (const o of e) o.matchesSearch = n.includes(o);
              return e.sort((o, s) => n.indexOf(o) - n.indexOf(s))
          },
          hasNoResults() {
              return !this.addonList.some(e => e.matchesSearch && e.matchesCategory)
          },
          version() {
              return chrome.runtime.getManifest().version
          },
          versionName() {
              return chrome.runtime.getManifest().version_name
          },
          addonAmt() {
              return `${Math.floor(this.manifests.filter(e=>!e.tags.includes("easterEgg")).length/5)*5}+`
          },
          selectedCategoryName() {
              var e;
              return (e = this.categories.find(t => t.id === this.selectedCategory)) == null ? void 0 : e.name
          }
      },
      setup() {
          const e = We(null);
          return (async () => {
              const {
                  theme: t,
                  setGlobalTheme: n
              } = await Xo();
              e.value = t, io = n
          })(), {
              theme: e
          }
      },
      methods: {
          openMoreSettings: function() {
              this.closePickers(), this.moreSettingsOpen = !0, this.smallMode && this.sidebarToggle()
          },
          sidebarToggle: function() {
              this.categoryOpen = !this.categoryOpen, this.categoryOpen ? this.switchPath = "../../images/icons/close.svg" : this.switchPath = "../../images/icons/switch.svg"
          },
          msg(e, ...t) {
              return chrome.i18n.getMessage(e, ...t)
          },
          direction() {
              return Mn(chrome.i18n.getUILanguage())
          },
          clearSearch() {
              this.searchInputReal = ""
          },
          setTheme(e) {
              io(e), this.theme = e
          },
          stopPropagation(e) {
              e.stopPropagation()
          },
          updateSettings(e, {
              wait: t = 0,
              settingId: n = null
          } = {}) {
              const o = n && this.addonSettings[e._addonId][n];
              setTimeout(() => {
                  (!n || this.addonSettings[e._addonId][n] === o) && (chrome.runtime.sendMessage({
                      changeAddonSettings: {
                          addonId: e._addonId,
                          newSettings: this.addonSettings[e._addonId]
                      }
                  }), console.log("Updated", this.addonSettings[e._addonId]))
              }, t)
          },
          closePickers(e, t, {
              callCloseDropdowns: n = !0
          } = {}) {
              Pe.$emit("close-pickers", t), n && this.closeResetDropdowns()
          },
          closeResetDropdowns(e, t) {
              Pe.$emit("close-reset-dropdowns", t)
          },
          exportSettings() {
              Wn().then(e => {
                  const t = new Blob([e], {
                      type: "application/json"
                  });
                  Ko("scratch-addons-settings.json", t)
              })
          },
          viewSettings() {
              const e = window.open("about:blank");
              Wn().then(t => {
                  const n = new Blob([t], {
                      type: "text/plain"
                  });
                  e.location.replace(URL.createObjectURL(n))
              })
          },
          importSettings() {
              const e = Object.assign(document.createElement("input"), {
                  hidden: !0,
                  type: "file",
                  accept: "application/json"
              });
              e.addEventListener("change", async t => {
                  const n = e.files[0];
                  if (!n) {
                      e.remove(), alert(chrome.i18n.getMessage("fileNotSelected"));
                      return
                  }
                  const o = await n.text();
                  e.remove();
                  const s = document.getElementById("confirmImport");
                  try {
                      await _s(o, this.manifests, s)
                  } catch (i) {
                      console.warn("Error when importing settings:", i), s.classList.add("hidden-button"), alert(chrome.i18n.getMessage("importFailed"));
                      return
                  }
                  alert(chrome.i18n.getMessage("importSuccess")), chrome.runtime.reload()
              }, {
                  once: !0
              }), document.body.appendChild(e), e.click()
          },
          applyLanguageSettings() {
              alert(chrome.i18n.getMessage("importSuccess")), chrome.runtime.reload()
          },
          openFullSettings() {
              window.open(`${chrome.runtime.getURL("webpages/dist/index.html")}#addon-${this.addonToEnable&&this.addonToEnable._addonId}`), setTimeout(() => window.parent.close(), 100)
          },
          hidePopup() {
              document.querySelector(".popup").style.animation = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "closePopup 0.35s 1" : "closePopup 0.6s 1", document.querySelector(".popup").addEventListener("animationend", () => {
                  this.showPopupModal = !1
              }, {
                  once: !0
              })
          },
          groupShownCount(e) {
              return e.id === "_iframeSearch" ? -1 : this.addonListObjs.filter(t => t.group === e && t.matchesSearch && t.matchesCategory).length
          },
          groupMarginAbove(e) {
              const t = this.addonGroups.find(n => this.groupShownCount(n) > 0);
              return e !== t
          },
          closesidebar(e) {
              (e == null ? void 0 : e.target.classList[0]) !== "toggle" && this.categoryOpen && this.smallMode && this.sidebarToggle()
          },
          resizeEvent() {
              window.innerWidth < 1100 ? (this.smallMode = !0, this.categoryOpen = !1, this.switchPath = "../../images/icons/switch.svg") : this.smallMode !== !1 && (this.smallMode = !1, this.categoryOpen = !0, this.switchPath = "../../images/icons/close.svg")
          }
      },
      watch: {
          searchInputReal(e) {
              if (e === "") return this.searchInput = e;
              setTimeout(() => {
                  this.searchInputReal === e && (this.searchInput = e)
              }, 150)
          },
          selectedCategory(e) {
              this.addonListObjs.forEach(t => {
                  const n = t.manifest._categories[0] === "easterEgg" && e !== "easterEgg" && t.manifest._wasEverEnabled === !1;
                  t.matchesCategory = !n && (e === "all" || t.manifest._categories.includes(e))
              }), e === "forums" && (this.addonGroups.find(t => t.id === "forums").expanded = !0)
          },
          forceEnglishSetting(e, t) {
              t !== null && chrome.storage.local.set({
                  forceEnglish: this.forceEnglishSetting
              })
          }
      },
      mounted() {
          window.vue = this, (Xe || typeof browser < "u") && setTimeout(() => {
              var s;
              return (s = document.getElementById("searchBox")) == null ? void 0 : s.focus()
          }, 0);
          const e = {
              group: Un[0],
              manifest: JSON.parse(JSON.stringify(us)),
              matchesSearch: !0,
              matchesCategory: !0,
              naturalIndex: -1,
              headerAbove: !1,
              footerBelow: !1,
              duplicate: !1
          };
          setTimeout(() => {
              this.loaded || (this.addonListObjs = Array(25).fill("").map(() => JSON.parse(JSON.stringify(e))))
          }, 0), chrome.storage.local.get("forceEnglish", ({
              forceEnglish: s
          }) => {
              this.forceEnglishSettingInitial = s, this.forceEnglishSetting = s
          }), window.addEventListener("hashchange", s => {
              const i = location.hash.replace(/^#addon-/, ""),
                  r = this.addonGroups.find(l => l.addonIds.includes(i));
              if (!r) return;
              const d = this.manifestsById[i];
              r.expanded = !0, this.selectedCategory = d != null && d.tags.includes("easterEgg") ? "easterEgg" : "all", this.clearSearch(), setTimeout(() => {
                  var l;
                  return (l = document.getElementById("addon-" + i)) == null ? void 0 : l.scrollIntoView()
              }, 0)
          }, {
              capture: !1
          }), window.addEventListener("resize", this.resizeEvent), this.resizeEvent(), document.title = chrome.i18n.getMessage("settingsTitle"), chrome.management.getSelf(s => {
              s.installType === "development" && (vue.devMode = !0)
          });
          let t = 0;
          const n = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
          let o = this;
          document.addEventListener("keydown", s => {
              t = s.key.toLowerCase() === n[t] ? t + 1 : 0, t === n.length && (o.selectedCategory = "easterEgg", setTimeout(() => vue.searchInputReal = "", 0))
          })
      }
  },
  pd = "/webpages/dist/assets/users.svg",
  jo = "/webpages/dist/assets/translate.svg",
  fd = "/webpages/dist/assets/comment.svg",
  vd = "/webpages/dist/assets/wrench.svg",
  bd = "/webpages/dist/assets/left-arrow.svg",
  yd = "/webpages/dist/assets/theme.svg",
  wd = "/webpages/dist/assets/import-export.svg",
  _d = md,
  Sd = {
      class: "navbar"
  },
  xd = ["src"],
  kd = a("img", {
      src: Yo,
      class: "logo",
      alt: "Logo"
  }, null, -1),
  Ed = a("span", {
      class: "vue3"
  }, "Vue 3", -1),
  Md = ["src"],
  Cd = {
      class: "main"
  },
  Id = ["href"],
  Td = a("img", {
      src: pd
  }, null, -1),
  $d = a("img", {
      src: xn
  }, null, -1),
  Od = {
      class: "category category-small",
      href: "https://scratchaddons.com/translate",
      target: "_blank"
  },
  Dd = a("img", {
      src: jo
  }, null, -1),
  Ad = a("img", {
      src: xn
  }, null, -1),
  Ld = ["href"],
  Nd = a("img", {
      src: fd
  }, null, -1),
  Pd = a("img", {
      src: xn
  }, null, -1),
  Fd = a("img", {
      src: vd
  }, null, -1),
  Rd = {
      class: "addons-block"
  },
  jd = ["placeholder"],
  Bd = {
      class: "search-button"
  },
  zd = {
      key: 0,
      id: "search-not-found"
  },
  Ud = {
      key: 1,
      id: "search-not-found"
  },
  Hd = {
      key: 0,
      id: "iframe-fullscreen-suggestion"
  },
  Wd = {
      class: "addon-block settings-block"
  },
  Gd = {
      class: "addon-body"
  },
  Vd = {
      class: "addon-topbar"
  },
  Xd = {
      class: "addon-name"
  },
  Yd = a("img", {
      src: yd,
      class: "icon-type"
  }, null, -1),
  qd = {
      class: "addon-settings"
  },
  Kd = {
      class: "addon-description-full"
  },
  Jd = {
      class: "addon-setting"
  },
  Zd = {
      class: "filter-selector"
  },
  Qd = {
      class: "filter-text"
  },
  ec = {
      class: "filter-options"
  },
  tc = {
      class: "addon-body"
  },
  nc = {
      class: "addon-topbar"
  },
  oc = {
      class: "addon-name"
  },
  sc = {
      class: "addon-settings"
  },
  ic = {
      class: "addon-description-full"
  },
  rc = {
      class: "addon-description-full"
  },
  ac = {
      class: "addon-setting"
  },
  lc = {
      class: "filter-selector"
  },
  dc = {
      class: "filter-selector"
  },
  cc = {
      class: "large-button hidden-button",
      id: "confirmImport"
  },
  uc = {
      class: "filter-selector",
      style: {
          "margin-left": "16px"
      }
  },
  hc = {
      class: "addon-body"
  },
  gc = {
      class: "addon-topbar"
  },
  mc = {
      class: "addon-name"
  },
  pc = a("img", {
      src: jo,
      class: "icon-type"
  }, null, -1),
  fc = {
      class: "addon-settings"
  },
  vc = {
      class: "addon-setting",
      style: {
          "margin-top": "0"
      }
  },
  bc = a("span", null, "Show addon names and descriptions in English", -1),
  yc = {
      class: "badge red"
  },
  wc = {
      class: "footer"
  },
  _c = ["href"],
  Sc = {
      href: "./licenses.html?libraries=icu-message-formatter,vue3,vite,vue-accessible-color-picker,comlink,Sora,fuse,idb,sortable,tiny-emitter",
      target: "_blank"
  },
  xc = {
      class: "popup"
  },
  kc = {
      class: "label"
  };

function Ec(e, t, n, o, s, i) {
  const r = me("CategorySelector"),
      d = me("AddonGroupHeader"),
      l = me("AddonBody"),
      c = me("modal"),
      m = Nt("click-outside");
  return p(), v(z, null, [a("div", Sd, [R(a("img", {
      src: e.switchPath,
      class: "toggle",
      onClick: t[0] || (t[0] = h => e.sidebarToggle()),
      alt: "Logo"
  }, null, 8, xd), [
      [ee, e.smallMode]
  ]), kd, a("h1", null, [re(k(e.msg("settings")) + " ", 1), Ed]), a("img", {
      onClick: t[1] || (t[1] = h => e.setTheme(!e.theme)),
      class: "theme-switch",
      src: e.themePath
  }, null, 8, Md)]), a("div", Cd, [R((p(), v("div", {
      class: U(["categories-block", {
          smallMode: e.smallMode === !0
      }])
  }, [(p(!0), v(z, null, X(e.categories, h => (p(), pe(r, {
      category: h
  }, null, 8, ["category"]))), 256)), a("a", {
      class: "category category-small",
      style: {
          "margin-top": "auto"
      },
      href: e.sidebarUrls.contributors,
      target: "_blank"
  }, [Td, a("span", null, [re(k(e.msg("credits")) + " ", 1), $d])], 8, Id), a("a", Od, [Dd, a("span", null, [re(k(e.msg("translate")) + " ", 1), Ad])]), a("a", {
      class: "category category-small",
      href: e.sidebarUrls.feedback,
      target: "_blank"
  }, [Nd, a("span", null, [re(k(e.msg("feedback")) + " ", 1), Pd])], 8, Ld), a("div", {
      class: "category",
      style: {
          "margin-top": "12px",
          "margin-bottom": "14px"
      },
      onClick: t[2] || (t[2] = h => e.openMoreSettings())
  }, [Fd, a("span", null, k(e.msg("moreSettings")), 1)])], 2)), [
      [m, e.closesidebar],
      [ee, e.categoryOpen && !e.isIframe]
  ]), R(a("div", {
      class: "categories-shrink",
      onClick: t[3] || (t[3] = h => e.sidebarToggle())
  }, [a("img", {
      src: bd,
      class: U({
          flipped: e.categoryOpen === (e.direction() === "rtl")
      })
  }, null, 2)], 512), [
      [ee, !e.isIframe && e.smallMode === !1]
  ]), a("div", Rd, [a("div", {
      class: U(["search-box", {
          smallMode: e.smallMode === !0
      }])
  }, [R(a("input", {
      type: "text",
      id: "searchBox",
      placeholder: e.searchMsg,
      "onUpdate:modelValue": t[4] || (t[4] = h => e.searchInputReal = h),
      autofocus: ""
  }, null, 8, jd), [
      [nt, e.searchInputReal]
  ]), R(a("button", Bd, null, 512), [
      [ee, e.searchInput === ""]
  ]), R(a("button", {
      class: "search-clear-button",
      onClick: t[5] || (t[5] = h => e.clearSearch())
  }, null, 512), [
      [ee, e.searchInput !== ""]
  ])], 2), a("div", {
      class: U(["addons-container", {
          placeholder: !e.loaded
      }])
  }, [e.searchInput && e.hasNoResults ? (p(), v(z, {
      key: 0
  }, [e.selectedCategory === "all" || !e.selectedCategoryName ? (p(), v("p", zd, k(e.msg("searchNotFound")), 1)) : (p(), v("p", Ud, k(e.msg("searchNotFoundInCategory", e.selectedCategoryName)), 1))], 64)) : A("", !0), (p(!0), v(z, null, X(e.addonList, h => (p(), v(z, null, [e.isIframe && h.headerAbove && (e.hasNoResults || h.group.id === "enabled") ? R((p(), v("div", Hd, [a("span", null, k(e.msg("exploreAllAddons", [e.addonAmt])), 1), a("button", {
      class: "large-button",
      onClick: t[6] || (t[6] = g => e.openFullSettings())
  }, k(e.msg("openFullSettings")), 1)], 512)), [
      [ee, e.searchInput === ""]
  ]) : A("", !0), h.headerAbove ? (p(), pe(d, {
      key: 1,
      group: h.group,
      "shown-count": e.groupShownCount(h.group),
      "margin-above": e.groupMarginAbove(h.group)
  }, null, 8, ["group", "shown-count", "margin-above"])) : A("", !0), Pt(l, {
      visible: h.matchesSearch && h.matchesCategory,
      addon: h.manifest,
      "group-id": h.group.id,
      "group-expanded": h.group.expanded
  }, null, 8, ["visible", "addon", "group-id", "group-expanded"])], 64))), 256))], 2)])]), Pt(c, {
      class: "more-settings",
      modelValue: e.moreSettingsOpen,
      "onUpdate:modelValue": t[14] || (t[14] = h => e.moreSettingsOpen = h),
      title: e.msg("moreSettings")
  }, {
      default: co(() => [a("div", Wd, [a("div", Gd, [a("div", Vd, [a("span", Xd, [Yd, re(" " + k(e.msg("scratchAddonsTheme")), 1)])]), a("div", qd, [a("span", Kd, k(e.msg("scratchAddonsThemeDescription")), 1), a("div", Jd, [a("div", Zd, [a("div", Qd, k(e.msg("theme")), 1), a("div", ec, [a("div", {
          class: U(["filter-option", {
              sel: e.theme === !0
          }]),
          onClick: t[7] || (t[7] = h => e.setTheme(!0))
      }, k(e.msg("light")), 3), a("div", {
          class: U(["filter-option", {
              sel: e.theme === !1
          }]),
          onClick: t[8] || (t[8] = h => e.setTheme(!1))
      }, k(e.msg("dark")), 3)])])])])]), a("div", tc, [a("div", nc, [a("span", oc, [a("img", {
          src: wd,
          class: U(["icon-type", {
              dark: e.theme === !1
          }])
      }, null, 2), re(" " + k(e.msg("exportAndImportSettings")), 1)])]), a("div", sc, [a("span", ic, k(e.msg("exportAndImportSettingsDescription")), 1), a("span", rc, k(e.msg("useBrowserSync")), 1), a("div", ac, [a("div", lc, [a("button", {
          class: "large-button",
          onClick: t[9] || (t[9] = h => e.exportSettings())
      }, k(e.msg("export")), 1)]), a("div", dc, [a("button", {
          class: "large-button",
          onClick: t[10] || (t[10] = h => e.importSettings())
      }, k(e.msg("import")), 1), a("button", cc, k(e.msg("confirmImport")), 1)]), a("div", uc, [a("button", {
          class: "large-button",
          onClick: t[11] || (t[11] = h => e.viewSettings())
      }, k(e.msg("viewSettings")), 1)])])])]), a("div", hc, [a("div", gc, [a("span", mc, [pc, re(k(e.msg("language")), 1)])]), a("div", fc, [a("div", vc, [R(a("input", {
          type: "checkbox",
          class: "setting-input check",
          "onUpdate:modelValue": t[12] || (t[12] = h => e.forceEnglishSetting = h),
          style: {
              "margin-inline-start": "0",
              "margin-inline-end": "8px"
          }
      }, null, 512), [
          [lo, e.forceEnglishSetting]
      ]), bc, a("div", yc, k(e.msg("beta")), 1), R(a("button", {
          class: "large-button",
          id: "applyLanguageSettingsButton",
          onClick: t[13] || (t[13] = h => e.applyLanguageSettings()),
          style: {
              "margin-inline-start": "16px"
          }
      }, k(e.msg("applySettings")), 513), [
          [ee, e.forceEnglishSetting !== null && e.forceEnglishSetting !== this.forceEnglishSettingInitial]
      ])])])])]), a("div", wc, [a("p", null, [re(k(e.msg("extensionName")) + " ", 1), a("a", {
          href: "https://scratchaddons.com/changelog",
          title: "{{ msg('changelog') }}",
          target: "_blank"
      }, " v" + k(e.version), 9, _c)]), a("p", null, [a("a", Sc, k(e.msg("libraryCredits")), 1)])])]),
      _: 1
  }, 8, ["modelValue", "title"]), R(a("div", xc, [a("div", kc, k(e.msg("settingsPagePermission", e.addonToEnable ? e.addonToEnable.name : "")), 1), a("div", null, [a("button", {
      class: "large-button",
      onClick: t[15] || (t[15] = h => e.openFullSettings())
  }, k(e.msg("openFullSettings")), 1), a("button", {
      class: "large-button",
      onClick: t[16] || (t[16] = h => e.hidePopup())
  }, k(e.msg("skipOpenFullSettings")), 1)])], 512), [
      [ee, e.showPopupModal]
  ])], 64)
}
const Mc = ve(_d, [
  ["render", Ec]
]);
document.documentElement.lang = chrome.i18n.getUILanguage();
document.body.dir = Mn(chrome.i18n.getUILanguage());
const Bo = qo(Mc);
Bo.directive("click-outside", {
  mounted: function(e, t, n) {
      e.addEventListener("click", o => o.stopPropagation()), e.addEventListener("click", o => o.stopPropagation()), e.controlled = t.value.prevent, e.clickOutsideEvent = function(o) {
          !(e == o.target || e.contains(o.target)) && !e.controlled && t.value(o)
      }, document.body.addEventListener("click", e.clickOutsideEvent)
  },
  unmounted: function(e) {
      document.body.removeEventListener("click", e.clickOutsideEvent)
  }
});
Bo.mount("#app");