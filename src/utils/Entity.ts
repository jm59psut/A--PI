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

var IgnoreBuffs: any = {
		1: [ // DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
			"modifier_item_aeon_disk_buff"
		],
		2: [   // DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
			"modifier_life_stealer_rage",
			"modifier_oracle_fates_edict",
			"modifier_medusa_stone_gaze",
			"modifier_juggernaut_blade_fury",
			"modifier_omniknight_repel",
			"modifier_item_aeon_disk_buff"
		],
		4: <string[]> [], // DAMAGE_TYPES.DAMAGE_TYPE_PURE
		8: <string[]> [], // DAMAGE_TYPES.DAMAGE_TYPE_HP_REMOVAL
		7: [   // DAMAGE_TYPES.DAMAGE_TYPE_ALL
			"modifier_abaddon_borrowed_time",
			"modifier_skeleton_king_reincarnation_scepter_active",
			"modifier_brewmaster_primal_split",
			"modifier_phoenix_supernova_hiding",
			"modifier_nyx_assassin_spiked_carapace",
			"modifier_templar_assassin_refraction_absorb",
			"modifier_oracle_false_promise",
			"modifier_dazzle_shallow_grave",
			"modifier_treant_living_armor",
			"modifier_item_aegis",
			"modifier_tusk_snowball_movement",
			"modifier_eul_cyclone",
			"modifier_necrolyte_reapers_scythe",
			"modifier_riki_tricks_of_the_trade_phase",
			"modifier_ember_spirit_sleight_of_fist_caster_invulnerability",
			"modifier_puck_phase_shift"
		]
	},
	BuffsAbsorbMagicDmg = {
		"item_pipe": {
			absorbsF: (item: Item) => item.SpecialValueFor("barrier_block"),
			damageType: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
		},
		"item_hood_of_defiance": {
			absorbsF: (item: Item) => item.SpecialValueFor("barrier_block"),
			damageType: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
		},
		"item_infused_raindrop": {
			absorbsF: (item: Item) => item.SpecialValueFor("magic_damage_block"),
			damageType: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
		},
		"ember_spirit_flame_guard": {
			absorbsF: (abil: Ability) => {
				var damageAbsorb = abil.SpecialValueFor("absorb_amount"),
					talent = abil.Caster.AbilityByName("special_bonus_unique_ember_spirit_1")
				if(talent && talent.Level > 0)
					damageAbsorb += talent.SpecialValueFor("value")
				
				return damageAbsorb
			},
			damageType: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
		},
		"abaddon_aphotic_shield": {
			absorbsF: (abil: Ability) => {
				var damageAbsorb = abil.SpecialValueFor("damage_absorb"),
					talent = abil.Caster.AbilityByName("special_bonus_unique_abaddon")
				if(talent && talent.Level > 0)
					damageAbsorb += talent.SpecialValueFor("value")
				
				return damageAbsorb
			},
			damageType: DAMAGE_TYPES.DAMAGE_TYPE_ALL
		},
		"bloodseeker_bloodrage": {
			absorbsF: (abil: Ability, dmg: number) => -dmg * abil.SpecialValueFor("damage_increase_pct") / 100,
			damageType: DAMAGE_TYPES.DAMAGE_TYPE_ALL
		}
	}
class Entity {
	id: number

	/**
	 * @param {number} id id of entity
	 */
	constructor(id: number = -1) {
		if(id <= -1)
			throw "[Entity::constructor] Invalid ID"
		this.id = id
	}

	// D2API Functions
	/**
	 * @returns {boolean} can this entity be dominated?
	 */
	get CanBeDominated(): boolean { return Entities.CanBeDominated(this.id) }

	/**
	 * @returns {boolean} does this entity has attack capability?
	 */
	get HasAttackCapability(): boolean { return Entities.HasAttackCapability(this.id) }

	/**
	 * @returns {boolean} does this entity has castable abilities?
	 */
	get HasCastableAbilities(): boolean { return Entities.HasCastableAbilities(this.id) }

	/**
	 * @returns {boolean} does this entity has flying vision?
	 */
	get HasFlyingVision(): boolean { return Entities.HasFlyingVision(this.id) }

	/**
	 * @returns {boolean} does this entity has fly movement capability?
	 */
	get HasFlyMovementCapability(): boolean { return Entities.HasFlyMovementCapability(this.id) }

	/**
	 * @returns {boolean} does this entity has ground movement capability?
	 */
	get HasGroundMovementCapability(): boolean { return Entities.HasGroundMovementCapability(this.id) }

	/**
	 * @returns {boolean} does this entity has movement capability?
	 */
	get HasMovementCapability(): boolean { return Entities.HasMovementCapability(this.id) }

	/**
	 * @returns {boolean} does this entity has aghs?
	 */
	get HasScepter(): boolean { return Entities.HasScepter(this.id) }

