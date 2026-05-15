/**
 * Jest Setup for Solace AI Mobile Testing
 * Compatible with Expo SDK 54, React Native 0.81, Reanimated v4
 */

// Mock AsyncStorage — used by ThemeProvider persistence and AuthContext.
// Uses the official in-memory mock shipped by the library.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// In-memory expo-sqlite mock with enough behaviour to drive repository tests.
// Supports the SQL surface our Sprint 10 repositories produce: CREATE TABLE,
// CREATE INDEX, INSERT, SELECT (with WHERE id = ?, WHERE x = ?, ORDER BY,
// LIMIT, COUNT(*)), UPDATE, DELETE, PRAGMA user_version, transactions, and
// ON CONFLICT upserts on the settings table.
jest.mock("expo-sqlite", () => {
  function createDb() {
    const tables = new Map(); // name -> { rows: Map(id -> row) }
    let userVersion = 0;
    let nextRowId = 0;

    function ensureTable(name) {
      if (!tables.has(name)) {
        tables.set(name, { rows: new Map(), columns: new Set() });
      }
      const tbl = tables.get(name);
      // Older mock instances created tables without a columns set — patch in
      // place so existing fixtures keep working.
      if (!tbl.columns) tbl.columns = new Set();
      return tbl;
    }

    function recordColumns(name, cols) {
      const tbl = ensureTable(name);
      for (const c of cols) {
        if (c) tbl.columns.add(c);
      }
    }

    function extractCreateColumns(sql) {
      // Pull the parenthesised column list out of a `CREATE TABLE` statement
      // and split it on top-level commas. Quick-and-dirty: the migrations we
      // own do not use parenthesised constraints inside a column definition.
      const paren = sql.match(/\(([\s\S]+)\)/);
      if (!paren) return [];
      const body = paren[1];
      const parts = [];
      let depth = 0;
      let buf = "";
      for (const ch of body) {
        if (ch === "(") depth++;
        if (ch === ")") depth--;
        if (ch === "," && depth === 0) {
          parts.push(buf.trim());
          buf = "";
        } else {
          buf += ch;
        }
      }
      if (buf.trim()) parts.push(buf.trim());
      const cols = [];
      for (const part of parts) {
        if (/^(foreign|primary|unique|check)\b/i.test(part)) continue;
        const m = part.match(/^([a-z_][a-z0-9_]*)/i);
        if (m) cols.push(m[1].toLowerCase());
      }
      return cols;
    }

    function evalSelectFilter(sql, params) {
      // Returns { table, predicate, orderBy, limit, columns, isCount }
      const lower = sql.toLowerCase();
      const fromMatch = lower.match(/from\s+([a-z_][a-z0-9_]*)/);
      const table = fromMatch ? fromMatch[1] : null;
      const isCount = /count\s*\(\s*\*\s*\)/.test(lower);
      // ORDER BY can be a bare column (`order by created_at desc`) or a
      // COALESCE() expression with a fallback (`order by coalesce(a, b) desc`).
      // For COALESCE we sort by the first non-null of the listed columns.
      let orderBy = null;
      const coalesceOrder = lower.match(
        /order\s+by\s+coalesce\(\s*([a-z_]+)\s*,\s*([a-z_]+)\s*\)\s*(asc|desc)?/,
      );
      const plainOrder = lower.match(/order\s+by\s+([a-z_]+)\s*(asc|desc)?/);
      if (coalesceOrder) {
        orderBy = {
          coalesce: [coalesceOrder[1], coalesceOrder[2]],
          dir: coalesceOrder[3] === "desc" ? "desc" : "asc",
        };
      } else if (plainOrder) {
        orderBy = { col: plainOrder[1], dir: plainOrder[2] === "desc" ? "desc" : "asc" };
      }
      const limitMatch = lower.match(/limit\s+(\d+)/);
      const limit = limitMatch ? parseInt(limitMatch[1], 10) : null;
      const whereIdx = lower.indexOf("where");
      const orderIdx = orderBy ? lower.indexOf("order by") : -1;
      const limitIdx = limitMatch ? lower.indexOf("limit") : -1;
      let whereClause = "";
      if (whereIdx !== -1) {
        const end = [orderIdx, limitIdx]
          .filter((i) => i !== -1 && i > whereIdx)
          .reduce((min, i) => (min === -1 ? i : Math.min(min, i)), -1);
        whereClause = sql
          .slice(whereIdx + 5, end === -1 ? sql.length : end)
          .trim();
      }
      const predicate = makePredicate(whereClause, params);
      return { table, predicate, orderBy, limit, isCount };
    }

    function makePredicate(whereClause, params) {
      if (!whereClause) return () => true;
      // Strip outer parens
      const trimmed = whereClause.replace(/^\s*\(/, "").replace(/\)\s*$/, "");
      const conditions = trimmed.split(/\s+and\s+/i).map((c) => c.trim());
      const paramIdx = { i: 0 };
      const evaluators = conditions.map((cond) => makeCondition(cond, params, paramIdx));
      return (row) => evaluators.every((fn) => fn(row));
    }

    function makeCondition(cond, params, idx) {
      // Handle search OR clause: (LOWER(body) LIKE ? OR LOWER(IFNULL(title,'')) LIKE ?)
      if (/lower\(/i.test(cond) && /\bor\b/i.test(cond)) {
        const cols = [...cond.matchAll(/lower\(\s*(?:ifnull\(\s*)?([a-z_]+)/gi)].map((m) => m[1]);
        const a = params[idx.i++];
        const b = params[idx.i++];
        return (row) => {
          for (let k = 0; k < cols.length; k++) {
            const v = row[cols[k]];
            const pattern = k === 0 ? a : b;
            if (typeof v === "string" && likeMatch(v.toLowerCase(), pattern)) return true;
          }
          return false;
        };
      }
      const op = cond.match(/(>=|<=|<>|!=|=|>|<|\bLIKE\b)/i);
      if (!op) return () => true;
      const opStr = op[0].toUpperCase();
      const [colExpr, rhsExpr] = cond.split(op[0]).map((s) => s.trim());
      let col = colExpr.replace(/^[a-z_]+\./i, "");
      // Handle LOWER(col) and IFNULL(col,'')
      const lowerMatch = col.match(/lower\(\s*(?:ifnull\(\s*)?([a-z_]+)/i);
      if (lowerMatch) col = lowerMatch[1];
      const isPlaceholder = rhsExpr === "?";
      let rhs;
      if (isPlaceholder) rhs = params[idx.i++];
      else if (/^'.*'$/.test(rhsExpr)) rhs = rhsExpr.slice(1, -1);
      else if (/^\d+$/.test(rhsExpr)) rhs = parseInt(rhsExpr, 10);
      else rhs = rhsExpr;
      return (row) => {
        let v = row[col];
        if (lowerMatch && typeof v === "string") v = v.toLowerCase();
        if (opStr === "=") return v == rhs;
        if (opStr === "!=" || opStr === "<>") return v != rhs;
        if (opStr === ">") return v > rhs;
        if (opStr === ">=") return v >= rhs;
        if (opStr === "<") return v < rhs;
        if (opStr === "<=") return v <= rhs;
        if (opStr === "LIKE") return typeof v === "string" && likeMatch(v, rhs);
        return false;
      };
    }

    function likeMatch(value, pattern) {
      if (typeof pattern !== "string") return false;
      const re = new RegExp(
        "^" +
          pattern
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .replace(/%/g, ".*")
            .replace(/_/g, ".") +
          "$",
        "i",
      );
      return re.test(value);
    }

    function applyOrder(rows, orderBy) {
      if (!orderBy) return rows;
      const dir = orderBy.dir;
      const valueOf = (row) => {
        if (orderBy.coalesce) {
          for (const c of orderBy.coalesce) {
            const v = row[c];
            if (v !== undefined && v !== null) return v;
          }
          return null;
        }
        return row[orderBy.col];
      };
      const sorted = rows.slice().sort((a, b) => {
        const av = valueOf(a);
        const bv = valueOf(b);
        if (av === bv) return 0;
        if (av === undefined || av === null) return 1;
        if (bv === undefined || bv === null) return -1;
        return av < bv ? -1 : 1;
      });
      return dir === "desc" ? sorted.reverse() : sorted;
    }

    async function execAsync(source) {
      const statements = source
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const stmt of statements) {
        await runStatement(stmt, []);
      }
    }

    async function runStatement(sql, params) {
      const trimmed = sql.trim();
      const lower = trimmed.toLowerCase();
      // PRAGMA
      if (lower.startsWith("pragma user_version")) {
        const setMatch = trimmed.match(/=\s*(\d+)/);
        if (setMatch) {
          userVersion = parseInt(setMatch[1], 10);
          return { changes: 0, lastInsertRowId: 0 };
        }
        return { changes: 0, lastInsertRowId: 0 };
      }
      if (lower.startsWith("create table")) {
        const m = trimmed.match(/create\s+table\s+(?:if\s+not\s+exists\s+)?([a-z_][a-z0-9_]*)/i);
        if (m) {
          ensureTable(m[1]);
          recordColumns(m[1], extractCreateColumns(trimmed));
        }
        return { changes: 0, lastInsertRowId: 0 };
      }
      if (lower.startsWith("create index")) {
        return { changes: 0, lastInsertRowId: 0 };
      }
      if (lower.startsWith("alter table")) {
        const m = trimmed.match(
          /alter\s+table\s+([a-z_][a-z0-9_]*)\s+add\s+(?:column\s+)?([a-z_][a-z0-9_]*)/i,
        );
        if (m) {
          recordColumns(m[1], [m[2].toLowerCase()]);
        }
        return { changes: 0, lastInsertRowId: 0 };
      }
      if (lower.startsWith("insert into")) {
        return runInsert(trimmed, params);
      }
      if (lower.startsWith("update ")) {
        return runUpdate(trimmed, params);
      }
      if (lower.startsWith("delete from")) {
        return runDelete(trimmed, params);
      }
      throw new Error(`Mock expo-sqlite: unsupported statement: ${trimmed}`);
    }

    function runInsert(sql, params) {
      const tableMatch = sql.match(/insert\s+into\s+([a-z_][a-z0-9_]*)/i);
      const colsMatch = sql.match(/\(([^)]+)\)\s*values/i);
      const valuesMatch = sql.match(/values\s*\(([^)]+)\)/i);
      if (!tableMatch || !colsMatch || !valuesMatch) {
        throw new Error(`Mock expo-sqlite: cannot parse INSERT: ${sql}`);
      }
      const tableName = tableMatch[1];
      const cols = colsMatch[1].split(",").map((c) => c.trim());
      const valTokens = valuesMatch[1].split(",").map((c) => c.trim());
      const row = {};
      let p = 0;
      for (let i = 0; i < cols.length; i++) {
        const tok = valTokens[i];
        if (tok === "?") row[cols[i]] = params[p++];
        else if (/^null$/i.test(tok)) row[cols[i]] = null;
        else if (/^'.*'$/.test(tok)) row[cols[i]] = tok.slice(1, -1);
        else if (/^\d+$/.test(tok)) row[cols[i]] = parseInt(tok, 10);
        else row[cols[i]] = tok;
      }
      const tbl = ensureTable(tableName);
      const onConflict = /on\s+conflict\s*\(([^)]+)\)\s*do\s+update\s+set\s+(.+)$/i.exec(sql);
      if (onConflict) {
        const keyCol = onConflict[1].trim();
        const setClause = onConflict[2].replace(/\s+where\s+.*$/i, "");
        const existingKey = row[keyCol];
        let target = null;
        for (const r of tbl.rows.values()) {
          if (r[keyCol] === existingKey) {
            target = r;
            break;
          }
        }
        if (target) {
          applyConflictSet(target, setClause, row);
          return { changes: 1, lastInsertRowId: nextRowId };
        }
      }
      const id = row.id !== undefined ? row.id : `row_${++nextRowId}`;
      tbl.rows.set(id, row);
      return { changes: 1, lastInsertRowId: ++nextRowId };
    }

    function applyConflictSet(target, setClause, candidate) {
      const assignments = setClause.split(",").map((s) => s.trim());
      for (const a of assignments) {
        const m = a.match(/^([a-z_]+)\s*=\s*(?:excluded\.)?([a-z_]+)$/i);
        if (m) target[m[1]] = candidate[m[2]];
      }
    }

    function runUpdate(sql, params) {
      const tableMatch = sql.match(/update\s+([a-z_][a-z0-9_]*)\s+set\s+(.+?)\s+where\s+(.+)$/is);
      if (!tableMatch) {
        const noWhere = sql.match(/update\s+([a-z_][a-z0-9_]*)\s+set\s+(.+)$/is);
        if (!noWhere) throw new Error(`Mock expo-sqlite: cannot parse UPDATE: ${sql}`);
        return runUpdateRows(noWhere[1], noWhere[2], "", params);
      }
      return runUpdateRows(tableMatch[1], tableMatch[2], tableMatch[3], params);
    }

    function runUpdateRows(tableName, setClause, whereClause, params) {
      const tbl = ensureTable(tableName);
      const assignments = setClause.split(",").map((s) => s.trim());
      const placeholderCount = (setClause.match(/\?/g) || []).length;
      const setParams = params.slice(0, placeholderCount);
      const whereParams = params.slice(placeholderCount);
      let pi = 0;
      const setOps = assignments.map((a) => {
        const m = a.match(/^([a-z_]+)\s*=\s*(.+)$/i);
        if (!m) return null;
        const col = m[1];
        const rhs = m[2].trim();
        if (rhs === "?") {
          const v = setParams[pi++];
          return { col, value: v };
        }
        if (/^'.*'$/.test(rhs)) return { col, value: rhs.slice(1, -1) };
        if (/^\d+$/.test(rhs)) return { col, value: parseInt(rhs, 10) };
        return { col, value: rhs };
      }).filter(Boolean);
      const predicate = makePredicate(whereClause, whereParams);
      let changes = 0;
      for (const row of tbl.rows.values()) {
        if (predicate(row)) {
          for (const op of setOps) row[op.col] = op.value;
          changes++;
        }
      }
      return { changes, lastInsertRowId: 0 };
    }

    function runDelete(sql, params) {
      const m = sql.match(/delete\s+from\s+([a-z_][a-z0-9_]*)(?:\s+where\s+(.+))?$/i);
      if (!m) throw new Error(`Mock expo-sqlite: cannot parse DELETE: ${sql}`);
      const tbl = ensureTable(m[1]);
      const predicate = makePredicate(m[2] || "", params);
      let changes = 0;
      for (const [id, row] of tbl.rows.entries()) {
        if (predicate(row)) {
          tbl.rows.delete(id);
          changes++;
        }
      }
      return { changes, lastInsertRowId: 0 };
    }

    async function getAllAsync(source, ...rest) {
      const params = flattenParams(rest);
      const lower = source.toLowerCase().trim();
      if (lower.startsWith("pragma user_version")) {
        return [{ user_version: userVersion }];
      }
      const tableInfo = lower.match(/^pragma\s+table_info\(\s*([a-z_][a-z0-9_]*)\s*\)/);
      if (tableInfo) {
        const tbl = ensureTable(tableInfo[1]);
        return Array.from(tbl.columns).map((name, cid) => ({
          cid,
          name,
          type: "TEXT",
          notnull: 0,
          dflt_value: null,
          pk: 0,
        }));
      }
      if (!lower.startsWith("select")) {
        throw new Error(`Mock expo-sqlite: getAllAsync expects SELECT: ${source}`);
      }
      const { table, predicate, orderBy, limit, isCount } = evalSelectFilter(source, params);
      const tbl = ensureTable(table);
      let rows = Array.from(tbl.rows.values()).filter(predicate);
      rows = applyOrder(rows, orderBy);
      if (limit !== null) rows = rows.slice(0, limit);
      if (isCount) {
        return [{ n: rows.length }];
      }
      return rows.map((r) => ({ ...r }));
    }

    async function getFirstAsync(source, ...rest) {
      const params = flattenParams(rest);
      const lower = source.toLowerCase().trim();
      if (lower.startsWith("pragma user_version")) {
        return { user_version: userVersion };
      }
      const tableInfo = lower.match(/^pragma\s+table_info\(\s*([a-z_][a-z0-9_]*)\s*\)/);
      if (tableInfo) {
        const tbl = ensureTable(tableInfo[1]);
        const first = Array.from(tbl.columns)[0];
        if (first === undefined) return null;
        return {
          cid: 0,
          name: first,
          type: "TEXT",
          notnull: 0,
          dflt_value: null,
          pk: 0,
        };
      }
      const { table, predicate, orderBy, limit, isCount } = evalSelectFilter(source, params);
      const tbl = ensureTable(table);
      let rows = Array.from(tbl.rows.values()).filter(predicate);
      rows = applyOrder(rows, orderBy);
      if (limit !== null) rows = rows.slice(0, limit);
      if (isCount) {
        return { n: rows.length };
      }
      return rows.length > 0 ? { ...rows[0] } : null;
    }

    async function runAsync(source, ...rest) {
      const params = flattenParams(rest);
      return runStatement(source, params);
    }

    function flattenParams(rest) {
      if (rest.length === 1 && Array.isArray(rest[0])) return rest[0];
      return rest;
    }

    async function withTransactionAsync(task) {
      // No real isolation in the mock — just run the task.
      await task();
    }

    async function closeAsync() {
      tables.clear();
      userVersion = 0;
    }

    return {
      execAsync,
      getAllAsync,
      getFirstAsync,
      runAsync,
      withTransactionAsync,
      closeAsync,
      __debug: { tables, getUserVersion: () => userVersion },
    };
  }

  return {
    openDatabaseAsync: jest.fn(async () => createDb()),
    __createDb: createDb,
  };
});

// Mock react-native-worklets (required by Reanimated v4)
jest.mock("react-native-worklets", () => ({
  createWorklet: jest.fn(),
  runOnJS: jest.fn((fn) => fn),
  runOnUI: jest.fn((fn) => fn),
  useWorklet: jest.fn(),
  makeShareable: jest.fn((value) => value),
}));

// Mock react-native-reanimated (v4 - complete standalone mock)
jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const { View, Text, Image, ScrollView, FlatList } = require("react-native");

  return {
    __esModule: true,
    default: {
      View,
      Text,
      Image,
      ScrollView,
      FlatList,
      createAnimatedComponent: (component) => component,
      addWhitelistedNativeProps: jest.fn(),
      addWhitelistedUIProps: jest.fn(),
      call: jest.fn(),
      Value: jest.fn(),
      event: jest.fn(),
      Clock: jest.fn(),
      SpringUtils: { makeDefaultConfig: jest.fn() },
    },
    useSharedValue: jest.fn((init) => ({ value: init })),
    useAnimatedStyle: jest.fn((fn) => (typeof fn === "function" ? fn() : {})),
    useDerivedValue: jest.fn((fn) => ({ value: typeof fn === "function" ? fn() : fn })),
    useAnimatedProps: jest.fn((fn) => (typeof fn === "function" ? fn() : {})),
    useAnimatedRef: jest.fn(() => ({ current: null })),
    useAnimatedScrollHandler: jest.fn(() => jest.fn()),
    useAnimatedGestureHandler: jest.fn(() => jest.fn()),
    withTiming: jest.fn((toValue) => toValue),
    withSpring: jest.fn((toValue) => toValue),
    withDelay: jest.fn((_, animation) => animation),
    withSequence: jest.fn((...animations) => animations[animations.length - 1]),
    withRepeat: jest.fn((animation) => animation),
    withDecay: jest.fn((config) => 0),
    cancelAnimation: jest.fn(),
    interpolate: jest.fn((value) => value),
    Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
    Easing: {
      linear: jest.fn((x) => x),
      ease: jest.fn((x) => x),
      quad: jest.fn((x) => x),
      cubic: jest.fn((x) => x),
      poly: jest.fn(() => jest.fn((x) => x)),
      sin: jest.fn((x) => x),
      circle: jest.fn((x) => x),
      exp: jest.fn((x) => x),
      elastic: jest.fn(() => jest.fn((x) => x)),
      back: jest.fn(() => jest.fn((x) => x)),
      bounce: jest.fn((x) => x),
      bezier: jest.fn(() => jest.fn((x) => x)),
      bezierFn: jest.fn(() => jest.fn((x) => x)),
      steps: jest.fn(() => jest.fn((x) => x)),
      in: jest.fn((easing) => easing),
      out: jest.fn((easing) => easing),
      inOut: jest.fn((easing) => easing),
    },
    FadeIn: { duration: jest.fn().mockReturnThis(), delay: jest.fn().mockReturnThis(), build: jest.fn() },
    FadeOut: { duration: jest.fn().mockReturnThis(), delay: jest.fn().mockReturnThis(), build: jest.fn() },
    FadeInDown: { duration: jest.fn().mockReturnThis(), delay: jest.fn().mockReturnThis(), build: jest.fn() },
    FadeInUp: { duration: jest.fn().mockReturnThis(), delay: jest.fn().mockReturnThis(), build: jest.fn() },
    SlideInRight: { duration: jest.fn().mockReturnThis(), build: jest.fn() },
    SlideOutLeft: { duration: jest.fn().mockReturnThis(), build: jest.fn() },
    SlideInLeft: { duration: jest.fn().mockReturnThis(), build: jest.fn() },
    SlideOutRight: { duration: jest.fn().mockReturnThis(), build: jest.fn() },
    Layout: { duration: jest.fn().mockReturnThis(), build: jest.fn() },
    LinearTransition: { duration: jest.fn().mockReturnThis(), build: jest.fn() },
    runOnJS: jest.fn((fn) => fn),
    runOnUI: jest.fn((fn) => fn),
    createAnimatedComponent: jest.fn((component) => component),
    useReducedMotion: jest.fn(() => false),
    measure: jest.fn(() => ({ x: 0, y: 0, width: 0, height: 0, pageX: 0, pageY: 0 })),
    scrollTo: jest.fn(),
    setGestureState: jest.fn(),
    enableLayoutAnimations: jest.fn(),
    makeMutable: jest.fn((init) => ({ value: init })),
    makeShareableShadowNodeWrapper: jest.fn(),
  };
});

