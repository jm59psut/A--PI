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

//idea and base (c) I_GRIN_I 2017
var MainHud: Panel = Fusion.Panels.Main.HUDElements,
	unlearnedWashColor = "#666666",
	hookPanels: Panel[] = [],
	latestEnemy: boolean, abpanel_layout: string, lvlpanel_layout: string, itm_layout: string, stash_layout: string

/*function SetHook(panel, playerID) {
	if(panel.FindChild("hookPanel"))
		return
	var hookPanel = $.CreatePanel("Panel", panel, "hookPanel")
	hookPanel.BLoadLayoutFromString('<root>\
	<Panel style="width: 100%; height: 100%; z-index: 6;"/>\
</root>', false, false)
	hookPanel.SetPanelEvent("onactivate", () => GameUI.SelectUnit(Players.GetPlayerHeroEntityIndex(playerID), false))
	panel.MoveChildBefore(hookPanel, panel.FindChild("SlantedContainerPanel"))
	hookPanels[playerID] = hookPanel
}

function MakeTopBarGreatAgain() {
	var playerID = -1;
	["Radiant", "Dire"].forEach(teamName =>
		MainHud.FindChildTraverse(`TopBar${teamName}PlayersContainer`).Children()
			.filter(panel => panel.FindChildTraverse("PlayerColor").style["background-color"] !== "#FFFFFFFF")
			.forEach(panel => SetHook(panel, ++playerID))
	)
}*/

function DeleteAll_EnemyHUD() {
	hookPanels.forEach(panel => {
		try {
			panel.DeleteAsync(0)
		} catch(e) {}
	})
	hookPanels = []

	if (!Fusion.Panels.EnemyHUD)
		Fusion.Panels.EnemyHUD = []
	Fusion.Panels.EnemyHUD.forEach(([abilPanel, lvlPanels]) => {
		try {
			abilPanel.DeleteAsync(0)
		} catch(e) {}
		lvlPanels.forEach(lvlPanel => {
			try {
				lvlPanel.DeleteAsync(0)
			} catch(e) {}
		})
	})
	Fusion.Panels.EnemyHUD = []

	if (!Fusion.Panels.EnemyItems)
		Fusion.Panels.EnemyItems = {}
	Object.keys(Fusion.Panels.EnemyItems).forEach((str: string) => { // Object.values aren't supported in panorama
		try {
			Fusion.Panels.EnemyItems[str].DeleteAsync(0)
		} catch(e) {}
	})
	Fusion.Panels.EnemyItems = {}
}

function FixColors() {
	var selectedEnt = EntityManager.LocalPlayerPortraitUnit
	if(selectedEnt === undefined)
		return
	var abcount = selectedEnt.AbilityCount,
		generic = 0
	for(let abilNum = 0; abilNum < abcount && abilNum <= 5; abilNum++) {
		var ability = selectedEnt.Ability(abilNum)
		if(ability === undefined || ability.AbilityName === "generic_hidden") {
			generic++
			continue
		}

		var abilLayout = MainHud.FindChildTraverse("abilities").FindChild(`Ability${abilNum - generic}`)
		if(abilLayout === null)
			continue
		var abilImage = abilLayout.FindChildTraverse("AbilityImage"),
			abilLevel = ability.Level
		abilImage.style["saturation"] = 1
		abilImage.style["wash-color"] = abilLevel > 0 ? "none" : unlearnedWashColor
	}
}

function UnsubscribeAll() {
	if(Fusion.Subscribes.EnemyHUD)
		Fusion.Subscribes.EnemyHUD.forEach(sub => GameEvents.Unsubscribe(sub)) // Optimize this line by native
	Fusion.Subscribes.EnemyHUD = []
}

function SetPanelEvent(abPanel, ability) {
	abPanel.SetPanelEvent("onactivate", () => {
		if(!GameUI.IsAltDown())
			return
		var base = `say_team "Beware ${Utils.Localize(EntityManager.LocalPlayerPortraitUnit.UnitName)} ▶ ${Utils.Localize(`DOTA_Tooltip_Ability_${ability.AbilityName}`)}`,
			lvl = ability.Level
		if(lvl === 0) {
			Game.ServerCmd(`${base} ▶ Not Learned"`)
			return
		}
		if(abPanel.FindChild("cooldownoverlay").visible) {
			Game.ServerCmd(`${base} ▶ On Cooldown (${abPanel.FindChild("cooldown").text} seconds remain)"`)
			return
		}
		if(abPanel.FindChild("nomana").visible) {
			Game.ServerCmd(`${base} ▶ No Mana"`)
			return
		}
		Game.ServerCmd(`${base} ▶ Ready (Level ${lvl})"`)
	})
}