	/**
	 * @returns {boolean} does this entity has upgradeable abilities?
	 */
	get HasUpgradeableAbilities(): boolean { return Entities.HasUpgradeableAbilities(this.id) }

	/**
	 * @returns {boolean} does this entity has upgradeable abilities that aren't maxed?
	 */
	get HasUpgradeableAbilitiesThatArentMaxed(): boolean { return Entities.HasUpgradeableAbilitiesThatArentMaxed(this.id) }

	/**
	 * @returns {boolean} is this entity ancient creep?
	 */
	get IsAncient(): boolean { return Entities.IsAncient(this.id) }

	/**
	 * @returns {boolean} is this entity attack immune?
	 */
	get IsAttackImmune(): boolean { return Entities.IsAttackImmune(this.id) }

	/**
	 * @returns {boolean} is this entity barracks?
	 */
	get IsBarracks(): boolean { return Entities.IsBarracks(this.id) }

	/**
	 * @returns {boolean} is this entity blind?
	 */
	get IsBlind(): boolean { return Entities.IsBlind(this.id) }

	/**
	 * @returns {boolean} is this entity boss?
	 */
	get IsBoss(): boolean { return Entities.IsBoss(this.id) }

	/**
	 * @returns {boolean} is this entity roshan?
	 */
	get IsRoshan(): boolean { return Entities.IsRoshan(this.id) }

	/**
	 * @returns {boolean} is this entity building?
	 */
	get IsBuilding(): boolean { return Entities.IsBuilding(this.id) }

	/**
	 * @returns {boolean} is this entity command restricted?
	 */
	get IsCommandRestricted(): boolean { return Entities.IsCommandRestricted(this.id) }

	get IsConsideredHero(): boolean { return Entities.IsConsideredHero(this.id) }

	/**
	 * @returns {boolean} is this entity controllable by any player?
	 */
	get IsControllableByAnyPlayer(): boolean { return Entities.IsControllableByAnyPlayer(this.id) }

	/**
	 * @returns {boolean} is this entity courier?
	 */
	get IsCourier(): boolean { return Entities.IsCourier(this.id) }

	/**
	 * @returns {boolean} is this entity creature?
	 */
	get IsCreature(): boolean { return Entities.IsCreature(this.id) }

	/**
	 * @returns {boolean} is this entity creep?
	 */
	get IsCreep(): boolean { return Entities.IsCreep(this.id) }

	get IsCreepHero(): boolean { return Entities.IsCreepHero(this.id) }

	/**
	 * @returns {boolean} is this entity deniable?
	 */
	get IsDeniable(): boolean { return Entities.IsDeniable(this.id) }

	/**
	 * @returns {boolean} is this entity dominated?
	 */
	get IsDominated(): boolean { return Entities.IsDominated(this.id) }

	/**
	 * @returns {boolean} is this entity enemy?
	 */
	get IsEnemy(): boolean { return Entities.IsEnemy(this.id) }

	/**
	 * @returns {boolean} is this entity evade disabled? (ex.: bloodthorn)
	 */
	get IsEvadeDisabled(): boolean { return Entities.IsEvadeDisabled(this.id) }

	/**
	 * @returns {boolean} is this entity fort? (ancient building)
	 */
	get IsFort(): boolean { return Entities.IsFort(this.id) }

	/**
	 * @returns {boolean} is this entity frozen? (is CM's 2nd ability applied to this entity?)
	 */
	get IsFrozen(): boolean { return Entities.IsFrozen(this.id) }

	/**
	 * @returns {boolean} is this entity generated by econ item?
	 */
	get IsGeneratedByEconItem(): boolean { return Entities.IsGeneratedByEconItem(this.id) }

	/**
	 * @returns {boolean} is this entity hall of fame?
	 */
	get IsHallofFame(): boolean { return Entities.IsHallofFame(this.id) }

	/**
	 * @returns {boolean} is this entity disarmed?
	 */
	get IsDisarmed(): boolean { return Entities.IsDisarmed(this.id) }

	/**
	 * @returns {boolean} is this entity hero?
	 */
	get IsHero(): boolean { return Entities.IsHero(this.id) }

	/**
	 * @returns {boolean} is this entity hexed?
	 */
	get IsHexed(): boolean { return Entities.IsHexed(this.id) }

	/**
	 * @returns {boolean} is this entity illusion?
	 */
	get IsIllusion(): boolean { return Entities.IsIllusion(this.id) }

	/**
	 * @returns {boolean} is this entity in range of fountain?
	 */
	get IsInRangeOfFountain(): boolean { return Entities.IsInRangeOfFountain(this.id) }

	/**
	 * @returns {boolean} does this entity has inventory?
	 */
	get IsInventoryEnabled(): boolean { return Entities.IsInventoryEnabled(this.id) }

	/**
	 * @returns {boolean} is this entity invisible?
	 */
	get IsInvisible(): boolean { return Entities.IsInvisible(this.id) }

	/**
	 * @returns {boolean} is this entity invulnerable?
	 */
	get IsInvulnerable(): boolean { return Entities.IsInvulnerable(this.id) }