// Mock NativeAnimatedHelper for RN 0.81+ (prevents "Native animated module is not available")
jest.mock("react-native/src/private/animated/NativeAnimatedHelper", () => ({
  API: {
    enableQueue: jest.fn(),
    disableQueue: jest.fn(),
    createAnimatedNode: jest.fn(),
    updateAnimatedNodeConfig: jest.fn(),
    getValue: jest.fn(),
    startListeningToAnimatedNodeValue: jest.fn(),
    stopListeningToAnimatedNodeValue: jest.fn(),
    connectAnimatedNodes: jest.fn(),
    disconnectAnimatedNodes: jest.fn(),
    startAnimatingNode: jest.fn(),
    stopAnimation: jest.fn(),
    setAnimatedNodeValue: jest.fn(),
    setAnimatedNodeOffset: jest.fn(),
    flattenAnimatedNodeOffset: jest.fn(),
    extractAnimatedNodeOffset: jest.fn(),
    connectAnimatedNodeToView: jest.fn(),
    disconnectAnimatedNodeFromView: jest.fn(),
    restoreDefaultValues: jest.fn(),
    dropAnimatedNode: jest.fn(),
    addAnimatedEventToView: jest.fn(),
    removeAnimatedEventFromView: jest.fn(),
    flushQueue: jest.fn(),
  },
  addListener: jest.fn(),
  removeListeners: jest.fn(),
  shouldUseNativeDriver: jest.fn(() => false),
  generateNewNodeTag: jest.fn(() => 1),
  generateNewAnimationId: jest.fn(() => 1),
  assertNativeAnimatedModule: jest.fn(),
  transformDataType: jest.fn((value) => value),
  default: {
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
}));

// Mock useColorScheme hook for consistent test behavior
jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  default: jest.fn(() => "dark"),
}));

