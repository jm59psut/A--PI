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

function WardBuyTrollF(): void {
	var MyEnt = EntityManager.MyEnt

	var item = GetItemAnywhere(MyEnt, "item_ward_sentry")
	if(item !== undefined)
		item.LocalPlayerSellItem()
	else
		Orders.PurchaseItem(MyEnt, 43)
}

/**
 * Searches for item in inventory, backpack + stash
 */
function GetItemAnywhere(ent: Entity, name: string): Item {
	var items = ent.UnitItems.concat(ent.StashItems).filter(item => item !== undefined && item.AbilityName === name)
	return items.length > 0 ? items[0] : undefined
}

module = {
	name: "WardBuyTroll",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.OnTick.push(WardBuyTrollF)
			Utils.ScriptLogMsg("Script enabled: WardBuyTroll", "#00ff00")
		} else {
			Fusion.OnTick.remove(WardBuyTrollF)
			Utils.ScriptLogMsg("Script disabled: WardBuyTroll", "#ff0000")
		}
	},
	onDestroy: () => Fusion.OnTick.remove(WardBuyTrollF)
}