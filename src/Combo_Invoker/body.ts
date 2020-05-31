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

var combo: Combo

function Invoke(abil_name: string) {
	combo.addDelay((caster: Entity) => caster.AbilityByName("invoker_invoke").CooldownTimeRemaining + Corona.MyTick, {
		castCondition: (abil: Ability, caster: Entity, ent: Entity): boolean => caster.AbilityByName(abil_name).IsHidden
	})
	combo.addAbility("invoker_invoke", EComboAction.NO_TARGET, {
		castCondition: (abil: Ability, caster: Entity, ent: Entity): boolean => caster.AbilityByName(abil_name).IsHidden
	})
}

// TODO: add support to not cast excessive spheres
function PrepareSpheres(str: String, abil_name?: string) {
	for(let i of str)
		switch(i) {
			case 'q':
			case 'Q':
				combo.addAbility("invoker_quas", EComboAction.NO_TARGET, {
					castCondition: (abil: Ability, caster: Entity, ent: Entity): boolean => abil_name === undefined || caster.AbilityByName(abil_name).IsHidden
				})
				break
			case 'w':
			case 'W':
				combo.addAbility("invoker_wex", EComboAction.NO_TARGET, {
					castCondition: (abil: Ability, caster: Entity, ent: Entity): boolean => abil_name === undefined || caster.AbilityByName(abil_name).IsHidden
				})
				break
			case 'e':
			case 'E':
				combo.addAbility("invoker_exort", EComboAction.NO_TARGET, {
					castCondition: (abil: Ability, caster: Entity, ent: Entity): boolean => abil_name === undefined || caster.AbilityByName(abil_name).IsHidden
				})
				break
		}
}

function onPreloadF_Combo_Invoker(): void {
	combo = new Combo()
	PrepareSpheres("eee", "invoker_sun_strike")
	Invoke("invoker_sun_strike")
	PrepareSpheres("eew", "invoker_chaos_meteor")
	Invoke("invoker_chaos_meteor")
	PrepareSpheres("qwe", "invoker_deafening_blast")
	combo.addAbility("item_veil_of_discord", EComboAction.CURSOR_ENEMY)
	combo.addAbility("item_cyclone", EComboAction.CURSOR_ENEMY)
	combo.addDelay(Corona.MyTick)
	combo.addDelay((caster: Entity, target: Entity): number => {
		let eul_buff = target.BuffByName("modifier_eul_cyclone")
		if(eul_buff === undefined) return -1
		return eul_buff.Duration - eul_buff.ElapsedTime - caster.AbilityByName("invoker_sun_strike").SpecialValueFor("delay")
	})
	combo.addAbility("invoker_sun_strike", EComboAction.CURSOR_ENEMY)
	combo.addDelay((caster: Entity, target: Entity) => {
		let eul_buff = target.BuffByName("modifier_eul_cyclone")
		if(eul_buff === undefined) return -1
		return eul_buff.Duration - eul_buff.ElapsedTime - caster.AbilityByName("invoker_chaos_meteor").SpecialValueFor("land_time") + Corona.MyTick
	}) 
	combo.addAbility("custom_cast", EComboAction.CURSOR_ENEMY, {
		custom_cast: (caster: Entity, target: Entity) => {
			let meteor = caster.AbilityByName("invoker_chaos_meteor"),
				dist = caster.RangeToUnit(target),
				pos = target.AbsOrigin.ExtendVector(caster.AbsOrigin, Math.min(dist - 1, meteor.SpecialValueFor("area_of_effect")))
			combo.vars["meteor_cast_position"] = pos
			Orders.CastPosition(caster, meteor, pos, false)
			return meteor.CastPoint + Corona.MyTick
		}
	})
	Invoke("invoker_deafening_blast")
	PrepareSpheres("qqq", "invoker_cold_snap")
	combo.addDelay((caster: Entity, target: Entity) => {
		let eul_buff = target.BuffByName("modifier_eul_cyclone")
		if(eul_buff === undefined) return -1
		let travel_time = caster.RangeToUnit(target) / caster.AbilityByName("invoker_deafening_blast").SpecialValueFor("travel_speed")
		return eul_buff.Duration - eul_buff.ElapsedTime - travel_time + Corona.MyTick * 2
	})
	combo.addAbility("invoker_deafening_blast", EComboAction.CURSOR_ENEMY)
	combo.addAbility(/item_(orchid|bloodthorn)/, EComboAction.CURSOR_ENEMY)
	combo.addAbility("item_ethereal_blade", EComboAction.CURSOR_ENEMY)
	combo.addAbility(/item_dagon/, EComboAction.CURSOR_ENEMY)
	combo.addAbility(/item_(urn_of_shadows|spirit_vessel)/, EComboAction.CURSOR_ENEMY)
	/*Invoke("invoker_cold_snap")
	PrepareSpheres("eeq", "invoker_forge_spirit")
	combo.addAbility("invoker_cold_snap", EComboAction.CURSOR_ENEMY)
	Invoke("invoker_forge_spirit")
	PrepareSpheres("wwe", "invoker_alacrity")
	combo.addAbility("invoker_forge_spirit", EComboAction.NO_TARGET)
	Invoke("invoker_alacrity")
	PrepareSpheres("eee") // just for damage
	combo.addAbility("invoker_alacrity", EComboAction.SELF)*/
	
	if(!Corona.Commands.InvokerCombo) {
		Corona.Commands.InvokerCombo = () => combo.execute(EntityManager.MyEnt)

		Game.AddCommand("__InvokerCombo", Corona.Commands.InvokerCombo, "", 0)
	}

	if(!Corona.Commands.InvokerCombo_AbilsNames) {
		Corona.Commands.InvokerCombo_AbilsNames = () => combo.abilsNames.forEach(abilName => $.Msg("InvokerCombo", abilName))

		Game.AddCommand("__InvokerCombo_AbilsNames", Corona.Commands.InvokerCombo_AbilsNames, "", 0)
	}
}

module = {
	name: "Combo_Invoker",
	onPreload: onPreloadF_Combo_Invoker,
	isVisible: false
}