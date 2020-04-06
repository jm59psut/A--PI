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

function AutoDewardF(): void {
	var MyEnt = EntityManager.MyEnt
	if(MyEnt.IsStunned || !MyEnt.IsAlive)
		return

	Deward(MyEnt, [EntityManager.GetAllEntitiesByClassname("npc_dota_ward_base"), EntityManager.GetAllEntitiesByClassname("npc_dota_ward_base_truesight")])
}

function Deward(MyEnt: Entity, wardsAr: Entity[][]) {
	var Abil = Utils.GetChopItem(MyEnt)
	if(!Abil)
		return

	var AbilRange = Abil.CastRange
	wardsAr.every(wards => !wards.filter(ent =>
		ent.IsAlive
		&& ent.IsEnemy
		&& MyEnt.IsEntityInRange(ent, AbilRange)
		&& (ent.IsWard || ent.IsMine)
	).some(ent => {
		Orders.CastTarget(MyEnt, Abil, ent, false)
		return true
	}))
}

module = {
	name: "Auto Deward",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.OnTick.push(AutoDewardF)
			Utils.ScriptLogMsg("Script enabled: AutoDeward", "#00ff00")
		} else {
			Fusion.OnTick.remove(AutoDewardF)
			Utils.ScriptLogMsg("Script disabled: AutoDeward", "#ff0000")
		}
	},
	onDestroy: () => Fusion.OnTick.remove(AutoDewardF)
}