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

var doing_tp = false

function WKAbuseF(): void {
	if(EntityManager.MyEnt == undefined || doing_tp) return
	var MyEnt = EntityManager.MyEnt
	if(!MyEnt.IsAlive) return
	var buff: Buff = MyEnt.BuffByName("modifier_skeleton_king_reincarnation_scepter_active"),
		tp: Item = MyEnt.ItemByName(/item_(tpscroll|travel_boots)/),
		bkb: Item = MyEnt.ItemByName("item_black_king_bar"),
		waitTime = 1 + Fusion.MyTick * (bkb === undefined ? 1 : 2)
	if(buff === undefined || tp === undefined || tp.CooldownTimeRemaining > 0 || buff.RemainingTime - (tp.ChannelTime + waitTime) > Fusion.MyTick) return
	doing_tp = true
	Orders.CastNoTarget(MyEnt, bkb, false)
	var fountain = EntityManager.Entities.filter(ent => !ent.IsEnemy && ent.UnitName === "dota_fountain")[0]
	Orders.CastPosition(MyEnt, tp, fountain.AbsOrigin, false)
	$.Schedule(waitTime + Fusion.MyTick, () => doing_tp = false)
}

module = {
	name: "WKAbuse",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.OnTick.push(WKAbuseF)
			Utils.ScriptLogMsg("Script enabled: WKAbuse", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: WKAbuse", "#ff0000")
		}
	},
	onDestroy: () => Fusion.OnTick.remove(WKAbuseF)
}