	/**
	 * @returns {boolean} is this entity lane creep?
	 */
	get IsLaneCreep(): boolean { return Entities.IsLaneCreep(this.id) }

	/**
	 * @returns {boolean} is this entity has low attack priority?
	 */
	get IsLowAttackPriority(): boolean { return Entities.IsLowAttackPriority(this.id) }

	/**
	 * @returns {boolean} is this entity magic immune?
	 */
	get IsMagicImmune(): boolean { return Entities.IsMagicImmune(this.id) }

	/**
	 * @returns {boolean} is this entity muted?
	 */
	get IsMuted(): boolean { return Entities.IsMuted(this.id) }

	/**
	 * @returns {boolean} is this entity neutral unit type?
	 */
	get IsNeutralUnitType(): boolean { return Entities.IsNeutralUnitType(this.id) }

	/**
	 * @returns {boolean} is this entity nightmared?
	 */
	get IsNightmared(): boolean { return Entities.IsNightmared(this.id) }

	get IsOther(): boolean { return Entities.IsOther(this.id) }

	get IsOutOfGame(): boolean { return Entities.IsOutOfGame(this.id) }

	/**
	 * @returns {boolean} is this entity owned by any player?
	 */
	get IsOwnedByAnyPlayer(): boolean { return Entities.IsOwnedByAnyPlayer(this.id) }

	/**
	 * @returns {boolean} is this entity phantom?
	 */
	get IsPhantom(): boolean { return Entities.IsPhantom(this.id) }

	/**
	 * @returns {boolean} is this entity ranged attacker?
	 */
	get IsRangedAttacker(): boolean { return Entities.IsRangedAttacker(this.id) }

	/**
	 * @returns {boolean} is this entity real hero? (works only for allies)
	 */
	get IsRealHero(): boolean { return Entities.IsRealHero(this.id) }

	/**
	 * @returns {boolean} is this entity rooted?
	 */
	get IsRooted(): boolean { return Entities.IsRooted(this.id) }

	/**
	 * @returns {boolean} is this entity selectable?
	 */
	get IsSelectable(): boolean { return Entities.IsSelectable(this.id) }

	/**
	 * @returns {boolean} is this entity shop?
	 */
	get IsShop(): boolean { return Entities.IsShop(this.id) }

	/**
	 * @returns {boolean} is this entity silenced?
	 */
	get IsSilenced(): boolean { return Entities.IsSilenced(this.id) }

	/**
	 * @returns {boolean} is this entity specially deniable?
	 */
	get IsSpeciallyDeniable(): boolean { return Entities.IsSpeciallyDeniable(this.id) }

	/**
	 * @returns {boolean} is this entity stunned?
	 */
	get IsStunned(): boolean { return Entities.IsStunned(this.id) }

	/**
	 * @returns {boolean} is this entity summoned?
	 */
	get IsSummoned(): boolean { return Entities.IsSummoned(this.id) }

	/**
	 * @returns {boolean} is this entity tower?
	 */
	get IsTower(): boolean { return Entities.IsTower(this.id) }

	/**
	 * @returns {boolean} is this entity shrine?
	 */
	get IsShrine(): boolean { return /npc_dota_(good|bad)guys_healers/.test(this.UnitName) }

	/**
	 * @returns {boolean} is this entity ward?
	 */
	get IsWard(): boolean { return Entities.IsWard(this.id) }

	/**
	 * @returns {boolean} is this entity zombie?
	 */
	get IsZombie(): boolean { return Entities.IsZombie(this.id) }

	/**
	 * @returns {boolean} doesn't this entity has HP bar?
	 */
	get NoHealthBar(): boolean { return Entities.NoHealthBar(this.id) }

	get NoTeamMoveTo(): boolean { return Entities.NoTeamMoveTo(this.id) }

	get NoTeamSelect(): boolean { return Entities.NoTeamSelect(this.id) }

	/**
	 * @returns {boolean} isn't this entity on minimap?
	 */
	get NotOnMinimap(): boolean { return Entities.NotOnMinimap(this.id) }

	/**
	 * @returns {boolean} isn't this entity on minimap for enemies?
	 */
	get NotOnMinimapForEnemies(): boolean { return Entities.NotOnMinimapForEnemies(this.id) }

	/**
	 * @returns {boolean} doesn't this entity have unit collision?
	 */
	get NoUnitCollision(): boolean { return Entities.NoUnitCollision(this.id) }

	/**
	 * @returns {boolean} is this entity have passives disabled?
	 */
	get PassivesDisabled(): boolean { return Entities.PassivesDisabled(this.id) }

	/**
	 * @returns {boolean} does this entity provides vision?
	 */
	get ProvidesVision(): boolean { return Entities.ProvidesVision(this.id) }

	/**
	 * @returns {boolean} does this entity uses hero ability numbers?
	 */
	get UsesHeroAbilityNumbers(): boolean { return Entities.UsesHeroAbilityNumbers(this.id) }

