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

var feeder = false

function AFK(): void {
	var MyEnt = EntityManager.MyEnt
	if(Game.GameStateIsBefore(DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME) || MyEnt.IsStunned || !MyEnt.IsAlive)
		return
	Array.prototype.orderBy.call(EntityManager.PlayersHeroEnts().filter(ent =>
		ent !== MyEnt
		&& ent.IsAlive
		&& !ent.IsEnemy
		&& !ent.IsBuilding
	), ent => ent.RangeToUnit(MyEnt)).every(ent => {
		if(feeder)
			Orders.MoveToAttackPos(MyEnt, ent.AbsOrigin, false)
		else
			Orders.MoveToTarget(MyEnt, ent.id, false)

		return false
	})
}

module = {
	name: "Anti AFK",
	onToggle: checkbox => {
		if(checkbox.checked) {
			Fusion.OnTick.push(AFK)
			Utils.ScriptLogMsg("Script enabled: AntiAFK", "#00ff00")
		} else {
			Fusion.OnTick.remove(AFK)
			Utils.ScriptLogMsg("Script disabled: AntiAFK", "#ff0000")
		}
	},
	onDestroy: () => Fusion.OnTick.remove(AFK)
}