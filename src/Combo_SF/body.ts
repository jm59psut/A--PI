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

var combo: Combo

module = {
	name: "Combo_SF",
	onPreload: (): void => {
		combo = new Combo()
		combo.addAbility("item_black_king_bar", EComboAction.NO_TARGET)
		combo.addAbility("item_blink", EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_ethereal_blade", EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_cyclone", EComboAction.CURSOR_ENEMY) // 2.5
		combo.addAbility(/item_invis_sword|item_silver_edge/, EComboAction.NO_TARGET)
		combo.addMove()
		combo.addDelay(Fusion.MyTick)
		combo.addDelay((caster: Entity, target: Entity): number => {
			let eul_buff = target.BuffByName("modifier_eul_cyclone")
			return eul_buff.Duration - eul_buff.ElapsedTime - caster.AbilityByName("nevermore_requiem").CastPoint + Fusion.MyTick * /*1.*/0.83
		})
		combo.addAbility("nevermore_requiem", EComboAction.NO_TARGET)

		if(!Fusion.Commands.SFCombo) {
			Fusion.Commands.SFCombo = () => combo.execute(EntityManager.MyEnt)
	
			Game.AddCommand("__SFCombo", Fusion.Commands.SFCombo, "", 0)
		}
	},
	isVisible: false
}