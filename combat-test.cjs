const assert=require('node:assert/strict'),{Arena,blocked,moveBody,sight}=require('./combat.js');
const a=new Arena(()=>.5);a.start();assert.equal(a.wave,1);assert.equal(a.pending.length,5);
// Large movements cannot tunnel through the central cover or arena boundary.
const b={x:420,y:300,r:13};moveBody(b,200,0);assert.ok(b.x<458);assert.equal(blocked(b.x,b.y,b.r),false);moveBody(b,-2000,0);assert.ok(b.x>=53);assert.equal(sight({x:400,y:300},{x:600,y:300}),false);
// Dash has cooldown and invulnerability, cannot phase through walls.
a.player.x=420;a.player.y=300;assert.equal(a.dash(1,0),true);assert.equal(a.dash(1,0),false);a.step(.03);assert.ok(a.player.x<458);const hp=a.player.hp;a.hurt(1);assert.equal(a.player.hp,hp);
// Damage respects invulnerability and loss transitions.
a.player.inv=0;a.hurt(1);assert.equal(a.player.hp,hp-1);a.hurt(1);assert.equal(a.player.hp,hp-1);
// Pulse clears nearby hostile projectiles and damages enemies.
a.enemies=[{x:a.player.x+30,y:a.player.y,hp:50,r:14}];a.bullets=[{x:a.player.x+20,y:a.player.y,enemy:true},{x:900,y:540,enemy:true}];assert.equal(a.pulse(),true);assert.equal(a.enemies[0].hp,18);assert.equal(a.bullets.length,1);assert.equal(a.pulse(),false);
// Clears freeze gameplay for mutation selection, then resume next wave.
a.enemies=[];a.pending=[];a.waveTime=3;a.step(.01);assert.equal(a.mode,'cleared');a.mode='choice';assert.equal(a.choose('invalid'),false);const oldPellets=a.player.pellets;assert.equal(a.choose('split'),true);assert.equal(a.player.pellets,oldPellets+1);assert.equal(a.mode,'service');a.nextWave();assert.equal(a.wave,2);assert.equal(a.mode,'playing');
// Swept bullets hit enemies and cover rather than jumping past them.
const c=new Arena(()=>.5);c.start();c.pending=[];c.player.x=100;c.player.y=300;c.enemies=[{x:130,y:300,r:14,type:'chaser',hp:5,maxHp:28,speed:0,cd:1,hit:0,age:0,phase:0}];c.bullets=[{x:108,y:300,vx:640,vy:0,r:3,damage:12,life:1,enemy:false}];c.step(.035);assert.equal(c.enemies.length,0);assert.equal(c.kills,1);
const d=new Arena(()=>.5);d.start();d.wave=9;d.pending=[];d.enemies=[];d.waveTime=3;d.step(.01);assert.equal(d.mode,'won');assert.ok(d.score>0);
const dead=new Arena();dead.start();dead.player.inv=0;dead.hurt(100);assert.equal(dead.mode,'dead');const pos=dead.player.x;dead.step(.03,{dx:1});assert.equal(dead.player.x,pos);
console.log('PASS: swept collisions, line of sight, dash, damage immunity, pulse, mutations, wave transitions, projectile hits, victory and defeat.');

