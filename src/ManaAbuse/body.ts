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

var AbuseManaItems = [
	"item_guardian_greaves",
	"item_soul_ring",
	"item_bottle",
	"item_magic_stick",
	"item_magic_wand"
]

module = {
	name: "ManaAbuse",
	isVisible: false,
	onPreload: (): void => {
		if(Fusion.Commands.ManaAbuseF)
			return
	
		Fusion.Commands.ManaAbuseF = () => {
			var MyEnt = EntityManager.MyEnt,
				dropVec = MyEnt.InFront(150),
				Inv = MyEnt.Inventory
			Inv.filter(Item => Item !== undefined).forEach(Item => {
				var ItemName = Item.AbilityName,
					ManaPool = 0
				ManaPool += Item.SpecialValueFor("bonus_int")
				ManaPool += Item.SpecialValueFor("bonus_intellect")
				ManaPool += Item.SpecialValueFor("bonus_all_stats")
				ManaPool += Item.SpecialValueFor("bonus_mana")
				if(ManaPool > 0 && AbuseManaItems.indexOf(ItemName) === -1)
					Orders.DropItem(MyEnt, Item, dropVec, false)
			})
			Inv.filter(Item => Item !== undefined && AbuseManaItems.indexOf(Item.AbilityName) !== -1).forEach(Item => Orders.CastNoTarget(MyEnt, Item, false))
			EntityManager.Entities.filter(ent =>
				ent.IsItemPhysical
				&& MyEnt.IsEntityInRange(ent, 150) // position calculations are latest, as it's most time-consuming
			).forEach(ent => Orders.PickupItem(MyEnt, ent, false))
		}
		Game.AddCommand("__ManaAbuse", Fusion.Commands.ManaAbuseF, "", 0)
	}
}