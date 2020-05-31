
var combo: Combo

module = {
	name: "Combo_Enigma",
	onPreload: (): void => {
		combo = new Combo()
		combo.addAbility("item_armlet", EComboAction.TOGGLE)
		combo.addAbility("item_buckler", EComboAction.NO_TARGET)
		combo.addAbility("item_crimson_guard", EComboAction.NO_TARGET)
		combo.addAbility("item_black_king_bar", EComboAction.NO_TARGET)
		combo.addAbility("item_lotus_orb", EComboAction.SELF)
		combo.addAbility("item_mjollnir", EComboAction.SELF)
		combo.addAbility("item_blade_mail", EComboAction.NO_TARGET)
		combo.addAbility("item_blink", EComboAction.CURSOR_ENEMY)
		combo.addLinkenBreaker()
		combo.addAbility(/item_(solar_crest|medallion_of_courage)/, EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_(bloodthorn|orchid)/, EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_dagon/, EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_(urn_of_shadows|spirit_vessel)/, EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_shivas_guard", EComboAction.NO_TARGET)
		combo.addAbility("item_satanic", EComboAction.CURSOR_ENEMY)
		combo.addAbility("enigma_black_hole", EComboAction.CURSOR_POS)
		Utils.ScriptLogMsg("Black Hole Script IN ACTION")


		if(!Corona.Commands.EngimaCombo) {
			Corona.Commands.EngimaCombo = () => combo.execute(EntityManager.MyEnt)
			Game.AddCommand("__ComboEnigma", Corona.Commands.EngimaCombo, "", 0)
		}
	},
	isVisible: false
}