function EnemyHUD() {
	var selectedEnt = EntityManager.LocalPlayerPortraitUnit
	if(selectedEnt === undefined || !selectedEnt.IsEnemy) {
		if(latestEnemy) {
			DeleteAll_EnemyHUD()
			latestEnemy = false
		}
		return
	}
	latestEnemy = true
	var abcount = selectedEnt.AbilityCount,
		generic = 0
	for(let abilNum = 0; abilNum < abcount && abilNum <= 5; abilNum++) {
		var ability = selectedEnt.Ability(abilNum)
		if(ability === undefined || ability.AbilityName === "generic_hidden") {
			generic++
			continue
		}

		var abilCD = ability.CooldownTimeRemaining,
			abilMaxCD = ability.Cooldown || abilCD || 1,
			abilLevel = ability.Level,
			abilMaxLevel = ability.MaxLevel,
			abilLayout = MainHud.FindChildTraverse("abilities").FindChild(`Ability${abilNum - generic}`)
		if(!abilLayout)
			continue
		var lvlPanelContainer = abilLayout.FindChildTraverse("AbilityLevelContainer")
		if(Fusion.Panels.EnemyHUD[abilNum - generic] === undefined) {
			let abilButton = abilLayout.FindChildTraverse("AbilityButton"),
				abPanel = $.CreatePanel("Panel", abilButton, "abpanel")
			abPanel.BLoadLayoutFromString(abpanel_layout, false, false)
			abilButton.MoveChildBefore(abPanel, abilButton.FindChild("AbilityBevel")) // quickhack to move our abpanel before AbilityBevel
			SetPanelEvent(abPanel, ability)
			Fusion.Panels.EnemyHUD[abilNum - generic] = [abPanel, lvlPanelContainer.Children()]
		}

		var [abPanel, lvlPanels] = Fusion.Panels.EnemyHUD[abilNum - generic]
		if(abilCD > 0) {
			abPanel.FindChild("cooldown").text = Math.ceil(abilCD)
			abPanel.FindChild("cooldownoverlay").visible = true
			abPanel.FindChild("cooldownoverlay").style.clip = `radial(50.0% 50.0%, 0.0deg, -${abilCD / abilMaxCD * 360}deg)`
		} else {
			abPanel.FindChild("cooldown").text = ""
			abPanel.FindChild("cooldownoverlay").visible = false
		}
		abPanel.FindChild("nomana").visible = !ability.IsOwnersManaEnough

		if(lvlPanels.length < abilMaxLevel) {
			for(let i = 0; i < abilMaxLevel - lvlPanels.length; i++) {
				var lvlPanel = $.CreatePanel("Panel", lvlPanelContainer, `LevelUp${i}`)
				lvlPanel.BLoadLayoutFromString(lvlpanel_layout, false, false)
				lvlPanels.push(lvlPanel)
			}
			Fusion.Panels.EnemyHUD[abilNum-generic] = [abPanel, lvlPanels]
		}
		lvlPanels.forEach((lvlPanel, i) => {
			lvlPanel.visible = abilMaxLevel - i - 1 > -1
			lvlPanel.SetHasClass("active_level", abilLevel - i - 1 > -1)
		})
	}
	if(Fusion.Panels.EnemyItems["StashPanel"] === undefined) {
		var stash = $.CreatePanel("Panel", MainHud, "FusionStash")
		stash.BLoadLayoutFromString(stash_layout, false, false)
		stash.FindChildTraverse("itemrow").Children().forEach(child => Utils.InstallStyle(child, "margin-left: 1.5%; height: 70%; width: 15%"))
		Fusion.Panels.EnemyItems["StashPanel"] = stash
	}
	var stashItems = selectedEnt.StashItems
	Fusion.Panels.EnemyItems["StashPanel"].visible = stashItems.filter(item => item !== undefined).length !== 0
	if(Fusion.Panels.EnemyItems["StashPanel"].visible) {
		const stash = Fusion.Panels.EnemyItems["StashPanel"]
		stashItems.forEach((item, i) => {
			const parent = stash.FindChildTraverse(`item${i}`)
			i += 9 // stash items' IDs are starting from 9
			if(!item) {
				if (Fusion.Panels.EnemyItems[`itemPanel${i}`] !== undefined) {
					Fusion.Panels.EnemyItems[`itemPanel${i}`].DeleteAsync(0)
					delete Fusion.Panels.EnemyItems[`itemPanel${i}`]
				}
				parent.itemname = ""
				return
			} else
				parent.itemname = item.AbilityName
			if(Fusion.Panels.EnemyItems[`itemPanel${i}`] === undefined) {
				const itemPanel = $.CreatePanel("Panel", parent, `itemPanel${i}`)
				itemPanel.BLoadLayoutFromString(itm_layout, false, false)

				Fusion.Panels.EnemyItems[`itemPanel${i}`] = itemPanel
			}

			InitStyles(selectedEnt, item, i)
		})
	}
	selectedEnt.Inventory.forEach((item, i) => {
		if(!item) {
			if(Fusion.Panels.EnemyItems[`itemPanel${i}`] !== undefined) {
				Fusion.Panels.EnemyItems[`itemPanel${i}`].DeleteAsync(0)
				delete Fusion.Panels.EnemyItems[`itemPanel${i}`]
			}
			return
		}
		if(Fusion.Panels.EnemyItems[`itemPanel${i}`] === undefined) {
			var slot = MainHud.FindChildTraverse(`inventory_slot_${i}`).FindChildTraverse("AbilityButton"),
				itemPanel = $.CreatePanel("Panel", slot, `itemPanel${i}`)
			itemPanel.BLoadLayoutFromString(itm_layout, false, false)
			Fusion.Panels.EnemyItems[`itemPanel${i}`] = itemPanel
		}
		InitStyles(selectedEnt, item, i)
	})
}

