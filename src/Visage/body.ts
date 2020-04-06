
var combo: Combo

module = {
	name: "Visage",
	onPreload: (): void => {
        combo = new Combo()
        combo.addAbility("item_lotus_orb", EComboAction.SELF)
		combo.addAbility("item_blade_mail", EComboAction.NO_TARGET)	
		combo.addAbility("item_mjollnir", EComboAction.SELF)
        combo.addAbility("item_blink", EComboAction.CURSOR_ENEMY)
        combo.addLinkenBreaker()
        combo.addAbility("item_shivas_guard", EComboAction.NO_TARGET)
        combo.addAbility("item_orchid", EComboAction.CURSOR_ENEMY)
        combo.addAbility("item_bloodthorn", EComboAction.CURSOR_ENEMY)
        combo.addAbility(/item_(bloodthorn|orchid)/, EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_dagon/, EComboAction.CURSOR_ENEMY)
        combo.addAbility("item_heavens_halberd", EComboAction.CURSOR_ENEMY)
        combo.addAbility(/item_(solar_crest|medallion_of_courage)/, EComboAction.CURSOR_ENEMY)
        combo.addAbility("item_rod_of_atos", EComboAction.CURSOR_ENEMY)
        combo.addAbility("item_clumsy_net", EComboAction.CURSOR_ENEMY)
        combo.addAbility("item_nullifier", EComboAction.CURSOR_ENEMY)
        combo.addAbility("visage_grave_chill",EComboAction.CURSOR_ENEMY)
        combo.addDelay((caster: Entity, target: Entity): number => {
        let VisageModifier = target.BuffByName("modifier_visage_soul_assumption")
        return VisageModifier.Duration - VisageModifier.ElapsedTime - caster.AbilityByName("visage_soul_assumption").CastPoint + Fusion.MyTick * /*1.*/0.83
    })
    combo.addAbility(/item_(urn_of_shadows|spirit_vessel)/, EComboAction.CURSOR_ENEMY)
        combo.addAbility("visage_soul_assumption",EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_armlet", EComboAction.TOGGLE)
		combo.addAbility("item_buckler", EComboAction.NO_TARGET)
		combo.addAbility("item_crimson_guard", EComboAction.NO_TARGET)
		combo.addAbility("item_black_king_bar", EComboAction.NO_TARGET)
		combo.addAbility("item_satanic", EComboAction.CURSOR_ENEMY)
		if(!Fusion.Commands.VisageCombo) {
			Fusion.Commands.VisageCombo = () => combo.execute(EntityManager.MyEnt)
			Game.AddCommand("__VisageCombo", Fusion.Commands.VisageCombo, "", 0)
		}
	},
	isVisible:false
}