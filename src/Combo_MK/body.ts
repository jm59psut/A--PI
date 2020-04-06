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
	name: "Combo_MK",
	onPreload: (): void => {
		combo = new Combo()
		combo.addAbility("item_cyclone", EComboAction.CURSOR_ENEMY) // 2.5
		combo.addDelay(1.3 - Fusion.MyTick * 3) // ~1.2
		combo.addAbility("monkey_king_wukongs_command", EComboAction.CURSOR_ENEMY) // 1.2
		combo.addAbility("monkey_king_boundless_strike", EComboAction.CURSOR_ENEMY) // 0.4

		if(!Fusion.Commands.MKCombo) {
			Fusion.Commands.MKCombo = () => combo.execute(EntityManager.MyEnt)
	
			Game.AddCommand("__MKCombo", Fusion.Commands.MKCombo, "", 0)
		}
	},
	isVisible: false
}