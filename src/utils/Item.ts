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

class Item extends Ability {
	owner: Entity // will be defined by Entity#ItemInSlot

	get Caster(): Entity { return this.owner || EntityManager.EntityByID(Abilities.GetCaster(this.id)) }
	
	/**
	 * @returns {boolean} is owners mana enough for this ability?
	 */
	get IsOwnersManaEnough(): boolean {
		if(this.IsItem) return this.Caster.Mana >= this.ManaCost
		return Abilities.IsOwnersManaEnough(this.id)
	}

	/**
	 * @returns {boolean} does this item display charges if it has?
	 */
	get ShouldDisplayCharges(): boolean { return Items.ShouldDisplayCharges(this.id) }

	/**
	 * @returns {boolean} does this always item display charges?
	 */
	get AlwaysDisplayCharges(): boolean { return Items.AlwaysDisplayCharges(this.id) }

	/**
	 * @returns {boolean} does this item display secondary charges?
	 */
	get ShowSecondaryCharges(): boolean { return Items.ShowSecondaryCharges(this.id) }

	/**
	 * @returns {boolean} can this item be sold by localplayer?
	 */
	get CanBeSoldByLocalPlayer(): boolean { return Items.CanBeSoldByLocalPlayer(this.id) }

	/**
	 * @returns {boolean} can this item be doubletap casted?
	 */
	get CanDoubleTapCast(): boolean { return Items.CanDoubleTapCast(this.id) }

	/**
	 * @returns {boolean} does this item hides charges?
	 */
	get ForceHideCharges(): boolean { return Items.ForceHideCharges(this.id) }

	/**
	 * @returns {boolean} is this item alertable?
	 */
	get IsAlertableItem(): boolean { return Items.IsAlertableItem(this.id) }

	/**
	 * @returns {boolean} is this item cast on pickup?
	 */
	get IsCastOnPickup(): boolean { return Items.IsCastOnPickup(this.id) }

	/**
	 * @returns {boolean} is this item disassemblable?
	 */
	get IsDisassemblable(): boolean { return Items.IsDisassemblable(this.id) }

	/**
	 * @returns {boolean} is this item droppable?
	 */
	get IsDroppable(): boolean { return Items.IsDroppable(this.id) }

	get IsInnatelyDisassemblable(): boolean { return Items.IsInnatelyDisassemblable(this.id) }

	/**
	 * @returns {boolean} can this item be denied?
	 */
	get IsKillable(): boolean { return Items.IsKillable(this.id) }

	/**
	 * @returns {boolean} is this item muted?
	 */
	get IsMuted(): boolean { return Items.IsMuted(this.id) }

	get IsPermanent(): boolean { return Items.IsPermanent(this.id) }

	get IsPurchasable(): boolean { return Items.IsPurchasable(this.id) }

	/**
	 * @returns {boolean} is this item recipe?
	 */
	get IsRecipe(): boolean { return Items.IsRecipe(this.id) }

	get IsRecipeGenerated(): boolean { return Items.IsRecipeGenerated(this.id) }

	/**
	 * @returns {boolean} is this item sellable?
	 */
	get IsSellable(): boolean { return Items.IsSellable(this.id) }

	/**
	 * @returns {boolean} is this item stackable? (ex.: tangos)
	 */
	get IsStackable(): boolean { return Items.IsStackable(this.id) }

	get ProRatesChargesWhenSelling(): boolean { return Items.ProRatesChargesWhenSelling(this.id) }

	/**
	 * @returns {boolean} does this item require charges to be casted?
	 */
	get RequiresCharges(): boolean { return Items.RequiresCharges(this.id) }

	/**
	 * @returns {boolean} can this item be executed right now?
	 */
	get CanBeExecuted(): boolean { return Items.CanBeExecuted(this.id) }

	/**
	 * @returns {number} current sell cost of item
	 */
	get Cost(): number { return Items.GetCost(this.id) }

	/**
	 * @returns {number} current charges
	 */
	get CurrentCharges(): number { return Items.GetCurrentCharges(this.id) }

	/**
	 * @returns {number} secondary charges
	 */
	get SecondaryCharges(): number { return Items.GetSecondaryCharges(this.id) }

	/**
	 * @returns {number} displayed charges
	 */
	get DisplayedCharges(): number { return Items.GetDisplayedCharges(this.id) }

	/**
	 * @returns {number} initial charges
	 */
	get InitialCharges(): number { return Items.GetInitialCharges(this.id) }

	get ItemColor() { return Items.GetItemColor(this.id) }

	/**
	 * @returns {EShareAbility} shareability type of this item
	 */
	get Shareability(): number { return Items.GetShareability(this.id) }

	/**
	 * @returns {string} SF ability texture name
	 */
	get AbilityTextureSF(): string { return Items.GetAbilityTextureSF(this.id) }

	get AssembledTime(): number { return Items.GetAssembledTime(this.id) }

	get PurchaseTime(): number { return Items.GetPurchaseTime(this.id) }

	/**
	 * @returns {Entity} purchaser
	 */
	get Purchaser(): Entity { return EntityManager.EntityByID(Items.GetPurchaser(this.id)) }

	LocalPlayerDisassembleItem(): void { Items.LocalPlayerDisassembleItem(this.id) }

	LocalPlayerDropItemFromStash(): void { Items.LocalPlayerDropItemFromStash(this.id) }

	LocalPlayerItemAlertAllies(): void { Items.LocalPlayerItemAlertAllies(this.id) }

	LocalPlayerMoveItemToStash(): void { Items.LocalPlayerMoveItemToStash(this.id) }

	LocalPlayerSellItem(): void { Items.LocalPlayerSellItem(this.id) }
}

module.exports = { Item }