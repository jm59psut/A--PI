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

var Orders = {
	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	MoveToPos(ent: Entity | number, vec: Vector, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	MoveToDirection(ent: Entity | number, vec: Vector, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	RotateToPos(ent: Entity | number, vec: Vector, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
		Orders.EntStop(ent, queue, orderIssuer)
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Entity | number} target target entity
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	MoveToTarget(ent: Entity | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	MoveToAttackPos(ent: Entity | number, vec: Vector, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Entity | number} target target entity
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	AttackTarget(ent: Entity | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	EntStop(ent: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Entity | number} target target entity
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	PickupItem(ent: Entity | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Entity | number} target target entity
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	PickupRune(ent: Entity | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Entity | number} target target entity
	 * @param {Ability | number} abil ability
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	CastTarget(ent: Entity | number, abil: Ability | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		var prev = PlayerManager.LocalPlayer.SelectedEntities
		GameUI.SelectUnit(ent instanceof Entity ? ent.id  : ent, false)

		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			AbilityIndex: abil instanceof Entity ? abil.id  : abil,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})

		Utils.SelectGroup(prev, true)
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Entity | number} target target entity
	 * @param {Ability | number} abil ability
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	CastTargetTree(ent: Entity | number, abil: Ability | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		var prev = PlayerManager.LocalPlayer.SelectedEntities
		GameUI.SelectUnit(ent instanceof Entity ? ent.id  : ent, false)

		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			AbilityIndex: abil instanceof Entity ? abil.id  : abil,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
		
		Utils.SelectGroup(prev, true)
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Ability | number} abil ability
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	CastPosition(ent: Entity | number, abil: Ability | number, vec: Vector, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			AbilityIndex: abil instanceof Entity ? abil.id  : abil,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
	},
	CastPosition2(ent, abil, xyz, queue){
		var SelectedEntities = Players.GetSelectedEntities(Game.GetLocalPlayerID());
		GameUI.SelectUnit(ent, false);
		
		var order = {};
		var OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION
		var UnitIndex = ent
		var Position = xyz
		var AbilityIndex = abil
		var Queue = queue
		var ShowEffects = false
		Game.PrepareUnitOrders( order )
		
		GameUI.SelectUnit(SelectedEntities[0], false);
		for(var i = 1; i < SelectedEntities.length; i++) {
			GameUI.SelectUnit(SelectedEntities[i], true);
		}
	},
	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Ability | number} abil ability
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	CastNoTarget(ent: Entity | number, abil: Ability | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
			UnitIndex: ent instanceof Entity ? ent.id : ent,
			AbilityIndex: abil instanceof Entity ? abil.id : abil,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Ability | number} abil ability
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	ToggleAbil(ent: Entity | number, abil: Ability | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		var prev = PlayerManager.LocalPlayer.SelectedEntities
		GameUI.SelectUnit(ent instanceof Entity ? ent.id  : ent, false)

		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			AbilityIndex: abil instanceof Entity ? abil.id  : abil,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Corona.debugAnimations
		})
		
		Utils.SelectGroup(prev, true)
	},
	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Item | number} item item to move
	 * @param {number} slot_id target slot ID
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	MoveItem(ent: Entity | number, item, slot_id, queue: boolean | number) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			AbilityIndex: item.id ? item.id  : item,
			TargetIndex: slot_id,
			Queue: queue,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Entity | number} target target item
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	DropItem(ent: Entity | number, target: Entity | number, vec: Vector, queue: boolean | number) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			AbilityIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Entity | number} target target item
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	ItemLock(ent: Entity | number, target: Entity | number, queue: boolean | number) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			ShowEffects: Corona.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {number} itemid Item ID [lookup scripts/npc/items.txt]
	 */
	PurchaseItem(ent: Entity | number, itemid: number) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			AbilityIndex: itemid,
			Queue: false,
			ShowEffects: Corona.debugAnimations
		})
	},
	Behaviors(DABor){
		var DABh = []
		var ZBehavior = Abilities.GetBehavior( parseInt( DABor ) )
		var s = 32
		while ( ZBehavior > 0 && s > 0 ){
			if(Math.pow(2,s)>ZBehavior){
				s--
				continue
			}
			ZBehavior-=Math.pow(2,s)
			DABh.push(Math.pow(2,s))
		}
		return DABh
	}
}

module.exports = { Orders }