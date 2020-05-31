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

class Ability extends Entity {
	/**
	 * @returns {string} ability name (from npc_abilities)
	 */
	get AbilityName(): string { return Abilities.GetAbilityName(this.id) }

	/**
	 * @returns {string} ability HUD texture name (from npc_abilities)
	 */
	get AbilityTextureName(): string { return Abilities.GetAbilityTextureName(this.id) }

	get AssociatedPrimaryAbilities() { return Abilities.GetAssociatedPrimaryAbilities(this.id) }

	get AssociatedSecondaryAbilities() { return Abilities.GetAssociatedSecondaryAbilities(this.id) }

	/**
	 * @returns {string} hotkey override
	 */
	get HotkeyOverride(): string { return Abilities.GetHotkeyOverride(this.id) }

	/**
	 * @returns {string} modifier name associated with this ability
	 */
	get IntrinsicModifierName(): string { return Abilities.GetIntrinsicModifierName(this.id) }

	/**
	 * @returns {string} shared cooldown name
	 */
	get SharedCooldownName(): string { return Abilities.GetSharedCooldownName(this.id) }

	get AbilityReady(): boolean { return Abilities.AbilityReady(this.id) }

	/**
	 * @returns {AbilityLearnResult_t}
	 */
	get CanAbilityBeUpgraded(): number { return Abilities.CanAbilityBeUpgraded(this.id) }

	/**
	 * @returns {boolean} can this ability be executed?
	 */
	get CanBeExecuted(): boolean { return Abilities.CanBeExecuted(this.id) }

	/**
	 * @returns {number} AbilityDamage from npc_abilities
	 */
	get AbilityDamage(): number { return Abilities.GetAbilityDamage(this.id) }

	/**
	 * @returns {number} encoded array of AbilityDamageType from npc_abilities
	 */
	get AbilityDamageType(): number { return Abilities.GetAbilityDamageType(this.id) }

	/**
	 * @returns {number} encoded array of DOTA_UNIT_TARGET_FLAGS
	 */
	get AbilityTargetFlags(): number { return Abilities.GetAbilityTargetFlags(this.id) }

	/**
	 * @returns {number} encoded array of DOTA_UNIT_TARGET_TEAM
	 */
	get AbilityTargetTeam(): number { return Abilities.GetAbilityTargetTeam(this.id) }

	/**
	 * @returns {number} encoded array of DOTA_UNIT_TARGET_TYPE
	 */
	get AbilityTargetType(): number { return Abilities.GetAbilityTargetType(this.id) }

	/**
	 * @returns {ABILITY_TYPES}
	 */
	get AbilityType(): number { return Abilities.GetAbilityType(this.id) }

	/**
	 * @returns {number} channeled manacost per second
	 */
	get ChannelledManaCostPerSecond(): number { return Abilities.GetChannelledManaCostPerSecond(this.id) }

	/**
	 * @returns {number} current charges of this ability (ex.: sniper's 1st ability)
	 */
	get CurrentCharges(): number { return Abilities.GetCurrentCharges(this.id) }

	get EffectiveLevel(): number { return Abilities.GetEffectiveLevel(this.id) }

	/**
	 * @returns {number} hero level required to upgrade this ability
	 */
	get HeroLevelRequiredToUpgrade(): number { return Abilities.GetHeroLevelRequiredToUpgrade(this.id) }

	/**
	 * @returns {number} current level of this ability
	 */
	get Level(): number { return Abilities.GetLevel(this.id) }

	/**
	 * @returns {number} manacost of this ability
	 */
	get ManaCost(): number { return Abilities.GetManaCost(this.id) }

	/**
	 * @returns {number} maximum level of this ability
	 */
	get MaxLevel(): number { return Abilities.GetMaxLevel(this.id) }

	/**
	 * Attempts to upgrade this ability
	 */
	AttemptToUpgrade() { return Abilities.AttemptToUpgrade(this.id) }

