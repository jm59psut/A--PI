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

var ItemPanelHM: Item[][],
	layout_String

function NewItem(oldinv: Item[], newinv: Item[], ent: Entity): void {
	newinv.filter(item => item !== undefined).forEach(item => {
		if(oldinv.indexOf(item) === -1 && Fusion.Configs.ItemPanel.Items.indexOf(item.AbilityName) > -1){
			if(Fusion.Configs.ItemPanel.Notify) {
				var A = $.CreatePanel("Panel", Fusion.Panels.ItemPanel, `ItemAlert_${ent}_${item}`)
				A.BLoadLayoutFromString("<root>\
	<Panel style='width:100%;height:37px;background-color:#111;'>\
		<DOTAHeroImage heroname='' style='vertical-align:center;width:60px;height:35px;position:0px;'/>\
		<DOTAItemImage itemname='' style='vertical-align:center;width:60px;height:35px;position:70px;'/>\
	</Panel>\
</root>", false, false)
				A.Children()[0].heroname = ent.UnitName
				A.Children()[1].itemname = item.AbilityName
				A.DeleteAsync(parseInt(Fusion.Configs.ItemPanel.NotifyTime))
			}

			if(Fusion.Configs.ItemPanel.EmitSound == "true")
				Game.EmitSound("General.Buy")
		}
	})
}

function ItemPanelEvery(): void {
	EntityManager.PlayersHeroEnts(true)
		.filter(ent => ent.IsEnemy)
		.forEach((ent, i) => {
			var P = Fusion.Panels.ItemPanel.Children()[i]
			P.style.height = "24px"
			P.Children()[0].heroname = ent.UnitName
			var Inv = ent.Inventory
			if(ItemPanelHM[ent.id] === undefined)
				ItemPanelHM[ent.id] = []
			var Inv_old = ItemPanelHM[ent.id]
			if(Inv_old === Inv)
				return
			NewItem(Inv_old, Inv, ent)
			ItemPanelHM[ent.id] = Inv
			Inv.forEach((item, n) => {
				var itemPanel = P.Children()[n + 1]
				itemPanel.itemname = item !== undefined ? item.AbilityName : ""
				if(item !== undefined) {
					var itemCD = item.CooldownTimeRemaining, // current cooldown
						itemMaxCD = item.Cooldown || itemCD || 1, // max cooldown
						charges = item.CurrentCharges
					itemPanel.Children()[0].text = charges > 0 ? charges : ""
					itemPanel.FindChild("cooldown").text = itemCD > 0 ? Math.ceil(itemCD).toString() : ""
					itemPanel.FindChild("cooldownoverlay").visible = true
					itemPanel.FindChild("cooldownoverlay").style.clip = `radial(50.0% 50.0%, 0.0deg, -${itemCD / itemMaxCD * 360}deg)`
					itemPanel.FindChild("nomana").style.opacity = item.IsOwnersManaEnough ? 0 : .8
				} else {
					itemPanel.Children()[0].text = ""
					itemPanel.FindChild("cooldown").text = ""
					itemPanel.FindChild("cooldownoverlay").visible = false
					itemPanel.FindChild("nomana").style.opacity = 0
				}
			})
		})
}

function ItemPanelLoad(): void {
	Fusion.Panels.ItemPanel = $.CreatePanel("Panel", Fusion.Panels.Main, "ItemPanel1")
	Fusion.Panels.ItemPanel.BLoadLayoutFromString(layout_String, false, false)
	Fusion.Panels.ItemPanel.Children().forEach(child => child.style.height = "0")
	Utils.MovePanel(Fusion.Panels.ItemPanel, panel => {
		Fusion.Configs.ItemPanel.position = panel.style.position
		Fusion.SaveConfig("ItemPanel", Fusion.Configs.ItemPanel)
	})

	Fusion.GetConfig("ItemPanel").then(config => {
		Fusion.Configs.ItemPanel = config
		Fusion.Panels.ItemPanel.style.position = config.position
		Fusion.OnTick.push(ItemPanelEvery)
	})
}

module = {
	name: "Item Panel",
	onPreload: () => Fusion.GetXML("ItemPanel/panel").then(response => layout_String = response),
	onToggle: checkbox => {
		if (checkbox.checked) {
			if(!ItemPanelHM)
				ItemPanelHM = []
			ItemPanelLoad()
			Utils.ScriptLogMsg("Script enabled: ItemPanel", "#00ff00")
		} else {
			Fusion.OnTick.remove(ItemPanelEvery)
			ItemPanelHM = []
			if(Fusion.Panels.ItemPanel) {
				Fusion.Panels.ItemPanel.DeleteAsync(0)
				delete Fusion.Panels.ItemPanel
			}
			Utils.ScriptLogMsg("Script disabled: ItemPanel", "#ff0000")
		}
	},
	onDestroy: () => {
		Fusion.OnTick.remove(ItemPanelEvery)
		ItemPanelHM = []
		if(Fusion.Panels.ItemPanel) {
			Fusion.Panels.ItemPanel.DeleteAsync(0)
			delete Fusion.Panels.ItemPanel
		}
	}
}