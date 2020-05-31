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

var blockUnAgr: boolean = false,
	MyHP: number

function UnAgrF(): void {
	if (blockUnAgr)
		return

	var MyEnt = EntityManager.MyEnt,
		curHP = MyEnt.Health

	if (MyHP === undefined || curHP >= MyHP) {
		MyHP = curHP
		return
	}
	MyHP = curHP

	EntityManager.LaneCreeps
		.filter(creep => !creep.IsEnemy && creep.IsAlive && MyEnt.IsEntityInRange(creep, 520))
		.forEach(creep => {
			Orders.AttackTarget(MyEnt, creep, false)
			Orders.EntStop(MyEnt)
		})
	blockUnAgr = true
	$.Schedule(1, () => blockUnAgr = false)
}

module = {
	name: "Auto UnAgr",
	onPreload: () => {
		if(!Corona.Commands.AgrCreepsF) {
			Corona.Commands.AgrCreepsF = () => {
				var MyEnt = EntityManager.MyEnt
				EntityManager.PlayersHeroEnts().filter(ent => ent.IsEnemy && ent.IsAlive && MyEnt.IsEntityInRange(ent, 520)).forEach(ent => {
					Orders.AttackTarget(MyEnt, ent, false)
					Orders.EntStop(MyEnt)
				})
			}
			Game.AddCommand("__AgrCreeps", Corona.Commands.AgrCreepsF, "", 0)
		}
	},
	onToggle: checkbox => {
		if (checkbox.checked) {
			Corona.OnTick.push(UnAgrF)
			Utils.ScriptLogMsg("Script enabled: AgrUnAgr", "#00ff00")
		} else {
			Corona.OnTick.remove(UnAgrF)
			Utils.ScriptLogMsg("Script disabled: AgrUnAgr", "#ff0000")
		}
	},
	onDestroy: () => Corona.OnTick.remove(UnAgrF)
}