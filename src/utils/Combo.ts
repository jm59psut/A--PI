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

enum EComboAction {
	NEARBY_ENEMY_CREEP = 1,
	NEARBY_ENEMY_SIEGE,
	NEARBY_ALLY_TOWER,
	NEARBY_ENEMY_TOWER,
	NEARBY_ENEMY,
	NEARBY_ALLY,
	CURSOR_ENEMY,
	CURSOR_ALLY,
	CURSOR_POS,
	SELF,
	NO_TARGET,
	TOGGLE
}

class Combo {
	abils: any[] = []
	vars: any = {} // available while combo are executing, clearing on end
	cursor_enemy: Entity = undefined
	cursor_ally: Entity = undefined
	cursor_pos: Vector = undefined
	
	/** @param {EComboAction} act */
	addAbility(abilName: string | RegExp, act: number | ((caster: Entity, target: Entity) => number), options: ComboOptions = {}, index?: number): void {
		var obj = [abilName, act, options]
		if(index !== undefined)
			this.abils.splice(index, 0, obj)
		else
			this.abils.push(obj)
	}

	addDelay(delay: number | ((caster: Entity, target: Entity) => number) = Corona.MyTick, options: ComboOptions = {}) { this.addAbility("delay", delay) }
	/** @param {EComboAction} act */
	addLinkenBreaker(act: number = EComboAction.CURSOR_ENEMY, options: ComboOptions = {}) { this.addAbility("linken_breaker", act) }
	/** @param {EComboAction} act */
	addMove(act: number = EComboAction.CURSOR_ENEMY, options: ComboOptions = {}) { this.addAbility("move", act) }
	
	removeAbility(abilName: string): void {
		var flag = true
		while(flag) {
			let abilAr = this.abils.filter(([abilName2]) => abilName === abilName2)
			if(flag = (abilAr.length > 0))
				delete abilAr[0]
		}
	}

	getNextAbility(caster: Entity, index: number): any {
		var [abilName, act, options] = this.abils[index]
		return [caster.NByName(abilName), abilName, act, options]
	}

