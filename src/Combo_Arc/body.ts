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

function GetRealArcWardens(): Entity[] {
	return EntityManager.Entities.filter(ent =>
		!ent.IsEnemy
		&& ent.IsAlive
		&& ent.IsRealHero
		&& ent.AbilityByName("arc_warden_tempest_double") !== undefined
	)
}

module = {
	name: "Combo_Arc",
	onPreload: (): void => {
		combo = new Combo()
		combo.addAbility("item_hand_of_midas", EComboAction.NEARBY_ENEMY_SIEGE)
		combo.addAbility("item_hand_of_midas", EComboAction.NEARBY_ENEMY_CREEP)
		combo.addAbility("item_ethereal_blade", EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_soul_ring", EComboAction.NO_TARGET)
		combo.addAbility("item_arcane_boots", EComboAction.NO_TARGET)
		combo.addAbility("item_guardian_greaves", EComboAction.NO_TARGET)
		combo.addAbility("item_shivas_guard", EComboAction.NO_TARGET)
		combo.addAbility("item_blade_mail", EComboAction.NO_TARGET)
		combo.addAbility(/item_(orchid|bloodthorn)/, EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_dagon/, EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_(solar_crest|medallion_of_courage)/, EComboAction.CURSOR_ENEMY)
		combo.addAbility("arc_warden_magnetic_field", EComboAction.SELF)
		combo.addAbility(/item_necronomicon/, EComboAction.NO_TARGET)
		combo.addAbility("item_mjollnir", EComboAction.SELF)
		combo.addAbility("item_nullifier", EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_heavens_halberd", EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_diffusal_blade", EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_sheepstick", EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_(urn_of_shadows|spirit_vessel)/, EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_manta", EComboAction.NO_TARGET)
		combo.addDelay()
		combo.addAbility("item_ancient_janggo", EComboAction.NO_TARGET)
		combo.addAbility("arc_warden_spark_wraith", EComboAction.CURSOR_ENEMY, { dynamicDelay: abil => abil.SpecialValueFor("activation_delay") })
		combo.addAbility("arc_warden_flux", EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_mask_of_madness", EComboAction.NO_TARGET)
		combo.addAbility("item_hurricane_pike", EComboAction.CURSOR_ENEMY)

		if(!Corona.Commands.ArcCombo) {
			Corona.Commands.ArcCombo = () => {
				const MyEnt = EntityManager.MyEnt
	
				const tempest_double = MyEnt.AbilityByName("arc_warden_tempest_double")
				var ready = tempest_double.IsCooldownReady
				if(ready) Orders.CastNoTarget(MyEnt, tempest_double, false)
				$.Schedule(ready ? tempest_double.CastPoint + Corona.MyTick : 0, () => {
					GetRealArcWardens().forEach(arc => combo.execute(arc))
				})
			}
	
			Game.AddCommand("__ArcCombo", Corona.Commands.ArcCombo, "", 0)
		}
	},
	isVisible: false
}