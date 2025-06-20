if (typeof window === 'undefined') {
  const http = await import('http');
  const fs = await import('fs/promises');
  const path = await import('path');
  const { exec } = await import('child_process');
  const { fileURLToPath } = await import('url');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };

  const server = http.createServer(async (req, res) => {
    const file = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(__dirname, file);
    try {
      const data = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'text/plain' });
      res.end(data);
    } catch (e) {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Calculator running at ${url}`);
    const opener = process.platform === 'darwin' ? 'open'
      : process.platform === 'win32' ? 'start'
      : 'xdg-open';
    exec(`${opener} ${url}`, err => {
      if (err) {
        console.log('Unable to open browser automatically');
      }
    });
  });
} else {
  const { Attributes } = await import('./attributes.js');
  const { Technique } = await import('./technique.js');
  const { Character } = await import('./character.js');
  const { Races } = await import('./races.js');
  const { Battle } = await import('./battle.js');
  const { AttributeBonus } = await import('./attributeBonus.js');

  const styleAttributes = [
    'bstr','bdex','bcon','beng','bsol','bfoc','hit','dodge','speed','critRate',
    'critDamage','blockRate','blockPower','pDefense','eDefense','physicalAttack',
    'energyAttack','chargeBonus'
  ];

  const styleLabels = {
    bstr:'STR %', bdex:'DEX %', bcon:'CON %', beng:'ENG %', bsol:'SOL %',
    bfoc:'FOC %', hit:'Hit %', dodge:'Dodge %', speed:'Speed %',
    critRate:'Crit Rate %', critDamage:'Crit Dmg %', blockRate:'Block Rate %',
    blockPower:'Block Power %', pDefense:'PDef %', eDefense:'EDef %',
    physicalAttack:'Phys Atk %', energyAttack:'Eng Atk %', chargeBonus:'Charge Bonus %'
  };

  function createWeapon(name, bonuses) {
    const ab = new AttributeBonus(name, 'Weapon');
    Object.assign(ab, bonuses);
    return { name, attbonus: ab };
  }

  function createArmor(name, bonuses) {
    const ab = new AttributeBonus(name, 'Dogi');
    Object.assign(ab, bonuses);
    return { name, attbonus: ab };
  }

  const presetWeapons = {
    Katana: createWeapon('Katana', {
      bdex: 0.09, physicalAttack: 0.07, critRate: 0.07, speed: 0.03
    }),
    Greatsword: createWeapon('Greatsword', {
      bstr: 0.1, physicalAttack: 0.09, critDamage: 0.07, blockRate: 0.03
    }),
    Gun: createWeapon('Gun', {
      bfoc: 0.09, energyAttack: 0.08, hit: 0.05, critRate: 0.05
    }),
    Polearm: createWeapon('Polearm', {
      bdex: 0.08, bfoc: 0.05, physicalAttack: 0.07, critRate: 0.04
    }),
    Staff: createWeapon('Staff', {
      bsol: 0.09, energyAttack: 0.09, bdex: 0.03, critRate: 0.03
    }),
    Rod: createWeapon('Rod', {
      bsol: 0.09, bfoc: 0.05, energyAttack: 0.08, critRate: 0.03
    }),
    Focus: createWeapon('Focus', {
      bfoc: 0.09, magicPower: 0.08, critRate: 0.04
    }),
    Gloves: createWeapon('Gloves', {
      bdex: 0.08, bfoc: 0.07, critRate: 0.07, dodge: 0.06
    })
  };

  const presetArmors = {
    Dogi: createArmor('Dogi', { bcon: 0.09, dodge: 0.03, pDefense: 0.05 }),
    Armor: createArmor('Armor', { bcon: 0.1, pDefense: 0.08, blockRate: 0.04 }),
    Battle_Armor: createArmor('Battle_Armor', { bcon: 0.1, pDefense: 0.09, blockPower: 0.05 }),
    Robes: createArmor('Robes', { beng: 0.09, eDefense: 0.07, chargeBonus: 0.04 }),
    Clothing: createArmor('Clothing', { beng: 0.07, bcon: 0.05, dodge: 0.04 }),
    Demon_Clothes: createArmor('Demon_Clothes', { bcon: 0.09, beng: 0.06, critDamage: 0.03 }),
    Jacket: createArmor('Jacket', { bcon: 0.08, pDefense: 0.06, hit: 0.03 })
  };

  const presetAttributes = {
    Bruiser: {
      race: 'Saiyan',
      stats: { str:1500, con:1500, eng:750, dex:500, foc:500, sol:250 },
      weapon: 'Greatsword', armor: 'Armor',
      style: { bstr:0.5, bcon:0.5, physicalAttack:0.3,
               pDefense:0.3, blockPower:0.2, critRate:0.2 }
    },
    Striker: {
      race: 'Half-Saiyan',
      stats: { str:1500, dex:1500, con:750, eng:500, sol:500, foc:250 },
      weapon: 'Katana', armor: 'Dogi',
      style: { bstr:0.5, bdex:0.5, physicalAttack:0.3,
               critRate:0.3, speed:0.2, dodge:0.2 }
    },
    Speedster: {
      race: 'Android',
      stats: { dex:1500, foc:1500, str:750, eng:500, con:500, sol:250 },
      weapon: 'Gloves', armor: 'Clothing',
      style: { bdex:0.5, bfoc:0.5, speed:0.35,
               hit:0.25, dodge:0.25, critRate:0.15 }
    },
    'Hybrid Attacker': {
      race: 'Human',
      stats: { str:1500, sol:1500, dex:750, eng:500, con:500, foc:250 },
      weapon: 'Rod', armor: 'Robes',
      style: { bstr:0.5, bsol:0.5, physicalAttack:0.3,
               energyAttack:0.3, speed:0.2, critRate:0.2 }
    },
    Blaster: {
      race: 'Alien',
      stats: { sol:1500, foc:1500, eng:750, dex:500, str:500, con:250 },
      weapon: 'Focus', armor: 'Robes',
      style: { bsol:0.5, bfoc:0.5, energyAttack:0.35,
               critRate:0.25, hit:0.25, dodge:0.15 }
    },
    Skirmisher: {
      race: 'Arcosian',
      stats: { foc:1500, con:1500, dex:750, eng:500, str:500, sol:250 },
      weapon: 'Gun', armor: 'Jacket',
      style: { bfoc:0.5, bcon:0.5, hit:0.3,
               dodge:0.3, speed:0.2, critRate:0.2 }
    },
    Guardian: {
      race: 'Namekian',
      stats: { con:1500, sol:1500, str:750, eng:500, dex:500, foc:250 },
      weapon: 'Polearm', armor: 'Armor',
      style: { bcon:0.5, bsol:0.5, pDefense:0.3,
               blockRate:0.3, blockPower:0.2, hit:0.2 }
    },
    Tank: {
      race: 'Majin',
      stats: { con:1500, eng:1500, str:750, sol:500, dex:500, foc:250 },
      weapon: 'Greatsword', armor: 'Battle_Armor',
      style: { bcon:0.5, beng:0.5, pDefense:0.35,
               eDefense:0.35, blockPower:0.15, blockRate:0.15 }
    },
    Defender: {
      race: 'Dragon_Clan',
      stats: { con:1500, dex:1500, str:750, eng:500, foc:500, sol:250 },
      weapon: 'Polearm', armor: 'Armor',
      style: { bcon:0.5, bdex:0.5, pDefense:0.3,
               dodge:0.25, blockRate:0.25, blockPower:0.2 }
    }
  };

  const techniquePresets = {
    Custom: { type: 'Ki', flatDamage: 120, scalePercent: 4.25, hits: 1, armorPen: 0, hitRate: 0, critRate: 0 },
    Kamehameha: { type: 'Ki', flatDamage: 125, scalePercent: 4.5, hits: 1, armorPen: 0, hitRate: 0, critRate: 0 },
    'Meteor Combination': { type: 'Strike', flatDamage: 90, scalePercent: 1, hits: 3, armorPen: 30, hitRate: 0, critRate: 0 }
  };

  const raceList = ['Human','Saiyan','Half-Saiyan','Android','Majin','Namekian','Dragon_Clan','Arcosian','Alien'];

  function populateRaces() {
    ['atk-race','def-race'].forEach(id => {
      const select = document.getElementById(id);
      raceList.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r.replace(/_/g,' ');
        select.appendChild(opt);
      });
    });
  }

  function populatePresets() {
    const keys = Object.keys(presetAttributes);
    ['atk-preset','def-preset'].forEach(id => {
      const select = document.getElementById(id);
      const none = document.createElement('option');
      none.value = '';
      none.textContent = 'Custom';
      select.appendChild(none);
      keys.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      });
    });
    document.getElementById('atk-preset').value = 'Blaster';
    document.getElementById('def-preset').value = 'Tank';
  }

  function populateTechniqueSelect() {
    const select = document.getElementById('tech-select-box');
    Object.keys(techniquePresets).forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });
    select.value = 'Custom';
  }

  function applyTechniquePreset(name) {
    const preset = techniquePresets[name];
    if (!preset) return;
    const fields = ['type','flatDamage','scalePercent','hits','armorPen','hitRate','critRate'];
    fields.forEach(f => {
      const el = document.getElementById('tech-' + f);
      if (el.tagName === 'SELECT') {
        el.value = preset[f];
      } else {
        el.value = preset[f];
      }
    });
  }


  function createAttributeInputs(container, prefix) {
    const fields = ['str', 'dex', 'con', 'eng', 'sol', 'foc', 'level'];
    fields.forEach(f => {
      const row = document.createElement('div');
      row.className = 'attr-row';
      const label = document.createElement('label');
      label.textContent = f.toUpperCase();
      label.setAttribute('for', prefix + f);
      const input = document.createElement('input');
      input.type = 'number';
      input.id = prefix + f;
      input.value = f === 'level' ? 400 : 0;
      const span = document.createElement('span');
      span.id = `${prefix}${f}-buff`;
      span.className = 'buff-val';
      span.textContent = '0';
      row.appendChild(label);
      row.appendChild(input);
      row.appendChild(span);
      container.appendChild(row);
    });
  }

  function createStyleInputs(container, prefix) {
    const baseAttrs = ['bstr','bdex','bcon','beng','bsol','bfoc'];
    for (let i = 0; i < 6; i++) {
      const row = document.createElement('div');
      row.className = 'style-row';
      const select = document.createElement('select');
      select.id = `${prefix}style-attr${i}`;
      const attrs = i < 2 ? baseAttrs : styleAttributes;
      if (i >= 2) {
        const none = document.createElement('option');
        none.value = '';
        none.textContent = 'None';
        select.appendChild(none);
      }
      attrs.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a;
        opt.textContent = styleLabels[a] || a;
        select.appendChild(opt);
      });
      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.max = 50;
      input.value = 0;
      input.id = `${prefix}style-val${i}`;
      row.appendChild(select);
      row.appendChild(input);
      container.appendChild(row);
      select.addEventListener('change', () => { enforceStyle(prefix); runCalc(); });
      input.addEventListener('change', () => { enforceStyle(prefix); runCalc(); });
    }
  }

  function enforceStyle(prefix) {
    let total = 0;
    const values = [];
    for (let i = 0; i < 6; i++) {
      const input = document.getElementById(`${prefix}style-val${i}`);
      let val = Number(input.value);
      if (val > 50) val = 50;
      if (val < 0 || isNaN(val)) val = 0;
      values.push(val);
      total += val;
    }
    if (total > 200) {
      const scale = 200 / total;
      for (let i = 0; i < values.length; i++) {
        values[i] = Math.floor(values[i] * scale);
      }
    }
    for (let i = 0; i < 6; i++) {
      document.getElementById(`${prefix}style-val${i}`).value = values[i];
    }
  }

  function createTechniqueInputs(container) {
    const fields = [
      ['type', 'select', [['Ki', 'Energy'], ['Strike', 'Strike']]],
      ['flatDamage', 'number', 0],
      ['scalePercent', 'number', 0],
      ['hits', 'number', 1],
      ['armorPen', 'number', 0],
      ['hitRate', 'number', 0],
      ['critRate', 'number', 0]
    ];
    const labels = {
      type: 'Type',
      flatDamage: 'Flat Damage',
      scalePercent: 'Damage %',
      hits: 'Hit Count',
      armorPen: 'Armor Pen %',
      hitRate: 'Bonus Hit %',
      critRate: 'Bonus Crit %'
    };
    fields.forEach(([name, type, value]) => {
      const div = document.createElement('div');
      const label = document.createElement('label');
      label.textContent = labels[name] || name;
      label.setAttribute('for', 'tech-' + name);
      let input;
      if (type === 'select') {
        input = document.createElement('select');
        value.forEach(v => {
          const opt = document.createElement('option');
          if (Array.isArray(v)) {
            opt.value = v[0];
            opt.textContent = v[1];
          } else {
            opt.value = v;
            opt.textContent = v;
          }
          input.appendChild(opt);
        });
      } else {
        input = document.createElement('input');
        input.type = type;
        input.value = value;
      }
      input.id = 'tech-' + name;
      div.appendChild(label);
      div.appendChild(input);
      container.appendChild(div);
    });
  }

  function getAttributes(prefix) {
    const vals = {};
    ['str', 'dex', 'con', 'eng', 'sol', 'foc', 'level'].forEach(f => {
      vals[f] = Number(document.getElementById(prefix + f).value);
    });
    const att = new Attributes(vals.str, vals.dex, vals.con, vals.eng, vals.sol, vals.foc);
    return { att, level: vals.level };
  }

  function getStyle(prefix) {
    const obj = {};
    for (let i = 0; i < 6; i++) {
      const attr = document.getElementById(`${prefix}style-attr${i}`).value;
      const val = Number(document.getElementById(`${prefix}style-val${i}`).value);
      if (attr) {
        obj[attr] = (obj[attr] || 0) + val/100;
      }
    }
    return obj;
  }

  function getTechnique() {
    const vals = {};
    ['type', 'flatDamage', 'scalePercent', 'hits', 'armorPen', 'hitRate', 'critRate']
      .forEach(f => {
        const el = document.getElementById('tech-' + f);
        vals[f] = el.type === 'number' ? Number(el.value) : el.value;
      });
    const tech = new Technique(0, 'Custom', vals.type, 0, 0,
      vals.flatDamage, vals.scalePercent, vals.hits);
    tech.armorPen = vals.armorPen;
    tech.hitRate = vals.hitRate;
    tech.critRate = vals.critRate;
    return tech;
  }

  function randomize(prefix, total = null) {
    let totalPoints = total;
    if (totalPoints === null) {
      totalPoints = Math.floor(Math.random() * (18000 - 300 + 1)) + 300;
    }
    const maxStat = Math.floor(totalPoints * 0.5);
    const weights = Array.from({length:6}, () => Math.random() ** 2);
    const wsum = weights.reduce((a,b) => a + b, 0);
    let vals = weights.map(w => Math.floor(w / wsum * totalPoints));
    vals = vals.map(v => Math.min(v, maxStat));
    let used = vals.reduce((a,b)=>a+b,0);
    while (used < totalPoints) {
      const i = Math.floor(Math.random() * 6);
      if (vals[i] < maxStat) { vals[i]++; used++; }
    }
    const sorted = [...vals].sort((a,b) => b - a);
    const pairs = [
      ['sol','foc'], ['str','dex'], ['con','str'], ['eng','con'],
      ['eng','sol'], ['foc','dex'], ['str','foc'], ['sol','dex']
    ];
    const [high, second] = sorted;
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const stats = ['str','dex','con','eng','sol','foc'];
    const result = {};
    result[pair[0]] = high;
    result[pair[1]] = second;
    const remainingVals = sorted.slice(2).sort(() => Math.random() - 0.5);
    const remainingStats = stats.filter(s => s !== pair[0] && s !== pair[1]);
    remainingStats.forEach((s,i) => { result[s] = remainingVals[i]; });
    stats.forEach(s => {
      document.getElementById(prefix + s).value = result[s];
    });
  }

  function randomizeMatch(prefix, otherPrefix) {
    const total = ['str','dex','con','eng','sol','foc']
      .map(f => Number(document.getElementById(otherPrefix + f).value))
      .reduce((a,b) => a + b, 0);
    randomize(prefix, total);
  }

  function applyPreset(prefix, name) {
    const preset = presetAttributes[name];
    if (!preset) return;
    const stats = preset.stats;
    ['str','dex','con','eng','sol','foc'].forEach(stat => {
      document.getElementById(prefix + stat).value = stats[stat];
    });
    if (preset.race) {
      document.getElementById(prefix + 'race').value = preset.race;
    }
    if (preset.weapon) {
      document.getElementById(prefix + 'weapon-select').value = preset.weapon;
    }
    if (preset.armor) {
      document.getElementById(prefix + 'armor-select').value = preset.armor;
    }
    if (preset.style) {
      let i = 0;
      for (const [attr,val] of Object.entries(preset.style)) {
        document.getElementById(`${prefix}style-attr${i}`).value = attr;
        document.getElementById(`${prefix}style-val${i}`).value = Math.round(val*100);
        i++;
      }
      for (; i < 6; i++) {
        document.getElementById(`${prefix}style-attr${i}`).value = '';
        document.getElementById(`${prefix}style-val${i}`).value = 0;
      }
      enforceStyle(prefix);
    }
  }

  function setupChargeInput(prefix) {
    const slider = document.getElementById(prefix + 'charge-input');
    const fill = document.getElementById(prefix + 'charge-fill');
    const text = document.getElementById(prefix + 'charge-text');
    const update = () => {
      fill.style.width = `${slider.value}%`;
      text.textContent = `Charge: ${slider.value}%`;
    };
    slider.addEventListener('input', update);
    slider.addEventListener('change', () => { update(); runCalc(); });
    update();
  }

  function defenseReduction(defense) {
    const scalar = Battle.defenseScalar;
    return Math.round((1 - scalar / (scalar + defense)) * 100);
  }

  function fmt(n) {
    return Math.round(n).toLocaleString();
  }

  function updateAdvanced(id, char, offensive) {
    const el = document.getElementById(id);
    if (!el) return;
    const a = char.battleCurrAtt;
    let lines;
    if (offensive) {
      lines = [
        `Speed: ${fmt(a.speed)}`,
        `Hit: ${fmt(a.hit)}`,
        `Crit Rate: ${Math.round(a.critRate)}%`,
        `Crit Damage: ${Math.round(a.critDamage * 100)}%`,
        `Phys Atk: ${fmt(a.physicalAttack)}`,
        `Eng Atk: ${fmt(a.energyAttack)}`
      ];
    } else {
      lines = [
        `Dodge: ${Math.round(a.dodge)}%`,
        `Block Rate: ${Math.round(a.blockRate)}%`,
        `Block Power: ${fmt(a.blockPower)}`,
        `PDef Reduction: ${defenseReduction(a.pDefense)}%`,
        `EDef Reduction: ${defenseReduction(a.eDefense)}%`
      ];
    }
    el.textContent = lines.join('\n');
  }

  function updateBuffed(prefix, char) {
    const stats = ['str','dex','con','eng','sol','foc','level'];
    stats.forEach(stat => {
      const el = document.getElementById(`${prefix}${stat}-buff`);
      if (el) {
        const val = stat === 'level' ? char.level : char.battleCurrAtt[stat];
        el.textContent = fmt(val);
      }
    });
  }

  function runCalc() {
    const atkRace = new Races(document.getElementById('atk-race').value);
    const defRace = new Races(document.getElementById('def-race').value);
    const { att: atkAtt, level: atkLevel } = getAttributes('atk-');
    const { att: defAtt, level: defLevel } = getAttributes('def-');
    const atkChar = new Character('Attacker', atkRace, atkAtt, 'atk', atkLevel);
    const defChar = new Character('Defender', defRace, defAtt, 'def', defLevel);
    atkChar.fightingStyle = new AttributeBonus('AtkStyle','Fighting Style');
    Object.assign(atkChar.fightingStyle, getStyle('atk-'));
    defChar.fightingStyle = new AttributeBonus('DefStyle','Fighting Style');
    Object.assign(defChar.fightingStyle, getStyle('def-'));
    const atkWeapon = document.getElementById('atk-weapon-select').value;
    const defWeapon = document.getElementById('def-weapon-select').value;
    const atkArmor = document.getElementById('atk-armor-select').value;
    const defArmor = document.getElementById('def-armor-select').value;
    if (atkWeapon) {
      atkChar.weapon = presetWeapons[atkWeapon];
    }
    if (defWeapon) {
      defChar.weapon = presetWeapons[defWeapon];
    }
    if (atkArmor) {
      atkChar.dogi = presetArmors[atkArmor];
    }
    if (defArmor) {
      defChar.dogi = presetArmors[defArmor];
    }
    atkChar.statusUpdate(0);
    defChar.statusUpdate(0);

    updateBuffed('atk-', atkChar);
    updateBuffed('def-', defChar);

    const atkChargePct = Number(document.getElementById('atk-charge-input').value);
    const defChargePct = Number(document.getElementById('def-charge-input').value);
    atkChar.battleCurrAtt.charge = Math.round(atkChar.battleMaxAtt.charge * atkChargePct / 100);
    defChar.battleCurrAtt.charge = Math.round(defChar.battleMaxAtt.charge * defChargePct / 100);
    atkChar.battleCurrAtt.setChargeBonus();
    defChar.battleCurrAtt.setChargeBonus();

    document.getElementById('atk-img').src = atkChar.image;
    document.getElementById('def-img').src = defChar.image;
    document.getElementById('atk-charge-fill').style.width = `${(atkChar.battleCurrAtt.charge/atkChar.battleMaxAtt.charge)*100}%`;
    document.getElementById('def-charge-fill').style.width = `${(defChar.battleCurrAtt.charge/defChar.battleMaxAtt.charge)*100}%`;
    document.getElementById('atk-charge-text').textContent =
      `Charge: ${atkChar.battleCurrAtt.charge} / ${atkChar.battleMaxAtt.charge}`;
    document.getElementById('def-charge-text').textContent =
      `Charge: ${defChar.battleCurrAtt.charge} / ${defChar.battleMaxAtt.charge}`;
    const atkBuffsEl = document.getElementById('atk-buffs');
    const defBuffsEl = document.getElementById('def-buffs');
    const formatBuffs = c => c.battleCurrAtt.buffs.map(b =>
      `${b.name}\n${b.outputBonusStr().trim()}`
    ).join('\n\n');
    atkBuffsEl.textContent = formatBuffs(atkChar);
    defBuffsEl.textContent = formatBuffs(defChar);
    updateAdvanced('atk-adv', atkChar, true);
    updateAdvanced('def-adv', defChar, false);

    const battle = new Battle([atkChar], [defChar], 'calc', []);

    const strikeRes = battle.calcStrike(atkChar, defChar);
    const burstRes = battle.calcBurst(atkChar, defChar);
    const tech = getTechnique();
    const techRes = battle.calcTech(atkChar, defChar, tech);

    const hp = defChar.battleCurrAtt.health;
    const strikeAvg = Math.round((strikeRes[1] + (strikeRes[2]-strikeRes[1]) * (strikeRes[6]/100)) * (strikeRes[5]/100));
    const burstAvg = Math.round((burstRes[1] + (burstRes[2]-burstRes[1]) * (burstRes[6]/100)) * (burstRes[5]/100));
    const techAvg = Math.round((techRes[1] + (techRes[2]-techRes[1]) * (techRes[6]/100)) * (techRes[5]/100));

    const hpFill = document.getElementById('hp-fill');
    const hpText = document.getElementById('hp-text');
    const maxDamage = Math.max(strikeAvg, burstAvg, techAvg);
    const remaining = Math.max(hp - maxDamage, 0);
    hpFill.style.width = `${(remaining / hp) * 100}%`;
    hpText.textContent = `HP: ${remaining.toLocaleString()} / ${hp.toLocaleString()}`;

    function format(name,res,avg,isMax){
      const dmg = Math.round(res[1]);
      const crit = Math.round(res[2]);
      const block = Math.round(res[3]);
      const p = (avg/hp*100).toFixed(2);
      const cls = isMax ? 'highlight' : '';
      return `<div class="${cls}">${name}<br>`+
        `Average Damage: ${avg.toLocaleString()} (${p}%)<br>`+
        `Base Damage: ${dmg.toLocaleString()}<br>`+
        `Crit Damage: ${crit.toLocaleString()}<br>`+
        `Block Damage: ${block.toLocaleString()}<br>`+
        `Hits: ${res[4]}<br>`+
        `Hit Chance: ${res[5].toFixed(2)}%<br>`+
        `Crit Chance: ${res[6].toFixed(2)}%</div>`;
    }

    const out = document.getElementById('output');
    const maxD = Math.max(strikeAvg, burstAvg, techAvg);
    const maxP = ((maxD / hp) * 100).toFixed(2);
    out.innerHTML =
      `Highest Damage: <span class="highlight">${maxD.toLocaleString()} (${maxP}% )</span><br><br>`+
      `${format('Strike', strikeRes, strikeAvg, strikeAvg===maxD)}<br><br>`+
      `${format('Burst', burstRes, burstAvg, burstAvg===maxD)}<br><br>`+
      `${format('Skill', techRes, techAvg, techAvg===maxD)}`;
  }

  createAttributeInputs(document.getElementById('attacker-attributes'), 'atk-');
  createAttributeInputs(document.getElementById('defender-attributes'), 'def-');
  createStyleInputs(document.getElementById('atk-style'), 'atk-');
  createStyleInputs(document.getElementById('def-style'), 'def-');
  createTechniqueInputs(document.getElementById('technique-fields'));
  populateRaces();
  populatePresets();
  function initDefaults() {
    const r = new Races(raceList[0]);
    const a = new Character('A', r, new Attributes(0,0,0,0,0,0), 'atk');
    const d = new Character('D', r, new Attributes(0,0,0,0,0,0), 'def');
    document.getElementById('atk-img').src = a.image;
    document.getElementById('def-img').src = d.image;
    document.getElementById('atk-charge-input').value = 40;
    document.getElementById('def-charge-input').value = 40;
    setupChargeInput('atk-');
    setupChargeInput('def-');
  }
  initDefaults();
  applyPreset('atk-', 'Blaster');
  applyPreset('def-', 'Tank');
  populateTechniqueSelect();
  applyTechniquePreset('Custom');
  runCalc();
  document.getElementById('calc-btn').addEventListener('click', runCalc);
  document.getElementById('atk-rand').addEventListener('click', () => { randomize('atk-'); runCalc(); });
  document.getElementById('def-rand').addEventListener('click', () => { randomize('def-'); runCalc(); });
  document.getElementById('atk-rand-match').addEventListener('click', () => { randomizeMatch('atk-', 'def-'); runCalc(); });
  document.getElementById('def-rand-match').addEventListener('click', () => { randomizeMatch('def-', 'atk-'); runCalc(); });
  document.getElementById('atk-preset').addEventListener('change', e => { applyPreset('atk-', e.target.value); runCalc(); });
  document.getElementById('def-preset').addEventListener('change', e => { applyPreset('def-', e.target.value); runCalc(); });
  document.getElementById('tech-select-box').addEventListener('change', e => { applyTechniquePreset(e.target.value); runCalc(); });
  ['atk-weapon-select','def-weapon-select','atk-armor-select','def-armor-select'].forEach(id => {
    document.getElementById(id).addEventListener('change', runCalc);
  });
  ['atk-race','def-race'].forEach(id => {
    document.getElementById(id).addEventListener('change', runCalc);
  });
}