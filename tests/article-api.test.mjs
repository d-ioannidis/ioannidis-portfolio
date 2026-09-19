import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function fixture() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../drizzle/0000_article_engagement.sql', import.meta.url), 'utf8'));
  const db = {
    prepare(sql) {
      const statement = sqlite.prepare(sql);
      return {
        bind(...values) {
          return {
            async run() { return statement.run(...values); },
            async first() { return statement.get(...values) ?? null; },
            async all() { return { results: statement.all(...values) }; },
          };
        },
      };
    },
  };
  function route(name) {
    const source = readFileSync(new URL(`../app/api/articles/[slug]/${name}/route.ts`, import.meta.url), 'utf8');
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    });
    const mod = { exports: {} };
    const routeRequire = (name) => name === '@opennextjs/cloudflare'
      ? { getCloudflareContext: async () => ({ env: { DB: db } }) }
      : require(name);
    new Function('require', 'module', 'exports', outputText)(routeRequire, mod, mod.exports);
    return mod.exports;
  }
  return { sqlite, engagement: route('engagement'), comments: route('comments') };
}

const context = { params: Promise.resolve({ slug: 'sql-server-order-management' }) };
function post(body, visitor = 'test-visitor') {
  return new Request('https://example.test/api/articles/sql-server-order-management', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Visitor-Id': visitor },
    body: JSON.stringify(body),
  });
}

test('engagement counts impressions and toggles one visitor like', async () => {
  const { sqlite, engagement } = fixture();
  try {
    let response = await engagement.POST(post({ action: 'impression' }), context);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).impressions, 1);
    response = await engagement.POST(post({ action: 'like' }), context);
    assert.deepEqual(await response.json(), { impressions: 1, likes: 1, liked: true, comments: [] });
    response = await engagement.POST(post({ action: 'like' }), context);
    assert.deepEqual(await response.json(), { impressions: 1, likes: 0, liked: false, comments: [] });
  } finally { sqlite.close(); }
});

test('comments stay private until approved and never expose email', async () => {
  const { sqlite, engagement, comments } = fixture();
  try {
    const response = await comments.POST(post({ name: 'Test reader', email: 'reader@example.test', body: 'A useful article.' }), context);
    assert.equal(response.status, 201);
    const get = () => engagement.GET(new Request('https://example.test'), context);
    assert.deepEqual((await (await get()).json()).comments, []);
    sqlite.exec('UPDATE article_comments SET approved = 1');
    const summary = await (await get()).json();
    assert.equal(summary.comments.length, 1);
    assert.equal(summary.comments[0].body, 'A useful article.');
    assert.equal('email' in summary.comments[0], false);
  } finally { sqlite.close(); }
});

test('non-object JSON receives a validation response instead of crashing', async () => {
  const { sqlite, engagement, comments } = fixture();
  try {
    for (const payload of [null, [], 42, 'invalid']) {
      assert.equal((await comments.POST(post(payload), context)).status, 400);
      assert.equal((await engagement.POST(post(payload), context)).status, 400);
    }
  } finally { sqlite.close(); }
});
