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

var MeepoClassname = "npc_dota_hero_meepo"
function GetMeepos(): Entity[] {
	var playerID = Game.GetLocalPlayerID()
	return EntityManager.GetAllEntitiesByClassname(MeepoClassname).filter(ent =>
		ent.IsAlive
		&& !ent.IsEnemy
		&& !ent.IsStunned
		&& ent.IsControllableByPlayer(playerID)
		&& !ent.IsIllusion
	)
}

function PoofAllMeeposToMeepo(To: Entity, Queue: boolean = false) {
	GetMeepos().forEach(ent => Orders.CastTarget(ent, ent.AbilityByName("meepo_poof"), To, Queue))
}

function PoofAllMeeposToPos(To: Vector, Queue: boolean = false) {
	GetMeepos().forEach(ent => Orders.CastPosition(ent, ent.AbilityByName("meepo_poof"), To, Queue))
}

function onPreloadF_Combo_Meepo(): void {
	if(!Fusion.Commands.MeepoAutoPoof) {
		Fusion.Commands.MeepoAutoPoof = (flag: number) => {
			if(Players.GetPlayerSelectedHero(Game.GetLocalPlayerID()) !== MeepoClassname){
				Utils.ScriptLogMsg("MeepoAutoPoof: Not Meepo", "#cccccc")
				return
			}

			var MyEnt = EntityManager.MyEnt
			switch(flag) {
				case 0:
					PoofAllMeeposToMeepo(EntityManager.LocalPlayerPortraitUnit)
					break
				case 1:
					var EntsOnCursor = Utils.FindScreenEntitiesAtCursor()
					if(EntsOnCursor.length !== 0)
						PoofAllMeeposToMeepo(EntityManager.EntityByID(EntsOnCursor[0]))
					else
						Utils.ScriptLogMsg("MeepoAutoPoof: No Meepo at cursor", "#cccccc")
					break
				case 2:
					PoofAllMeeposToMeepo(MyEnt)
					break
				case 3:
					PoofAllMeeposToPos(Utils.CursorWorldVec)
					break
			}
		}

		Game.AddCommand("__MeepoAutoPoof_ToSelected", () => Fusion.Commands.MeepoAutoPoof(0), "", 0)
		Game.AddCommand("__MeepoAutoPoof_ToCursor", () => Fusion.Commands.MeepoAutoPoof(1), "", 0)
		Game.AddCommand("__MeepoAutoPoof_ToMain", () => Fusion.Commands.MeepoAutoPoof(2), "", 0)
	}

	if(!Fusion.Commands.MeepoCombo) {
		var combo = new Combo()
		combo.addDelay(caster => {
			GetMeepos()
				.filter(meepo => meepo !== caster)
				.forEach(ent => Orders.CastTarget(ent, ent.AbilityByName("meepo_poof"), caster, false))
			return caster.AbilityByName("meepo_poof").CastPoint - (Fusion.MyTick *
				(
					1 + (caster.ItemByName("item_blink") !== undefined ? 1 : 0) +
					(caster.AbilityByName("meepo_earthbind").Level > 0 ? 10 : 0) +
					(caster.ItemByName("item_veil_of_discord") !== undefined ? 1 : 0) +
					(caster.ItemByName("item_ethereal_blade") !== undefined ? 2 : 0) +
					(caster.ItemByName(/item_(orchid|bloodthorn)/) !== undefined ? 1 : 0) +
					(caster.ItemByName("item_nullifier") !== undefined ? 2 : 0) +
					(caster.ItemByName("item_diffusal_blade") !== undefined ? 1 : 0) +
					(caster.ItemByName("item_sheepstick") !== undefined ? 1 : 0) +
					(caster.ItemByName(/item_(urn_of_shadows|spirit_vessel)/) !== undefined ? 1 : 0)
				)
			)
		})
		combo.addAbility("item_blink", EComboAction.CURSOR_POS)
		combo.addAbility("meepo_earthbind", EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_veil_of_discord", EComboAction.CURSOR_POS)
		combo.addAbility("item_ethereal_blade", EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_(orchid|bloodthorn)/, EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_nullifier", EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_diffusal_blade", EComboAction.CURSOR_ENEMY)
		combo.addAbility("item_sheepstick", EComboAction.CURSOR_ENEMY)
		combo.addAbility(/item_(urn_of_shadows|spirit_vessel)/, EComboAction.CURSOR_ENEMY)
		Game.AddCommand("__MeepoCombo", Fusion.Commands.MeepoCombo = () => combo.execute(EntityManager.MyEnt), "", 0)
	}

	if(!Fusion.Commands.MeepoEarthBind) {
		Fusion.Commands.MeepoEarthBind = pos => {
			var playerID = Game.GetLocalPlayerID()

			EntityManager.GetAllEntitiesByClassname(MeepoClassname).filter(ent =>
				ent.IsAlive
				&& !ent.IsEnemy
				&& !ent.IsStunned
				&& ent.IsControllableByPlayer(playerID)
				&& !ent.IsIllusion
			).every(ent => {
				var Abil = ent.AbilityByName("meepo_earthbind")
				if(Abil.IsCooldownReady) {
					var EarthBind = ent.AbilityByName("meepo_earthbind")
					Orders.CastPosition(ent, EarthBind, pos, false)
					return false
				}
				return true
			})
		}
		Game.AddCommand("__MeepoEarthBind", () => Fusion.Commands.MeepoEarthBind(Utils.CursorWorldVec), "", 0)
	}
}

module = {
	name: "Combo_Meepo",
	onPreload: onPreloadF_Combo_Meepo,
	isVisible: false
}