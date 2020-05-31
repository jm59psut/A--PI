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

// copypasta from https://github.com/IdcNoob/Ensage/blob/master/CreepsBlocker/ and https://github.com/IdcNoob/Ensage/blob/master/BodyBlocker/
// idea (c) 414r7 2017
var HeroBlock_flag:         number  = 0,
	HeroBlock_sensitivity:  number  = 150, /* 100-200 */
	CreepBlock_sensitivity: number  = 550 /* 500-700 */

function CreepBlockF(): void {
	var MyEnt = EntityManager.MyEnt
	if(!MyEnt.IsAlive || Game.IsGamePaused())
		return
	var creeps = EntityManager.LaneCreeps.filter(creep => creep.IsAlive && !creep.IsEnemy && MyEnt.IsEntityInRange(creep, 500))
	if(creeps.length <= 0)
		return
	var creepsMovePositionSum = creeps.map(creep => creep.InFront(300)).reduce((sum, vec) => sum ? new Vector(sum.x + vec.x, sum.z + vec.z, sum.y + vec.y) : vec),
		creepsMovePosition = new Vector(creepsMovePositionSum.x / creeps.length, creepsMovePositionSum.z / creeps.length, creepsMovePositionSum.y / creeps.length),
		tower = EntityManager.BuildingEntities.filter(building => building.IsTower && building.IsAlive && MyEnt.IsEntityInRange(building, 120))
	if(tower.length > 0 && tower[0].UnitName === "npc_dota_badguys_tower2_mid") {
		Orders.MoveToPos(MyEnt, creepsMovePosition, false)
		return
	}
	var flag = true
	Array.prototype.orderBy.call(creeps, creep => creep.RangeToUnit(MyEnt)).every(creep => {
		if (!creep.IsMoving && !creep.IsEntityInRange(MyEnt, 50))
			return true
		var creepDistance = creepsMovePosition.PointDistance(creep.AbsOrigin) + 50,
			heroDistance = creepsMovePosition.PointDistance(MyEnt.AbsOrigin),
			creepAngle = creep.FindRotationAngle(MyEnt.AbsOrigin)
		if(creepDistance < heroDistance && creepAngle > 2 || creepAngle > 2.5)
			return true
		var moveDistance = CreepBlock_sensitivity / MyEnt.Speed * 100
		if (MyEnt.Speed - creep.Speed > 50)
			moveDistance -= (MyEnt.Speed - creep.Speed) / 2
		var movePosition = creep.InFront(Math.max(moveDistance, moveDistance * creepAngle))
		if(movePosition.PointDistance(creepsMovePosition) - 50 > heroDistance)
			return true
		if(creepAngle < 0.2 && MyEnt.IsMoving)
			return true

		Orders.MoveToPos(MyEnt, movePosition, false)
		flag = false
		return false
	})
	if(!flag)
		return
	if(MyEnt.IsMoving)
		Orders.EntStop(MyEnt, false)
	else if (MyEnt.FindRotationAngle(creepsMovePosition) > 1.5)
		Orders.MoveToPos(MyEnt, MyEnt.AbsOrigin.ExtendVector(creepsMovePosition, 10), false)
}

function HeroBlockF(): void {
	var MyEnt = EntityManager.MyEnt
	if(!MyEnt.IsAlive || Game.IsGamePaused())
		return
	var blockTarget = Utils.NearestToMouse(MyEnt, 1000, HeroBlock_flag !== 1)
	if(!blockTarget)
		return
	var angle = blockTarget.FindRotationAngle(MyEnt.AbsOrigin)
	if(angle > 1.3) {
		var delta = angle * 0.6,
			position = blockTarget.AbsOrigin,
			myPosition = MyEnt.AbsOrigin,
			side1 = position.VectorRotation(blockTarget.Vector3FromPolarAngle(delta), Math.max(HeroBlock_sensitivity, 150)),
			side2 = position.VectorRotation(blockTarget.Vector3FromPolarAngle(-delta), Math.max(HeroBlock_sensitivity, 150))

		Orders.MoveToPos(MyEnt, side1.PointDistance(myPosition) < side2.PointDistance(myPosition) ? side1 : side2, false)
	} else if(blockTarget.IsMoving && angle < 0.3 && MyEnt.IsMoving)
		Orders.EntStop(MyEnt, false)
	else
		Orders.MoveToPos(MyEnt, blockTarget.InFront(HeroBlock_sensitivity), false)
}

module = {
	name: "Body Blocker",
	isVisible: false,
	onPreload: (): void => {
		if(!Corona.Commands.CreepBlock) {
			Corona.Commands.CreepBlock = true // flag. don't touch.
			Game.AddCommand("+__CreepBlock", () => Corona.OnTick.push(CreepBlockF), "", 0)
			Game.AddCommand("-__CreepBlock", () => Corona.OnTick.remove(CreepBlockF), "", 0)
	
			Game.AddCommand("__CreepBlock", () => {
				if(Corona.OnTick.indexOf(CreepBlockF) === -1)
					Corona.OnTick.push(CreepBlockF)
				else
					Corona.OnTick.remove(CreepBlockF)
			}, "", 0)
		}
		if(!Corona.Commands.HeroBlock) {
			Corona.Commands.HeroBlock = true // flag. don't touch.
			Game.AddCommand("+__HeroBlock", (name, arg) => { // arg = 0 => block only enemies, and vice versa
				HeroBlock_flag = parseInt(arg)
				Corona.OnTick.push(HeroBlockF)
			}, "", 0)
			Game.AddCommand("-__HeroBlock", () => Corona.OnTick.remove(HeroBlockF), "", 0)
	
			Game.AddCommand("__HeroBlock", (name, arg) => {
				HeroBlock_flag = parseInt(arg)
				if(Corona.OnTick.indexOf(HeroBlockF) === -1)
					Corona.OnTick.push(HeroBlockF)
				else
					Corona.OnTick.remove(HeroBlockF)
			}, "", 0)
		}
	},
	onDestroy: () => {
		Corona.OnTick.remove(CreepBlockF)
		Corona.OnTick.remove(HeroBlockF)
	}
}