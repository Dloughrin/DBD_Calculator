import { describe, it, expect } from 'vitest';
import { getCharacterPresets, getTechniquePresets } from '../src/script.js';

describe('loader presets', () => {
  it('should return character presets with expected fields', () => {
    const chars = getCharacterPresets();
    expect(chars).toBeDefined();

    let caulifla = null;
    let poke = null;

    chars.forEach(function(character) {
      if(character.name == "Caulifla") {
        caulifla = character;
      }
      else if(character.name == "Poke") {
        poke = character;
      }
    });

    expect(poke).not.toBe(null);
    expect(poke).toHaveProperty('race');
    expect(poke.race.raceName).toBe('Namekian');
    expect(poke).toHaveProperty('stats');
    expect(poke).toHaveProperty('weapon');
    expect(poke.weapon.uid).toBe(124);
    expect(poke).toHaveProperty('armor');
    expect(poke.dogi.uid).toBe(136);
    expect(poke).toHaveProperty('fightingStyle');
    expect(poke.fightingStyle.name).toBe('Poking_Style');

    expect(caulifla).not.toBe(null);
    expect(caulifla).toHaveProperty('race');
    expect(caulifla.race.raceName).toBe('Saiyan');
    expect(caulifla).toHaveProperty('stats');
    expect(caulifla).toHaveProperty('weapon');
    expect(caulifla).toHaveProperty('armor');
    expect(caulifla.dogi.uid).toBe(20);
    expect(caulifla).toHaveProperty('fightingStyle');
    expect(caulifla.fightingStyle.name).toBe('Ruffian_Style');
  });

  it('should return technique presets with expected fields', () => {
    const techs = getTechniquePresets();
    let angry_hit = null;
    let infinity_bullet = null;

    Object.entries(techs).forEach(([name, tech]) => {
      expect(["Ki", "Strike"]).toContain(tech.type);
      if(tech.name == 'Angry_Hit') {
        angry_hit = tech;
      }
      if(tech.name == 'Infinity_Bullet') {
        infinity_bullet = tech;
      }
    });
    
    expect(angry_hit).not.toBe(null);
    expect(infinity_bullet).not.toBe(null);

    const fields = ['type','flatDamage','scalePercent','hits','armorPen','hitRate','critRate'];
    fields.forEach(f => { expect(angry_hit).toHaveProperty(f) });
    fields.forEach(f => expect(infinity_bullet).toHaveProperty(f));

    expect(angry_hit.type).toBe("Strike");
    expect(angry_hit.flatDamage).toBe(225);
    expect(angry_hit.scalePercent).toBe(3.5);
    expect(angry_hit.hits).toBe(1);
    expect(angry_hit.armorPen).toBe(5);
    expect(angry_hit.hitRate).toBe(0);
    expect(angry_hit.critRate).toBe(0);

    expect(infinity_bullet.type).toBe("Strike");
    expect(infinity_bullet.flatDamage).toBe(20);
    expect(infinity_bullet.scalePercent).toBe(1.5);
    expect(infinity_bullet.hits).toBe(5);
    expect(infinity_bullet.armorPen).toBe(5);
    expect(infinity_bullet.hitRate).toBe(5);
    expect(infinity_bullet.critRate).toBe(5);
  });
});