	/**
	 * @returns {boolean} can this ability be leveled up?
	 */
	get CanLearn(): boolean { return Abilities.CanLearn(this.id) }

	/**
	 * @returns {boolean} current autocast state of this ability
	 */
	get AutoCastState(): boolean { return Abilities.GetAutoCastState(this.id) }

	/**
	 * @returns {boolean} current toggle state of this ability
	 */
	get ToggleState(): boolean { return Abilities.GetToggleState(this.id) }

	/**
	 * @returns {boolean} can this ability be upgraded by aghs?
	 */
	get HasScepterUpgradeTooltip(): boolean { return Abilities.HasScepterUpgradeTooltip(this.id) }

	get IsActivated(): boolean { return Abilities.IsActivated(this.id) }

	get IsActivatedChanging(): boolean { return Abilities.IsActivatedChanging(this.id) }

	/**
	 * @returns {boolean} is this ability attribute bonus?
	 */
	get IsAttributeBonus(): boolean { return Abilities.IsAttributeBonus(this.id) }

	/**
	 * @returns {boolean} is this ability autocast?
	 */
	get IsAutocast(): boolean { return Abilities.IsAutocast(this.id) }

	/**
	 * @returns {boolean} is this ability cooldown ready?
	 */
	get IsCooldownReady(): boolean { return Abilities.IsCooldownReady(this.id) }

	get IsDisplayedAbility(): boolean { return Abilities.IsDisplayedAbility(this.id) }

	/**
	 * @returns {boolean} is this ability hidden from HUD?
	 */
	get IsHidden(): boolean { return Abilities.IsHidden(this.id) }

	get IsHiddenWhenStolen(): boolean { return Abilities.IsHiddenWhenStolen(this.id) }

	/**
	 * @returns {boolean} is this ability in cast point/being channeled (active) now?
	 */
	get IsInAbilityPhase(): boolean { return Abilities.IsInAbilityPhase(this.id) }

	/**
	 * @returns {boolean} is this ability item?
	 */
	get IsItem(): boolean { return Abilities.IsItem(this.id) }

	get IsMarkedAsDirty(): boolean { return Abilities.IsMarkedAsDirty(this.id) }

	/**
	 * @returns {boolean} is this ability muted now?
	 */
	get IsMuted(): boolean { return Abilities.IsMuted(this.id) }

	get IsOnCastbar(): boolean { return Abilities.IsOnCastbar(this.id) }

	/**
	 * @returns {boolean} can this ability be leveled up?
	 */
	get IsOnLearnbar(): boolean { return Abilities.IsOnLearnbar(this.id) }

	/**
	 * @returns {boolean} is owner's gold enough to cast this ability?
	 */
	get IsOwnersGoldEnough(): boolean { return Abilities.IsOwnersGoldEnough(this.id) }

	/**
	 * @returns {boolean} is owner's gold enough to upgrade this ability?
	 */
	get IsOwnersGoldEnoughForUpgrade(): boolean { return Abilities.IsOwnersGoldEnoughForUpgrade(this.id) }

	/**
	 * @returns {boolean} is owners mana enough for this ability?
	 */
	get IsOwnersManaEnough(): boolean { return Abilities.IsOwnersManaEnough(this.id) }

	/**
	 * @returns {boolean} is this ability passive?
	 */
	get IsPassive(): boolean { return Abilities.IsPassive(this.id) }

	/**
	 * @returns {boolean} is this ability - item recipe?
	 */
	get IsRecipe(): boolean { return Abilities.IsRecipe(this.id) }

	/**
	 * @returns {boolean} is this ability shared with teammates?
	 */
	get IsSharedWithTeammates(): boolean { return Abilities.IsSharedWithTeammates(this.id) }

	/**
	 * @returns {boolean} can this ability be stolen?
	 */
	get IsStealable(): boolean { return Abilities.IsStealable(this.id) }

	/**
	 * @returns {boolean} is this ability stolen?
	 */
	get IsStolen(): boolean { return Abilities.IsStolen(this.id) }