function InitStyles(selectedEnt: Entity, item: Item, i: number) { // used for items ONLY
	var itemPanel: Panel = Fusion.Panels.EnemyItems[`itemPanel${i}`],
		itemCD = item.CooldownTimeRemaining, // current cooldown
		itemMaxCD = item.Cooldown || itemCD || 1 // max cooldown
	if(itemPanel.FindChild("cooldownoverlay").visible = itemCD > 0) {
		itemPanel.FindChild("cooldown").text = Math.ceil(itemCD).toString()
		itemPanel.FindChild("cooldownoverlay").style.clip = `radial(50.0% 50.0%, 0.0deg, -${itemCD / itemMaxCD * 360}deg)`
	}
	itemPanel.FindChild("nomana").style.opacity = item.IsOwnersManaEnough ? 0 : .8
}

function EnemyHUDOnInterval() {
	EnemyHUD()

	if(!latestEnemy)
		Fusion.OnTick.remove(EnemyHUDOnInterval)
}

function EventSubscribe() {
	if(latestEnemy)
		return
	Fusion.OnTick.push(EnemyHUDOnInterval)
}

module = {
	name: "Enemy HUD",
	isVisible: false,
	onPreload: () => {
		module.onDestroy()
		// MakeTopBarGreatAgain() // doesn't work at dedicated servers, idk why, but GameUI.SelectUnit just doesn't work for FoW
		Fusion.GetXML("EnemyHUD/abpanel").then(xml => abpanel_layout = xml)
			.then(() => Fusion.GetXML("EnemyHUD/lvlpanel").then(xml => lvlpanel_layout = xml)
				.then(() => Fusion.GetXML("EnemyHUD/itm").then(xml => itm_layout = xml)
					.then(() => Fusion.GetXML("EnemyHUD/stash").then(xml => stash_layout = xml)
						.then(() => {
							//Fusion.OnUpdate.push(FixColors)
							Fusion.Subscribes.EnemyHUD.update_selected_unit = GameEvents.Subscribe("dota_player_update_selected_unit", EventSubscribe)
							Fusion.Subscribes.EnemyHUD.update_query_unit = GameEvents.Subscribe("dota_player_update_query_unit", EventSubscribe)
						})
					)
				)
			)
	},
	onDestroy: () => {
		//Fusion.OnUpdate.remove(FixColors)
		UnsubscribeAll()
		DeleteAll_EnemyHUD()
	}
}
