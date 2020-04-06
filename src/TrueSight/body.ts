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

var truesight_modifiers = {
		"modifier_truesight": "item_gem",
		"modifier_item_dustofappearance": "item_dust",
		"modifier_bloodseeker_thirst_vision": "bloodseeker_thirst",
		"modifier_bounty_hunter_track": "bounty_hunter_track"
	},
	TrueSight_panels: Map<Buff, Panel> = new Map(),
	TrueSight_buffs: Map<Entity, Buff[]> = new Map(),
	particles: number[] = [],
	ignoreBuffs: Buff[] = []

function TrueSightF(): void {
	EntityManager.PlayersHeroEnts().filter(ent => ent.IsAlive).forEach(ent => {
		ent.Buffs.filter(buff => ignoreBuffs.indexOf(buff) === -1).forEach(buff => {
			ignoreBuffs.push(buff)
			var abil_name = truesight_modifiers[buff.Name]
			if(abil_name) {
				if(!TrueSight_buffs.has(ent))
					TrueSight_buffs.set(ent, [])
				TrueSight_buffs.get(ent).push(buff)
				CreateAlert_Panel(ent, buff, abil_name)
				CreateAlert_Particle(ent)
				buff.OnDestroy(() => {
					var ar = TrueSight_buffs.get(ent)
					ar.remove(buff)

					if(TrueSight_panels.has(buff)) {
						TrueSight_panels.get(buff).DeleteAsync(0)
						TrueSight_panels.delete(buff)
					}

					if(ar.length === 0) {
						ParticleManager.DestroyParticleEffect(particles[ent.id])
						delete particles[ent.id]
					}

					ignoreBuffs.remove(buff)
				})
			}
		})
	})
}

function CreateAlert_Panel(ent: Entity, buff: Buff, abil_name: string): void {
	if(Fusion.Panels.ItemPanel === undefined)
		return

	var A = $.CreatePanel("Panel", Fusion.Panels.ItemPanel, `Alert ${buff}`),
		caster = buff.Caster,
		isAbility = /item_/.test(abil_name),
		isWard = caster === undefined
	A.BLoadLayoutFromString(`<root>\
	<Panel style='width:100%;height:37px;background-color:#111;'>\
		<DOTA${isWard ? "Item" : "Hero"}Image ${isWard ? "item" : "hero"}name='' style='vertical-align:center;width:60px;height:35px;position:0px;'/>\
		<DOTA${isAbility ? "Item" : "Ability"}Image ${isAbility ? "item" : "ability"}name='' style='vertical-align:center;width:60px;height:35px;position:70px;'/>\
		<DOTAHeroImage heroname='' style='vertical-align:center;width:60px;height:35px;position:140px;'/>\
	</Panel>\
</root>`, false, false)
	A.Children()[0][`${isWard ? "item" : "hero"}name`] = isWard ? "item_ward_sentry" : caster.UnitName
	A.Children()[1][`${isAbility ? "item" : "ability"}name`] = abil_name
	A.Children()[2].heroname = ent.UnitName
	TrueSight_panels.set(buff, A)
}

function CreateAlert_Particle(ent: Entity) {
	if(particles[ent.id] !== undefined)
		return

	particles[ent.id] = ParticleManager.CreateParticle("particles/ui/ui_sweeping_ring.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
}

function onDisable() {
	TrueSight_panels.forEach(panel => panel.DeleteAsync(0))
	TrueSight_panels.clear()

	particles.forEach(par => ParticleManager.DestroyParticleEffect(par))
	particles = []

	TrueSight_buffs.clear()

	ignoreBuffs = []
}

module = {
	name: "TrueSight Detector",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.OnTick.push(TrueSightF)
			Utils.ScriptLogMsg("Script enabled: TrueSight Detector", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: TrueSight Detector", "#ff0000")
		}
	},
	onDestroy: () => {
		Fusion.OnTick.remove(TrueSightF)
		onDisable()
	}
}