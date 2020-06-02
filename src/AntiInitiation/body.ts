/*!
 * Created on Sun Mar 04 2018
 *
 * This file is part of Corona.
 * Copyright (c) 2018 Corona
 *
 * Corona is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Corona is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Corona.  If not, see <http://www.gnu.org/licenses/>.
 */

// 3rd arg means that this ability can"t be disabled because of castpoint (ex. eul has 0.0 castpoint)
var Abils_: ([string, boolean] | [string, boolean, boolean])[][] = [
		[ // HexAbils
			["lion_voodoo", true, true],
			["shadow_shaman_voodoo", true, true],
		],
		[ // DisableAbils
			["axe_berserkers_call", true],
			["puck_waning_rift", true],
			["crystal_maiden_frostbite", true],
			["skywrath_mage_ancient_seal", true],
			["doom_bringer_doom", false],
		],
		[ // StunAbils
			["dragon_knight_dragon_tail", true],
			["tidehunter_ravage", true],
			["earthshaker_echo_slam", false, true],
			["earthshaker_fissure", false],
			["magnataur_reverse_polarity", false],
			["beastmaster_primal_roar", true],
			["treant_overgrowth", false],
			["faceless_void_chronosphere", false],
			["batrider_flaming_lasso", true],
			["slardar_slithereen_crush", false],
			["enigma_black_hole", false],
			["shadow_shaman_shackles", false],
			["sven_storm_bolt", true],
			["lion_impale", true],
			["centaur_hoof_stomp", false],
			["vengefulspirit_magic_missile", true],
			["sand_king_burrowstrike", true],
			["nyx_assassin_impale", true],
			["chaos_knight_chaos_bolt", false],
			["tiny_avalanche", true],
			["ogre_magi_fireblast", true],
			["obsidian_destroyer_astral_imprisonment", true],
			["rubick_telekinesis", true],
			["pudge_dismember", true],
			["invoker_cold_snap", true],
			["invoker_tornado", true],
			["dark_seer_vacuum", true],
			["bane_nightmare", true],
			["rattletrap_hookshot", true],
			["tusk_walrus_kick", true],
		],
		[ // OtherAbils
			["dark_seer_wall_of_replica", false],
			["queenofpain_sonic_wave", false],
			["queenofpain_blink", false],
			["antimage_blink", false],
			["faceless_void_time_walk", false],
			["antimage_mana_void", false],
			["legion_commander_duel", false],
			["witch_doctor_death_ward", false],
			["rattletrap_power_cogs", false],
			["brewmaster_primal_split", false],
			["omniknight_guardian_angel", false],
			["lion_finger_of_death", false],
			["lina_laguna_blade", false],
			["juggernaut_omni_slash", false],
			["slark_pounce", false],
			["axe_culling_blade", false],
			["phoenix_supernova", false],
			["riki_smoke_screen", false],
			["riki_tricks_of_the_trade", false],
			["riki_blink_strike", false],
		],
		[ // AntiInitItems
			["item_sheepstick", true, true],
			["item_orchid", true, true],
			["item_bloodthorn", true, true],
			["item_cyclone", true, true],
			["item_blink", false, true],
			["item_heavens_halberd", true, true],
			["item_nullifier", true, true],
		],
	],
	BuffsDisablers_: ([string, boolean] | [string, boolean, boolean])[][] = [[ // any _target_ (micro-)stun
		["lion_voodoo", true, true],
		["shadow_shaman_voodoo", true, true],
		["crystal_maiden_frostbite", true],
		["ogre_magi_fireblast", true],
		["lion_impale", true],
		["sven_storm_bolt", true],
		["beastmaster_primal_roar", true],
		["rubick_telekinesis", true],
		["sand_king_burrowstrike", true],
		["item_sheepstick", true, true],
		["item_cyclone", true, true],
		["item_heavens_halberd", true, true],
	]],
	DisableBuffs: string[] = [
		"modifier_teleporting",
		"modifier_techies_suicide_leap",
		"modifier_monkey_king_bounce_leap",
		"modifier_spirit_breaker_charge_of_darkness",
	],
	Abils: ([string, boolean] | [string, boolean, boolean])[][] = [],
	BuffsDisablers: ([string, boolean] | [string, boolean, boolean])[][] = []

