// src/loader.js
import { Character } from './character.js';
import { Attributes } from './attributes.js';
import { Battle } from './battle.js';
import { Technique } from './technique.js';
import { Races } from './races.js';
import { AttributeBonus } from './attributeBonus.js';

class Loader {
    constructor() {
        this.dataPath = './data/dataSet.xlsx';
    }

    // Since we can't use xlsx in browser, we'll need to convert data to JSON
    // For now, let's create methods that would work with JSON data
    async loadCharacterData() {
        try {
            const response = await fetch('./data/characters.json');
            const data = await response.json();
            return this.parseCharacters(data);
        } catch (error) {
            console.error('Error loading character data:', error);
            return [];
        }
    }

    async loadNPCData() {
        try {
            const response = await fetch('./data/npcs.json');
            const data = await response.json();
            return this.parseCharacters(data);
        } catch (error) {
            console.error('Error loading NPC data:', error);
            return [];
        }
    }

    async loadTechniqueData() {
        try {
            const response = await fetch('./data/techniques.json');
            const data = await response.json();
            return this.parseTechniques(data);
        } catch (error) {
            console.error('Error loading technique data:', error);
            return [];
        }
    }

    parseCharacters(data) {
        const characters = [];
        for (let i = 0; i < data.length; i++) {
            const charData = data[i];
            const attr = new Attributes(
                charData["STR"] || 0,
                charData["DEX"] || 0,
                charData["CON"] || 0,
                charData["ENG"] || 0,
                charData["SOL"] || 0,
                charData["FOC"] || 0
            );
            
            const char = new Character(
                charData["Name"] || `Character_${i}`,
                new Races(charData["Race"] || "Human"),
                attr,
                charData["Player ID"] || "Preset"
            );

            // Set level and experience
            if (charData["EXP"]) {
                char.reAddEXP(Number(charData["EXP"]));
            }
            
            // Set other properties
            char.statPoints = Number(charData["Stat Points"]) || 0;
            char.techniquePoints = charData["TP"] || 0;
            char.deathCount = charData["Death Count"] || 0;
            char.transformation = charData["Transformation"] || -1;
            char.image = String(charData["Image"]) || char.image;
            char.potentialUnlocked = charData["Unlocked"] || 0;
            char.unleashPotential(parseInt(charData["Unleashed"]) || 0);

            // Set fighting style
            if (charData["styleName"]) {
                char.styleName = charData["styleName"];
                char.fightingStyle = new AttributeBonus(char.styleName, "Fighting Style");
                // Load style bonuses if available
                this.loadStyleBonuses(char.fightingStyle, charData);
            }

            // Add techniques
            for (let j = 1; j <= 5; j++) {
                const techKey = `Technique ${j}`;
                if (charData[techKey]) {
                    char.addTechnique(Number(charData[techKey]), 'NPC');
                }
            }

            char.statusUpdate(0);
            characters.push(char);
        }
        return characters;
    }

    parseTechniques(data) {
        const techniques = [];
        for (let i = 0; i < data.length; i++) {
            const techData = data[i];
            const tech = new Technique(
                techData["UID"] || i,
                techData["name"] || "Unknown",
                techData["techType"] || "Ki",
                techData["energyCost"] || 0,
                techData["healthCost"] || 0,
                techData["flatDamage"] || 0,
                techData["scalePercent"] || 0,
                techData["hits"] || 1
            );

            // Load additional properties
            tech.armorPen = techData["armorPen"] || 0;
            tech.hitRate = techData["hitRate"] || 0;
            tech.critRate = techData["critRate"] || 0;
            tech.description = techData["description"] || "";

            // Load attribute bonuses for transform/buff/debuff techniques
            if (tech.techType === "Transform" || tech.techType === "Buff" || tech.techType === "Debuff") {
                tech.attBonus = new AttributeBonus(tech.name, tech.techType);
                this.loadStyleBonuses(tech.attBonus, techData);
            }

            techniques.push(tech);
        }
        return techniques;
    }

    loadStyleBonuses(attributeBonus, data) {
        // Load all possible attribute bonuses
        const bonusFields = [
            'bstr', 'bdex', 'bcon', 'beng', 'bsol', 'bfoc',
            'hit', 'dodge', 'speed', 'critRate', 'critDamage',
            'blockRate', 'blockPower', 'pDefense', 'eDefense',
            'physicalAttack', 'energyAttack', 'chargeBonus',
            'health', 'energy', 'charge'
        ];

        bonusFields.forEach(field => {
            if (data[field] !== undefined && data[field] !== 0) {
                attributeBonus[field] = Number(data[field]);
            }
        });
    }
}

export { Loader };