	/**
	 * @returns {boolean} is this entity moving right now?
	 */
	get IsMoving(): boolean { return Entities.IsMoving(this.id) }

	/**
	 * @returns {number} ability count of this entity
	 */
	get AbilityCount(): number { return Entities.GetAbilityCount(this.id) }

	get CombatClassAttack() { return Entities.GetCombatClassAttack(this.id) }

	get CombatClassDefend() { return Entities.GetCombatClassDefend(this.id) }

	get CurrentVisionRange(): number { return Entities.GetCurrentVisionRange(this.id) }

	/**
	 * @returns {number} bonus damage (shown after "+" in the HUD)
	 */
	get DamageBonus(): number { return Entities.GetDamageBonus(this.id) }

	/**
	 * @returns {number} minimum base damage of this entity
	 */
	get DamageMin(): number { return Entities.GetDamageMin(this.id) }

	/**
	 * @returns {number} maximum base damage of this entity
	 */
	get DamageMax(): number { return Entities.GetDamageMax(this.id) }

	/**
	 * @returns {number} day time vision range
	 */
	get DayTimeVisionRange(): number { return Entities.GetDayTimeVisionRange(this.id) }

	/**
	 * @returns {number} level of this entity
	 */
	get Level(): number { return Entities.GetLevel(this.id) }

	/**
	 * @returns {number} night time vision range
	 */
	get NightTimeVisionRange(): number { return Entities.GetNightTimeVisionRange(this.id) }

	/**
	 * @returns {modifierstate[]}
	 */
	get States(): number { return Entities.GetStates(this.id) }

	/**
	 * @returns {number} total gold amount that was spent on upgrades
	 */
	get TotalPurchasedUpgradeGoldCost(): number { return Entities.GetTotalPurchasedUpgradeGoldCost(this.id) }

	/**
	 * @returns {DOTATeam_t} team ID
	 */
	get TeamNumber(): number { return Entities.GetTeamNumber(this.id) }

	/**
	 * @returns {number} attack range of this entity
	 */
	get AttackRange(): number { return Entities.GetAttackRange(this.id) }

	/**
	 * @returns {number} attack speed of this entity
	 */
	get AttackSpeed(): number { return Entities.GetAttackSpeed(this.id) }

	/**
	 * @returns {number} attacks per second of this entity
	 */
	get AttacksPerSecond(): number { return Entities.GetAttacksPerSecond(this.id) }

	/**
	 * @returns {number} base attack time of this entity
	 */
	get BaseAttackTime(): number { return Entities.GetBaseAttackTime(this.id) }

	/**
	 * @returns {number} base magic resistance of this entity (always 0.25 after meepo patch)
	 */
	get BaseMagicalResistanceValue(): number { return Entities.GetBaseMagicalResistanceValue(this.id) }

	/**
	 * @returns {number} base movespeed of this entity
	 */
	get BaseMoveSpeed(): number { return Entities.GetBaseMoveSpeed(this.id) }

	/**
	 * @returns {number} bonus physical armor (after "+" in the HUD) of this entity
	 */
	get BonusPhysicalArmor(): number { return Entities.GetBonusPhysicalArmor(this.id) }

	get CollisionPadding(): number { return Entities.GetCollisionPadding(this.id) }

	get EffectiveInvisibilityLevel(): number { return Entities.GetEffectiveInvisibilityLevel(this.id) }

	get HasteFactor(): number { return Entities.GetHasteFactor(this.id) }

	get HullRadius(): number { return Entities.GetHullRadius(this.id) }

	/**
	 * @returns {number} increased attack speed of this entity
	 */
	get IncreasedAttackSpeed(): number { return Entities.GetIncreasedAttackSpeed(this.id) }

	/**
	 * @returns {number} magical armor of this entity
	 */
	get MagicalArmorValue(): number { return Entities.GetMagicalArmorValue(this.id) }

	/**
	 * @returns {number} padded collision radius of this entity
	 */
	get PaddedCollisionRadius(): number { return Entities.GetPaddedCollisionRadius(this.id) }

	get PercentInvisible(): number { return Entities.GetPercentInvisible(this.id) }

	/**
	 * @returns {number} physical armor value of this entity
	 */
	get PhysicalArmorValue(): number { return Entities.GetPhysicalArmorValue(this.id) }

	/**
	 * @returns {number} projectile collision size of this entity
	 */
	get ProjectileCollisionSize(): number { return Entities.GetProjectileCollisionSize(this.id) }

	/**
	 * @returns {number} the radius of the bounding ring of this entity
	 */
	get RingRadius(): number { return Entities.GetRingRadius(this.id) }

	/**
	 * @returns {number} seconds per attack of this entity (1 / Entity#AttacksPerSecond)
	 */
	get SecondsPerAttack(): number { return Entities.GetSecondsPerAttack(this.id) }

