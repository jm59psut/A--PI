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

var MainHud:        Panel    = Corona.Panels.Main,
	uiw:            number   = Corona.Panels.Main.actuallayoutwidth,
	uih:            number   = Corona.Panels.Main.actuallayoutheight,
	enemies:        Entity[] = [],
	manabar_layout: string

function DeleteAll_EMB(): void {
	if(!Corona.Panels.EnemyManaBars)
		Corona.Panels.EnemyManaBars = []
	Corona.Panels.EnemyManaBars.forEach(panel => panel.DeleteAsync(0))
	Corona.Panels.EnemyManaBars = []
}

function OnTick_EMB(): void {
	enemies = EntityManager.PlayersHeroEnts().filter(ent => ent.IsAlive && ent.IsEnemy)

	Corona.Panels.EnemyManaBars.forEach((manabar: Panel, ent_id: number) => {
		let ent = EntityManager.EntityByID(ent_id)
		if(enemies.indexOf(ent) === -1) {
			manabar.DeleteAsync(0)
			delete Corona.Panels.EnemyManaBars[ent_id]
			return
		}
		manabar.Children()[0].style.width = `${Math.floor(ent.Mana / ent.MaxMana * 100)}%`
	})
}

function OnUpdate_EMB(): void {
	enemies.forEach(ent => {
		var vec = ent.AbsOrigin,
			healthbaroffset = ent.HealthBarOffset,
			uix_offset = 1,
			uix = Game.WorldToScreenX(vec.x, vec.z, vec.y + healthbaroffset) + uix_offset,
			uiy = Game.WorldToScreenY(vec.x, vec.z, vec.y + healthbaroffset),
			uixp = uix / uiw * 100,
			uiyp = uiy / uih * 100,
			manabar: Panel
		
		if (!healthbaroffset || uix - uix_offset === 0 || uiy === -1) {
			if((manabar = Corona.Panels.EnemyManaBars[ent.id])) {
				manabar.DeleteAsync(0)
				delete Corona.Panels.EnemyManaBars[ent.id]
			}
			return
		}
		if (Corona.Panels.EnemyManaBars[ent.id] === undefined) {
			manabar = $.CreatePanel("Panel", MainHud, "EnemyManaBar")
			manabar.BLoadLayoutFromString(manabar_layout, false, false)
			Corona.Panels.EnemyManaBars[ent.id] = manabar
		}

		if(manabar === undefined)
			manabar = Corona.Panels.EnemyManaBars[ent.id]
		manabar.style.position = `${uixp}% ${uiyp}% 0`
	})
}

module = {
	name: "Enemy ManaBars",
	onPreload: () => {
		DeleteAll_EMB() // as it defines variables
		Corona.GetXML("EnemyManaBars/manabar").then(xml => manabar_layout = xml)
	},
	onToggle: checkbox => {
		if (checkbox.checked) {
			Corona.OnUpdate.push(OnUpdate_EMB)
			Corona.OnTick.push(OnTick_EMB)
			Utils.ScriptLogMsg("Script enabled: EnemyManaBars", "#00ff00")
		} else {
			Corona.OnUpdate.remove(OnUpdate_EMB)
			Corona.OnTick.remove(OnTick_EMB)
			DeleteAll_EMB()
			Utils.ScriptLogMsg("Script disabled: EnemyManaBars", "#ff0000")
		}
	},
	onDestroy: DeleteAll_EMB
}