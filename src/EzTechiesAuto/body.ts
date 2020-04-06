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

var NoTarget: number[] = [],
	EzTechiesAuto_config = { // do not edit this unless you know what you're doing!
		safe_mode: true,
		use_prediction: false
	},
	BlowDelay = 0.25

function CallMines(techies: Entity, ent: Entity, callback: Function, explosionCallback: Function): void {
	var TargetHP = ent.HealthAfter(EzTechies.blowDelay),
		RMinesToBlow = [],
		RMinesDmg = 0

	EzTechies.RMines.filter(([rmine]) => callback(techies, ent, rmine)).every(([rmine, dmg]) => {
		RMinesToBlow.push(rmine)
		RMinesDmg += dmg
		var theres = ent.CalculateDamage(RMinesDmg, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
		if(TargetHP < theres) {
			if(Fusion.debug)
				$.Msg("EzTechiesAuto", `There's ${theres}, needed ${TargetHP} for ${ent.UnitName}`)
			explosionCallback(techies, ent, RMinesToBlow, RMinesDmg)
			return false
		} else return !TryDagon(techies, ent, RMinesDmg, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
	})
}

/**
 * Tries dagon
 * @param techies entity that'll output damage
 * @param ent entity that'll receive damage
 * @param damage damage that we already have
 * @param damage_type damage type that we already have
 * @returns used dagon or not
 */
function TryDagon(techies: Entity, ent: Entity, damage: number = 0, damage_type: number = DAMAGE_TYPES.DAMAGE_TYPE_NONE): boolean {
	var Dagon = techies.ItemByName(/item_dagon/),
		TargetHP = ent.HealthAfter(EzTechies.blowDelay)
	if(Dagon)
		if(Dagon.CooldownTimeRemaining === 0 && TargetHP < ent.CalculateDamage(Dagon.SpecialValueFor("damage"), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) + ent.CalculateDamage(damage, damage_type) && techies.IsEntityInRange(ent, Dagon.CastRange)) {
			Orders.CastTarget(techies, Dagon, ent, false)
			return true
		}

	return false
}

function DenyMines(): void {
	EzTechies.RMines.forEach(([rmine]) => {
		if(rmine.HealthPercent === 100)
			return
		if(!rmine.IsAlive) {
			EzTechies.RemoveRMine(rmine)
			return
		}
		Orders.CastNoTarget(rmine, rmine.AbilityByName("techies_remote_mines_self_detonate"), false)
	})
}

function NeedToTriggerMine(rmine: Entity, ent: Entity, forcestaff: boolean = false): boolean {
	var TriggerRadius = EzTechies.TriggerRadius
	if(EzTechiesAuto_config.safe_mode)
		TriggerRadius -= ent.Speed * (EzTechies.blowDelay / 30)
	
	return EzTechiesAuto_config.use_prediction
		? ent.InFront((ent.Speed_IsMoving * BlowDelay) + (forcestaff ? Fusion.ForceStaffUnits : 0)).PointDistance(rmine.AbsOrigin) <= TriggerRadius
		: forcestaff
			? rmine.AbsOrigin.PointDistance(ent.ForceStaffPos) <= TriggerRadius
			: rmine.IsEntityInRange(ent, TriggerRadius)
}

function RemoteMines(techies: Entity, HEnts: Entity[]): void {
	if(techies.AbilityByName("techies_remote_mines").Level === 0 || EzTechies.RMines.length === 0)
		return
	HEnts.filter(ent =>
		ent.MagicMultiplier !== 0
		&& NoTarget.indexOf(ent.id) < 0
	).forEach(ent => {
		var callbackCalled = false
		CallMines (
			techies, ent,
			(techies, ent, rmine) => NeedToTriggerMine(rmine, ent),
			(techies, ent, RMinesToBlow) => {
				callbackCalled = true
				RMinesToBlow.forEach(rmine => Orders.CastNoTarget(rmine, rmine.AbilityByName("techies_remote_mines_self_detonate"), false))
				NoTarget.push(ent.id)
				$.Schedule(EzTechies.blowDelay / 30, () => NoTarget.remove(ent.id))
			}
		)

		var force = techies.ItemByName("item_force_staff")
		if (
			!callbackCalled && force !== undefined && techies.IsAlive && force.CooldownTimeRemaining === 0
			&& techies.IsEntityInRange(ent, force.CastRange)
		)
			CallMines (
				techies, ent,
				(techies, ent, rmine) => NeedToTriggerMine(rmine, ent, true),
				(techies, ent) => Orders.CastTarget(techies, force, ent, false)
			)
	})
}

function EzTechiesF(): void {
	const techies = EzTechies.Techies
	if(techies === undefined || techies.IsEnemy) {
		Fusion.OnTick.remove(EzTechiesF)
		Utils.ScriptLogMsg("[EzTechiesAuto] Isn't techies, also don't have one in team", "#ff0000")
		return
	}
	var HEnts = Array.prototype.orderBy.call(EntityManager.PlayersHeroEnts().filter(ent => ent.IsAlive && ent.IsEnemy), ent => ent.Health)

	RemoteMines(techies, HEnts)
	DenyMines()
}

module = {
	name: "EzTechiesAuto",
	onPreload: () => Fusion.GetConfig("EzTechiesAuto").then(config => EzTechiesAuto_config = config),
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.OnTick.push(EzTechiesF)
			Utils.ScriptLogMsg("Script enabled: EzTechiesAuto", "#00ff00")
		} else {
			Fusion.OnTick.remove(EzTechiesF)
			Utils.ScriptLogMsg("Script disabled: EzTechiesAuto", "#ff0000")
		}
	},
	onDestroy: () => Fusion.OnTick.remove(EzTechiesF)
}