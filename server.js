import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files={'/cosmos.js':['cosmos.js','text/javascript'],'/':['index.html','text/html'],'/app.js':['app.js','text/javascript'],'/style.css':['style.css','text/css']};
http.createServer(async(req,res)=>{const f=files[new URL(req.url,'http://localhost').pathname];if(!f){res.writeHead(404);res.end();return}try{const body=await readFile(new URL(f[0],import.meta.url));res.writeHead(200,{'Content-Type':f[1]+'; charset=utf-8'});res.end(body)}catch{res.writeHead(500);res.end()}}).listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Listening on port '+(process.env.PORT||3000)));
