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

var flags: boolean[] = [],
	flag: boolean = false

function EzSuntrikeF(): void {
	var MyEnt = EntityManager.MyEnt,
		SunStrike = MyEnt.AbilityByName("invoker_sun_strike"),
		exort = MyEnt.AbilityByName("invoker_exort"),
		damage = SunStrike.LevelSpecialValueFor("damage", exort.Level - 1 + (MyEnt.HasScepter ? 1 : 0)),
		delay = SunStrike.SpecialValueFor("delay")
	if(flag || !SunStrike.IsCooldownReady)
		return
	
	EntityManager.PlayersHeroEnts().filter(ent =>
		ent.IsEnemy
		&& flags[ent.id] !== true
		&& ent.IsAlive
		&& (ent.IsStunned || ent.IsRooted/* || !ent.IsMoving*/)
		//&& ent.HealthAfter(delay) <= damage
	).some(ent => {
		if(SunStrike.IsHidden) {
			for(let i = 0; i < 3; i++) Orders.CastNoTarget(MyEnt, exort, false)
			Orders.CastNoTarget(MyEnt, MyEnt.AbilityByName("invoker_invoke"), false)

			flag = true
			$.Schedule(Corona.MyTick * 4, () => flag = false)
			return true
		}
		Orders.CastPosition(MyEnt, SunStrike, ent.AbsOrigin/*VelocityWaypoint(delay)*/, false)

		flags[ent.id] = true
		$.Schedule(delay + SunStrike.CastPoint + 0.3, () => delete flags[ent.id])
		return true
	})
}

module = {
	name: "EzSuntrike",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Corona.OnTick.push(EzSuntrikeF)
			Utils.ScriptLogMsg("Script enabled: EzSuntrike", "#00ff00")
		} else {
			Corona.OnTick.remove(EzSuntrikeF)
			Utils.ScriptLogMsg("Script disabled: EzSuntrike", "#ff0000")
		}
	},
	onDestroy: () => {
		Corona.OnTick.remove(EzSuntrikeF)
		flags = []
		flag = false
	}
}