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

var MainHud:      Panel  = Fusion.Panels.Main,
	uiw:          number = Fusion.Panels.Main.actuallayoutwidth,
	uih:          number = Fusion.Panels.Main.actuallayoutheight,
	panel_layout: string

var JungleCreeps = {
	get AllCreeps(): Entity[] { return Game.allCreeps },

	get NotSpawnedCreeps(): Entity[] { return Game.allCreeps.filter(ent => ent.IsBlind) }
}

function JungleMapHack_OnTick() {
	EntityManager.Entities.filter(ent =>
		Game.allCreeps.indexOf(ent) === -1
		&& ent.IsAlive
		&& ent.IsCreep
		&& !ent.IsLaneCreep
		&& ent.TeamNumber === DOTATeam_t.DOTA_TEAM_NEUTRALS
	).forEach(ent => Game.allCreeps.push(ent))
	Game.allCreeps.filter(ent =>
		!ent.IsAlive
		|| !ent.IsValidEntity
		|| ent.TeamNumber !== DOTATeam_t.DOTA_TEAM_NEUTRALS
	).forEach(ent => Game.allCreeps.remove(ent))
	var invisCreeps = JungleCreeps.NotSpawnedCreeps
	Fusion.Panels.JungleMapHack.forEach((panel: Panel, creep_id: number) => {
		if(invisCreeps.indexOf(EntityManager.EntityByID(creep_id)) === -1) {
			panel.DeleteAsync(0)
			delete Fusion.Panels.JungleMapHack[creep_id]
		}
	})
}

function JungleMapHack_OnUpdate() {
	JungleCreeps.NotSpawnedCreeps.filter(creep => !creep.IsLaneCreep && creep.TeamNumber === DOTATeam_t.DOTA_TEAM_NEUTRALS).forEach(creep => {
		var vec = creep.InFront(50),
			uix = Game.WorldToScreenX(vec.x, vec.z, vec.y),
			uiy = Game.WorldToScreenY(vec.x, vec.z, vec.y),
			uixp = uix / uiw * 100,
			uiyp = uiy / uih * 100,
			panel: Panel
		
		if (uix === -1 || uiy === -1) {
			if((panel = Fusion.Panels.JungleMapHack[creep.id])) {
				panel.DeleteAsync(0)
				delete Fusion.Panels.JungleMapHack[creep.id]
			}
			return
		}
		if(Fusion.Panels.JungleMapHack[creep.id] === undefined) {
			panel = $.CreatePanel("Panel", MainHud, "JungleMapHack")
			panel.BLoadLayoutFromString(panel_layout, false, false)
			panel.Children()[0].text = Utils.Localize(creep.UnitName)

			Fusion.Panels.JungleMapHack[creep.id] = panel
		}
		if(panel === undefined)
			panel = Fusion.Panels.JungleMapHack[creep.id]
		panel.style.position = `${uixp}% ${uiyp}% 0`
	})
}

module = {
	name: "Jungle Map Hack",
	onPreload: () => {
		Fusion.Panels.JungleMapHack = []
		Fusion.GetXML("JungleMapHack/panel").then(xml => panel_layout = xml)
	},
	onToggle: checkbox => {
		if (checkbox.checked) {
			Utils.UnrestrictedCmd("cl_fullupdate")
			Fusion.OnTick.push(JungleMapHack_OnTick)
			Fusion.OnUpdate.push(JungleMapHack_OnUpdate)
			Utils.ScriptLogMsg("Script enabled: JungleMapHack", "#00ff00")
			Utils.ScriptLogMsg("WARNING: game will freeze for a few seconds", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: JungleMapHack", "#ff0000")
		}
	},
	onDestroy: (): void => {
		Fusion.OnTick.remove(JungleMapHack_OnTick)
		Fusion.OnUpdate.remove(JungleMapHack_OnUpdate)
		if(Fusion.Panels.JungleMapHack !== undefined) {
			Fusion.Panels.JungleMapHack.forEach(panel => panel.DeleteAsync(0))
			Fusion.Panels.JungleMapHack = []
		}
	}
}