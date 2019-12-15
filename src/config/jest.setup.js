import db from '../database';

/*
global.afterEach(() => {
  const str = 'total: '+db.getTotalConnections()+' active: '+db.getActiveConnections()+' idle: '+db.getIdleConnections();
  expect(str).toEqual('');
});
*/


global.afterAll(() => {
  db.instance.end()
});