// Mock Linking module (fixes CrisisModal tests + URL-opening tests)
// react-native accesses Linking via .default, so we need both the module
// exports and a .default property pointing to the same object
jest.mock("react-native/Libraries/Linking/Linking", () => {
  const linking = {
    openURL: jest.fn(() => Promise.resolve()),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
    getInitialURL: jest.fn(() => Promise.resolve(null)),
  };
  return { __esModule: true, default: linking, ...linking };
});

// Mock Keyboard module (fixes bottom-tabs navigation tests)
// react-native accesses Keyboard via .default
jest.mock("react-native/Libraries/Components/Keyboard/Keyboard", () => {
  const keyboard = {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeListener: jest.fn(),
    dismiss: jest.fn(),
    isVisible: jest.fn(() => false),
    metrics: jest.fn(() => undefined),
  };
  return { __esModule: true, default: keyboard, ...keyboard };
});

// Keep a stable reference to the real Date constructor
const __RealDate = Date;

function __ensureDateNow() {
  try {
    if (typeof Date.now !== "function") {
      Object.defineProperty(Date, "now", {
        configurable: true,
        writable: true,
        value: () => new __RealDate().getTime(),
      });
    }
  } catch {
    Date.now = () => new __RealDate().getTime();
  }
}

__ensureDateNow();