function GetAbilArray(abilNameToSearch: string): any {
	var abilArFound
	Abils.every(ar => ar.every(abilAr => {
		if(abilAr[0] !== abilNameToSearch)
			return true

		abilArFound = abilAr
		return false
	}))

	return abilArFound
}

var flags: boolean[] = []
function AntiInitiationF(): void {
	var MyEnt = EntityManager.MyEnt
	if(MyEnt.IsStunned || !MyEnt.IsAlive || Abilities.GetLocalPlayerActiveAbility() !== -1/* || (MyEnt.CanBeVisible && selectedHero !== "riki" && selectedHero !== "treant_protector")*/)
		return
	var ents = EntityManager.PlayersHeroEnts().filter(ent => ent.IsAlive && ent.IsEnemy && !flags[ent.id])
	if(ents.some(ent => ent.Abilities.some(abil => Disable(MyEnt, ent, Abils, abil))))
		return
	if(ents.some(ent => Utils.IntersectArrays(ent.BuffsNames, DisableBuffs) && Disable(MyEnt, ent, BuffsDisablers)))
		return
}

function Disable(MyEnt: Entity, ent: Entity, DisableAr: any[], Abil?: Ability): boolean {
	if(Abil !== undefined) { // check that it can be disabled
		let AbilAr
		if (
			!Abil.IsInAbilityPhase ||
			!Abil.IsCooldownReady ||
			Abil.Level === 0 ||
			(AbilAr = GetAbilArray(Abil.AbilityName)) === undefined ||
			AbilAr[2]
		)
			return false
	}

	var abil: Ability
	DisableAr.every(ar => !ar.filter(abilAr => abilAr[1]).map(abilAr => MyEnt.NByName(abilAr[0])).filter(abilL => abilL !== undefined).filter(abilL => {
		var abil_range = abilL.CastRange
		return (abil_range <= 0 || MyEnt.IsEntityInRange(ent, abil_range))
			&& !abilL.IsHidden
			&& abilL.IsCooldownReady
	}).some(abilL => {
		abil = abilL
		return true
	}))
	if(abil === undefined)
		return false

	var Behavior = abil.Behavior
	if(Utils.IsFlagSet(Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET))
		Orders.CastNoTarget(MyEnt, abil, false)
	else if(Utils.IsFlagSet(Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT))
		Orders.CastPosition(MyEnt, abil, ent.AbsOrigin, false)
	else if(Utils.IsFlagSet(Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET))
		Orders.CastTarget(MyEnt, abil, ent, false)
	flags[ent.id] = true
	$.Schedule(1, () => flags[ent.id] = false)

	return true
}

function TransformToAvailable(abil_arrays: ([string, boolean] | [string, boolean, boolean])[][]): ([string, boolean] | [string, boolean, boolean])[][] {
	var MyEnt = EntityManager.MyEnt,
	name = /^npc_dota_hero_(.*)$/.exec(MyEnt.UnitName)[1]
	if(name === "rubick" || name === "morphling")
		return abil_arrays
	return abil_arrays.map(abil_ar => abil_ar.filter(abilData =>
		MyEnt.AbilityByName(abilData[0]) !== undefined
		|| abilData[0].startsWith("item_")
	))
}

module = {
	name: "Anti Initiation [HUGE FPS DROP]",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Abils = TransformToAvailable(Abils_)
			BuffsDisablers = TransformToAvailable(BuffsDisablers_)
			Corona.OnTick.push(AntiInitiationF)
			Utils.ScriptLogMsg("Script enabled: AntiInitiation", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: AntiInitiation", "#ff0000")
		}
	},
	onDestroy: () => Corona.OnTick.remove(AntiInitiationF)
}