	/**
	 * @returns {boolean} is this ability toggle?
	 */
	get IsToggle(): boolean { return Abilities.IsToggle(this.id) }

	/**
	 * @returns {number} AOE radius
	 */
	get AOERadius(): number { return Abilities.GetAOERadius(this.id) }

	/**
	 * @returns {number} backswing time
	 */
	get BackswingTime(): number { return Abilities.GetBackswingTime(this.id) }

	get ChannelStartTime(): number { return Abilities.GetChannelStartTime(this.id) }

	/**
	 * @returns {number} maximum channel time
	 */
	get ChannelTime(): number { return Abilities.GetChannelTime(this.id) }

	/**
	 * @returns {number} maximum cooldown of this ability
	 */
	get Cooldown(): number { return Abilities.GetCooldown(this.id) }

	get CooldownLength(): number { return Abilities.GetCooldownLength(this.id) }

	get CooldownTime(): number { return Abilities.GetCooldownTime(this.id) }

	get Duration(): number { return Abilities.GetDuration(this.id) }

	get UpgradeBlend() { return Abilities.GetUpgradeBlend(this.id) }

	/**
	 * @returns {Entity} owner of this ability
	 */
	get Caster(): Entity { return EntityManager.EntityByID(Abilities.GetCaster(this.id)) }

	/**
	 * @param {string} pszAbilityVarName custom value name
	 * @returns {*} custom value
	 */
	CustomValueFor(pszAbilityVarName: string): any { return Abilities.GetCustomValueFor(this.id, pszAbilityVarName) }

	/**
	 * @param {string} szName special value name
	 * @param {number} nLevel level to get
	 * @returns {*} special value for given level
	 */
	LevelSpecialValueFor(szName: string, nLevel: number): any { return Abilities.GetLevelSpecialValueFor(this.id, szName, nLevel) }

	/**
	 * @param {string} szName special value name
	 * @returns {*} special value
	 */
	SpecialValueFor(szName: string): any { return Abilities.GetSpecialValueFor(this.id, szName) }

	IsCosmetic(ent: Entity): boolean { return Abilities.IsCosmetic(this.id, ent.id) }

	/**
	 * Attempt to execute the specified ability (Equivalent to clicking the ability in the HUD action bar)
	 */
	ExecuteAbility(caster: Entity, bIsQuickCast: boolean): void { Abilities.ExecuteAbility(this.id, caster.id, bIsQuickCast) }

	/**
	 * Attempt to double-tap (self-cast) the specified ability (Equivalent to double-clicking the ability in the HUD action bar)
	 */
	CreateDoubleTapCastOrder(caster: Entity): void { Abilities.CreateDoubleTapCastOrder(this.id, caster.id) }

	/**
	 * Pings this ability (Equivalent to alt-clicking the ability in the HUD action bar)
	 */
	PingAbility(): void { Abilities.PingAbility(this.id) }

	/**
	 * @returns {string} the keybind for this ability
	 */
	get Keybind(): string { return Abilities.GetKeybind(this.id) }

	/**
	 * @returns {number} cast point of this ability
	 */
	get CastPoint(): number { return Abilities.GetCastPoint(this.id) - Abilities.GetBackswingTime(this.id) }

	/**
	 * @returns {number} cast range of this ability
	 */
	get CastRange(): number {
		var AbilRange = Abilities.GetCastRange(this.id)
		if (AbilRange === -1)
			return -1
		if (this.Caster.HasItemInInventory("item_aether_lens"))
			AbilRange += 250

		return AbilRange
	}

	/**
	 * @returns {number} encoded DOTA_ABILITY_BEHAVIOR array of this ability
	 */
	get Behavior(): number { return Abilities.GetBehavior(this.id) }

	/**
	 * @returns {number} cooldown time remaining
	 */
	get CooldownTimeRemaining(): number { return Abilities.GetCooldownTimeRemaining(this.id) }
}

module.exports = { Ability }