// Global fetch mock for API testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
  }),
);

// Mock TurboModuleRegistry for React Native 0.76+ compatibility
jest.mock("react-native/Libraries/TurboModule/TurboModuleRegistry", () => ({
  getEnforcing: jest.fn((name) => {
    if (name === "SettingsManager") {
      return {
        settings: {},
        setSettings: jest.fn(),
        getSettings: jest.fn(() => ({})),
      };
    }
    if (name === "DeviceInfo") {
      return {
        getConstants: jest.fn(() => ({
          Dimensions: {
            window: { width: 375, height: 667, scale: 2, fontScale: 1 },
            screen: { width: 375, height: 667, scale: 2, fontScale: 1 },
          },
        })),
      };
    }
    if (name === "PlatformConstants") {
      return {
        getConstants: jest.fn(() => ({
          forceTouchAvailable: false,
          interfaceIdiom: "phone",
          osVersion: "14.0",
          systemName: "iOS",
        })),
      };
    }
    return null;
  }),
  get: jest.fn(() => null),
}));

// NativeDeviceInfo is handled by TurboModuleRegistry mock above (RN 0.81+ compatible)

// Mock NativeSettingsManager
jest.mock("react-native/Libraries/Settings/NativeSettingsManager", () => ({
  getConstants: jest.fn(() => ({
    settings: {},
  })),
}));

