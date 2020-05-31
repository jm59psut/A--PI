/*!
 * Created on Tue Mar 06 2018
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

var MainHud:       Panel    = Corona.Panels.Main,
	uiw:           number   = Corona.Panels.Main.actuallayoutwidth,
	uih:           number   = Corona.Panels.Main.actuallayoutheight,
	creeps:        Entity[] = [],
	marker_layout: string

function DeleteAll_LHM(): void {
	if(!Corona.Panels.LHMarkers)
		Corona.Panels.LHMarkers = []
	Corona.Panels.LHMarkers.forEach(panel => panel.DeleteAsync(0))
	Corona.Panels.LHMarkers = []
}

function OnTick_LHM(): void {
	creeps = EntityManager.Creeps.filter(ent => ent.IsAlive && (ent.IsEnemy || ent.IsDeniable))
	if(Corona.Configs.LastHitMarker.FriendCreeps == false)
		creeps = creeps.filter(ent => ent.IsEnemy)

	var MyEnt_Damage = EntityManager.MyEnt.Damage
	Corona.Panels.LHMarkers.forEach((marker: Panel, ent_id: number) => {
		var ent = EntityManager.EntityByID(ent_id),
			creepHP = ent.Health,
			dmgtoent = ent.CalculateDamage(MyEnt_Damage, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL)
		if(!ent.IsAlive || creeps.indexOf(ent) === -1) {
			marker.DeleteAsync(0)
			delete Corona.Panels.LHMarkers[ent_id]
			return
		}

		marker.visible = creepHP <= dmgtoent * Corona.Configs.LastHitMarker.AttacksBeforeLH
		marker.style['background-color'] = creepHP <= dmgtoent
			? ent.IsEnemy
				? Corona.Configs.LastHitMarker.EnemyLHColor
				: Corona.Configs.LastHitMarker.FriendLHColor
			: ent.IsEnemy
				? Corona.Configs.LastHitMarker.EnemyPreColor
				: Corona.Configs.LastHitMarker.FriendPreColor
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
			if((marker = Corona.Panels.LHMarkers[ent.id])) {
				marker.DeleteAsync(0)
				delete Corona.Panels.LHMarkers[ent.id]
			}
			return
		}
		if (Corona.Panels.LHMarkers[ent.id] === undefined) {
			marker = $.CreatePanel("Panel", MainHud, "LSMarker")
			marker.BLoadLayoutFromString(marker_layout, false, false)
			Corona.Panels.LHMarkers[ent.id] = marker
		}
		
		if(marker === undefined)
			marker = Corona.Panels.LHMarkers[ent.id]
		marker.style.position = `${uixp}% ${uiyp}% 0`
	})
}

module = {
	name: "LastHitMarker",
	onPreload: () => {
		DeleteAll_LHM()
		Corona.GetXML("LastHitMarker/marker").then(xml => marker_layout = xml)
		Corona.GetConfig("LastHitMarker").then(config => Corona.Configs.LastHitMarker = config)
	},
	onToggle: checkbox => {
		if (checkbox.checked) {
			Corona.OnUpdate.push(OnUpdate_LHM)
			Corona.OnTick.push(OnTick_LHM)
			Utils.ScriptLogMsg("Script enabled: LastHitMarker", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: LastHitMarker", "#ff0000")
		}
	},
	onDestroy: () => {
		Corona.OnUpdate.remove(OnUpdate_LHM)
		Corona.OnTick.remove(OnTick_LHM)
		DeleteAll_LHM()
	}
}