/*!
 * Created on Sun Mar 04 2018
 *
 * This file is part of Fusion.
 * Copyright (c) 2018 Fusion
 *
 * Fusion is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Fusion is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Fusion.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @type {{particlepath: string, deleteDelay: number, heroName: string, abilityName: string, soundName: string}[]}
*/
var positionModifiers = {
	"modifier_invoker_sun_strike": {
		//particlepath: "particles/neutral_fx/roshan_spawn.vpcf",
		particlepath: "particles/econ/items/invoker/invoker_apex/invoker_sun_strike_team_immortal1.vpcf",
		soundName: "Hero_Invoker.SunStrike.Charge"
	},
	"modifier_kunkka_torrent_thinker": {
		particlepath: "particles/units/heroes/hero_kunkka/kunkka_spell_torrent_bubbles.vpcf",
		soundName: "kunkka_kunk_ability_torrent_01"
	},
	"modifier_lina_light_strike_array": {
		//particlepath: "particles/units/heroes/hero_lina/lina_spell_light_strike_array_ray_team.vpcf", // doesn't work
		particlepath: "particles/neutral_fx/roshan_spawn.vpcf",
		soundName: "lina_lina_ability_lightstrike_02"
	},
	"modifier_leshrac_split_earth_thinker": {
		particlepath: "particles/neutral_fx/roshan_spawn.vpcf",
		soundName: "leshrac_lesh_ability_split_05"
	}
}
/**
 * @type {{particlepath: string, soundName: string}[]}
 */
var targetModifiers = {
	"modifier_spirit_breaker_charge_of_darkness_vision": {
		particlepath: "particles/units/heroes/hero_spirit_breaker/spirit_breaker_charge_target.vpcf",
		soundName: "spirit_breaker_spir_ability_charge_17"
	},
	"modifier_tusk_snowball_visible": {
		particlepath: "particles/units/heroes/hero_tusk/tusk_snowball_target.vpcf",
		soundName: "tusk_tusk_snowball_01"
	},
	"modifier_life_stealer_infest_effect": {
		particlepath: "particles/units/heroes/hero_life_stealer/life_stealer_infested_unit_icon.vpcf",
		soundName: "Hero_LifeStealer.Infest"
	},
	"modifier_life_stealer_assimilate_effect": {
		particlepath: "particles/units/heroes/hero_life_stealer/life_stealer_infested_unit_icon.vpcf",
		soundName: "Hero_LifeStealer.Assimilate.Target"
	}
}
var ignoreBuffs: Buff[] = [],
	panels: Panel[] = []

function SAlertEvery(): void {
	EntityManager.GetAllEntitiesByName("npc_dota_thinker").forEach(thinker => {
		const vec = thinker.AbsOrigin
		thinker.Buffs.filter(buff => ignoreBuffs.indexOf(buff) === -1).forEach(buff => {
			ignoreBuffs.push(buff)
			const modifier = positionModifiers[buff.Name]
			if(modifier !== undefined)
				AlertPosition(modifier, vec, thinker, buff)
		})
	})

	EntityManager.PlayersHeroEnts()
		.filter(ent => ent.IsAlive)
		.forEach(ent => ent.Buffs.filter(buff => ignoreBuffs.indexOf(buff) === -1).forEach(buff => {
			ignoreBuffs.push(buff)
			const modifier = targetModifiers[buff.Name]
			if(modifier !== undefined && modifier !== [])
				AlertTarget(modifier, ent, buff)
		}))
}

/**
 * @param {{particlepath: string, soundName: string}} modifier
 * @param {Entity} ent
 * @param {Buff} buff
 */