// Mock NativeEventEmitter
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter", () => {
  function MockNativeEventEmitter() {
    this.listeners = {};
    this.addListener = jest.fn();
    this.removeListener = jest.fn();
    this.removeAllListeners = jest.fn();
    this.emit = jest.fn();
  }
  return MockNativeEventEmitter;
});

// Sprint 12: collapsed the legacy alias families (brown/tan/olive/gold/stone/
// gray/white/black/yellow/orange/purple/teal/pink/slate/primary.gold) — every
// consumer was reskinned in S12-A to import cosmic palette tokens directly.
// The mock now exposes only the cosmic families + status palettes that the
// real `colors.ts` exports. Tests assert cosmic hex values (#040818, #9BC4B0,
// #161D3D, etc.) — same shapes as production rendering.
jest.mock("./src/shared/theme", () => ({
  palette: {
    red: { 500: "#EF4444" },
    green: { 500: "#22C55E", 450: "#4A9E8C" },
    amber: { 500: "#F59E0B", 450: "#FFD93D" },
    blue: { 500: "#3B82F6", 600: "#2563EB" },
    background: {
      primary: "#040818", secondary: "#0E1430", tertiary: "#161D3D",
      quaternary: "#202A55", hero: "#0E1430",
    },
    text: {
      primary: "#F5F1EA", secondary: "#8B95A8", tertiary: "#5A6478",
      disabled: "#202A55", inverse: "#040818",
    },
    accent: { orange: "#E88B5A", green: "#9BC4B0", purple: "#8B7CC8" },
    opacity: {
      white04: "rgba(255, 255, 255, 0.04)", white05: "rgba(255, 255, 255, 0.05)",
      white06: "rgba(255, 255, 255, 0.06)", white08: "rgba(255, 255, 255, 0.08)",
      white10: "rgba(255, 255, 255, 0.1)",  white12: "rgba(255, 255, 255, 0.12)",
      white18: "rgba(255, 255, 255, 0.18)", white20: "rgba(255, 255, 255, 0.2)",
      white30: "rgba(255, 255, 255, 0.3)",  white40: "rgba(255, 255, 255, 0.4)",
      black50: "rgba(0, 0, 0, 0.5)",
    },
    indigo: {
      500: "#6366F1", 400: "#818CF8", 300: "#A5B4FC",
      200: "#C7D2FE", 100: "#E0E7FF",
    },
    alpha: {
      5: "0D", 10: "1A", 15: "26", 20: "33", 30: "4D", 40: "66",
      50: "80", 60: "99", 70: "B3", 80: "CC", 90: "E6",
    },
    success: "#7AAA94", warning: "#E88B5A", error: "#EF4444", info: "#A89AE0",
    onboarding: {
      step1: "#9BC4B0", step2: "#F4A77E", step3: "#8B95A8",
      step4: "#6B8FFF", step5: "#8B7CC8",
    },
    semantic: {
      info: "#818CF8", success: "#22C55E", warning: "#F59E0B", error: "#EF4444",
    },

    // ---- Cosmic families (NEW — values match src/shared/theme/colors.ts) ----
    midnight: { 950: "#040818", 900: "#070C20", 800: "#0E1430", 700: "#161D3D", 600: "#202A55" },
    aurora:   { 100: "#D6E0FF", 300: "#8AA3FF", 500: "#6B8FFF", 700: "#4A6FE5" },
    sage:     { 100: "#D8EADF", 300: "#9BC4B0", 500: "#7AAA94", 700: "#5A8A78" },
    peach:    { 100: "#FCE3D4", 300: "#F4A77E", 500: "#E88B5A" },
    lavender: { 100: "#E0DAF3", 300: "#A89AE0", 500: "#8B7CC8" },
    warm:     { 50: "#F5F1EA", 100: "#EAE3D5", 200: "#C7BEA9", 400: "#8B95A8", 500: "#5A6478" },
    mist:     "#BFCFE8",
  },
  colors: {
    background: {
      primary: "#1C1410", secondary: "#2A1F1A", tertiary: "#3D2E23",
      overlay: "rgba(0, 0, 0, 0.85)", elevated: "#57493D",
    },
    text: {
      primary: "#FFFFFF", secondary: "#94A3B8", tertiary: "#64748B",
      disabled: "#475569", inverse: "#1C1410", accent: "#C4A574",
      muted: "#A8A29E", error: "#EF4444", success: "#22C55E",
      warning: "#F59E0B", info: "#818CF8",
    },
    border: {
      default: "rgba(255, 255, 255, 0.1)", light: "rgba(255, 255, 255, 0.05)",
      medium: "rgba(255, 255, 255, 0.2)",  heavy: "rgba(255, 255, 255, 0.3)",
      accent: "#C4A574", error: "#EF4444",
    },
    interactive: {
      default: "#C4A574", hover: "#D4B894", active: "#E0CAA4",
      disabled: "rgba(196, 165, 116, 0.3)", ghost: "rgba(255, 255, 255, 0.05)",
    },
    status: {
      success: { background: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.3)", text: "#22C55E" },
      warning: { background: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)", text: "#F59E0B" },
      error:   { background: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.3)", text: "#EF4444" },
      info:    { background: "rgba(129, 140, 248, 0.15)", border: "rgba(129, 140, 248, 0.3)", text: "#818CF8" },
    },
    form: {
      background: "rgba(255, 255, 255, 0.05)", backgroundFocus: "rgba(255, 255, 255, 0.1)",
      border: "rgba(255, 255, 255, 0.2)", borderFocus: "#C4A574",
      borderError: "#EF4444", placeholder: "#64748B", label: "#94A3B8", error: "#EF4444",
    },
    badge: {
      default: { background: "#475569", text: "#E2E8F0" },
      success: { background: "rgba(34, 197, 94, 0.2)", text: "#22C55E" },
      warning: { background: "rgba(245, 158, 11, 0.2)", text: "#F59E0B" },
      error:   { background: "rgba(239, 68, 68, 0.2)", text: "#EF4444" },
      info:    { background: "rgba(129, 140, 248, 0.2)", text: "#818CF8" },
    },
    progress: {
      track: "#334155", fill: "#C4A574", success: "#22C55E",
      warning: "#F59E0B", error: "#EF4444",
    },
    crisis: {
      primary: "#EF4444", background: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.3)", text: "#FCA5A5",
    },
  },
  shadows: {
    none: { shadowColor: "transparent", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
    sm: { shadowColor: "#000000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
    md: { shadowColor: "#000000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 4 },
    lg: { shadowColor: "#000000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 8 },
    xl: { shadowColor: "#000000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 16 },
  },
  applyShadow: jest.fn((level = "md") => {
    const shadows = {
      none: { shadowColor: "transparent", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
      sm: { shadowColor: "#000000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
      md: { shadowColor: "#000000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 4 },
      lg: { shadowColor: "#000000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 8 },
      xl: { shadowColor: "#000000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 16 },
    };
    return shadows[level] || shadows.md;
  }),
  gradients: {},
  animations: {},
  zIndex: {},
  spacing: {
    xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24,
    xxxl: 32, xxxxl: 40, section: 48,
  },
}));

// Mock AuthContext (provides auth state to components)
jest.mock("./src/app/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: false,
    hasCompletedOnboarding: false,
    isLoading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
    completeOnboarding: jest.fn(),
  })),
  AuthProvider: ({ children }) => children,
}));

// Mock ThemeProvider from useTheme (wraps app with theme context)
jest.mock("./src/shared/theme/useTheme", () => {
  const actual = jest.requireActual("./src/shared/theme/useTheme");
  return {
    ...actual,
    ThemeProvider: ({ children }) => children,
  };
});

// Mock @react-navigation/native (provides navigation to components using useNavigation)
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    setOptions: jest.fn(),
  })),
  useRoute: jest.fn(() => ({
    params: {},
  })),
}));