	get ManaFraction(): number { return Entities.ManaFraction(this.id) }

	/**
	 * @returns {string} classname of this entity
	 */
	get Classname(): string { return Entities.GetClassname(this.id) }

	/**
	 * @returns {string} dispaled unit name of this entity
	 */
	get DisplayedUnitName(): string { return Entities.GetDisplayedUnitName(this.id) }

	/**
	 * @returns {string} selection group of this entity
	 */
	get SelectionGroup(): string { return Entities.GetSelectionGroup(this.id) }

	/**
	 * @returns {string} soundset of this entity
	 */
	get SoundSet(): string { return Entities.GetSoundSet(this.id) }

	/**
	 * @returns {string} label of this entity
	 */
	get UnitLabel(): string { return Entities.GetUnitLabel(this.id) }

	/**
	 * @returns {string} name of this entity
	 */
	get UnitName(): string { return Entities.GetUnitName(this.id) }

	/**
	 * @returns {number} total damage taken by this entity
	 */
	get TotalDamageTaken(): number { return Entities.GetTotalDamageTaken(this.id) }

	/**
	 * @param {number} nPlayerIndex player ID
	 * @returns {boolean} can this entity be cotrolled by given player ID?
	 */
	IsControllableByPlayer(nPlayerIndex): boolean { return Entities.IsControllableByPlayer(this.id, nPlayerIndex) }

	/**
	 * Broken?
	 */
	get ChosenTarget(): Entity { return EntityManager.EntityByID(Entities.GetChosenTarget(this.id)) }

	/**
	 * @param {string} pItemName item name to search
	 * @returns {boolean} does this entity's inventory contain item with given name?
	 */
	HasItemInInventory(pItemName: string): boolean { return Entities.HasItemInInventory(this.id, pItemName) }

	/**
	 * @param {Entity} ent 2nd entity
	 * @returns {number} range between this and 2nd entity
	 */
	RangeToUnit(ent: Entity): number { return Entities.GetRangeToUnit(this.id, ent.id) }

	/**
	 * @param {Entity} ent 2nd entity
	 * @param {number} range range to check
	 * @returns {boolean} is given entity in given range from this entity?
	 */
	IsEntityInRange(ent: Entity, range: number): boolean { return Entities.IsEntityInRange(this.id, ent.id, range) }

	/**
	 * @param {number} flBaseSpeed base speed to extend
	 * @returns {number} given base speed extended by modifiers/items of this entity
	 */
	MoveSpeedModifier(flBaseSpeed: number = 0): number { return Entities.GetMoveSpeedModifier(this.id, flBaseSpeed) }

	/**
	 * @param {Entity} ent entity to check
	 * @returns {boolean} can this entity accept given entity as target to attack?
	 */
	CanAcceptTargetToAttack(ent: Entity): boolean { return Entities.CanAcceptTargetToAttack(this.id, ent.id) }

	/**
	 * @param {modifierstate} nState ex.: MODIFIER_STATE_ROOTED
	 * @returns {boolean} does this entity have given modifier state?
	 */
	InState(nState: number): boolean { return Entities.InState(this.id, nState) }

	/**
	 * @param {DAMAGE_TYPES} iDamageType damage type
	 * @returns {number} armor count/percent for given damage type
	 */
	ArmorForDamageType(iDamageType: number): number { return Entities.GetArmorForDamageType(this.id, iDamageType) }

	/**
	 * @param {DAMAGE_TYPES} iDamageType damage type
	 * @returns {number} armor count/percent for given damage type
	 */
	ArmorReductionForDamageType(iDamageType: number): number { return Entities.GetArmorReductionForDamageType(this.id, iDamageType) }

	/**
	 * @param {number} iShopType shop type
	 * @param {boolean} bSpecific exactly this shop or just available items?
	 * @returns {boolean} is this entity in range of given shop type?
	 */
	IsInRangeOfShop(iShopType: number, bSpecific: boolean): boolean { return Entities.IsInRangeOfShop(this.id, iShopType, bSpecific) }

	/**
	 * @returns {number} count of items located in stash of this entity
	 */
	get NumItemsInStash(): number { return Entities.GetNumItemsInStash(this.id) }

	/**
	 * @returns {number} count of items located in inventory of this entity
	 */
	get NumItemsInInventory(): number { return Entities.GetNumItemsInInventory(this.id) }

	/**
	 * @returns {number} count of buffs at this entity
	 */
	get NumBuffs(): number { return Entities.GetNumBuffs(this.id) }

	/**
	 * @param {number} nBufIndex buff number
	 * @returns {Buff} buff with given number
	 */
	Buff(nBufIndex: number): Buff { return BuffManager.GetBuff(this.id, Entities.GetBuff(this.id, nBufIndex)) }

	/**
	 * @returns {number} count of ability points that this entity have
	 */
	get AbilityPoints(): number { return Entities.GetAbilityPoints(this.id) }

