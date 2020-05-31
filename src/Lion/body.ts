var interval = 0.3
var damage = [490,600,720]
var scepterdamage = [570,710,890]
var manacost = [200,420,650]
var rangeCast = 900
var IgnoreBuffs = [
	"modifier_abaddon_borrowed_time",
	"modifier_brewmaster_primal_split",
	"modifier_omniknight_repel",
	"modifier_phoenix_supernova_hiding",
	"modifier_tusk_snowball_movemEnemyEntity",
	"modifier_tusk_snowball_movemEnemyEntity_friendly",
	"modifier_juggernaut_blade_fury",
	"modifier_medusa_stone_gaze",
	"modifier_nyx_assassin_spiked_carapace",
	"modifier_templar_assassin_refraction_absorb",
	"modifier_oracle_false_promise",
	"modifier_dazzle_shallow_grave",
	"modifier_treant_living_armor",
	"modifier_life_stealer_rage",
	"modifier_item_aegis"
]

var DebuffsAddMagicDmg = [
	["modifier_bloodthorn_debuff", 1.3],
	["modifier_orchid_malevolence_debuff", 1.3],
	["modifier_item_mask_of_madness_berserk", 1.25],
	["modifier_bloodseeker_bloodrage", [1.25, 1.3, 1.35, 1.4]],
	["modifier_ursa_enrage", 0.2],
]

var BuffsAbsorbMagicDmg = [
	["modifier_item_pipe_barrier", 400],
	["modifier_item_hood_of_defiance_barrier", 400],
	["modifier_item_infused_raindrop", 120],
	["modifier_abaddon_aphotic_shield", [110, 140, 170, 200]],
	["modifier_ember_spirit_flame_guard", [50, 200, 350, 500]]
]
var BuffsAddMagicDmgForMe = [
	["modifier_bloodseeker_bloodrage", [1.25, 1.3, 1.35, 1.4]]
]



function LionF(){
    var Me = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var Ulti = Entities.GetAbility(Me, 3)
	var UltiLvl = Abilities.GetLevel(Ulti)
    //Линза
	if (Entities.GetAbilityByName(Me, 'item_aether_lens') != -1) {
	    var Lense = true
	    rangeCast += 200
	}else
	    Lense = false
	

	if(UltiLvl==0)
		return
	if ( Abilities.GetCooldownTimeRemaining(Ulti) != 0 || Entities.GetMana(Me)<manacost[UltiLvl-1] )
		return
	if (!Entities.HasScepter(Me))
		var UltiDmg = damage[UltiLvl-1]
	else
		var UltiDmg = scepterdamage[UltiLvl-1]
	var MyPos = Entities.GetAbsOrigin(Me)
    var HEnts = EntityManager.PlayersHeroEnts3()
	for (var i in HEnts) {
        var ent = parseInt(HEnts[i])
	    var entPos = Entities.GetAbsOrigin(ent)
		var cast = true
		if(ent==Me)
			continue	
		
		if (Utils.PointDistance(entPos,MyPos) >  rangeCast) {
			cast = false
		}
		if (cast) {
		    var buffsnames = Utils.GetBuffsNames(ent)
		    if (!Entities.IsEnemy(ent) || Entities.IsMagicImmune(ent) || !Entities.IsAlive(ent) || Utils.IntersecArrays(buffsnames, IgnoreBuffs) || Entities.GetAllHeroEntities().indexOf(ent) == -1)
		        continue

		    var MagicResist = Entities.GetArmorReductionForDamageType(ent, 2) * 100
		    var buffs = Utils.GetBuffs(ent)
		    for (var m in buffs)
		        for (var k in DebuffsAddMagicDmg)
		            if (Buffs.GetName(ent, buffs[m]) === DebuffsAddMagicDmg[k][0])
		                if (Array.isArray(DebuffsAddMagicDmg[k][1]))
		                    UltiDmg *= DebuffsAddMagicDmg[k][1][Abilities.GetLevel(Buffs.GetAbility(ent, buffs[i])) - 1]
                        else
                        var z=1
		                    UltiDmg *= DebuffsAddMagicDmg[k][z]
		    var buffsme = Utils.GetBuffs(Me)
		    for (m in buffsme)
		        for (k in BuffsAddMagicDmgForMe)
                    if (Buffs.GetName(ent, buffsme[m]) === BuffsAddMagicDmgForMe[k][0])
                    var zzzz=1
                        if (Array.isArray(BuffsAddMagicDmgForMe[k][1]))
                  
		                    UltiDmg *= BuffsAddMagicDmgForMe[k][zzzz][Abilities.GetLevel(Entities.GetAbility(ent, buffsme[i])) - 1]
                        else
                        var zzz=1
		                    UltiDmg *= BuffsAddMagicDmgForMe[k][zzz]
		    for (m in buffs)
		        for (k in BuffsAbsorbMagicDmg)
		            if (Buffs.GetName(ent, buffs[m]) === BuffsAbsorbMagicDmg[k][0])
		                if (Array.isArray(BuffsAbsorbMagicDmg[k][1]))
		                    UltiDmg -= BuffsAbsorbMagicDmg[k][1][Abilities.GetLevel(Entities.GetAbility(ent, buffs[i])) - 1]
                        else
                        var zz=1
		                    UltiDmg -= BuffsAddMagicDmgForMe[k][zz]

		    if (Lense)
		        UltiDmg = UltiDmg * 1.05


		    var dmgclear = UltiDmg - UltiDmg / 100 * MagicResist

			var HP = Entities.GetHealth(ent)
			if (HP <= dmgclear) {
				GameUI.SelectUnit(Me, false);
				Orders.CastTarget(Me, Ulti,ent,false)
				$.Msg(HP, '<', dmgclear)
			}
			cast = false
		}
	}
	}


module = {
	name: "Lion Autoulti",
	onToggle: checkbox => {
		if (checkbox.checked) {
            Corona.OnTick.push(LionF)
		
			Utils.ScriptLogMsg("Script enabled: LION ULTI", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: LION ULTI", "#ff0000")
		}
	},
	onDestroy: () => Corona.OnTick.remove(LionF)
}