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

function Destroy(): void {
	if(Fusion.Panels.AbilityRange)
		Fusion.Panels.AbilityRange.DeleteAsync(0)
	delete Fusion.Panels.AbilityRange
	
	if(Fusion.Subscribes.AbilityRange)
		Fusion.Subscribes.AbilityRange.forEach(sub => GameEvents.Unsubscribe(sub)) // Optimize this line by native
	Fusion.Subscribes.AbilityRange = []

	if(!Fusion.Particles.AbilityRange)
		Fusion.Particles.AbilityRange = new Map<number, number>()
	Fusion.Particles.AbilityRange.forEach(par => ParticleManager.DestroyParticleEffect(par))
	Fusion.Particles.AbilityRange.clear()
}

function SkillLearned(data: any): void {
	var MyEnt = EntityManager.MyEnt,
		LearnedAbil = MyEnt.AbilityByName(data.abilityname)
	if (!LearnedAbil || data.abilityname === "attribute_bonus")
		return
	if(!Fusion.Panels.AbilityRange.Children().some(panel => {
		var abil = panel.GetAttributeInt("Skill", 0)

		if(abil === LearnedAbil.id) {
			if(panel.checked) {
				ParticleManager.DestroyParticleEffect(Fusion.Particles.AbilityRange.get(abil), true)
				Fusion.Particles.AbilityRange.set(abil, Utils.CreateCustomRange(MyEnt, abil.CastRange))
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
		ParticleManager.DestroyParticleEffect(Fusion.Particles.AbilityRange.get(abil), true)
		Fusion.Particles.AbilityRange.delete(abil)
	} else
	var par = ParticleManager.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, MyEnt)
		ParticleManager.SetParticleControl(par, 1, [abil.CastRange, 0, 0])
		Fusion.Particles.AbilityRange.set(abil, par)
}

function CreatePanel(abil: Ability): void {
	if (!abil || abil.AbilityName === "attribute_bonus" || abil.CastRange <= 0)
		return
	var panel = $.CreatePanel("ToggleButton", Fusion.Panels.AbilityRange, "AbilityRangeSkill")
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
		Fusion.Panels.AbilityRange = $.CreatePanel("Panel", Fusion.Panels.Main, "AbilityRangePanel")
		Fusion.Panels.AbilityRange.BLoadLayoutFromString("<root>\
	<Panel class='AbilityRangePanel' style='flow-children: down; background-color: #00000099; border-radius: 15px; padding: 10px 5px 5px 0px;'>\
	</Panel>\
</root>", false, false)
		Utils.MovePanel(Fusion.Panels.AbilityRange, p => {
			Fusion.Configs.AbilityRange.position = p.style.position
			Fusion.SaveConfig("AbilityRange", Fusion.Configs.AbilityRange)
		})
		Fusion.GetConfig("AbilityRange").then(config => {
			Fusion.Configs.AbilityRange = config
			Fusion.Panels.AbilityRange.style.position = config.position
			Fusion.Panels.AbilityRange.style.flowChildren = config.flow
		})
		MyEnt.Abilities.forEach(CreatePanel)
		Fusion.Subscribes.AbilityRange.learned_ability = GameEvents.Subscribe("dota_player_learned_ability", SkillLearned)
		//Fusion.Subscribes.AbilityRange.inventory_changed = GameEvents.Subscribe("dota_inventory_changed", InventoryChanged) // just informs about inventory change, not about item.
		Utils.ScriptLogMsg("Script enabled: AbilityRange", "#00ff00")
	} else {
		Destroy()
		Utils.ScriptLogMsg("Script disabled: AbilityRange", "#ff0000")
	}
}

module = {
	name: "Ability Range",
	onPreload: (): void => {
		if(Fusion.Commands.AbilityRange_Rotate)
			return
		Fusion.Commands.AbilityRange_Rotate = () => {
			if(!Fusion.Configs.AbilityRange) {
				$.Msg("AbilityRange_Rotate", "Just... config aren't initialized.")
				return
			}
			var panel = Fusion.Panels.AbilityRange
			Fusion.Configs.AbilityRange.flow = panel.style.flowChildren = (panel.style.flowChildren === "right" ? "down"  : "right")
			Fusion.SaveConfig("AbilityRange", Fusion.Configs.AbilityRange)
		}
	
		Game.AddCommand("__AbilityRange_Rotate", Fusion.Commands.AbilityRange_Rotate, "", 0)
		Game.AddCommand("__TogglePanel_AbilityRange", () => Fusion.Panels.AbilityRange.visible = !Fusion.Panels.AbilityRange.visible, "",0)
		Destroy()
	},
	onToggle: onToggleF,
	onDestroy: Destroy
}