	/**
	 * @returns {number} current XP of this entity
	 */
	get CurrentXP(): number { return Entities.GetCurrentXP(this.id) }

	/**
	 * @returns {number} needed XP to next level
	 */
	get NeededXPToLevel(): number { return Entities.GetNeededXPToLevel(this.id) }

	/**
	 * @returns {Entity[]} the currently selected entities
	 */
	get SelectionEntities(): Entity[] { return Entities.GetSelectionEntities(this.id).map(EntityManager.EntityByID) }

	/**
	 * @returns {boolean} is this a valid entity index?
	 */
	get IsValidEntity(): boolean { return Entities.IsValidEntity(this.id) }

	/**
	 * @returns {boolean} Is this entity an item container in the world?
	 */
	get IsItemPhysical(): boolean { return Entities.IsItemPhysical(this.id) }

	/**
	 * @returns {Vector} world origin of this entity
	 */
	get AbsOrigin(): Vector { return new Vector(Entities.GetAbsOrigin(this.id)) }

	/**
	 * @returns {Vector} forward vector of this entity
	 */
	get Forward(): Vector { return new Vector(Entities.GetForward(this.id)) }

	/**
	 * @returns {Vector} right vector of this entity
	 */
	get Right(): Vector { return new Vector(Entities.GetRight(this.id)) }

	/**
	 * @returns {Vector} up vector of this entity
	 */
	get Up(): Vector { return new Vector(Entities.GetUp(this.id)) }

	/**
	 * I don't think that's working
	 * @returns {Item} item contained in this physical item container
	 */
	get ContainedItem(): Item { return <Item> EntityManager.EntityByID(Entities.GetContainedItem(this.id)) }

	/**
	 * @returns {number} attack damage of this entity (Entity#DamageMin + Entity#DamageBonus)
	 */
	get Damage(): number { return Entities.GetDamageMin(this.id) + Entities.GetDamageBonus(this.id) }

	/**
	 * Useful to know if enemy gone to FoW
	 * @returns {boolean} isn't this entity in FoW?
	 */
	get IsVisible(): boolean { return EntityManager.Entities.some(ent => ent.id === this.id) }

	/**
	 * @returns {boolean} is this entity alive?
	 */
	get IsAlive(): boolean { return Entities.IsAlive(this.id) }

	/**
	 * @returns {number} HP bar screen offset from entity world origin
	 */
	get HealthBarOffset(): number { return Entities.GetHealthBarOffset(this.id) }

	/**
	 * @returns {number} ideal speed of this entity
	 */
	get Speed(): number { return Entities.GetIdealSpeed(this.id) }

	/**
	 * @param {number} abilNum ability number
	 * @returns {Ability} ability under given number
	 */
	Ability(abilNum: number): Ability { return <Ability> EntityManager.EntityByID(Entities.GetAbility(this.id, abilNum)) }

	/**
	 * @returns {number} current HP amount of this entity
	 */
	get Health(): number { return Entities.GetHealth(this.id) }

	/**
	 * @returns {number} current HP percent of this entity
	 */
	get HealthPercent(): number { return Entities.GetHealthPercent(this.id) }

	/**
	 * @returns {number} max HP of this entity
	 */
	get MaxHealth(): number { return Entities.GetMaxHealth(this.id) }

	/**
	 * @returns {number} HP regeneration per tick of this entity
	 */
	get HealthThinkRegen(): number { return Entities.GetHealthThinkRegen(this.id) }

	/**
	 * @returns {number} current mana amount of this entity
	 */
	get Mana(): number { return Entities.GetMana(this.id) }

	/**
	 * @returns {number} current mana percent of this entity
	 */
	get ManaPercent(): number { return this.Mana / this.MaxMana * 100 }

	/**
	 * @returns {number} max mana of this entity
	 */
	get MaxMana(): number { return Entities.GetMaxMana(this.id) }

	/**
	 * @returns {number} mana regeneration per tick of this entity
	 */
	get ManaThinkRegen(): number { return Entities.GetManaThinkRegen(this.id) }

	// Corona Functions
	/**
	 * @returns {Ability[]} ability array of this entity (except talents and generics)
	 */
	get Abilities(): Ability[] {
		var abils = []
		for(let m = 0; m < this.AbilityCount; m++)
			abils.push(this.Ability(m))

		return abils.filter(abil => abil !== undefined && !/^(?:special_bonus_.*|generic_hidden)$/.test(abil.AbilityName))
	}

	/**
	 * @returns {boolean} is this entity tree?
	 */
	get IsTree(): boolean { return this.IsValidEntity && this.id > 16384 }

	/**
	 * @returns {boolean} does enemies have true sight at this entity?
	 */
	get IsTrueSighted(): boolean { return this.Buffs.some(buff => ["modifier_item_dustofappearance", "modifier_truesight"].indexOf(buff.Name) > -1) }

	/**
	 * @returns {boolean} is this entity true sighter/not invisible?
	 */
	get CanBeVisible(): boolean { return !(!this.IsTrueSighted && this.IsInvisible) }

