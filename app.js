const sets = [
  {name:"Pitch Black",code:"me5",icon:"🌑",pulls:[
    ["Mega Darkrai ex","116/084","Special Illustration Rare",218.91,"116"],
    ["Mega Darkrai ex","120/084","Mega Hyper Rare",171.45,"120"],
    ["Morpeko ex","117/084","Special Illustration Rare",93.21,"117"],
    ["Mega Zeraora ex","114/084","Special Illustration Rare",61.64,"114"],
    ["Mega Chandelure ex","115/084","Special Illustration Rare",48.57,"115"]]},
  {name:"Chaos Rising",code:"me4",icon:"🌊",pulls:[
    ["Mega Greninja ex","116/086","Special Illustration Rare",197.00,"116"],
    ["Mega Greninja ex","122/086","Mega Hyper Rare",175.02,"122"],
    ["Cinccino ex","119/086","Special Illustration Rare",62.13,"119"],
    ["Mega Dragalge ex","118/086","Special Illustration Rare",39.39,"118"],
    ["Mega Floette ex","117/086","Special Illustration Rare",31.84,"117"]]},
  {name:"Perfect Order",code:"me3",icon:"💚",note:"Poké Pad is card #113 in this set",pulls:[
    ["Mega Zygarde ex","124/088","Mega Hyper Rare",184.69,"124"],
    ["Meowth ex","121/088","Special Illustration Rare",156.33,"121"],
    ["Mega Zygarde ex","120/088","Special Illustration Rare",108.81,"120"],
    ["Rosa's Encouragement","123/088","Special Illustration Rare",84.63,"123"],
    ["Mega Starmie ex","118/088","Special Illustration Rare",74.91,"118"]]},
  {name:"Ascended Heroes",code:"me2pt5",icon:"🐉",pulls:[
    ["Mega Gengar ex","284/217","Special Illustration Rare",1145.00,"284"],
    ["Pikachu ex","276/217","Special Illustration Rare",676.14,"276"],
    ["Mega Dragonite ex","290/217","Special Illustration Rare",675.27,"290"],
    ["Mega Charizard Y ex","294/217","Mega Hyper Rare",453.38,"294"],
    ["Pikachu ex","277/217","Special Illustration Rare",338.21,"277"]]},
  {name:"Phantasmal Flames",code:"me2",icon:"🔥",pulls:[
    ["Mega Charizard X ex","125/094","Special Illustration Rare",761.06,"125"],
    ["Mega Charizard X ex","130/094","Mega Hyper Rare",330.05,"130"],
    ["Mega Charizard X ex","109/094","Ultra Rare",34.48,"109"],
    ["Dawn","129/094","Special Illustration Rare",32.52,"129"],
    ["Mega Sharpedo ex","127/094","Special Illustration Rare",27.18,"127"]]},
  {name:"Surging Sparks",code:"sv8",icon:"⚡",pulls:[
    ["Pikachu ex","238/191","Special Illustration Rare",260.31,"238"],
    ["Latias ex","239/191","Special Illustration Rare",185.30,"239"],
    ["Milotic ex","237/191","Special Illustration Rare",95.00,"237"],
    ["Pikachu ex","247/191","Hyper Rare",71.15,"247"],
    ["Hydreigon ex","240/191","Special Illustration Rare",38.81,"240"]]},
  {name:"Prismatic Evolutions",code:"sv8pt5",icon:"🌈",pulls:[
    ["Umbreon ex","161/131","Special Illustration Rare",1392.88,"161"],
    ["Sylveon ex","156/131","Special Illustration Rare",333.90,"156"],
    ["Leafeon ex","144/131","Special Illustration Rare",246.27,"144"],
    ["Espeon ex","155/131","Special Illustration Rare",238.41,"155"],
    ["Glaceon ex","150/131","Special Illustration Rare",205.50,"150"]]}
];

const container=document.querySelector("#sets");
const template=document.querySelector("#set-template");
const money=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2});

function render(query=""){
  container.replaceChildren();
  const q=query.trim().toLowerCase();
  const filtered=sets.filter(s=>!q||s.name.toLowerCase().includes(q)||s.pulls.some(p=>p[0].toLowerCase().includes(q)));
  if(!filtered.length){container.innerHTML='<p class="empty">No packs or cards found.</p>';return}
  filtered.forEach(set=>{
    const node=template.content.cloneNode(true);
    const article=node.querySelector(".set-card");
    const button=node.querySelector("button");
    const pulls=node.querySelector(".pulls");
    node.querySelector(".set-icon").textContent=set.icon;
    node.querySelector("strong").textContent=set.name;
    node.querySelector("small").textContent=set.note||"Tap to reveal the Top 5 pulls";
    set.pulls.forEach((pull,index)=>{
      const [name,number,rarity,value,image]=pull;
      const row=document.createElement("div");row.className="pull";
      row.innerHTML=`<span class="rank">${index+1}</span><img class="card-art" src="https://images.pokemontcg.io/${set.code}/${image}_hires.png" alt="${name} card" loading="lazy"><span class="card-name"><strong>${name}</strong><small>#${number} · ${rarity}</small></span><span class="price">${money.format(value)}</span>`;
      row.querySelector("img").addEventListener("error",e=>{e.currentTarget.classList.add("failed");e.currentTarget.alt="Card image unavailable"});
      pulls.append(row);
    });
    button.addEventListener("click",()=>{const open=button.getAttribute("aria-expanded")==="true";button.setAttribute("aria-expanded",String(!open));pulls.hidden=open});
    article.dataset.search=[set.name,...set.pulls.map(p=>p[0])].join(" ").toLowerCase();
    container.append(node);
  });
}

document.querySelector("#search").addEventListener("input",e=>render(e.target.value));
render();
