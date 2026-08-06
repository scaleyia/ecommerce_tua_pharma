import EmbeddedPostgres from 'embedded-postgres';
const pg = new EmbeddedPostgres({ databaseDir: './pgdata', user:'postgres', password:'postgres', port:5433, persistent:true });
await pg.start();
try { await pg.createDatabase('medusa'); } catch(e){}
console.log('DB_UP porta 5433 db medusa');
process.on('SIGTERM', async()=>{ try{await pg.stop();}catch(e){} process.exit(0); });
setInterval(()=>{}, 1<<30);
