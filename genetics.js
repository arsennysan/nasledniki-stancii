(function(root){
const genes=['LUX','FLEX','SON','THERM','MET','REG'];
const labels=['Свечение','Гибкость','Эхолокация','Теплоизоляция','Метаболизм','Регуляция'];
function traits(g){return {light:g.LUX.includes(1),flex:g.FLEX.includes(1),echo:g.SON.includes(1),cold:g.THERM.includes(1),energy:16+g.MET.reduce((a,b)=>a+b,0)*3,brightness:g.LUX.includes(1)?1+g.REG.reduce((a,b)=>a+b,0):0};}
function breed(a,b,rng=Math.random,rate=.02){let genome={},origins={},mutations=[];for(const key of genes){genome[key]=[a[key][rng()<.5?0:1],b[key][rng()<.5?0:1]];origins[key]=[...genome[key]];for(let i=0;i<2;i++)if(rng()<rate){genome[key][i]=1-genome[key][i];mutations.push(key+': '+(i+1));}}return {genome,origins,mutations};}
function probability(a,b,key){return 1-((2-a[key][0]-a[key][1])/2)*((2-b[key][0]-b[key][1])/2);}
function genome(active){return Object.fromEntries(genes.map(k=>[k,active.includes(k)?[1,1]:[0,0]]));}
const api={genes,labels,traits,breed,probability,genome};if(typeof module!=='undefined')module.exports=api;root.Genetics=api;
})(globalThis);
