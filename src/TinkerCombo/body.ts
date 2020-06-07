var combo: Combo
module = {
	name: "Combo_Tinker",
	onPreload: (): void => {
		combo = new Combo()
	
		combo.addAbility("tinker_rearm",EComboAction.NO_TARGET)
        combo.addAbility("item_soul_ring", EComboAction.NO_TARGET)
        combo.addAbility("item_blink", EComboAction.CURSOR_ENEMY)
        combo.addAbility("item_sheepstick", EComboAction.CURSOR_ENEMY) 
        combo.addAbility("item_ethereal_blade", EComboAction.CURSOR_ENEMY)
	    combo.addAbility(/item_dagon/, EComboAction.CURSOR_ENEMY)
        combo.addAbility("tinker_heat_seeking_missile", EComboAction.NO_TARGET)
		combo.addAbility("tinker_laser", EComboAction.CURSOR_ENEMY)
	
    
		if(!Corona.Commands.TinkerCombo) {
			Corona.Commands.TinkerCombo = () => combo.execute(EntityManager.MyEnt)
			Game.AddCommand("__ComboTinker", Corona.Commands.TinkerCombo, "", 0)
		}
	},
	isVisible: false
}
