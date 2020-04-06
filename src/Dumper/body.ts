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

module = {
	name: "Dumper",
	onPreload: (): void => {
		if(!Fusion.Commands.DumpNearby) {
			Fusion.Commands.DumpNearby = (name: string, arg1: string = "400") => {
				var MyEnt = EntityManager.MyEnt
				Array.prototype.orderBy.call (
					EntityManager.Entities.filter(ent => ent !== MyEnt && MyEnt.IsEntityInRange(ent, parseInt(arg1)) && !ent.IsBuilding && !ent.IsOwnedByAnyPlayer),
					ent => -ent.RangeToUnit(MyEnt)
				).forEach(ent => {
					var pos = ent.AbsOrigin
					$.Msg("DumpNearby", `${ent}: [${pos}]`)
					GameUI.PingMinimapAtLocation(pos)
				})
			}
			Game.AddCommand("__DumpNearby", Fusion.Commands.DumpNearby, "", 0)
		}
	},
	isVisible: false
}