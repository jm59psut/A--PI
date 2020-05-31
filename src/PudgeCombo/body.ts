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

var no_rotating = false
function Hook(MyEnt: Entity, ent: Entity, callback: Function): void {
	if(MyEnt.IsMoving) {
		Orders.EntStop(MyEnt, false)
		$.Schedule(Corona.MyTick * 3, () => Hook(MyEnt, ent, callback))
		return
	}

	var myVec = MyEnt.AbsOrigin,
		hook = MyEnt.AbilityByName("pudge_meat_hook"),
		hookSpeed = hook.SpecialValueFor("hook_speed"),
		hookDist = hook.CastRange,
		hookwidth = hook.SpecialValueFor("hook_width") / 2,
		reachtime = MyEnt.RangeToUnit(ent) / hookSpeed,
		delay = hook.CastPoint,
		schedDelay = delay - Corona.MyTick * 2,
		time = reachtime + delay + Corona.MyTick + (no_rotating ? Utils.Angle2Vector(myVec.AngleBetweenTwoVectors(ent.AbsOrigin)).RotationTime(0.7) : 0),
		predict = ent.VelocityWaypoint(time)

	if(!MyEnt.IsEntityInRange(ent, hookDist + hookwidth))
		return

	if(no_rotating)
		predict = myVec.ExtendVector(predict, 1)
	Orders.CastPosition(MyEnt, hook, predict, false)
	$.Schedule(schedDelay, () => {
		var retEnt = ent //CancelHook(MyEnt, hookDist, Corona.MyTick * 2, hookwidth, angleBetween)
		if(retEnt)
			$.Schedule(time - schedDelay - Corona.MyTick * 2, () => {
				var retEnt = ent //CancelHook(MyEnt, hookDist, Corona.MyTick * 2, hookwidth, angleBetween)
				if(retEnt)
					callback(retEnt, hookSpeed)
			})
		else
			Orders.EntStop(MyEnt, false)
	})
}

/*function IsOnTrajectory(MyEnt, distance, time, hookwidth, angleBetween) {
	var myVec = MyEnt.AbsOrigin,
		ents = Array.prototype.orderBy.call(EntityManager.Entities.filter(ent => MyEnt.IsEntityInRange(ent, distance + hookwidth)).filter(ent => {
			if(MyEnt === ent)
				return false

			var entVec = ent.VelocityWaypoint(time)

			for(let i = 0; i <= distance; i++)
				if(entVec.PointDistance(myVec.VectorRotation(angleBetween, -i)) <= hookwidth)
					return true

			return false
		}), ent => ent.RangeToUnit(MyEnt))

	return ents[0] && EntityManager.PlayersHeroEnts().indexOf(ents[0]) > -1 ? ents[0] : undefined
}

function CancelHook(MyEnt, hookDist, delay, hookwidth, angleBetween) {
	if(!IsOnTrajectory(MyEnt, hookDist, delay, hookwidth, angleBetween)) {
		Orders.EntStop(MyEnt, false)
		return true
	} else
		return false
}*/

function Etherial(MyEnt: Entity, ent: Entity, hookSpeed: number, second: boolean = false) {
	var etherial = MyEnt.ItemByName("item_ethereal_blade")
	if(!etherial)
		return
	var etherialRadius = etherial.CastRange,
		dist = MyEnt.RangeToUnit(ent)
	if(dist > etherialRadius) {
		if(second)
			return
		$.Schedule((dist - etherialRadius) / hookSpeed, () => Etherial(MyEnt, ent, hookSpeed, true))
		return
	}
	Orders.CastTarget(MyEnt, etherial, ent, false)
}

function Rot(MyEnt: Entity) {
	if(MyEnt.BuffsNames.indexOf("modifier_pudge_rot") === -1)
		Orders.ToggleAbil(MyEnt, MyEnt.AbilityByName("pudge_rot"), false)
}

function Urn(MyEnt: Entity, ent: Entity, hookSpeed: number, second?: boolean) {
	var urn = MyEnt.ItemByName(/item_(urn_of_shadows|spirit_vessel)/),
		urncharges = urn ? urn.CurrentCharges : -1

	if(!urn || urncharges < 0)
		return
	var urnRadius = urn.CastRange,
		dist = MyEnt.RangeToUnit(ent),
		delta = 50
	if(dist > urnRadius + delta) {
		if(second)
			return
		$.Schedule((dist - urnRadius + delta) / hookSpeed, () => Urn(MyEnt, ent, hookSpeed, true))
		return
	}
	Orders.CastTarget(MyEnt, urn, ent, false)
}

function Dismember(MyEnt: Entity, ent: Entity) {
	Orders.CastTarget(MyEnt, MyEnt.AbilityByName("pudge_dismember"), ent, false)
}

module = {
	name: "Pudge Combo",
	isVisible: false,
	onPreload: (): void => {
		if(Corona.Commands.PudgeCombo)
			return
	
		Corona.Commands.PudgeCombo = () => {
			var MyEnt = EntityManager.MyEnt,
				ent = Utils.NearestToMouse(MyEnt, 1000, true)
			if(ent === undefined)
				return
	
			Hook(MyEnt, ent, (retEnt, hookSpeed) => {
				Etherial(MyEnt, retEnt, hookSpeed)
				Urn(MyEnt, retEnt, hookSpeed)
				Rot(MyEnt)
				Dismember(MyEnt, retEnt)
			})
		}
	
		Game.AddCommand("__PudgeCombo", Corona.Commands.PudgeCombo, "", 0)
	}
}