	/**
	 * @returns {boolean} is this entity rune?
	 */
	get IsRune(): boolean { return this.IsValidEntity && !this.IsTree && !this.IsSelectable && !this.IsItemPhysical && !this.IsAlive }

	/**
	 * @returns {boolean} is this entity mine?
	 */
	get IsMine(): boolean { return ["npc_dota_techies_remote_mine", "npc_dota_techies_stasis_trap"].indexOf(this.UnitName) > -1 }

	/**
	 * @returns {Vector} position of this entity after force staff usage
	 */
	get ForceStaffPos(): Vector { return this.InFront(Corona.ForceStaffUnits) }

	/**
	 * @returns {number} returns ideal speed of this entity if it's moving or 0 if it isn't moving
	 */
	get Speed_IsMoving(): number { return this.IsMoving && !this.IsRooted && !this.IsStunned ? this.Speed : 0 }

	/**
	 * @returns {Buff[]} buff array of this entity
	 */
	get Buffs(): Buff[] {
		var buffs = []
		for(let i = 0; i < this.NumBuffs; i++)
			buffs.push(this.Buff(i))
		return buffs
	}

	/**
	 * @returns {String[]} array of buff names of this entity
	 */
	get BuffsNames(): string[] { return this.Buffs.map(buff => buff.Name) }

	/**
	 * @returns {Item[]} items located in inventory of this entity
	 */
	get Inventory(): Item[] {
		var inv = []
		for(let i = 0; i < 6; i++) {
			var item = this.ItemInSlot(i)
			inv.push(item)
		}
		return inv
	}

	/**
	 * @returns {Item[]} items located in inventory and backpack of this entity
	 */
	get UnitItems(): Item[] { return this.Inventory.concat(this.BackpackItems) }

	/**
	 * @returns {Item[]} items located in backpack of this entity
	 */
	get BackpackItems(): Item[] {
		var inv = []
		for(let i = 6; i < 9; i++) {
			var item = this.ItemInSlot(i)
			inv.push(item)
		}
		return inv
	}

	/**
	 * @returns {Item[]} items located in stash of this entity
	 */
	get StashItems(): Item[] {
		var inv = []
		for(let i = 9; i < 15; i++) {
			var item = this.ItemInSlot(i)
			inv.push(item)
		}
		return inv
	}

	/**
	 * @param {number} maxRange maximum range from this entity to search
	 * @param {Entity[]} ents entities that script will iterate over
	 * @param {Entity[]} ignore entities that must be ignored
	 * @returns {Entity} nearest entity to this entity
	 */
	FindNearestEntity(maxRange: number, ents: Entity[], ignore: Entity[] = []): Entity {
		var ret = ents.reduce((prev, cur) => {
			if(!prev || prev.id === this.id || ignore.indexOf(prev) > 0)
				return cur
			if(cur.id === this.id || ignore.indexOf(cur) > 0)
				return prev

			if(this.RangeToUnit(cur) < this.RangeToUnit(prev) && this.RangeToUnit(cur) <= maxRange)
				return cur
			else
				return this.RangeToUnit(prev) <= maxRange ? prev : undefined
		})
		return ret !== this ? ret : undefined
	}

	/**
	 * @param {number} delta delta of current forward angle
	 * @returns {Vector} this entity's rotated forward angle by delta
	 */
	Vector3FromPolarAngle(delta: number): Vector { return Utils.Angle2Vector(this.Forward.Angle + delta) }

	/**
	 * @param {number} dist distance in units
	 * @returns {Vector} this entity vector extended forward by given amount of units
	 */
	InFront(dist: number = this.Speed_IsMoving): Vector { return this.AbsOrigin.VectorRotation(this.Forward, dist) }

	/**
	 * @param {Vector} vec vector which will act as 2nd vector
	 * @returns {number} rotation angle of this entity to given vector
	 */
	FindRotationAngle(vec: Vector): number {
		var entPos = this.AbsOrigin,
			angle = Math.abs(Math.atan2(vec.z - entPos.z, vec.x - entPos.x) - this.Forward.Angle)

		if (angle > Math.PI)
			angle = Math.abs((Math.PI * 2) - angle)

		return angle
	}

	/**
	 * @param {number} time in ticks
	 * @returns {number} health of this entity after given amount of ticks
	 */
	HealthAfter(time: number): number {
		var curHP = this.Health,
			maxHP = this.MaxHealth
		return curHP + Math.min(this.HealthThinkRegen * time, maxHP - curHP)
	}

	/**
	 * @param {string} buffName buff name to search (ex.: modifier_teleporting)
	 * @returns {Buff} 1st buff with given name
	 */
	BuffByName(buffName: string): Buff {
		var ret = undefined
		this.Buffs.some(buff => {
			if(buff.Name === buffName) {
				ret = buff
				return true
			}

			return false
		})

		return ret
	}

