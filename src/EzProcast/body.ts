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

var lock: boolean = false

function EzProcastOnOffLoad(): void {
	Fusion.GetXML("EzProcast/panel").then(layout_String => {
		Fusion.Panels.EzProcast = $.CreatePanel("Panel", Fusion.Panels.Main, "EzProcast")
		Fusion.Panels.EzProcast.BLoadLayoutFromString(layout_String, false, false)
		Utils.MovePanel(Fusion.Panels.EzProcast, p => {
			Fusion.Configs.EzProcast.position = p.style.position
			Fusion.SaveConfig("EzProcast", Fusion.Configs.EzProcast)
		})
		Fusion.GetConfig("EzProcast").then(config => {
			Fusion.Configs.EzProcast = config
			Fusion.Panels.EzProcast.style.position = config.position
		})

		var MyEnt = EntityManager.MyEnt
		MyEnt.Abilities.forEach(abil => {
			var abilName = abil.AbilityName

			if(!abil.IsDisplayedAbility || abil.IsPassive)
				return
			var P = $.CreatePanel("Panel", Fusion.Panels.EzProcast.Children()[0], abilName)
			P.BLoadLayoutFromString("<root>\
	<script>\
		function Add() {\
			Parent=$.GetContextPanel().GetParent().GetParent();\
			$.GetContextPanel().SetParent(Parent.Children()[2]);\
			$.GetContextPanel().SetPanelEvent('onactivate', function() {\
				Parent = $.GetContextPanel().GetParent().GetParent();\
				$.GetContextPanel().SetParent(Parent.Children()[0]);\
				$.GetContextPanel().SetPanelEvent('onactivate', Add)\
			})\
		}\
	</script>\
	<Panel style='border: 1px solid #000; border-radius: 10px;' onactivate='Add()'>\
		<DOTAAbilityImage/>\
	</Panel>\
</root>", false, false)
			P.Children()[0].abilityname = abil.AbilityName
		})
		MyEnt.Inventory
			.filter(item => item !== undefined && !item.IsPassive)
			.forEach(item => {
				var itemName = item.AbilityName,
					P = $.CreatePanel("Panel", Fusion.Panels.EzProcast.Children()[0], "EzProcast1Item_" + itemName)
				P.BLoadLayoutFromString("<root>\
	<script>\
		function Add() {\
			Parent = $.GetContextPanel().GetParent().GetParent();\
			$.GetContextPanel().SetParent(Parent.Children()[2]);\
			$.GetContextPanel().SetPanelEvent('onactivate', function() {\
				Parent=$.GetContextPanel().GetParent().GetParent();\
				$.GetContextPanel().SetParent(Parent.Children()[0]);\
				$.GetContextPanel().SetPanelEvent('onactivate', Add)\
			})\
		}\
	</script>\
	<Panel style='border: 1px solid #000; border-radius: 10px;' onactivate='Add()'>\
		<DOTAItemImage/>\
	</Panel>\
</root>", false, false )
				P.Children()[0].itemname = itemName
			})
	});
}

function ScheduleCast(MyEnt: Entity, abils: string[], pos: Vector, EntOnCursor: Entity) {
	var abilName = abils[0],
		abil = MyEnt.NByName(abilName)
	abils.remove(abilName)

	var Behavior = abil.Behavior
	if(Utils.IsFlagSet(Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE))
		Orders.ToggleAbil(MyEnt, abil, false)
	else if(Utils.IsFlagSet(Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET))
		Orders.CastNoTarget(MyEnt, abil, false)
	else if(Utils.IsFlagSet(Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT))
		Orders.CastPosition(MyEnt, abil, pos, false)
	else if(abilName === "item_ethereal_blade" || Utils.IsFlagSet(Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) || Behavior === 0)
		Orders.CastTarget(MyEnt, abil, EntOnCursor || MyEnt, false)

	if(abils.length > 0 && !lock)
		$.Schedule(abil.CastPoint, () => ScheduleCast(MyEnt, abils, pos, EntOnCursor))
	else
		lock = false
}

module = {
	name: "EzProcast",
	onPreload: (): void => {
		if(Fusion.Commands.EzProcastF)
			return
		Fusion.Commands.EzProcastF = () => {
			var MyEnt = EntityManager.MyEnt,
				EntsOnCursor = Utils.FindScreenEntitiesAtCursor(),
				pos = Utils.CursorWorldVec,
				abils = Fusion.Panels.EzProcast.Children()[2].Children().map(item => {
					if(item.Children()[0].paneltype === "DOTAAbilityImage")
						return item.Children()[0].abilityname
					else if(item.Children()[0].paneltype === "DOTAItemImage")
						return item.Children()[0].itemname
	
					return undefined
				}).filter(abil => abil !== undefined)
	
			//$.Msg("EzProcast", `Abils: ${abils}`)
			Orders.EntStop(MyEnt)
			ScheduleCast(MyEnt, abils, pos, EntityManager.EntityByID(EntsOnCursor[0]))
		}
		Game.AddCommand("__EzProcast", Fusion.Commands.EzProcastF, "",0)
		Game.AddCommand("__EzProcast_Stop", () => lock = false, "",0)
		Game.AddCommand("__TogglePanel_EzProcast", () => Fusion.Panels.EzProcast.visible = !Fusion.Panels.EzProcast.visible, "",0)
	},
	onToggle: checkbox => {
		if (checkbox.checked) {
			EzProcastOnOffLoad()
			Utils.ScriptLogMsg("Script enabled: EzProcast", "#00ff00")
		} else {
			Fusion.Panels.EzProcast.DeleteAsync(0)
			Utils.ScriptLogMsg("Script disabled: EzProcast", "#ff0000")
		}
	},
	onDestroy: () => {
		if(Fusion.Panels.EzProcast) {
			Fusion.Panels.EzProcast.DeleteAsync(0)
			delete Fusion.Panels.EzProcast
		}
	}
}