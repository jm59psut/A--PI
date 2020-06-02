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

function Destroy(): void {
	if(Corona.Panels.AbilityRange)
		Corona.Panels.AbilityRange.DeleteAsync(0)
	delete Corona.Panels.AbilityRange
	
	if(Corona.Subscribes.AbilityRange)
		Corona.Subscribes.AbilityRange.forEach(sub => GameEvents.Unsubscribe(sub)) // Optimize this line by native
	Corona.Subscribes.AbilityRange = []

	if(!Corona.Particles.AbilityRange)
		Corona.Particles.AbilityRange = new Map<number, number>()
	Corona.Particles.AbilityRange.forEach(par => ParticleManager.DestroyParticleEffect(par))
	Corona.Particles.AbilityRange.clear()
}

function SkillLearned(data: any): void {
	var MyEnt = EntityManager.MyEnt,
		LearnedAbil = MyEnt.AbilityByName(data.abilityname)
	if (!LearnedAbil || data.abilityname === "attribute_bonus")
		return
	if(!Corona.Panels.AbilityRange.Children().some(panel => {
		var abil = panel.GetAttributeInt("Skill", 0)

		if(abil === LearnedAbil.id) {
			if(panel.checked) {
				ParticleManager.DestroyParticleEffect(Corona.Particles.AbilityRange.get(abil), true)
				Corona.Particles.AbilityRange.set(abil, Utils.CreateCustomRange(MyEnt, abil.CastRange))
			}
			return true
		}
		return false
	}))
		CreatePanel(LearnedAbil)
}

function chkboxpressed(panel: Panel): void {
	var MyEnt = EntityManager.MyEnt,
		abil: Ability = EntityManager.EntityByID(panel.GetAttributeInt("Skill", 0))

	Utils.InstallStyle(panel.Children()[0], `border: ${panel.checked ? "2px solid white" : 0}; box-shadow: ${panel.checked ? "0 0 10"  : "0 0 0"}px white`)
	if(!panel.checked) {
		ParticleManager.DestroyParticleEffect(Corona.Particles.AbilityRange.get(abil), true)
		Corona.Particles.AbilityRange.delete(abil)
	} else
	var par = ParticleManager.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, MyEnt)
		ParticleManager.SetParticleControl(par, 1, [abil.CastRange, 0, 0])
		Corona.Particles.AbilityRange.set(abil, par)
}

function CreatePanel(abil: Ability): void {
	if (!abil || abil.AbilityName === "attribute_bonus" || abil.CastRange <= 0)
		return
	var panel = $.CreatePanel("ToggleButton", Corona.Panels.AbilityRange, "AbilityRangeSkill")
	panel.BLoadLayoutFromString(`<root>\
	<styles>\
		<include src='s2r://panorama/styles/dotastyles.vcss_c'/>\
	</styles>\
	<Panel>\
		<DOTA${abil.IsItem ? "Item" : "Ability"}Image style='width: 30px; margin: 0px 5px 5px 10px; border-radius : 15px;'/>\
	</Panel>\
</root>`, false, false)
	panel.Children()[0].abilityname = abil.AbilityName
	panel.SetAttributeInt("Skill", abil.id)
	panel.SetPanelEvent("onactivate", () => chkboxpressed(panel))
}

function onToggleF(checkbox: Panel): void {
	if (checkbox.checked) {
		var MyEnt = EntityManager.MyEnt
		Corona.Panels.AbilityRange = $.CreatePanel("Panel", Corona.Panels.Main, "AbilityRangePanel")
		Corona.Panels.AbilityRange.BLoadLayoutFromString("<root>\
	<Panel class='AbilityRangePanel' style='flow-children: down; background-color: #00000099; border-radius: 15px; padding: 10px 5px 5px 0px;'>\
	</Panel>\
</root>", false, false)
		Utils.MovePanel(Corona.Panels.AbilityRange, p => {
			Corona.Configs.AbilityRange.position = p.style.position
			Corona.SaveConfig("AbilityRange", Corona.Configs.AbilityRange)
		})
		Corona.GetConfig("AbilityRange").then(config => {
			Corona.Configs.AbilityRange = config
			Corona.Panels.AbilityRange.style.position = config.position
			Corona.Panels.AbilityRange.style.flowChildren = config.flow
		})
		MyEnt.Abilities.forEach(CreatePanel)
		Corona.Subscribes.AbilityRange.learned_ability = GameEvents.Subscribe("dota_player_learned_ability", SkillLearned)
		//Corona.Subscribes.AbilityRange.inventory_changed = GameEvents.Subscribe("dota_inventory_changed", InventoryChanged) // just informs about inventory change, not about item.
		Utils.ScriptLogMsg("Script enabled: AbilityRange", "#00ff00")
	} else {
		Destroy()
		Utils.ScriptLogMsg("Script disabled: AbilityRange", "#ff0000")
	}
}

module = {
	name: "Ability Range [Beta]",
	onPreload: (): void => {
		if(Corona.Commands.AbilityRange_Rotate)
			return
		Corona.Commands.AbilityRange_Rotate = () => {
			if(!Corona.Configs.AbilityRange) {
				$.Msg("AbilityRange_Rotate", "Just... config aren't initialized.")
				return
			}
			var panel = Corona.Panels.AbilityRange
			Corona.Configs.AbilityRange.flow = panel.style.flowChildren = (panel.style.flowChildren === "right" ? "down"  : "right")
			Corona.SaveConfig("AbilityRange", Corona.Configs.AbilityRange)
		}
	
		Game.AddCommand("__AbilityRange_Rotate", Corona.Commands.AbilityRange_Rotate, "", 0)
		Game.AddCommand("__TogglePanel_AbilityRange", () => Corona.Panels.AbilityRange.visible = !Corona.Panels.AbilityRange.visible, "",0)
		Destroy()
	},
	onToggle: onToggleF,
	onDestroy: Destroy
}