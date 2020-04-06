/* function Destroy(): void {
	if(Fusion.Panels.AbilityRange2)
		Fusion.Panels.AbilityRange2.DeleteAsync(0)
	if(Fusion.Subscribes.AbilityRange2)
		Fusion.Subscribes.AbilityRange2.forEach(sub => GameEvents.Unsubscribe(sub)) // Optimize this line by native
	if(Fusion.Particles.AbilityRange2)
		Fusion.Particles.AbilityRange2.forEach(par => ParticleManager.DestroyParticleEffect(par, true))
	Fusion.Subscribes.AbilityRange2 = []
	Fusion.Particles.AbilityRange2 = new Map()
	delete Fusion.Panels.AbilityRange2
}

function onPreloadFAbility(): void {
	if(Fusion.Commands.AbilityRange2_Rotate)
		return
	Fusion.Commands.AbilityRange2_Rotate = () => {
		if(!Fusion.Configs.AbilityRange2) {
			$.Msg("AbilityRange2_Rotate", "Just... config aren't initialized.")
			return
		}
		var panel = Fusion.Panels.AbilityRange2
		Fusion.Configs.AbilityRange2.flow = panel.style.flowChildren = (panel.style.flowChildren === "right" ? "down"  : "right")
		Fusion.SaveConfig("AbilityRange2", Fusion.Configs.AbilityRange2)
	}

	Game.AddCommand("__AbilityRange2_Rotate", Fusion.Commands.AbilityRange2_Rotate, "", 0)
	Game.AddCommand("__TogglePanel_AbilityRange2", () => Fusion.Panels.AbilityRange2.visible = !Fusion.Panels.AbilityRange2.visible, "",0)
	Destroy()
}

function SkillLearned(data: any): void {
	var MyEnt = EntityManager.MyEnt,
		LearnedAbil = MyEnt.AbilityByName(data.abilityname)
	if (!LearnedAbil || data.abilityname === "attribute_bonus")
		return
	if(!Fusion.Panels.AbilityRange2.Children().some(panel => {
		var abil = panel.GetAttributeInt("Skill", 0)
		if(abil === LearnedAbil) {
			if(panel.checked) {
				ParticleManager.DestroyParticleEffect(Fusion.Particles.AbilityRange2.get(abil), true)
				var par = ParticleManager.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, MyEnt)
				ParticleManager.SetParticleControl(par, 1, [abil.CastRange, 0, 0])
				Fusion.Particles.AbilityRange2.set(abil, par)
			}
			return true
		}
		return false
	}))
		CreatePanel(LearnedAbil)
}


function chkboxpressed(panel: Panel): void {
	var MyEnt = EntityManager.MyEnt,
		abil = <Ability> EntityManager.EntityByID(panel.GetAttributeInt("Skill", 0))

	Utils.InstallStyle(panel.Children()[0], `border: ${panel.checked ? "10px solid blue" : 0}; box-shadow: ${panel.checked ? "0 0 10"  : "0 0 0"}px blue`)
	if(panel.checked) {
		var par = ParticleManager.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, MyEnt)
		ParticleManager.SetParticleControl(par, 1, [abil.CastRange, 0, 0])
		Fusion.Particles.AbilityRange2.set(abil, par)
	} else {
		ParticleManager.DestroyParticleEffect(Fusion.Particles.AbilityRange2.get(abil), true)
		Fusion.Particles.AbilityRange2.delete(abil)
	}
}

function CreatePanel(abil: Ability): void {
	if (!abil || abil.AbilityName === "attribute_bonus" || abil.CastRange <= 0)
		return
	var panel = $.CreatePanel("ToggleButton", Fusion.Panels.AbilityRange2, "AbilityRange2Skill")
	panel.BLoadLayoutFromString(`<root>\
	<styles>\
		<include src='s2r://panorama/styles/dotastyles.vcss_c'/>\
	</styles>\
	<Panel>\
		<DOTA${abil instanceof Item ? "Item" : "Ability"}Image style='width: 30px; margin: 0px 5px 5px 10px; border-radius : 15px;'/>\
	</Panel>\
</root>`, false, false)
	panel.Children()[0].abilityname = abil.AbilityName
	panel.SetAttributeInt("Skill", abil.id)
	panel.SetPanelEvent("onactivate", () => chkboxpressed(panel))
}

function onToggleF(checkbox: Panel): void {
	if (checkbox.checked) {
		var MyEnt = EntityManager.MyEnt
		Fusion.Panels.AbilityRange2 = $.CreatePanel("Panel", Fusion.Panels.Main, "AbilityRange2Panel")
		Fusion.Panels.AbilityRange2.BLoadLayoutFromString("<root>\
	<Panel class='AbilityRange2Panel' style='flow-children: down; background-color: #00000099; border-radius: 15px; padding: 10px 5px 5px 0px;'>\
	</Panel>\
</root>", false, false)
		Utils.MovePanel(Fusion.Panels.AbilityRange2, p => {
			var position = p.style.position.split(" ")
			Fusion.Configs.AbilityRange2.position = position
			Fusion.SaveConfig("AbilityRange2", Fusion.Configs.AbilityRange2)
		})
		Fusion.GetConfig("AbilityRange2").then(config => {
			Fusion.Configs.AbilityRange2 = config
			Fusion.Panels.AbilityRange2.style.position = `${config.position}`
			Fusion.Panels.AbilityRange2.style.flowChildren = config.flow
		})
		MyEnt.Abilities.forEach(CreatePanel)
		Fusion.Subscribes.AbilityRange2.learned_ability = GameEvents.Subscribe("dota_player_learned_ability", SkillLearned)
		//Fusion.Subscribes.AbilityRange2.inventory_changed = GameEvents.Subscribe("dota_inventory_changed", InventoryChanged) // just informs about inventory change, not about item.
		Utils.ScriptLogMsg("Script enabled: AbilityRange2", "#00ff00")
	} else {
		Destroy()
		Utils.ScriptLogMsg("Script disabled: AbilityRange2", "#ff0000")
	}
}
module = {
    name: "Ability Range 2",
    onPreload: onPreloadFAbility,
    onToggle:onToggleF,
    onDestroy: Destroy
	/* 	if (checkbox.checked) {
            CreatePanel
            Fusion.OnTick.push(chkboxpressed)
			Utils.ScriptLogMsg("Script enabled: AbilityRange2", "#00ff00")
		} else {
            Fusion.OnTick.remove(chkboxpressed)
			Utils.ScriptLogMsg("Script disabled: AbilityRange2", "#ff0000")
		} */
	/* }, */