	tech_names = [
		"linken_breaker",
		"move",
		"custom_cast"
	]
	execute(caster: Entity, callback?: Function, index: number = 0): void {
		var heroEnts = EntityManager.PlayersHeroEnts()
		if(index === 0) {
			this.cursor_pos = Utils.CursorWorldVec
			var cursor_enemy = this.cursor_pos.GetEntitiesInRange(1000, true, true).filter(ent => ent.UnitName === "npc_dota_roshan" || heroEnts.indexOf(ent) > -1),
				cursor_ally = this.cursor_pos.GetEntitiesInRange(1000, false, true).filter(ent => !ent.IsEnemy && heroEnts.indexOf(ent) > -1)
			this.cursor_ally = cursor_ally.length > 0 ? this.cursor_ally = cursor_ally[0] : undefined
			this.cursor_enemy = cursor_enemy.length > 0 ? this.cursor_enemy = cursor_enemy[0] : undefined
		}
		var [abil, abilName, act, options]: [Ability, string, number | Function, ComboOptions] = this.getNextAbility(caster, index),
			delay: number = options.combo_delay
				? options.combo_delay
				: abil
					? abil.CastPoint > 0
						? abil.CastPoint + Corona.MyTick
						: Corona.MyTick
					: 0
		
		if(options.castCondition !== undefined && !options.castCondition(abil, caster, target)){
			this.nextExecute(caster, callback, delay, index)
			return
		}
		if(abilName === "delay") {
			if(act instanceof Function) delay = act(caster, this.cursor_enemy)
			else delay = act
			if(delay === -1) $.Schedule(0, () => this.execute(caster, callback, index))
			else this.nextExecute(caster, callback, delay, index)
			return
		}

		if(!this.tech_names.some(name => abilName === name) && (abil === undefined || abil.Level === 0 || !abil.IsCooldownReady)) {
			this.nextExecute(caster, callback, delay, index)
			return
		}

		var CastRange = abil ? abil.CastRange > 0 ? abil.CastRange : 1500 : 0
		
		// target selection switch
		var target: Entity
		switch(act) {
			case EComboAction.NEARBY_ENEMY_CREEP:
				var creepsOnCursor = caster.AbsOrigin.GetEntitiesInRange(abil.CastRange, true, true).filter(ent => ent.IsCreep)
				if(creepsOnCursor.length === 0) {
					act = undefined
					break
				}
				target = creepsOnCursor[0]
				break
			case EComboAction.NEARBY_ENEMY_SIEGE:
				var sieges = EntityManager.GetAllEntitiesByClassname("npc_dota_creep_siege"),
					creepsOnCursor = caster.AbsOrigin.GetEntitiesInRange(abil.CastRange, true, true).filter(ent => sieges.indexOf(ent) > -1)
				if(creepsOnCursor.length === 0) {
					act = undefined
					break
				}
				target = creepsOnCursor[0]
				break
			case EComboAction.NEARBY_ALLY_TOWER:
				var nearbyAllyTowers = caster.AbsOrigin.GetEntitiesInRange(abil.CastRange, false, true).filter(ent => !ent.IsEnemy && ent.IsTower)
				if(nearbyAllyTowers.length === 0) {
					act = undefined
					break
				}
				target = nearbyAllyTowers[0]
				break
			case EComboAction.NEARBY_ENEMY_TOWER:
				var nearbyEnemyTowers = caster.AbsOrigin.GetEntitiesInRange(abil.CastRange, true, true).filter(ent => ent => ent.IsTower)
				if(nearbyEnemyTowers.length === 0) {
					act = undefined
					break
				}
				target = nearbyEnemyTowers[0]
				break
			case EComboAction.NEARBY_ALLY:
				var nearbyAllies = caster.AbsOrigin.GetEntitiesInRange(abil.CastRange, false, true).filter(ent => !ent.IsEnemy && heroEnts.indexOf(ent) > -1)
				if(nearbyAllies.length === 0) {
					act = undefined
					break
				}
				target = nearbyAllies[0]
				break
			case EComboAction.NEARBY_ENEMY:
				var nearbyEnemies = caster.AbsOrigin.GetEntitiesInRange(abil.CastRange, true, true).filter(ent => ent.UnitName === "npc_dota_roshan" || heroEnts.indexOf(ent) > -1)
				if(nearbyEnemies.length === 0) {
					act = undefined
					break
				}
				target = nearbyEnemies[0]
				break
			case EComboAction.CURSOR_ALLY:
				target = this.cursor_ally
				if(target === undefined) act = undefined
				break
			case EComboAction.CURSOR_ENEMY:
				target = this.cursor_enemy
				if(target === undefined) act = undefined
				break
			case EComboAction.CURSOR_POS:
			case EComboAction.SELF:
			case EComboAction.NO_TARGET:
			case EComboAction.TOGGLE:
			case undefined:
				break
			default:
				$.Msg("Combo", `Undefined act ${act}`)
				break
		}

		if(abilName === "linken_breaker") {
			if(target.HasLinkenAtTime() && [
				"item_force_staff",
				"item_hurricane_pike",
				"item_sheepstick",
				"item_heavens_halberd",
				"item_diffusal_blade",
				"item_abyssal_blade",
				"item_cyclone",
				/item_(urn_of_shadows|spirit_vessel)/,
				/item_(solar_crest|medallion_of_courage)/,
				/item_dagon/,
				/item_(bloodthorn|orchid)/
			].some(item_name => (abil = caster.ItemByName(item_name)) !== undefined)) {
				Orders.CastTarget(caster, abil, target, false)
				delay = options.combo_delay
					? options.combo_delay
					: abil
						? abil.CastPoint > 0
							? abil.CastPoint + Corona.MyTick
							: Corona.MyTick
						: 0
			}
		} else if(abilName === "move") {
			Orders.MoveToPos(caster, target.AbsOrigin, false)
			this.nextExecute(caster, callback, delay + (caster.RangeToUnit(target) / caster.Speed), index)
			return
		} else if(abilName === "custom_cast") {
			this.nextExecute(caster, callback, options.custom_cast(caster, target), index)
			return
		} else if(act !== undefined) {
			// cast switch
			switch(act) {
				case EComboAction.NEARBY_ENEMY_CREEP:
				case EComboAction.NEARBY_ENEMY_SIEGE:
				case EComboAction.NEARBY_ALLY_TOWER:
				case EComboAction.NEARBY_ENEMY_TOWER:
				case EComboAction.NEARBY_ALLY:
				case EComboAction.NEARBY_ENEMY:
				case EComboAction.CURSOR_ALLY:
				case EComboAction.CURSOR_ENEMY:
					if(Utils.IsFlagSet(abil.Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT))
						Orders.CastPosition (
							caster, abil,
							options.dynamicDelay
								? target.VelocityWaypoint(options.dynamicDelay(abil, caster, target))
								: target.AbsOrigin,
							false
						)
					else
						Orders.CastTarget(caster, abil, target, false)
					break
				case EComboAction.CURSOR_POS:
					Orders.CastPosition(caster, abil, this.cursor_pos, false)
					break
				case EComboAction.SELF:
					if(Utils.IsFlagSet(abil.Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT))
						Orders.CastPosition(caster, abil, caster.AbsOrigin, false)
					else
						Orders.CastTarget(caster, abil, caster, false)
					break
				case EComboAction.NO_TARGET:
					Orders.CastNoTarget(caster, abil, false)
					break
				case EComboAction.TOGGLE:
					Orders.ToggleAbil(caster, abil, false)
					break
			}
		}

		this.nextExecute(caster, callback, delay, index)
	}

	nextExecute(caster: Entity, callback: Function, delay: number, index: number): void {
		if(++index < this.abils.length) // increments variable and checks is index valid
			$.Schedule(delay, () => this.execute(caster, callback, index))
		else {
			this.vars = {}
			if(callback instanceof Function) callback()
		}
	}

	get abilsNames(): string[] { return this.abils.map(([abilName]) => abilName) }

	get length(): number { return this.abils.length }
}

module.exports = { Combo, EComboAction }