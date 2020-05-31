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

function AutoBottleF(): void {
	var MyEnt = EntityManager.MyEnt
	if(MyEnt.IsStunned || !MyEnt.IsAlive)
		return

	var Bottle = MyEnt.ItemByName("item_bottle")
	if(Bottle !== undefined && MyEnt.IsInRangeOfFountain && Bottle.IsCooldownReady)
		Orders.CastNoTarget(MyEnt, Bottle, false)
}

module = {
	name: "Auto Bottle",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Corona.OnTick.push(AutoBottleF)
			Utils.ScriptLogMsg("Script enabled: AutoBottle", "#00ff00")
		} else {
			Corona.OnTick.remove(AutoBottleF)
			Utils.ScriptLogMsg("Script disabled: AutoBottle", "#ff0000")
		}
	},
	onDestroy: () => Corona.OnTick.remove(AutoBottleF)
}