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

module = {
	name: "Combo_LC",
	onPreload: (): void => {
		combo = new Combo()
		combo.addAbility("item_armlet", EComboAction.TOGGLE)
		combo.addAbility("item_buckler", EComboAction.NO_TARGET)
		combo.addAbility("item_crimson_guard", EComboAction.NO_TARGET)
		combo.addAbility("item_black_king_bar", EComboAction.NO_TARGET)
		combo.addAbility("item_lotus_orb", EComboAction.SELF)
		combo.addAbility("item_mjollnir", EComboAction.SELF)
		combo.addAbility("legion_commander_press_the_attack", EComboAction.SELF)
		combo.addAbility("item_blade_mail", EComboAction.NO_TARGET)
		combo.addAbility("item_blink", EComboAction.CURSOR_ENEMY)
		combo.addLinkenBreaker()
		combo.addAbility(/item_(solar_crest|medallion_of_courage)/, EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_(bloodthorn|orchid)/, EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_dagon/, EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_(urn_of_shadows|spirit_vessel)/, EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_shivas_guard", EComboAction.NO_TARGET)
		combo.addAbility("item_satanic", EComboAction.CURSOR_ENEMY)
		combo.addAbility("legion_commander_duel", EComboAction.CURSOR_ENEMY)


		if(!Corona.Commands.LCCombo) {
			Corona.Commands.LCCombo = () => combo.execute(EntityManager.MyEnt)
			Game.AddCommand("__LCCombo", Corona.Commands.LCCombo, "", 0)
		}
	},
	isVisible: false
}