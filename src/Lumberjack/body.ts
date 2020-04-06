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

var ignore: Entity[] = []

function LumberjackF(): void {
	var MyEnt = EntityManager.MyEnt,
		chopItem = Utils.GetChopItem(MyEnt)
	if(chopItem === undefined)
		return
	var chopItemRange = chopItem.CastRange,
		ignoreTime = 3
	if(Game.IsGamePaused() || MyEnt.IsStunned || !MyEnt.IsAlive)
		return

	var trees = EntityManager.Entities.filter(ent => ent.IsTree && MyEnt.IsEntityInRange(ent, chopItemRange))
	if(trees.length === 0)
		return

	trees.every(tree => {
		if(ignore.indexOf(tree) > -1)
			return true

		Orders.CastTargetTree(MyEnt, chopItem, tree, false)

		ignore.push(tree)
		$.Schedule(ignoreTime, () => ignore.remove(tree))
		return false
	})
}

module = {
	name: "Lumberjack",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.OnTick.push(LumberjackF)
			Utils.ScriptLogMsg("Script enabled: Lumberjack", "#00ff00")
		} else {
			Fusion.OnTick.remove(LumberjackF)
			Utils.ScriptLogMsg("Script disabled: Lumberjack", "#ff0000")
		}
	},
	onDestroy: () => {
		Fusion.OnTick.remove(LumberjackF)
		ignore.forEach((el, id) => delete ignore[id])
	}
}