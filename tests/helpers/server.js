export function session(server) {
  server.post('/db/_session', function(){
    return {"ok":true,"name":"hradmin","roles":["System Administrator","admin","user"]};
  });
  server.post('/chkuser', function(){
    return {"prefix":"p1","role":"System Administrator"};
  });
}
