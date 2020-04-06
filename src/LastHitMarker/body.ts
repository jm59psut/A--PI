/*!
 * Created on Tue Mar 06 2018
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

var MainHud:       Panel    = Fusion.Panels.Main,
	uiw:           number   = Fusion.Panels.Main.actuallayoutwidth,
	uih:           number   = Fusion.Panels.Main.actuallayoutheight,
	creeps:        Entity[] = [],
	marker_layout: string

function DeleteAll_LHM(): void {
	if(!Fusion.Panels.LHMarkers)
		Fusion.Panels.LHMarkers = []
	Fusion.Panels.LHMarkers.forEach(panel => panel.DeleteAsync(0))
	Fusion.Panels.LHMarkers = []
}

function OnTick_LHM(): void {
	creeps = EntityManager.Creeps.filter(ent => ent.IsAlive && (ent.IsEnemy || ent.IsDeniable))
	if(Fusion.Configs.LastHitMarker.FriendCreeps == false)
		creeps = creeps.filter(ent => ent.IsEnemy)

	var MyEnt_Damage = EntityManager.MyEnt.Damage
	Fusion.Panels.LHMarkers.forEach((marker: Panel, ent_id: number) => {
		var ent = EntityManager.EntityByID(ent_id),
			creepHP = ent.Health,
			dmgtoent = ent.CalculateDamage(MyEnt_Damage, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL)
		if(!ent.IsAlive || creeps.indexOf(ent) === -1) {
			marker.DeleteAsync(0)
			delete Fusion.Panels.LHMarkers[ent_id]
			return
		}

		marker.visible = creepHP <= dmgtoent * Fusion.Configs.LastHitMarker.AttacksBeforeLH
		marker.style['background-color'] = creepHP <= dmgtoent
			? ent.IsEnemy
				? Fusion.Configs.LastHitMarker.EnemyLHColor
				: Fusion.Configs.LastHitMarker.FriendLHColor
			: ent.IsEnemy
				? Fusion.Configs.LastHitMarker.EnemyPreColor
				: Fusion.Configs.LastHitMarker.FriendPreColor
	})
}

function OnUpdate_LHM(): void {
	creeps.forEach(ent => {
		var vec = ent.AbsOrigin,
			healthbaroffset = ent.HealthBarOffset,
			uix_offset = -10,
			uiy_offset = -35,
			uix = Game.WorldToScreenX(vec.x, vec.z, vec.y + healthbaroffset) + uix_offset,
			uiy = Game.WorldToScreenY(vec.x, vec.z, vec.y + healthbaroffset) + uiy_offset,
			uixp = uix / uiw * 100,
			uiyp = uiy / uih * 100,
			marker: Panel

		if (!healthbaroffset || uix - uix_offset === -1 || uiy - uiy_offset === -1) {
			if((marker = Fusion.Panels.LHMarkers[ent.id])) {
				marker.DeleteAsync(0)
				delete Fusion.Panels.LHMarkers[ent.id]
			}
			return
		}
		if (Fusion.Panels.LHMarkers[ent.id] === undefined) {
			marker = $.CreatePanel("Panel", MainHud, "LSMarker")
			marker.BLoadLayoutFromString(marker_layout, false, false)
			Fusion.Panels.LHMarkers[ent.id] = marker
		}
		
		if(marker === undefined)
			marker = Fusion.Panels.LHMarkers[ent.id]
		marker.style.position = `${uixp}% ${uiyp}% 0`
	})
}

module = {
	name: "LastHitMarker",
	onPreload: () => {
		DeleteAll_LHM()
		Fusion.GetXML("LastHitMarker/marker").then(xml => marker_layout = xml)
		Fusion.GetConfig("LastHitMarker").then(config => Fusion.Configs.LastHitMarker = config)
	},
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.OnUpdate.push(OnUpdate_LHM)
			Fusion.OnTick.push(OnTick_LHM)
			Utils.ScriptLogMsg("Script enabled: LastHitMarker", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: LastHitMarker", "#ff0000")
		}
	},
	onDestroy: () => {
		Fusion.OnUpdate.remove(OnUpdate_LHM)
		Fusion.OnTick.remove(OnTick_LHM)
		DeleteAll_LHM()
	}
}