// Mock react-native-safe-area-context (provides safe area insets for ScreenContainer)
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const insets = { top: 0, bottom: 0, left: 0, right: 0 };
  const frame = { x: 0, y: 0, width: 0, height: 0 };
  const SafeAreaInsetsContext = React.createContext(insets);
  const SafeAreaFrameContext = React.createContext(frame);
  return {
    useSafeAreaInsets: jest.fn(() => insets),
    useSafeAreaFrame: jest.fn(() => frame),
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children, ...props }) =>
      React.createElement(require("react-native").View, props, children),
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
    initialWindowMetrics: {
      frame,
      insets,
    },
  };
});

// Mock expo-linking (deep link handling)
jest.mock("expo-linking", () => ({
  getInitialURL: jest.fn(() => Promise.resolve(null)),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  createURL: jest.fn((path) => `solace://${path}`),
}));

// Mock lazy-loaded navigation stack modules (prevents dynamic import() issues in tests)
jest.mock("./src/app/navigation/stacks/DashboardStack", () => ({
  DashboardStack: () => null,
}));
jest.mock("./src/app/navigation/stacks/MoodStack", () => ({
  MoodStack: () => null,
}));
jest.mock("./src/app/navigation/stacks/ChatStack", () => ({
  ChatStack: () => null,
}));
jest.mock("./src/app/navigation/stacks/JournalStack", () => ({
  JournalStack: () => null,
}));
jest.mock("./src/app/navigation/stacks/ProfileStack", () => ({
  ProfileStack: () => null,
}));