	/**
	 * @param {number} nSlotIndex slot ID
	 * @returns {Item} item at given slot ID
	 */
	ItemInSlot(nSlotIndex: number): Item {
		var item: Item = EntityManager.EntityByID(Entities.GetItemInSlot(this.id, nSlotIndex))
		if(item !== undefined && (item.owner === undefined || item.owner !== this))
			item.owner = this
		return item
	}

	/**
	 * @param {string | RegExp} name item name to search (ex.: item_tango)
	 * @returns {Item} 1st item with given name
	 */
	ItemByName(name: string | RegExp): Item {
		var found
		this.Inventory.filter(item => item !== undefined).some(item => {
			if(name instanceof RegExp ? name.test(item.AbilityName) : item.AbilityName === name) {
				found = item
				return true
			}
			return false
		})
		return found
	}

	/**
	 * @param {string | RegExp} name ability name to search (ex.: axe_culling_blade)
	 * @returns {Ability} 1st ability with given name
	 */
	AbilityByName(name: string | RegExp): Ability {
		var ab
		if(name instanceof RegExp) {
			this.Abilities
				.filter(abil => name.test(abil.AbilityName))
				.every(abil => {
					ab = abil
					return false
				})
			if(ab)
				return ab
		} else
			return EntityManager.EntityByID(Entities.GetAbilityByName(this.id, name))
	}

	/**
	 * @param {string | RegExp} name item/ability name to search
	 * @returns {Ability | Item} 1st found ability/item with given name
	 */
	NByName(name: string | RegExp): Ability | Item { return this.AbilityByName(name) || this.ItemByName(name) }

	/**
	 * @param {number} time time (ex.: castpoint)
	 * @returns {boolean} does this entity will have linken after given time?
	 */
	HasLinkenAtTime(time: number = 0): boolean {
		var sphere = this.ItemByName("item_sphere")

		return (
			sphere !== undefined &&
			sphere.CooldownTimeRemaining - time <= 0
		) || this.BuffByName("modifier_item_sphere_target") !== undefined
	}

	/**
	 * @param {number} time time of waypoint
	 * @param {number} movespeed which movespeed will be used for calculations
	 * @returns {Vector} velocity waypoint of entity at given time and movespeed
	 */
	VelocityWaypoint(time: number, movespeed: number = this.Speed_IsMoving): Vector { return this.InFront(movespeed * time) }

	/**
	 * Use only to detect magic damage ignore buffs
	 * @returns {number} magic multiplier for this entity
	 */
	get MagicMultiplier(): number {
		var multiplier = this.MagicalArmorValue

		if(Utils.IntersectArrays(this.BuffsNames, IgnoreBuffs[DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL]) || multiplier == 1)
			return 0

		return 1 + multiplier
	}

	/**
	 * Calculates absorbed damage amount of given type
	 * @param {DAMAGE_TYPES} damageType damage type
	 * @returns {number} absorbed damage
	 */
	AbsorbedDamage(damageType: number): number {
		var dmg = 0
		this.Buffs.forEach(enemyBuff => {
			var abil = enemyBuff.Ability
			if(abil === undefined)
				return
			
			var absorbBuff = BuffsAbsorbMagicDmg[abil.AbilityName]
			if(absorbBuff === undefined || (absorbBuff.damageType !== DAMAGE_TYPES.DAMAGE_TYPE_ALL && absorbBuff.damageType !== damageType))
				return

			dmg += absorbBuff.absorbsF(abil, dmg)
		})

		return dmg
	}

	/**
	 * @param {number} damage damage amount
	 * @param {DAMAGE_TYPES} damage_type damage type
	 * @returns {number} damage that this entity will receive
	 */
	CalculateDamage(damage: number, damage_type: number): number {
		damage -= this.AbsorbedDamage(damage_type)

		var buffs = this.BuffsNames
		if(damage <= 0 || Utils.IntersectArrays(buffs, IgnoreBuffs[damage_type]) || Utils.IntersectArrays(buffs, IgnoreBuffs[DAMAGE_TYPES.DAMAGE_TYPE_ALL]))
			return 0

		switch(damage_type) {
			case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
				damage *= 1 - this.MagicalArmorValue
				break
			case DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL:
				var armor = this.PhysicalArmorValue
				damage *= (1 - (armor * 0.05) / (1 + Math.abs(armor) * 0.05))
				
				if(this.Classname == "npc_dota_creep_siege" || this.IsTower)
					damage *= 0.5
				break
			case DAMAGE_TYPES.DAMAGE_TYPE_NONE:
				damage = 0
				break
			case DAMAGE_TYPES.DAMAGE_TYPE_HP_REMOVAL:
			case DAMAGE_TYPES.DAMAGE_TYPE_PURE:
			case DAMAGE_TYPES.DAMAGE_TYPE_ALL:
			default:
				break
		}

		return damage
	}

	toString() { return this.id }
}

module.exports = { Entity }