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

var EzVisage_config = { // do not change this!
	invalid_mode: false,
	ping_familiars: true
}

function GetFamiliars(): Entity[] {
	var playerID = Game.GetLocalPlayerID()
	return EntityManager.GetAllEntitiesByClassname("npc_dota_visage_familiar").filter(ent =>
		ent.IsAlive
		&& !ent.IsEnemy
		&& ent.IsControllableByPlayer(playerID)
		&& !ent.IsIllusion
	)
}

var HealBarrierPercent = 50
function Familiars(): void {
	GetFamiliars().filter(familiar => !familiar.IsStunned).forEach(familiar => {
		var StoneForm = familiar.AbilityByName("visage_summon_familiars_stone_form")
		if(familiar.HealthPercent <= HealBarrierPercent)
			if(StoneForm.IsCooldownReady)
				Orders.CastNoTarget(familiar, StoneForm, false)
			else
				if(EzVisage_config.ping_familiars)
					GameUI.PingMinimapAtLocation(familiar.AbsOrigin.Common)
	})
}

function EzVisageF(): void {
	Familiars()
	if(EzVisage_config.invalid_mode && GameUI.IsControlDown())
		Utils.SelectGroup(GetFamiliars(), false)
}

module = {
	name: "EzVisage",
	onPreload: () => Fusion.GetConfig("EzVisage").then(config => EzVisage_config = config),
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.OnTick.push(EzVisageF)
			Utils.ScriptLogMsg("Script enabled: EzVisage", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: EzVisage", "#ff0000")
		}
	},
	onDestroy: () => Fusion.OnTick.remove(EzVisageF)
}