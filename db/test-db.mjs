import EmbeddedPostgres from 'embedded-postgres';
const pg = new EmbeddedPostgres({ databaseDir: './pgdata', user: 'postgres', password: 'postgres', port: 5433, persistent: true });
console.log('init...'); await pg.initialise();
console.log('start...'); await pg.start();
try { await pg.createDatabase('medusa'); console.log('db medusa criada'); } catch(e){ console.log('db já existe ou:', e.message); }
const client = pg.getPgClient(); await client.connect();
const r = await client.query('select version()'); console.log('OK:', r.rows[0].version.slice(0,40));
await client.end(); await pg.stop(); console.log('parado. tudo certo.');
