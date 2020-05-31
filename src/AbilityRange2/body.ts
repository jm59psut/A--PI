/* function Destroy(): void {
	if(Corona.Panels.AbilityRange2)
		Corona.Panels.AbilityRange2.DeleteAsync(0)
	if(Corona.Subscribes.AbilityRange2)
		Corona.Subscribes.AbilityRange2.forEach(sub => GameEvents.Unsubscribe(sub)) // Optimize this line by native
	if(Corona.Particles.AbilityRange2)
		Corona.Particles.AbilityRange2.forEach(par => ParticleManager.DestroyParticleEffect(par, true))
	Corona.Subscribes.AbilityRange2 = []
	Corona.Particles.AbilityRange2 = new Map()
	delete Corona.Panels.AbilityRange2
}

function onPreloadFAbility(): void {
	if(Corona.Commands.AbilityRange2_Rotate)
		return
	Corona.Commands.AbilityRange2_Rotate = () => {
		if(!Corona.Configs.AbilityRange2) {
			$.Msg("AbilityRange2_Rotate", "Just... config aren't initialized.")
			return
		}
		var panel = Corona.Panels.AbilityRange2
		Corona.Configs.AbilityRange2.flow = panel.style.flowChildren = (panel.style.flowChildren === "right" ? "down"  : "right")
		Corona.SaveConfig("AbilityRange2", Corona.Configs.AbilityRange2)
	}

	Game.AddCommand("__AbilityRange2_Rotate", Corona.Commands.AbilityRange2_Rotate, "", 0)
	Game.AddCommand("__TogglePanel_AbilityRange2", () => Corona.Panels.AbilityRange2.visible = !Corona.Panels.AbilityRange2.visible, "",0)
	Destroy()
}

function SkillLearned(data: any): void {
	var MyEnt = EntityManager.MyEnt,
		LearnedAbil = MyEnt.AbilityByName(data.abilityname)
	if (!LearnedAbil || data.abilityname === "attribute_bonus")
		return
	if(!Corona.Panels.AbilityRange2.Children().some(panel => {
		var abil = panel.GetAttributeInt("Skill", 0)
		if(abil === LearnedAbil) {
			if(panel.checked) {
				ParticleManager.DestroyParticleEffect(Corona.Particles.AbilityRange2.get(abil), true)
				var par = ParticleManager.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, MyEnt)
				ParticleManager.SetParticleControl(par, 1, [abil.CastRange, 0, 0])
				Corona.Particles.AbilityRange2.set(abil, par)
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
		Corona.Particles.AbilityRange2.set(abil, par)
	} else {
		ParticleManager.DestroyParticleEffect(Corona.Particles.AbilityRange2.get(abil), true)
		Corona.Particles.AbilityRange2.delete(abil)
	}
}

function CreatePanel(abil: Ability): void {
	if (!abil || abil.AbilityName === "attribute_bonus" || abil.CastRange <= 0)
		return
	var panel = $.CreatePanel("ToggleButton", Corona.Panels.AbilityRange2, "AbilityRange2Skill")
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
		Corona.Panels.AbilityRange2 = $.CreatePanel("Panel", Corona.Panels.Main, "AbilityRange2Panel")
		Corona.Panels.AbilityRange2.BLoadLayoutFromString("<root>\
	<Panel class='AbilityRange2Panel' style='flow-children: down; background-color: #00000099; border-radius: 15px; padding: 10px 5px 5px 0px;'>\
	</Panel>\
</root>", false, false)
		Utils.MovePanel(Corona.Panels.AbilityRange2, p => {
			var position = p.style.position.split(" ")
			Corona.Configs.AbilityRange2.position = position
			Corona.SaveConfig("AbilityRange2", Corona.Configs.AbilityRange2)
		})
		Corona.GetConfig("AbilityRange2").then(config => {
			Corona.Configs.AbilityRange2 = config
			Corona.Panels.AbilityRange2.style.position = `${config.position}`
			Corona.Panels.AbilityRange2.style.flowChildren = config.flow
		})
		MyEnt.Abilities.forEach(CreatePanel)
		Corona.Subscribes.AbilityRange2.learned_ability = GameEvents.Subscribe("dota_player_learned_ability", SkillLearned)
		//Corona.Subscribes.AbilityRange2.inventory_changed = GameEvents.Subscribe("dota_inventory_changed", InventoryChanged) // just informs about inventory change, not about item.
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
            Corona.OnTick.push(chkboxpressed)
			Utils.ScriptLogMsg("Script enabled: AbilityRange2", "#00ff00")
		} else {
            Corona.OnTick.remove(chkboxpressed)
			Utils.ScriptLogMsg("Script disabled: AbilityRange2", "#ff0000")
		} */
	/* }, */