import test from 'node:test';
import assert from 'node:assert/strict';
import {roster,createBattle,stepBattle} from './battle.js';
test('速度决定行动顺序，前阵优先承伤',()=>{
  const s=createBattle([{id:'sword',slot:0}],[{id:'guard',slot:0},{id:'fire',slot:7}]);
  const e=stepBattle(s);assert.equal(e.actor,'left-sword');assert.deepEqual(e.targets,['right-guard']);assert.equal(s.units.find(u=>u.uid==='right-fire').hp,105);
});
test('医修恢复伤者气血且不超过上限',()=>{
  const s=createBattle([{id:'heal',slot:0},{id:'guard',slot:1}],[{id:'guard',slot:0}]);
  s.units[1].hp=215;const e=stepBattle(s);assert.equal(e.heal,true);assert.equal(s.units[1].hp,220);
});
test('强化法术攻击多个目标',()=>{
  const s=createBattle([{id:'fire',slot:0}],['guard','heal','sword'].map((id,slot)=>({id,slot})));
  s.round=3;s.queue=['left-fire'];const e=stepBattle(s);assert.equal(e.targets.length,3);assert.ok(s.units.slice(1).every(u=>u.hp<u.maxHp));
});
test('完整六人对局能够结束，阵容与角色模板不被修改',()=>{
  for(let offset=0;offset<32;offset++){
    const f=roster.map((u,i)=>({id:u.id,slot:(i*5+offset)%32}));const before=JSON.stringify(f);const s=createBattle(f,f);let turns=0;
    while(!s.winner&&turns++<1000)stepBattle(s);
    assert.ok(['left','right','draw'].includes(s.winner));assert.ok(s.units.every(u=>u.hp>=0&&u.hp<=u.maxHp));assert.equal(JSON.stringify(f),before);assert.equal(stepBattle(s),null);
  }
  assert.equal(roster[0].hp,130);
});
test('单角色对局可完成，无存活角色重复出手',()=>{
  const s=createBattle([{id:'shadow',slot:0}],[{id:'fire',slot:0}]);let count=0;
  while(!s.winner&&count++<100) {const e=stepBattle(s);if(e)assert.ok(s.units.find(u=>u.uid===e.actor).hp>0);}
  assert.ok(s.winner);
});
test('达到六十回合上限后不再开始下一回合',()=>{
  const s=createBattle([{id:'guard',slot:0}],[{id:'guard',slot:0}]);s.round=60;
  assert.equal(stepBattle(s),null);assert.equal(s.winner,'draw');assert.equal(s.round,60);
});