function AlertTarget(modifier, ent: Entity, buff: Buff): void {
	const cb = CreateFollowParticle(modifier.particlepath, ent)
	buff.OnDestroy(cb)
	if(Fusion.Panels.ItemPanel !== undefined && Fusion.Configs.SkillAlert.Notify === "true" && panels[ent.id] === undefined) {
		var A = $.CreatePanel("Panel", Fusion.Panels.ItemPanel, `Alert${ent.id}`)
		A.BLoadLayoutFromString('\
<root>\
	<Panel style="width:100%;height:37px;background-color:#111;">\
		<DOTAHeroImage heroname="" style="vertical-align:center;width:60px;height:35px;position:0px;"/>\
		<DOTAAbilityImage abilityname="" style="vertical-align:center;width:60px;height:35px;position:60px;"/>\
		<DOTAHeroImage heroname="" style="vertical-align:center;width:60px;height:35px;position:120px;"/>\
	</Panel>\
</root>', false, false)
		A.Children()[0].heroname = buff.Caster.UnitName
		A.Children()[1].abilityname = buff.Ability.AbilityName
		A.Children()[2].heroname = ent.UnitName
		panels[ent.id] = A

		buff.OnDestroy(() => {
			delete panels[ent.id]
			A.DeleteAsync(0)
		})
	}
	if(Fusion.Configs.SkillAlert.EmitSound === "true" && modifier.soundName)
		Game.EmitSound(modifier.soundName)
}

/**
 * @param {{particlepath: string, deleteDelay: number, heroName: string, abilityName: string, soundName: string}} modifier
 * @param {Vector} vec
 * @param {Entity} thinker
 * @param {Buff} buff
 */
function AlertPosition(modifier, vec: Vector, thinker: Entity, buff: Buff): void {
	const cb = CreateTimerParticle(modifier.particlepath, vec)
	buff.OnDestroy(cb)
	if(Fusion.Panels.ItemPanel !== undefined && Fusion.Configs.SkillAlert.Notify === "true" && panels[thinker.id] === undefined) {
		var A = $.CreatePanel("Panel", Fusion.Panels.ItemPanel, `Alert${thinker.id}`)
		A.BLoadLayoutFromString("\
<root>\
	<Panel style='width:100%;height:37px;background-color:#111;'>\
		<DOTAHeroImage heroname='' style='vertical-align:center;width:60px;height:35px;position:0px;'/>\
		<DOTAAbilityImage abilityname='' style='vertical-align:center;width:60px;height:35px;position:60px;'/>\
	</Panel>\
</root>", false, false)
		A.Children()[0].heroname = buff.Caster.UnitName
		A.Children()[1].abilityname = buff.Ability.AbilityName
		panels[thinker.id] = A

		buff.OnDestroy(() => {
			delete panels[thinker.id]
			A.DeleteAsync(0)
		})
	}
	if (Fusion.Configs.SkillAlert.EmitSound === "true" && modifier.soundName)
		Game.EmitSound(modifier.soundName)
}

/**
 * @param {string} particlepath
 * @param {Entity} ent
 */
function CreateFollowParticle(particlepath: string = "", ent: Entity): Function {
	if(particlepath === "")
		return
	var p = ParticleManager.CreateParticle(particlepath, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, ent)
	ParticleManager.SetParticleControl(p, 0, [0, 0, 0])

	return () => ParticleManager.DestroyParticleEffect(p, true)
}

/**
 * @param {string} particlepath
 * @param {Vector} vec
 */
function CreateTimerParticle(particlepath: string = "", vec: Vector): Function {
	if(particlepath === "")
		return
	var p = ParticleManager.CreateParticle(particlepath, ParticleAttachment_t.PATTACH_ABSORIGIN)
	ParticleManager.SetParticleControl(p, 0, vec)
	ParticleManager.SetParticleControl(p, 3, [0, 0, 0])

	return () => ParticleManager.DestroyParticleEffect(p, true)
}

module = {
	name: "SkillAlert",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.GetConfig("SkillAlert").then(config => {
				Fusion.Configs.SkillAlert = config
				Fusion.OnTick.push(SAlertEvery)
			})
			Utils.ScriptLogMsg("Script enabled: SkillAlert", "#00ff00")
		} else {
			Fusion.OnTick.remove(SAlertEvery)
			Utils.ScriptLogMsg("Script disabled: SkillAlert", "#ff0000")
		}
	},
	onDestroy: () => Fusion.OnTick.remove(SAlertEvery)
}