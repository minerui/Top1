export const roster = [
  {id:'sword',name:'青岚剑修',glyph:'剑',role:'剑修',skill:'御剑诀',hp:130,atk:29,def:5,speed:9,color:'#8ed8cc'},
  {id:'guard',name:'玄岳体修',glyph:'岳',role:'体修',skill:'撼山拳',hp:220,atk:20,def:12,speed:3,color:'#d8b575'},
  {id:'fire',name:'赤霄法修',glyph:'焰',role:'法修',skill:'焚天咒',hp:105,atk:36,def:3,speed:6,color:'#f3947d'},
  {id:'heal',name:'云裳医修',glyph:'莲',role:'医修',skill:'回春术',hp:125,atk:17,def:5,speed:5,color:'#b2d794'},
  {id:'shadow',name:'夜隐刺修',glyph:'影',role:'刺修',skill:'破影击',hp:110,atk:31,def:3,speed:12,color:'#b8a2e3'},
  {id:'frost',name:'寒川灵修',glyph:'霜',role:'灵修',skill:'寒霜诀',hp:145,atk:25,def:7,speed:7,color:'#91bfea'},
];
export const makeUnit=(id,slot,side)=>{const type=roster.find(r=>r.id===id);if(!type)throw Error('未知角色');return {...type,uid:side+'-'+id,slot,side,maxHp:type.hp,alive:true};};
export function createBattle(left,right){return {units:[...left.map(u=>makeUnit(u.id,u.slot,'left')),...right.map(u=>makeUnit(u.id,u.slot,'right'))],round:0,queue:[],winner:null};}
const living=(state,side)=>state.units.filter(u=>u.side===side&&u.hp>0);
export function stepBattle(state){
  if(state.winner)return null;
  if(!state.queue.length){if(state.round>=60){state.winner='draw';return null;}state.round++;state.queue=state.units.filter(u=>u.hp>0).sort((a,b)=>b.speed-a.speed||a.uid.localeCompare(b.uid)).map(u=>u.uid);}
  let actor;
  while(state.queue.length&&!actor){const uid=state.queue.shift();const next=state.units.find(u=>u.uid===uid);if(next.hp>0)actor=next;}
  if(!actor)return stepBattle(state);
  const friends=living(state,actor.side),enemies=living(state,actor.side==='left'?'right':'left');
  if(!enemies.length){state.winner=actor.side;return null;}
  const empowered=state.round%3===0;
  let targets=[],text='',heal=false;
  if(actor.id==='heal'&&friends.some(u=>u.hp<u.maxHp)){
    const target=[...friends].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
    const amount=Math.min(target.maxHp-target.hp,empowered?48:30);target.hp+=amount;targets=[target.uid];heal=true;text=`${actor.name}施展回春术，为${target.name}恢复 ${amount} 点气血。`;
  }else{
    // Columns nearest the opposing formation take attacks first. Assassins target the weakest instead.
    const ordered=[...enemies].sort((a,b)=>actor.id==='shadow'?a.hp-b.hp:(actor.side==='left'?a.slot%8-b.slot%8:b.slot%8-a.slot%8)||Math.abs(Math.floor(a.slot/8)-Math.floor(actor.slot/8))-Math.abs(Math.floor(b.slot/8)-Math.floor(actor.slot/8)));
    const victims=actor.id==='fire'&&empowered?ordered.slice(0,3):ordered.slice(0,1);
    const details=[];
    for(const target of victims){const amount=Math.max(5,Math.round(actor.atk*(empowered?1.6:1)-(actor.id==='shadow'&&empowered?0:target.def)));target.hp=Math.max(0,target.hp-amount);target.alive=target.hp>0;targets.push(target.uid);details.push(`${target.name} −${amount}${target.hp===0?'（退场）':''}`);}
    text=`${actor.name}${empowered?'施展'+actor.skill:'出手'}：${details.join('，')}。`;
  }
  if(!living(state,'right').length)state.winner='left';
  else if(!living(state,'left').length)state.winner='right';
  else if(state.round>=60&&!state.queue.length)state.winner='draw';
  return {actor:actor.uid,targets,text,heal,round:state.round,winner:state.winner};
}
