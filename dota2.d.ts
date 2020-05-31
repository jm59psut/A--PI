// made by 12548
// modified and decorated by snajdovski

declare var $: $;
declare var panorama: $;
declare var GameEvents: CDOTA_PanoramaScript_GameEvents;
declare var GameUI: CDOTA_PanoramaScript_GameUI;
declare var CustomNetTables: CDOTA_PanoramaScript_CustomNetTables;
declare var Players: CScriptBindingPR_Players;
declare var Entities: CScriptBindingPR_Entities;
declare var Abilities: CScriptBindingPR_Abilities;
declare var Items: CScriptBindingPR_Items;
declare var Game: CScriptBindingPR_Game;
declare var Buffs: Buffs;
declare var Particles: Particles

type js_raw_args = any;
type unknown_variant_type = any;
type js_value = any;
type js_object = Object;

interface Particles {
	/**
	 * Creates a new particle effect for local player
	 */
	CreateParticle(particleName: string, particleAttach: number, entityIndex: number): number
	/**
	 * Frees the specified particle index
	 */
	ReleaseParticleIndex(particleId: number)
	/**
	 * Destroys particle.
	 */
	DestroyParticleEffect(particleID: number, immediately: boolean)
	/**
	 * Set the control point data for a control on a particle effect
	 */
	SetParticleControl(particleId: number, controlIndex: number, controlData: number[])
	SetParticleControlEnt(particleId: number, controlIndex: number, entityIndex: number, int_4: number, attach_name: string, Vector_6: number[], bool_7: boolean)
	SetParticleControlForward(particleId: number, controlIndex: number, vForward: number[])
	SetParticleAlwaysSimulate(particleId: number)
}

interface Buffs {
	GetName(nEntityOwner, nBuffID): string
	GetClass(nEntityOwner, nBuffID): string
	GetTexture(nEntityOwner, nBuffID): string
	GetDuration(nEntityOwner, nBuffID): number
	GetDieTime(nEntityOwner, nBuffID): number
	GetRemainingTime(nEntityOwner, nBuffID): number
	GetElapsedTime(nEntityOwner, nBuffID): number
	GetCreationTime(nEntityOwner, nBuffID): number
	GetStackCount(nEntityOwner, nBuffID): number
	IsDebuff(nEntityOwner, nBuffID): boolean
	IsHidden(nEntityOwner, nBuffID): boolean
	/**
	 * Get the owner of the ability responsible for the modifier.
	 */
	GetCaster(nEntityOwner, nBuffID)
	/**
	 * Get the unit the modifier is parented to.
	 */
	GetParent(nEntityOwner, nBuffID)
	/**
	 * Get the ability that generated the modifier.
	 */
	GetAbility(nEntityOwner, nBuffID)
}

interface CDOTA_PanoramaScript_GameEvents{
	/**
	 * Subscribe to a game event
	 */
	Subscribe(pEventName: string, funcVal: Function): number
	/**
	 * Unsubscribe from a game event
	 */
	Unsubscribe(nCallbackHandle: number)
	/**
	 * Send a custom game event
	 */
	SendCustomGameEventToServer(pEventName: string, eventArgs: Object)
	/**
	 * Send a client-side event using gameeventmanager (only useful for a few specific events)
	 */
	SendEventClientSide(pEventName: string, eventArgs: Object)

}

interface CDOTA_PanoramaScript_GameUI{

	/**
	 * Control whether the default UI is enabled
	 */
	SetDefaultUIEnabled(nElementType: number, bVisible: boolean): void
	/**
	 * Get the current UI configuration
	 */
	CustomUIConfig(): any
	/**
	 * Create a minimap ping at the given location
	 */
	PingMinimapAtLocation(vec3: [number, number, number]): void
	/**
	 * Install a mouse input filter
	 */
	SetMouseCallback(callbackFn: Function): void
	EnableAliMode(bEnable: boolean, nPort: number,  offsetVal: number, nScale: number)
	/**
	 * Get the current mouse position.
	 */
	GetCursorPosition(): [number, number]
	/**
	 * Return the entity index of the entity under the given screen position.
	 */
	FindScreenEntities(screenLocVec2: [number, number]): Array<any>
	/**
	 * Get the world position of the screen position, or null if the cursor is out of the world.
	 */
	GetScreenWorldPosition(screenLocVec2: [number, number]): [number, number, number]
	/**
	 * Install a mouse input filter
	 */
	WasMousePressed(nButtonNum: number): boolean
	/**
	 * Install a mouse input filter
	 */
	WasMouseDoublePressed(nButtonNum: number): boolean
	/**
	 * Install a mouse input filter
	 */
	IsMouseDown(nButtonNum: number): boolean
	/**
	 * Is the shift button pressed?
	 */
	IsShiftDown(): boolean
	/**
	 * Is the alt button pressed?
	 */
	IsAltDown(): boolean
	/**
	 * Is the control button pressed?
	 */
	IsControlDown(): boolean
	/**
	 * Get the current UI click interaction mode.
	 */
	GetClickBehaviors(): CLICK_BEHAVIORS
	/**
	 * DEPRECATED: usually you don't need this.
	 * Select a unit, adding it to the group or replacing the current selection.
	 */
	SelectUnit(nEntityIndex: number, bAddToGroup: boolean)
	/**
	 * Set the minimum camera pitch angle.
	 */
	SetCameraPitchMin(flPitchMin: number): void
	/**
	 * Set the maximum camera pitch angle.
	 */
	SetCameraPitchMax(flPitchMax: number): void
	/**
	 * Set the camera's yaw.
	 */
	SetCameraYaw(flCameraYaw: number): void
	/**
	 * Offset the camera's look at point.
	 */
	SetCameraLookAtPositionHeightOffset(flCameraLookAtHeightOffset: number): void
	/**
	 * Set the camera distance from the look at point.
	 */
	SetCameraDistance(flDistance: number): void
	/**
	 * Set the gap between the bottom of the screen and the game rendering viewport. (Value expressed as pixels in a normalized 1024x768 viewport.)
	 */
	SetRenderBottomInsetOverride(nInset: number): void
	/**
	 * Set the gap between the top of the screen and the game rendering viewport. (Value expressed as pixels in a normalized 1024x768 viewport.)
	 */
	SetRenderTopInsetOverride(nInset: number): void
	/**
	 * Set the camera target for the local player, or -1 to clear.
	 */
	SetCameraTarget(nTargetEntIndex: number): void

}

interface CDOTA_PanoramaScript_CustomNetTables{

	/**
	 * Get a key from a custom net table
	 */
	GetTableValue(pTableName: string, pKeyName: string)
	/**
	 * Get all values from a custom net table
	 */
	GetAllTableValues(pTableName: string)
	/**
	 * Register a callback when a particular custom net table changes
	 */
	SubscribeNetTableListener(tableName: string, callback:Function): any
	/**
	 * Unsubscribe from a game event
	 */
	UnsubscribeNetTableListener(nCallbackHandle: number): any

}

interface CScriptBindingPR_Players {
	/**
	 * Get the maximum number of players in the game.
	 */
	GetMaxPlayers(): number
	/**
	 * Get the maximum number of players on teams.
	 */
	GetMaxTeamPlayers(): number
	/**
	 * Get the local player ID.
	 */
	GetLocalPlayer(): number
	/**
	 * Is the nth player a valid player?
	 */
	IsValidPlayerID(iPlayerID: number): boolean
	/**
	 * Return the name of a player.
	 */
	GetPlayerName(iPlayerID: number): string
	/**
	 * Get the entity index of the hero controlled by this player.
	 */
	GetPlayerHeroEntityIndex(iPlayerID: number): number
	/**
	 * Get the entities this player has selected.
	 */
	GetSelectedEntities(iPlayerID: number): number[]
	/**
	 * Get the entities this player is querying.
	 */
	GetQueryUnit(iPlayerID: number): number
	/**
	 * Get local player current portrait unit. (ie. Player's hero or primary selected unit.)
	 */
	GetLocalPlayerPortraitUnit(): number
	/**
	 * Can the player buy back?
	 */
	CanPlayerBuyback(iPlayerID: number): boolean
	/**
	 * Does this player have a custom game ticket?
	 */
	HasCustomGameTicketForPlayerID(iPlayerID: number): boolean
	/**
	 * The number of assists credited to a player.
	 */
	GetAssists(iPlayerID: number): number
	GetClaimedDenies(iPlayerID: number): number
	GetClaimedMisses(iPlayerID: number): number
	/**
	 * The number of deaths a player has suffered.
	 */
	GetDeaths(iPlayerID: number): number
	/**
	 * The number of denies credited to a player.
	 */
	GetDenies(iPlayerID: number): number
	/**
	 * The amount of gold a player has.
	 */
	GetGold(iPlayerID: number): number
	/**
	 * The number of kills credited to a player.
	 */
	GetKills(iPlayerID: number): number
	GetLastBuybackTime(iPlayerID: number): number
	GetLastHitMultikill(iPlayerID: number): number
	/**
	 * The number of last hits credited to a player.
	 */
	GetLastHits(iPlayerID: number): number
	GetLastHitStreak(iPlayerID: number): number
	/**
	 * The current level of a player.
	 */
	GetLevel(iPlayerID: number): number
	GetMisses(iPlayerID: number): number
	GetNearbyCreepDeaths(iPlayerID: number): number
	/**
	 * Total reliable gold for this player.
	 */
	GetReliableGold(iPlayerID: number): number
	GetRespawnSeconds(iPlayerID: number): number
	GetStreak(iPlayerID: number): number
	/**
	 * Total gold earned in this game by this player.
	 */
	GetTotalEarnedGold(iPlayerID: number): number
	/**
	 * Total xp earned in this game by this player.
	 */
	GetTotalEarnedXP(iPlayerID: number): number
	/**
	 * Total unreliable gold for this player.
	 */
	GetUnreliableGold(iPlayerID: number): number
	/**
	 * Get the team this player is on.
	 */
	GetTeam(iPlayerID: number): number
	/**
	 * Average gold earned per minute for this player.
	 */
	GetGoldPerMin(iPlayerID: number): number
	/**
	 * Average xp earned per minute for this player.
	 */
	GetXPPerMin(iPlayerID: number): number
	/**
	 * Return the name of the hero a player is controlling.
	 */
	GetPlayerSelectedHero(iPlayerID: number): string
	/**
	 * Get the player color.
	 * @returns raw number (RGB), you need to turn it into HEX
	 */
	GetPlayerColor(iPlayerID: number): number
	/**
	 * Is this player a spectator.
	 */
	IsSpectator(iPlayerID: number): boolean
	PlayerPortraitClicked(nClickedPlayerID: number, bHoldingCtrl: boolean,  bHoldingAlt: boolean)
	BuffClicked(nEntity: number, nBuffSerial: number,  bAlert: boolean)
}

interface CScriptBindingPR_Entities {
	GetHealthBarOffset(nEntityIndex: number): number
	IsMoving(nEntityIndex: number): boolean
	/**
	 * Get the world origin of the entity.
	 */
	GetAbsOrigin(nEntityIndex: number): [number, number, number]
	/**
	 * Get the forward vector of the entity.
	 */
	GetForward(nEntityIndex: number): [number, number, number]
	/**
	 * Get the right vector of the entity.
	 */
	GetRight(nEntityIndex: number): [number, number, number]
	/**
	 * Get the up vector of the entity.
	 */
	GetUp(nEntityIndex: number): [number, number, number]
	/**
	 * Get all the building
	 */
	GetAllBuildingEntities(): number[]
	/**
	 * Get all the hero
	 */
	GetAllHeroEntities(): number[]
	/**
	 * Get all the entities with a given name.
	 */
	GetAllEntitiesByName(pszName: string): number[]
	/**
	 * Get all the entities with a given classname.
	 */
	GetAllEntitiesByClassname(pszName: string): number[]
	/**
	 * Get all the creature
	 */
	GetAllCreatureEntities(): number[]
	/**
	 * Get all the
	 */
	GetAllEntities(): number[]
	CanBeDominated(nEntityIndex: number): boolean
	HasAttackCapability(nEntityIndex: number): boolean
	HasCastableAbilities(nEntityIndex: number): boolean
	HasFlyingVision(nEntityIndex: number): boolean
	HasFlyMovementCapability(nEntityIndex: number): boolean
	HasGroundMovementCapability(nEntityIndex: number): boolean
	HasMovementCapability(nEntityIndex: number): boolean
	HasScepter(nEntityIndex: number): boolean
	HasUpgradeableAbilities(nEntityIndex: number): boolean
	HasUpgradeableAbilitiesThatArentMaxed(nEntityIndex: number): boolean
	IsAlive(nEntityIndex: number): boolean
	IsAncient(nEntityIndex: number): boolean
	IsAttackImmune(nEntityIndex: number): boolean
	IsBarracks(nEntityIndex: number): boolean
	IsBlind(nEntityIndex: number): boolean
	IsBoss(nEntityIndex: number): boolean
	IsRoshan(nEntityIndex: number): boolean
	IsBuilding(nEntityIndex: number): boolean
	IsCommandRestricted(nEntityIndex: number): boolean
	IsConsideredHero(nEntityIndex: number): boolean
	IsControllableByAnyPlayer(nEntityIndex: number): boolean
	IsCourier(nEntityIndex: number): boolean
	IsCreature(nEntityIndex: number): boolean
	IsCreep(nEntityIndex: number): boolean
	IsCreepHero(nEntityIndex: number): boolean
	IsDeniable(nEntityIndex: number): boolean
	IsDominated(nEntityIndex: number): boolean
	IsEnemy(nEntityIndex: number): boolean
	IsEvadeDisabled(nEntityIndex: number): boolean
	IsFort(nEntityIndex: number): boolean
	IsFrozen(nEntityIndex: number): boolean
	IsGeneratedByEconItem(nEntityIndex: number): boolean
	IsHallofFame(nEntityIndex: number): boolean
	IsDisarmed(nEntityIndex: number): boolean
	IsHero(nEntityIndex: number): boolean
	IsHexed(nEntityIndex: number): boolean
	IsIllusion(nEntityIndex: number): boolean
	IsInRangeOfFountain(nEntityIndex: number): boolean
	IsInventoryEnabled(nEntityIndex: number): boolean
	IsInvisible(nEntityIndex: number): boolean
	IsInvulnerable(nEntityIndex: number): boolean
	IsLaneCreep(nEntityIndex: number): boolean
	IsLowAttackPriority(nEntityIndex: number): boolean
	IsMagicImmune(nEntityIndex: number): boolean
	IsMechanical(nEntityIndex: number): boolean
	IsMuted(nEntityIndex: number): boolean
	IsNeutralUnitType(nEntityIndex: number): boolean
	IsNightmared(nEntityIndex: number): boolean
	IsOther(nEntityIndex: number): boolean
	IsOutOfGame(nEntityIndex: number): boolean
	IsOwnedByAnyPlayer(nEntityIndex: number): boolean
	IsPhantom(nEntityIndex: number): boolean
	IsRangedAttacker(nEntityIndex: number): boolean
	IsRealHero(nEntityIndex: number): boolean
	IsRooted(nEntityIndex: number): boolean
	IsSelectable(nEntityIndex: number): boolean
	IsShop(nEntityIndex: number): boolean
	IsSilenced(nEntityIndex: number): boolean
	IsSpeciallyDeniable(nEntityIndex: number): boolean
	IsStunned(nEntityIndex: number): boolean
	IsSummoned(nEntityIndex: number): boolean
	IsTower(nEntityIndex: number): boolean
	IsUnselectable(nEntityIndex: number): boolean
	IsWard(nEntityIndex: number): boolean
	IsZombie(nEntityIndex: number): boolean
	NoHealthBar(nEntityIndex: number): boolean
	NoTeamMoveTo(nEntityIndex: number): boolean
	NoTeamSelect(nEntityIndex: number): boolean
	NotOnMinimap(nEntityIndex: number): boolean
	NotOnMinimapForEnemies(nEntityIndex: number): boolean
	NoUnitCollision(nEntityIndex: number): boolean
	PassivesDisabled(nEntityIndex: number): boolean
	ProvidesVision(nEntityIndex: number): boolean
	UsesHeroAbilityNumbers(nEntityIndex: number)
	GetAbilityCount(nEntityIndex: number) :number
	GetCombatClassAttack(nEntityIndex: number): any
	GetCombatClassDefend(nEntityIndex: number) :any
	GetCurrentVisionRange(nEntityIndex: number): number
	GetDamageBonus(nEntityIndex: number): number
	GetDamageMax(nEntityIndex: number): number
	GetDamageMin(nEntityIndex: number): number
	GetDayTimeVisionRange(nEntityIndex: number): number
	GetHealth(nEntityIndex: number): number
	GetHealthPercent(nEntityIndex: number): number
	GetHealthThinkRegen(nEntityIndex: number): number
	GetLevel(nEntityIndex: number): number
	GetMaxHealth(nEntityIndex: number): number
	GetNightTimeVisionRange(nEntityIndex: number): number
	GetStates(nEntityIndex: number): number
	GetTotalPurchasedUpgradeGoldCost(nEntityIndex: number): number
	GetTeamNumber(nEntityIndex: number): number
	GetAttackRange(nEntityIndex: number): number
	GetAttackSpeed(nEntityIndex: number): number
	GetAttacksPerSecond(nEntityIndex: number): number
	GetBaseAttackTime(nEntityIndex: number): number
	GetBaseMagicalResistanceValue(nEntityIndex: number): number
	GetBaseMoveSpeed(nEntityIndex: number): number
	GetBonusPhysicalArmor(nEntityIndex: number): number
	GetCollisionPadding(nEntityIndex: number): number
	GetEffectiveInvisibilityLevel(nEntityIndex: number): number
	GetHasteFactor(nEntityIndex: number): number
	GetHullRadius(nEntityIndex: number): number
	GetIdealSpeed(nEntityIndex: number): number
	GetIncreasedAttackSpeed(nEntityIndex: number): number
	GetMana(nEntityIndex: number): number
	GetManaThinkRegen(nEntityIndex: number): number
	GetMaxMana(nEntityIndex: number): number
	GetMagicalArmorValue(nEntityIndex: number): number
	GetPaddedCollisionRadius(nEntityIndex: number): number
	GetPercentInvisible(nEntityIndex: number): number
	GetPhysicalArmorValue(nEntityIndex: number): number
	GetProjectileCollisionSize(nEntityIndex: number): number
	GetRingRadius(nEntityIndex: number): number
	GetSecondsPerAttack(nEntityIndex: number): number
	ManaFraction(nEntityIndex: number): number
	GetClassname(nEntityIndex: number): string
	GetDisplayedUnitName(nEntityIndex: number): string
	GetSelectionGroup(nEntityIndex: number): string
	GetSoundSet(nEntityIndex: number): string
	GetUnitLabel(nEntityIndex: number): string
	GetUnitName(nEntityIndex: number): string
	GetTotalDamageTaken(nEntityIndex: number): number
	IsControllableByPlayer(nEntityIndex: number, nPlayerIndex: number): boolean
	GetChosenTarget(nEntityIndex: number): number
	HasItemInInventory(nEntityIndex: number, pItemName: string): boolean
	GetRangeToUnit(nEntityIndex: number, nEntityIndex2: number): number
	IsEntityInRange(nEntityIndex: number, nEntityIndex2: number,  flRange: number): boolean
	GetMoveSpeedModifier(nEntityIndex: number, flBaseSpeed: number): any
	CanAcceptTargetToAttack(nEntityIndex: number, nEntityIndex2: number): boolean
	InState(nEntityIndex: number, nState: number)
	GetArmorForDamageType(nEntityIndex: number, iDamageType: number)
	GetArmorReductionForDamageType(nEntityIndex: number, iDamageType: number)
	IsInRangeOfShop(nEntityIndex: number, iShopType: number,  bSpecific: boolean): boolean
	GetNumItemsInStash(nEntityIndex: number)
	GetNumItemsInInventory(nEntityIndex: number)
	GetItemInSlot(nEntityIndex: number, nSlotIndex: number)
	GetAbility(nEntityIndex: number, nSlotIndex: number)
	GetAbilityByName(nEntityIndex: number, pszAbilityName: string)
	GetNumBuffs(nEntityIndex: number)
	GetBuff(nEntityIndex: number, nBufIndex: number)
	GetAbilityPoints(nEntityIndex: number)
	GetCurrentXP(nEntityIndex: number)
	GetNeededXPToLevel(nEntityIndex: number)
	/**
	 * Get the currently selected entities
	 */
	GetSelectionEntities(nEntityIndex: number)
	/**
	 * Is this a valid entity index?
	 */
	IsValidEntity(nEntityIndex: number): boolean
	/**
	 * Is this entity an item container in the world?
	 */
	IsItemPhysical(nEntityIndex: number): boolean
	/**
	 * Get the item contained in this physical item container.
	 */
	GetContainedItem(nEntityIndex: number)

}

interface CScriptBindingPR_Abilities {
	LocalPlayerActiveAbility(): number
	GetAbilityName(nEntityIndex: number)
	GetAbilityTextureName(nEntityIndex: number)
	GetAssociatedPrimaryAbilities(nEntityIndex: number)
	GetAssociatedSecondaryAbilities(nEntityIndex: number)
	GetHotkeyOverride(nEntityIndex: number)
	GetIntrinsicModifierName(nEntityIndex: number)
	GetSharedCooldownName(nEntityIndex: number)
	AbilityReady(nEntityIndex: number)
	/**
	 * Returns an AbilityLearnResult_t
	 */
	CanAbilityBeUpgraded(nEntityIndex: number): number
	CanBeExecuted(nEntityIndex: number): boolean
	GetAbilityDamage(nEntityIndex: number)
	GetAbilityDamageType(nEntityIndex: number)
	GetAbilityTargetFlags(nEntityIndex: number)
	GetAbilityTargetTeam(nEntityIndex: number)
	GetAbilityTargetType(nEntityIndex: number)
	GetAbilityType(nEntityIndex: number)
	GetBehavior(nEntityIndex: number)
	GetCastRange(nEntityIndex: number)

	GetChannelledManaCostPerSecond(nEntityIndex: number)
	GetCurrentCharges(nEntityIndex: number)
	GetEffectiveLevel(nEntityIndex: number)
	GetHeroLevelRequiredToUpgrade(nEntityIndex: number)
	GetLevel(nEntityIndex: number)
	GetManaCost(nEntityIndex: number)
	GetMaxLevel(nEntityIndex: number)
	AttemptToUpgrade(nEntityIndex: number)
	CanLearn(nEntityIndex: number)
	GetAutoCastState(nEntityIndex: number)
	GetToggleState(nEntityIndex: number)
	HasScepterUpgradeTooltip(nEntityIndex: number)
	IsActivated(nEntityIndex: number): boolean
	IsActivatedChanging(nEntityIndex: number): boolean
	IsAttributeBonus(nEntityIndex: number): boolean
	IsAutocast(nEntityIndex: number): boolean
	IsCooldownReady(nEntityIndex: number): boolean
	IsDisplayedAbility(nEntityIndex: number): boolean
	IsHidden(nEntityIndex: number): boolean
	IsHiddenWhenStolen(nEntityIndex: number): boolean
	IsInAbilityPhase(nEntityIndex: number): boolean
	IsItem(nEntityIndex: number): boolean
	IsMarkedAsDirty(nEntityIndex: number): boolean
	IsMuted(nEntityIndex: number): boolean
	IsOnCastbar(nEntityIndex: number): boolean
	IsOnLearnbar(nEntityIndex: number): boolean
	IsOwnersGoldEnough(nEntityIndex: number): boolean
	IsOwnersGoldEnoughForUpgrade(nEntityIndex: number): boolean
	IsOwnersManaEnough(nEntityIndex: number): boolean
	IsPassive(nEntityIndex: number): boolean
	IsRecipe(nEntityIndex: number): boolean
	IsSharedWithTeammates(nEntityIndex: number): boolean
	IsStealable(nEntityIndex: number): boolean
	IsStolen(nEntityIndex: number): boolean
	IsToggle(nEntityIndex: number): boolean
	GetAOERadius(nEntityIndex: number)
	GetBackswingTime(nEntityIndex: number)
	GetCastPoint(nEntityIndex: number)
	GetChannelStartTime(nEntityIndex: number)
	GetChannelTime(nEntityIndex: number)
	GetCooldown(nEntityIndex: number)
	GetCooldownLength(nEntityIndex: number)
	GetCooldownTime(nEntityIndex: number)
	GetCooldownTimeRemaining(nEntityIndex: number)
	GetDuration(nEntityIndex: number)
	GetUpgradeBlend(nEntityIndex: number)
	/**
	 * Get the local player's current active ability. (Pre-cast targetting state.)
	 */
	GetLocalPlayerActiveAbility()
	GetCaster(nAbilityIndex: number)
	GetCustomValueFor(nAbilityIndex: number, pszAbilityVarName: string)
	GetLevelSpecialValueFor(nAbilityIndex: number, szName: string,  nLevel: number)
	GetSpecialValueFor(nAbilityIndex: number, szName: string)
	IsCosmetic(nAbilityIndex: number, nTargetEntityIndex: number): boolean
	/**
	 * Attempt to execute the specified ability (Equivalent to clicking the ability in the HUD action bar)
	 */
	ExecuteAbility(nAbilityEntIndex: number, nCasterEntIndex: number,  bIsQuickCast: boolean): void
	/**
	 * Attempt to double-tap (self-cast) the specified ability (Equivalent to double-clicking the ability in the HUD action bar)
	 */
	CreateDoubleTapCastOrder(nAbilityEntIndex: number, nCasterEntIndex: number): void
	/**
	 * Ping the specified ability (Equivalent to alt-clicking the ability in the HUD action bar)
	 */
	PingAbility(nAbilityIndex: number): void
	/**
	 * Returns the keybind (as a String) for the specified ability.
	 */
	GetKeybind(nAbilityEntIndex: number): string

}

interface CScriptBindingPR_Items extends CScriptBindingPR_Abilities{
	ShouldDisplayCharges(nEntityIndex: number)
	AlwaysDisplayCharges(nEntityIndex: number)
	ShowSecondaryCharges(nEntityIndex: number)
	CanBeSoldByLocalPlayer(nEntityIndex: number)
	CanDoubleTapCast(nEntityIndex: number)
	ForceHideCharges(nEntityIndex: number)
	IsAlertableItem(nEntityIndex: number): boolean
	IsCastOnPickup(nEntityIndex: number): boolean
	IsDisassemblable(nEntityIndex: number): boolean
	IsDroppable(nEntityIndex: number): boolean
	IsInnatelyDisassemblable(nEntityIndex: number): boolean
	IsKillable(nEntityIndex: number): boolean
	IsMuted(nEntityIndex: number): boolean
	IsPermanent(nEntityIndex: number): boolean
	IsPurchasable(nEntityIndex: number): boolean
	IsRecipe(nEntityIndex: number): boolean
	IsRecipeGenerated(nEntityIndex: number): boolean
	IsSellable(nEntityIndex: number): boolean
	IsStackable(nEntityIndex: number): boolean
	ProRatesChargesWhenSelling(nEntityIndex: number)
	RequiresCharges(nEntityIndex: number)
	CanBeExecuted(nEntityIndex: number)
	GetCost(nEntityIndex: number)
	GetCurrentCharges(nEntityIndex: number)
	GetSecondaryCharges(nEntityIndex: number)
	GetDisplayedCharges(nEntityIndex: number)
	GetInitialCharges(nEntityIndex: number)
	GetItemColor(nEntityIndex: number)
	GetShareability(nEntityIndex: number)
	GetAbilityTextureSF(nEntityIndex: number)
	GetAssembledTime(nEntityIndex: number)
	GetPurchaseTime(nEntityIndex: number)
	GetPurchaser(nItemID: number)
	/**
	 * Attempt to have the local player disassemble the specified item. Returns false if the order wasn't issued.
	 */
	LocalPlayerDisassembleItem(nItem: number)
	/**
	 * Attempt to have the local player drop the specified item from its stash. Returns false if the order wasn't issued.
	 */
	LocalPlayerDropItemFromStash(nItem: number)
	/**
	 * Attempt to have the local player alert allies about the specified item. Returns false if the order wasn't issued.
	 */
	LocalPlayerItemAlertAllies(nItem: number)
	/**
	 * Attempt to have the local player move the specified item to its stash. Returns false if the order wasn't issued.
	 */
	LocalPlayerMoveItemToStash(nItem: number)
	/**
	 * Attempt to have the local player sell the specified item. Returns false if the order wasn't issued.
	 */
	LocalPlayerSellItem(nItem: number)

}

interface CScriptBindingPR_Game{
	IsGamePaused(): boolean
	Time(): number
	GetGameTime(): number
	GetDOTATime(bIncludePreGame: boolean, bIncludeNegativeTime: boolean)
	/**
	 * Return the team id of the winning team.
	 */
	GetGameWinner(): number
	GetStateTransitionTime(): number
	/**
	 * Get the difficulty setting of the
	 */
	GetCustomGameDifficulty(): number
	/**
	 * Returns true if the user has enabled flipped HUD
	 */
	IsHUDFlipped(): boolean
	/**
	 * Returns the width of the display.
	 */
	GetScreenWidth()
	/**
	 * Returns the height of the display.
	 */
	GetScreenHeight()
	/**
	 * Converts the specified x,y,z world co-ordinate into an x screen coordinate. Returns -1 if behind the camera
	 */
	WorldToScreenX(x: number, y: number,  z: number)
	/**
	 * Converts the specified x,y,z world co-ordinate into a y screen coordinate. Returns -1 if behind the camera
	 */
	WorldToScreenY(x: number, y: number,  z: number)
	/**
	 * Converts the specified x, y screen coordinates into a x, y, z world coordinates.
	 */
	ScreenXYToWorld(nX: number, nY: number)
	/**
	 * Returns the keybind (as a String) for the requested ability slot.
	 */
	GetKeybindForAbility(iSlot: number)
	GetNianFightTimeLeft()
	GetState(): DOTA_GameState
	GameStateIs(nState: number): boolean
	GameStateIsBefore(nState: number): boolean
	GameStateIsAfter(nState: number): boolean
	AddCommand(pszCommandName: string, callback: Function,  pszDescription: string, nFlags: number)
	GetLocalPlayerID()
	/**
	 * Assign the local player to the specified team
	 */
	PlayerJoinTeam(nTeamID: number)
	/**
	 * Assign the currently unassigned players to teams
	 */
	AutoAssignPlayersToTeams()
	/**
	 * Shuffle the team assignments of all of the players currently assigned to a team.
	 */
	ShufflePlayerTeamAssignments()
	/**
	 * Set the remaining seconds in team setup before the game starts. -1 to stop the countdown timer
	 */
	SetRemainingSetupTime(flSeconds: number): void
	/**
	 * Set the amount of time in seconds that will be set as the remaining time when all players are assigned to a team.
	 */
	SetAutoLaunchDelay(flSeconds: number): void
	/**
	 * Enable or disable automatically starting the game once all players are assigned to a team
	 */
	SetAutoLaunchEnabled(bEnable: boolean): void
	/**
	 * Return true of false indicating if automatically starting the game is enabled.
	 */
	GetAutoLaunchEnabled()
	/**
	 * Lock the team selection preventing players from swiching teams.
	 */
	SetTeamSelectionLocked(bLockTeams: boolean): void
	/**
	 * Returns true or false to indicate if team selection is locked
	 */
	GetTeamSelectionLocked()
	/**
	 * Get all team IDs
	 */
	GetAllTeamIDs()
	/**
	 * Get all player IDs
	 */
	GetAllPlayerIDs()
	/**
	 * Get unassigned player IDs
	 */
	GetUnassignedPlayerIDs()
	/**
	 * Get info about the player hero ultimate ability
	 */
	GetPlayerUltimateStateOrTime(nPlayerID: number)
	/**
	 * Whether the local player has muted text and voice chat for the specified player id
	 */
	IsPlayerMuted(nPlayerID: number): boolean
	/**
	 * Set whether the local player has muted text and voice chat for the specified player id
	 */
	SetPlayerMuted(nPlayerID: number, bMuted: boolean): void
	/**
	 * Get detailed information for the given team
	 */
	GetTeamDetails(nTeam: number)
	/**
	 * Get details for the local player
	 */
	GetLocalPlayerInfo()
	/**
	 * Get info about the player items.
	 */
	GetPlayerItems(nPlayerID: number)
	/**
	 * Get info about the given player
	 */
	GetPlayerInfo(nPlayerID: number)
	/**
	 * Get player IDs for the given team
	 */
	GetPlayerIDsOnTeam(nTeam: number)
	ServerCmd(pMsg: string)
	FinishGame()
	/**
	 * Emit a sound for the local player. Returns an number handle that can be passed to StopSound. (Returns 0 on failure.)
	 */
	EmitSound(pSoundEventName: string)
	/**
	 * Stop a current playing sound on the local player. Takes handle from a call to EmitSound.
	 */
	StopSound(nHandle: number)
	/**
	 * Return information about the current map.
	 */
	GetMapInfo()
	/**
	 * Orders from the local player - takes a single arguments object that supports: dotaunitorder_t OrderType, ent_index TargetIndex, vector Position, ent_index AbilityIndex, OrderIssuer_t OrderIssuer, ent_index UnitIndex, OrderQueueBehavior_t QueueBehavior, bool ShowEffects.
	 */
	PrepareUnitOrders(args: js_raw_args)
	/**
	 * Order a unit to drop the specified item at the current cursor location.
	 */
	DropItemAtCursor(nControlledUnitEnt: number, nItemEnt: number)
	EnterAbilityLearnMode()
	EndAbilityLearnMode()
	IsInAbilityLearnMode(): boolean

}

interface $ {
	(idSelector: string): Panel

	/**
	 * Log a message
	 */
	Msg(...args: any[]): void
	/**
	 * Dispatch an event
	 */
	DispatchEvent(eventName: string, eventArgs: any): void
	/**
	 * Dispatch an event to occur later
	 */
	DispatchEventAsync(delay:number, eventName: string, eventArgs: any): void
	/**
	 * Register an event handler
	 */
	RegisterEventHandler(eventName: string, context: Panel, callback: Function): void
	/**
	 * Register a handler for an event that is not otherwise handled
	 */
	RegisterForUnhandledEvent(eventName: string, callback: Function)
	/**
	 * Remove an unhandled event handler
	 */
	UnregisterForUnhandledEvent(eventNameUnconfirmYet: string)
	/**
	 * Find an element
	 */
	FindChildInContext(idSelector: string): Panel
	/**
	 * Make a web request
	 */
	AsyncWebRequest(url: string, args:Object)
	/**
	 * Create a new panel
	 */
	CreatePanel(panelType:String, parent:Panel, id:String): Panel
	/**
	 * Localize a String
	 */
	Localize(js_raw_args_1: js_raw_args): string
	/**
	 * Get the current language
	 */
	Language(): string
	/**
	 * Schedule a function to be called later
	 */
	Schedule(delay: number, callback: Function): number
	/**
	 * Cancelse a scheduled function
	 */
	CancelScheduled(scheduleID: number)
	/**
	 * Get the current panel context
	 */
	GetContextPanel(): Panel
	/**
	 * Register a key binding
	 */
	RegisterKeyBind(context:Panel, keyName:String, callback:Function)
	/**
	 * Call a function on each given item
	 */
	Each(table:Object, callback:Function)

}

interface Panel {
	visible: boolean
	enabled: boolean
	checked: boolean
	defaultfocus: boolean
	inputnamespace: boolean
	hittest: boolean
	hittestchildren: boolean
	tabindex: number
	selectionpos_x: number
	selectionpos_y :number
	id: string
	layoutfile: string
	contentwidth: number
	contentheight: number
	desiredlayoutwidth: number
	desiredlayoutheight: number
	actuallayoutwidth: number
	actuallayoutheight: number
	actualxoffset: number
	actualyoffset: number
	scrolloffset_y: number
	scrolloffset_x: number
	style: any
	rememberchildfocus: boolean
	paneltype: string
	text: string
	html: boolean
	heroname: string
	itemname: string
	abilityname: string

	AddClass(className: string): void
	RemoveClass(className:  string): void
	BHasClass(className:  string): boolean
	SetHasClass(className: string, onoff: boolean): void
	ToggleClass(className: string)
	ClearPanelEvent(eventName: string)
	SetDraggable(draggable: boolean): void
	IsDraggable(): boolean
	GetChildCount(): number
	GetChild(childIndex: number): Panel
	GetChildIndex(unknown_variant_type_1: unknown_variant_type)
	Children(): Array<Panel>
	FindChildrenWithClassTraverse(className: string): Array<Panel>
	GetParent(): Panel
	SetParent(parent: Panel): void
	FindChild(id: string): Panel
	FindChildTraverse(id: string): Panel
	FindChildInLayoutFile(id: string): Panel
	RemoveAndDeleteChildren(): void
	MoveChildBefore(panel1: Panel, panel2: Panel)
	MoveChildAfter(panel1: Panel, panel2: Panel)
	GetPositionWithinWindow()
	ApplyStyles(boolean_1: boolean)
	ClearPropertyFromCode(unknown_variant_type_1: unknown_variant_type)
	DeleteAsync(delay: number)
	BIsTransparent(): boolean
	BAcceptsInput(): boolean
	BAcceptsFocus(): boolean
	SetFocus(): void
	UpdateFocusInContext()
	BHasHoverStyle(): boolean
	SetAcceptsFocus(boolean_1: boolean): void
	SetDisableFocusOnMouseDown(boolean_1: boolean): void
	BHasKeyFocus(): boolean
	SetScrollParentToFitWhenFocused(boolean_1: boolean): void
	BScrollParentToFitWhenFocused(): boolean
	IsSelected(): boolean
	BHasDescendantKeyFocus()
	BLoadLayout(layoutFilePath: string, boolean_2: boolean,  boolean_3: boolean): boolean
	BLoadLayoutSnippet(SnippetName: string): boolean
	BLoadLayoutFromString(cString_1: string, boolean_2: boolean,  boolean_3: boolean): boolean
	LoadLayoutFromStringAsync(String_1: string, boolean_2: boolean,  boolean_3: boolean)
	LoadLayoutAsync(String_1: string, boolean_2: boolean,  boolean_3: boolean)
	BCreateChildren(String_1: string): boolean
	SetTopOfInputContext(boolean_1: boolean): void
	SetDialogVariable(String_1: string, String_2: string): void
	SetDialogVariableInt(String_1: string, number_2: number): void
	ScrollToTop()
	ScrollToBottom()
	ScrollToLeftEdge()
	ScrollToRightEdge()
	ScrollParentToMakePanelFit(unknown_variant_type_1: unknown_variant_type, boolean_2: boolean)
	BCanSeeInParentScroll(): boolean
	GetAttributeInt(String_1: string, number_2: number)
	GetAttributeString(String_1: string, String_2: string)
	GetAttributeUInt32(String_1: string, number_2: number)
	SetAttributeInt(String_1: string, number_2: number): void
	SetAttributeString(String_1: string, String_2: string): void
	SetAttributeUInt32(String_1: string, number_2: number): void
	SetInputNamespace(String_1: string): void
	RegisterForReadyEvents(boolean_1: boolean)
	BReadyForDisplay(): boolean
	SetReadyForDisplay(boolean_1: boolean): void
	SetPanelEvent(eventName: string, callback:Function): void
}

interface Button extends Panel{
}

interface Image extends Panel{
	SetImage(url: string): any
}

interface Label extends Panel{
}

interface DOTAAvatarImage extends Panel{
	steamid: number
	accountid: number
}

interface CustomUIElement extends Panel {
	//没有多内容
}

interface DOTAAbilityImage extends Panel{
	SetImage(String_1: string): void
	SetScaling(String_1: string): void
	abilityname: string
	contextEntityIndex: number
}

declare var DOTA_GameState: DOTA_GameState;
interface DOTA_GameState {
	DOTA_GAMERULES_STATE_INIT: number
	DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD: number
	DOTA_GAMERULES_STATE_HERO_SELECTION: number
	DOTA_GAMERULES_STATE_STRATEGY_TIME: number
	DOTA_GAMERULES_STATE_PRE_GAME: number
	DOTA_GAMERULES_STATE_GAME_IN_PROGRESS: number
	DOTA_GAMERULES_STATE_POST_GAME: number
	DOTA_GAMERULES_STATE_DISCONNECT: number
	DOTA_GAMERULES_STATE_TEAM_SHOWCASE: number
	DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP: number
	DOTA_GAMERULES_STATE_LAST: number
}
declare var DOTA_GC_TEAM: DOTA_GC_TEAM;
interface DOTA_GC_TEAM {
	DOTA_GC_TEAM_GOOD_GUYS: number
	DOTA_GC_TEAM_BAD_GUYS: number
	DOTA_GC_TEAM_BROADCASTER: number
	DOTA_GC_TEAM_SPECTATOR: number
	DOTA_GC_TEAM_PLAYER_POOL: number
	DOTA_GC_TEAM_NOTEAM: number
}
declare var DOTAConnectionState_t: DOTAConnectionState_t;
interface DOTAConnectionState_t{
	DOTA_CONNECTION_STATE_UNKNOWN: number
	DOTA_CONNECTION_STATE_NOT_YET_CONNECTED: number
	DOTA_CONNECTION_STATE_CONNECTED: number
	DOTA_CONNECTION_STATE_DISCONNECTED: number
	DOTA_CONNECTION_STATE_ABANDONED: number
	DOTA_CONNECTION_STATE_LOADING: number
	DOTA_CONNECTION_STATE_FAILED: number
}
declare var dotaunitorder_t: dotaunitorder_t;
interface dotaunitorder_t {
	DOTA_UNIT_ORDER_NONE: number
	DOTA_UNIT_ORDER_MOVE_TO_POSITION: number
	DOTA_UNIT_ORDER_MOVE_TO_TARGET: number
	DOTA_UNIT_ORDER_ATTACK_MOVE: number
	DOTA_UNIT_ORDER_ATTACK_TARGET: number
	DOTA_UNIT_ORDER_CAST_POSITION: number
	DOTA_UNIT_ORDER_CAST_TARGET: number
	DOTA_UNIT_ORDER_CAST_TARGET_TREE: number
	DOTA_UNIT_ORDER_CAST_NO_TARGET: number
	DOTA_UNIT_ORDER_CAST_TOGGLE: number
	DOTA_UNIT_ORDER_HOLD_POSITION: number
	DOTA_UNIT_ORDER_TRAIN_ABILITY: number
	DOTA_UNIT_ORDER_DROP_ITEM: number
	DOTA_UNIT_ORDER_GIVE_ITEM: number
	DOTA_UNIT_ORDER_PICKUP_ITEM: number
	DOTA_UNIT_ORDER_PICKUP_RUNE: number
	DOTA_UNIT_ORDER_PURCHASE_ITEM: number
	DOTA_UNIT_ORDER_SELL_ITEM: number
	DOTA_UNIT_ORDER_DISASSEMBLE_ITEM: number
	DOTA_UNIT_ORDER_MOVE_ITEM: number
	DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO: number
	DOTA_UNIT_ORDER_STOP: number
	DOTA_UNIT_ORDER_TAUNT: number
	DOTA_UNIT_ORDER_BUYBACK: number
	DOTA_UNIT_ORDER_GLYPH: number
	DOTA_UNIT_ORDER_EJECT_ITEM_FROM_STASH: number
	DOTA_UNIT_ORDER_CAST_RUNE: number
	DOTA_UNIT_ORDER_PING_ABILITY: number
	DOTA_UNIT_ORDER_MOVE_TO_DIRECTION: number
	DOTA_UNIT_ORDER_PATROL: number
	DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION: number
	DOTA_UNIT_ORDER_RADAR: number
	DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK: number
}
declare var DOTA_OVERHEAD_ALERT: DOTA_OVERHEAD_ALERT;
interface DOTA_OVERHEAD_ALERT{
	OVERHEAD_ALERT_GOLD: number
	OVERHEAD_ALERT_DENY: number
	OVERHEAD_ALERT_CRITICAL: number
	OVERHEAD_ALERT_XP: number
	OVERHEAD_ALERT_BONUS_SPELL_DAMAGE: number
	OVERHEAD_ALERT_MISS: number
	OVERHEAD_ALERT_DAMAGE: number
	OVERHEAD_ALERT_EVADE: number
	OVERHEAD_ALERT_BLOCK: number
	OVERHEAD_ALERT_BONUS_POISON_DAMAGE: number
	OVERHEAD_ALERT_HEAL: number
	OVERHEAD_ALERT_MANA_ADD: number
	OVERHEAD_ALERT_MANA_LOSS: number
	OVERHEAD_ALERT_LAST_HIT_EARLY: number
	OVERHEAD_ALERT_LAST_HIT_CLOSE: number
	OVERHEAD_ALERT_LAST_HIT_MISS: number
	OVERHEAD_ALERT_MAGICAL_BLOCK: number
}
declare var DOTA_HeroPickState: DOTA_HeroPickState;
interface DOTA_HeroPickState{
	DOTA_HEROPICK_STATE_NONE: number
	DOTA_HEROPICK_STATE_AP_SELECT: number
	DOTA_HEROPICK_STATE_SD_SELECT: number
	DOTA_HEROPICK_STATE_INTRO_SELECT: number
	DOTA_HEROPICK_STATE_RD_SELECT: number
	DOTA_HEROPICK_STATE_CM_INTRO: number
	DOTA_HEROPICK_STATE_CM_CAPTAINPICK: number
	DOTA_HEROPICK_STATE_CM_BAN1: number
	DOTA_HEROPICK_STATE_CM_BAN2: number
	DOTA_HEROPICK_STATE_CM_BAN3: number
	DOTA_HEROPICK_STATE_CM_BAN4: number
	DOTA_HEROPICK_STATE_CM_BAN5: number
	DOTA_HEROPICK_STATE_CM_BAN6: number
	DOTA_HEROPICK_STATE_CM_BAN7: number
	DOTA_HEROPICK_STATE_CM_BAN8: number
	DOTA_HEROPICK_STATE_CM_BAN9: number
	DOTA_HEROPICK_STATE_CM_BAN10: number
	DOTA_HEROPICK_STATE_CM_SELECT1: number
	DOTA_HEROPICK_STATE_CM_SELECT2: number
	DOTA_HEROPICK_STATE_CM_SELECT3: number
	DOTA_HEROPICK_STATE_CM_SELECT4: number
	DOTA_HEROPICK_STATE_CM_SELECT5: number
	DOTA_HEROPICK_STATE_CM_SELECT6: number
	DOTA_HEROPICK_STATE_CM_SELECT7: number
	DOTA_HEROPICK_STATE_CM_SELECT8: number
	DOTA_HEROPICK_STATE_CM_SELECT9: number
	DOTA_HEROPICK_STATE_CM_SELECT10: number
	DOTA_HEROPICK_STATE_CM_PICK: number
	DOTA_HEROPICK_STATE_AR_SELECT: number
	DOTA_HEROPICK_STATE_MO_SELECT: number
	DOTA_HEROPICK_STATE_FH_SELECT: number
	DOTA_HEROPICK_STATE_CD_INTRO: number
	DOTA_HEROPICK_STATE_CD_CAPTAINPICK: number
	DOTA_HEROPICK_STATE_CD_BAN1: number
	DOTA_HEROPICK_STATE_CD_BAN2: number
	DOTA_HEROPICK_STATE_CD_BAN3: number
	DOTA_HEROPICK_STATE_CD_BAN4: number
	DOTA_HEROPICK_STATE_CD_BAN5: number
	DOTA_HEROPICK_STATE_CD_BAN6: number
	DOTA_HEROPICK_STATE_CD_SELECT1: number
	DOTA_HEROPICK_STATE_CD_SELECT2: number
	DOTA_HEROPICK_STATE_CD_SELECT3: number
	DOTA_HEROPICK_STATE_CD_SELECT4: number
	DOTA_HEROPICK_STATE_CD_SELECT5: number
	DOTA_HEROPICK_STATE_CD_SELECT6: number
	DOTA_HEROPICK_STATE_CD_SELECT7: number
	DOTA_HEROPICK_STATE_CD_SELECT8: number
	DOTA_HEROPICK_STATE_CD_SELECT9: number
	DOTA_HEROPICK_STATE_CD_SELECT10: number
	DOTA_HEROPICK_STATE_CD_PICK: number
	DOTA_HEROPICK_STATE_BD_SELECT: number
	DOTA_HERO_PICK_STATE_ABILITY_DRAFT_SELECT: number
	DOTA_HERO_PICK_STATE_ARDM_SELECT: number
	DOTA_HEROPICK_STATE_ALL_DRAFT_SELECT: number
	DOTA_HERO_PICK_STATE_CUSTOMGAME_SELECT: number
	DOTA_HEROPICK_STATE_COUNT: number
}
declare var DOTATeam_t: DOTATeam_t
interface DOTATeam_t {
	DOTA_TEAM_FIRST: number
	DOTA_TEAM_GOODGUYS: number
	DOTA_TEAM_BADGUYS: number
	DOTA_TEAM_NEUTRALS: number
	DOTA_TEAM_NOTEAM: number
	DOTA_TEAM_CUSTOM_1: number
	DOTA_TEAM_CUSTOM_2: number
	DOTA_TEAM_CUSTOM_3: number
	DOTA_TEAM_CUSTOM_4: number
	DOTA_TEAM_CUSTOM_5: number
	DOTA_TEAM_CUSTOM_6: number
	DOTA_TEAM_CUSTOM_7: number
	DOTA_TEAM_CUSTOM_8: number
	DOTA_TEAM_COUNT: number
	DOTA_TEAM_CUSTOM_MIN: number
	DOTA_TEAM_CUSTOM_MAX: number
	DOTA_TEAM_CUSTOM_COUNT: number
}
declare var DOTA_RUNES: DOTA_RUNES
interface DOTA_RUNES {
	DOTA_RUNE_INVALID: number
	DOTA_RUNE_DOUBLEDAMAGE: number
	DOTA_RUNE_HASTE: number
	DOTA_RUNE_ILLUSION: number
	DOTA_RUNE_INVISIBILITY: number
	DOTA_RUNE_REGENERATION: number
	DOTA_RUNE_BOUNTY: number
	DOTA_RUNE_ARCANE: number
	DOTA_RUNE_COUNT: number
}
declare var DOTA_UNIT_TARGET_TEAM: DOTA_UNIT_TARGET_TEAM
interface DOTA_UNIT_TARGET_TEAM {
	DOTA_UNIT_TARGET_TEAM_NONE: number
	DOTA_UNIT_TARGET_TEAM_FRIENDLY: number
	DOTA_UNIT_TARGET_TEAM_ENEMY: number
	DOTA_UNIT_TARGET_TEAM_CUSTOM: number
	DOTA_UNIT_TARGET_TEAM_BOTH: number
}
declare var DOTA_UNIT_TARGET_TYPE: DOTA_UNIT_TARGET_TYPE
interface DOTA_UNIT_TARGET_TYPE {
	DOTA_UNIT_TARGET_NONE: number
	DOTA_UNIT_TARGET_HERO: number
	DOTA_UNIT_TARGET_CREEP: number
	DOTA_UNIT_TARGET_BUILDING: number
	DOTA_UNIT_TARGET_MECHANICAL: number
	DOTA_UNIT_TARGET_COURIER: number
	DOTA_UNIT_TARGET_OTHER: number
	DOTA_UNIT_TARGET_TREE: number
	DOTA_UNIT_TARGET_CUSTOM: number
	DOTA_UNIT_TARGET_BASIC: number
	DOTA_UNIT_TARGET_ALL: number
}
declare var DOTA_UNIT_TARGET_FLAGS: DOTA_UNIT_TARGET_FLAGS
interface DOTA_UNIT_TARGET_FLAGS {
	DOTA_UNIT_TARGET_FLAG_NONE: number
	DOTA_UNIT_TARGET_FLAG_RANGED_ONLY: number
	DOTA_UNIT_TARGET_FLAG_MELEE_ONLY: number
	DOTA_UNIT_TARGET_FLAG_DEAD: number
	DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES: number
	DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES: number
	DOTA_UNIT_TARGET_FLAG_INVULNERABLE: number
	DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE: number
	DOTA_UNIT_TARGET_FLAG_NO_INVIS: number
	DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS: number
	DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED: number
	DOTA_UNIT_TARGET_FLAG_NOT_DOMINATED: number
	DOTA_UNIT_TARGET_FLAG_NOT_SUMMONED: number
	DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS: number
	DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE: number
	DOTA_UNIT_TARGET_FLAG_MANA_ONLY: number
	DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP: number
	DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO: number
	DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD: number
	DOTA_UNIT_TARGET_FLAG_NOT_NIGHTMARED: number
	DOTA_UNIT_TARGET_FLAG_PREFER_ENEMIES: number
}
declare var DOTALimits_t: DOTALimits_t
interface DOTALimits_t {
	DOTA_MAX_PLAYERS: number
	DOTA_MAX_TEAM: number
	DOTA_MAX_PLAYER_TEAMS: number
	DOTA_MAX_TEAM_PLAYERS: number
	DOTA_MAX_SPECTATOR_TEAM_SIZE: number
	DOTA_DEFAULT_MAX_TEAM: number
	DOTA_DEFAULT_MAX_TEAM_PLAYERS: number
}
declare var DOTAInventoryFlags_t: DOTAInventoryFlags_t
interface DOTAInventoryFlags_t {
	DOTA_INVENTORY_ALLOW_NONE: number
	DOTA_INVENTORY_ALLOW_MAIN: number
	DOTA_INVENTORY_ALLOW_STASH: number
	DOTA_INVENTORY_ALLOW_DROP_ON_GROUND: number
	DOTA_INVENTORY_ALLOW_DROP_AT_FOUNTAIN: number
	DOTA_INVENTORY_LIMIT_DROP_ON_GROUND: number
	DOTA_INVENTORY_ALL_ACCESS: number
}
declare var EDOTA_ModifyGold_Reason: EDOTA_ModifyGold_Reason
interface EDOTA_ModifyGold_Reason {
	DOTA_ModifyGold_Unspecified: number
	DOTA_ModifyGold_Death: number
	DOTA_ModifyGold_Buyback: number
	DOTA_ModifyGold_PurchaseConsumable: number
	DOTA_ModifyGold_PurchaseItem: number
	DOTA_ModifyGold_AbandonedRedistribute: number
	DOTA_ModifyGold_SellItem: number
	DOTA_ModifyGold_AbilityCost: number
	DOTA_ModifyGold_CheatCommand: number
	DOTA_ModifyGold_SelectionPenalty: number
	DOTA_ModifyGold_GameTick: number
	DOTA_ModifyGold_Building: number
	DOTA_ModifyGold_HeroKill: number
	DOTA_ModifyGold_CreepKill: number
	DOTA_ModifyGold_RoshanKill: number
	DOTA_ModifyGold_CourierKill: number
	DOTA_ModifyGold_SharedGold: number
}
declare var DOTAUnitAttackCapability_t: DOTAUnitAttackCapability_t
interface DOTAUnitAttackCapability_t {
	DOTA_UNIT_CAP_NO_ATTACK: number
	DOTA_UNIT_CAP_MELEE_ATTACK: number
	DOTA_UNIT_CAP_RANGED_ATTACK: number
}
declare var DOTAUnitMoveCapability_t: DOTAUnitMoveCapability_t
interface DOTAUnitMoveCapability_t {
	DOTA_UNIT_CAP_MOVE_NONE: number
	DOTA_UNIT_CAP_MOVE_GROUND: number
	DOTA_UNIT_CAP_MOVE_FLY: number
}
declare var EShareAbility: EShareAbility
interface EShareAbility {
	ITEM_FULLY_SHAREABLE: number
	ITEM_PARTIALLY_SHAREABLE: number
	ITEM_NOT_SHAREABLE: number
}
declare var DOTAMusicStatus_t: DOTAMusicStatus_t
interface DOTAMusicStatus_t {
	DOTA_MUSIC_STATUS_NONE: number
	DOTA_MUSIC_STATUS_EXPLORATION: number
	DOTA_MUSIC_STATUS_BATTLE: number
	DOTA_MUSIC_STATUS_PRE_GAME_EXPLORATION: number
	DOTA_MUSIC_STATUS_DEAD: number
	DOTA_MUSIC_STATUS_LAST: number
}
declare var DOTA_ABILITY_BEHAVIOR: DOTA_ABILITY_BEHAVIOR
interface DOTA_ABILITY_BEHAVIOR {
	DOTA_ABILITY_BEHAVIOR_NONE: number
	DOTA_ABILITY_BEHAVIOR_HIDDEN: number
	DOTA_ABILITY_BEHAVIOR_PASSIVE: number
	DOTA_ABILITY_BEHAVIOR_NO_TARGET: number
	DOTA_ABILITY_BEHAVIOR_UNIT_TARGET: number
	DOTA_ABILITY_BEHAVIOR_POINT: number
	DOTA_ABILITY_BEHAVIOR_AOE: number
	DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE: number
	DOTA_ABILITY_BEHAVIOR_CHANNELLED: number
	DOTA_ABILITY_BEHAVIOR_ITEM: number
	DOTA_ABILITY_BEHAVIOR_TOGGLE: number
	DOTA_ABILITY_BEHAVIOR_DIRECTIONAL: number
	DOTA_ABILITY_BEHAVIOR_IMMEDIATE: number
	DOTA_ABILITY_BEHAVIOR_AUTOCAST: number
	DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET: number
	DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT: number
	DOTA_ABILITY_BEHAVIOR_OPTIONAL_NO_TARGET: number
	DOTA_ABILITY_BEHAVIOR_AURA: number
	DOTA_ABILITY_BEHAVIOR_ATTACK: number
	DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT: number
	DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES: number
	DOTA_ABILITY_BEHAVIOR_UNRESTRICTED: number
	DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE: number
	DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL: number
	DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_MOVEMENT: number
	DOTA_ABILITY_BEHAVIOR_DONT_ALERT_TARGET: number
	DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK: number
	DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN: number
	DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING: number
	DOTA_ABILITY_BEHAVIOR_RUNE_TARGET: number
	DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_CHANNEL: number
	DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING: number
	DOTA_ABILITY_LAST_BEHAVIOR: number
}
declare var DAMAGE_TYPES: DAMAGE_TYPES
interface DAMAGE_TYPES {
	DAMAGE_TYPE_NONE: number
	DAMAGE_TYPE_PHYSICAL: number
	DAMAGE_TYPE_MAGICAL: number
	DAMAGE_TYPE_PURE: number
	DAMAGE_TYPE_HP_REMOVAL: number
	DAMAGE_TYPE_ALL: number
}
declare var ABILITY_TYPES: ABILITY_TYPES
interface ABILITY_TYPES {
	ABILITY_TYPE_BASIC: number
	ABILITY_TYPE_ULTIMATE: number
	ABILITY_TYPE_ATTRIBUTES: number
	ABILITY_TYPE_HIDDEN: number
}
declare var SPELL_IMMUNITY_TYPES: SPELL_IMMUNITY_TYPES
interface SPELL_IMMUNITY_TYPES {
	SPELL_IMMUNITY_NONE: number
	SPELL_IMMUNITY_ALLIES_YES: number
	SPELL_IMMUNITY_ALLIES_NO: number
	SPELL_IMMUNITY_ENEMIES_YES: number
	SPELL_IMMUNITY_ENEMIES_NO: number
}
declare var DOTADamageFlag_t: DOTADamageFlag_t
interface DOTADamageFlag_t {
	DOTA_DAMAGE_FLAG_NONE: number
	DOTA_DAMAGE_FLAG_IGNORES_MAGIC_ARMOR: number
	DOTA_DAMAGE_FLAG_IGNORES_PHYSICAL_ARMOR: number
	DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY: number
	DOTA_DAMAGE_FLAG_BYPASSES_BLOCK: number
	DOTA_DAMAGE_FLAG_REFLECTION: number
	DOTA_DAMAGE_FLAG_HPLOSS: number
	DOTA_DAMAGE_FLAG_NO_DIRECTOR_EVENT: number
	DOTA_DAMAGE_FLAG_NON_LETHAL: number
	DOTA_DAMAGE_FLAG_USE_COMBAT_PROFICIENCY: number
	DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS: number
}
declare var EDOTA_ModifyXP_Reason: EDOTA_ModifyXP_Reason
interface EDOTA_ModifyXP_Reason {
	DOTA_ModifyXP_Unspecified: number
	DOTA_ModifyXP_HeroKill: number
	DOTA_ModifyXP_CreepKill: number
	DOTA_ModifyXP_RoshanKill: number
}
declare var GameActivity_t: GameActivity_t
interface GameActivity_t {
	ACT_DOTA_IDLE: number
	ACT_DOTA_IDLE_RARE: number
	ACT_DOTA_RUN: number
	ACT_DOTA_ATTACK: number
	ACT_DOTA_ATTACK2: number
	ACT_DOTA_ATTACK_EVENT: number
	ACT_DOTA_DIE: number
	ACT_DOTA_FLINCH: number
	ACT_DOTA_FLAIL: number
	ACT_DOTA_DISABLED: number
	ACT_DOTA_CAST_ABILITY_1: number
	ACT_DOTA_CAST_ABILITY_2: number
	ACT_DOTA_CAST_ABILITY_3: number
	ACT_DOTA_CAST_ABILITY_4: number
	ACT_DOTA_CAST_ABILITY_5: number
	ACT_DOTA_CAST_ABILITY_6: number
	ACT_DOTA_OVERRIDE_ABILITY_1: number
	ACT_DOTA_OVERRIDE_ABILITY_2: number
	ACT_DOTA_OVERRIDE_ABILITY_3: number
	ACT_DOTA_OVERRIDE_ABILITY_4: number
	ACT_DOTA_CHANNEL_ABILITY_1: number
	ACT_DOTA_CHANNEL_ABILITY_2: number
	ACT_DOTA_CHANNEL_ABILITY_3: number
	ACT_DOTA_CHANNEL_ABILITY_4: number
	ACT_DOTA_CHANNEL_ABILITY_5: number
	ACT_DOTA_CHANNEL_ABILITY_6: number
	ACT_DOTA_CHANNEL_END_ABILITY_1: number
	ACT_DOTA_CHANNEL_END_ABILITY_2: number
	ACT_DOTA_CHANNEL_END_ABILITY_3: number
	ACT_DOTA_CHANNEL_END_ABILITY_4: number
	ACT_DOTA_CHANNEL_END_ABILITY_5: number
	ACT_DOTA_CHANNEL_END_ABILITY_6: number
	ACT_DOTA_CONSTANT_LAYER: number
	ACT_DOTA_CAPTURE: number
	ACT_DOTA_SPAWN: number
	ACT_DOTA_KILLTAUNT: number
	ACT_DOTA_TAUNT: number
	ACT_DOTA_THIRST: number
	ACT_DOTA_CAST_DRAGONBREATH: number
	ACT_DOTA_ECHO_SLAM: number
	ACT_DOTA_CAST_ABILITY_1_END: number
	ACT_DOTA_CAST_ABILITY_2_END: number
	ACT_DOTA_CAST_ABILITY_3_END: number
	ACT_DOTA_CAST_ABILITY_4_END: number
	ACT_MIRANA_LEAP_END: number
	ACT_WAVEFORM_START: number
	ACT_WAVEFORM_END: number
	ACT_DOTA_CAST_ABILITY_ROT: number
	ACT_DOTA_DIE_SPECIAL: number
	ACT_DOTA_RATTLETRAP_BATTERYASSAULT: number
	ACT_DOTA_RATTLETRAP_POWERCOGS: number
	ACT_DOTA_RATTLETRAP_HOOKSHOT_START: number
	ACT_DOTA_RATTLETRAP_HOOKSHOT_LOOP: number
	ACT_DOTA_RATTLETRAP_HOOKSHOT_END: number
	ACT_STORM_SPIRIT_OVERLOAD_RUN_OVERRIDE: number
	ACT_DOTA_TINKER_REARM1: number
	ACT_DOTA_TINKER_REARM2: number
	ACT_DOTA_TINKER_REARM3: number
	ACT_TINY_AVALANCHE: number
	ACT_TINY_TOSS: number
	ACT_TINY_GROWL: number
	ACT_DOTA_WEAVERBUG_ATTACH: number
	ACT_DOTA_CAST_WILD_AXES_END: number
	ACT_DOTA_CAST_LIFE_BREAK_START: number
	ACT_DOTA_CAST_LIFE_BREAK_END: number
	ACT_DOTA_NIGHTSTALKER_TRANSITION: number
	ACT_DOTA_LIFESTEALER_RAGE: number
	ACT_DOTA_LIFESTEALER_OPEN_WOUNDS: number
	ACT_DOTA_SAND_KING_BURROW_IN: number
	ACT_DOTA_SAND_KING_BURROW_OUT: number
	ACT_DOTA_EARTHSHAKER_TOTEM_ATTACK: number
	ACT_DOTA_WHEEL_LAYER: number
	ACT_DOTA_ALCHEMIST_CHEMICAL_RAGE_START: number
	ACT_DOTA_ALCHEMIST_CONCOCTION: number
	ACT_DOTA_JAKIRO_LIQUIDFIRE_START: number
	ACT_DOTA_JAKIRO_LIQUIDFIRE_LOOP: number
	ACT_DOTA_LIFESTEALER_INFEST: number
	ACT_DOTA_LIFESTEALER_INFEST_END: number
	ACT_DOTA_LASSO_LOOP: number
	ACT_DOTA_ALCHEMIST_CONCOCTION_THROW: number
	ACT_DOTA_ALCHEMIST_CHEMICAL_RAGE_END: number
	ACT_DOTA_CAST_COLD_SNAP: number
	ACT_DOTA_CAST_GHOST_WALK: number
	ACT_DOTA_CAST_TORNADO: number
	ACT_DOTA_CAST_EMP: number
	ACT_DOTA_CAST_ALACRITY: number
	ACT_DOTA_CAST_CHAOS_METEOR: number
	ACT_DOTA_CAST_SUN_STRIKE: number
	ACT_DOTA_CAST_FORGE_SPIRIT: number
	ACT_DOTA_CAST_ICE_WALL: number
	ACT_DOTA_CAST_DEAFENING_BLAST: number
	ACT_DOTA_VICTORY: number
	ACT_DOTA_DEFEAT: number
	ACT_DOTA_SPIRIT_BREAKER_CHARGE_POSE: number
	ACT_DOTA_SPIRIT_BREAKER_CHARGE_END: number
	ACT_DOTA_TELEPORT: number
	ACT_DOTA_TELEPORT_END: number
	ACT_DOTA_CAST_REFRACTION: number
	ACT_DOTA_CAST_ABILITY_7: number
	ACT_DOTA_CANCEL_SIREN_SONG: number
	ACT_DOTA_CHANNEL_ABILITY_7: number
	ACT_DOTA_LOADOUT: number
	ACT_DOTA_FORCESTAFF_END: number
	ACT_DOTA_POOF_END: number
	ACT_DOTA_SLARK_POUNCE: number
	ACT_DOTA_MAGNUS_SKEWER_START: number
	ACT_DOTA_MAGNUS_SKEWER_END: number
	ACT_DOTA_MEDUSA_STONE_GAZE: number
	ACT_DOTA_RELAX_START: number
	ACT_DOTA_RELAX_LOOP: number
	ACT_DOTA_RELAX_END: number
	ACT_DOTA_CENTAUR_STAMPEDE: number
	ACT_DOTA_BELLYACHE_START: number
	ACT_DOTA_BELLYACHE_LOOP: number
	ACT_DOTA_BELLYACHE_END: number
	ACT_DOTA_ROQUELAIRE_LAND: number
	ACT_DOTA_ROQUELAIRE_LAND_IDLE: number
	ACT_DOTA_GREEVIL_CAST: number
	ACT_DOTA_GREEVIL_OVERRIDE_ABILITY: number
	ACT_DOTA_GREEVIL_HOOK_START: number
	ACT_DOTA_GREEVIL_HOOK_END: number
	ACT_DOTA_GREEVIL_BLINK_BONE: number
	ACT_DOTA_IDLE_SLEEPING: number
	ACT_DOTA_INTRO: number
	ACT_DOTA_GESTURE_POINT: number
	ACT_DOTA_GESTURE_ACCENT: number
	ACT_DOTA_SLEEPING_END: number
	ACT_DOTA_AMBUSH: number
	ACT_DOTA_ITEM_LOOK: number
	ACT_DOTA_STARTLE: number
	ACT_DOTA_FRUSTRATION: number
	ACT_DOTA_TELEPORT_REACT: number
	ACT_DOTA_TELEPORT_END_REACT: number
	ACT_DOTA_SHRUG: number
	ACT_DOTA_RELAX_LOOP_END: number
	ACT_DOTA_PRESENT_ITEM: number
	ACT_DOTA_IDLE_IMPATIENT: number
	ACT_DOTA_SHARPEN_WEAPON: number
	ACT_DOTA_SHARPEN_WEAPON_OUT: number
	ACT_DOTA_IDLE_SLEEPING_END: number
	ACT_DOTA_BRIDGE_DESTROY: number
	ACT_DOTA_TAUNT_SNIPER: number
	ACT_DOTA_DEATH_BY_SNIPER: number
	ACT_DOTA_LOOK_AROUND: number
	ACT_DOTA_CAGED_CREEP_RAGE: number
	ACT_DOTA_CAGED_CREEP_RAGE_OUT: number
	ACT_DOTA_CAGED_CREEP_SMASH: number
	ACT_DOTA_CAGED_CREEP_SMASH_OUT: number
	ACT_DOTA_IDLE_IMPATIENT_SWORD_TAP: number
	ACT_DOTA_INTRO_LOOP: number
	ACT_DOTA_BRIDGE_THREAT: number
	ACT_DOTA_DAGON: number
	ACT_DOTA_CAST_ABILITY_2_ES_ROLL_START: number
	ACT_DOTA_CAST_ABILITY_2_ES_ROLL: number
	ACT_DOTA_CAST_ABILITY_2_ES_ROLL_END: number
	ACT_DOTA_NIAN_PIN_START: number
	ACT_DOTA_NIAN_PIN_LOOP: number
	ACT_DOTA_NIAN_PIN_END: number
	ACT_DOTA_LEAP_STUN: number
	ACT_DOTA_LEAP_SWIPE: number
	ACT_DOTA_NIAN_INTRO_LEAP: number
	ACT_DOTA_AREA_DENY: number
	ACT_DOTA_NIAN_PIN_TO_STUN: number
	ACT_DOTA_RAZE_1: number
	ACT_DOTA_RAZE_2: number
	ACT_DOTA_RAZE_3: number
	ACT_DOTA_UNDYING_DECAY: number
	ACT_DOTA_UNDYING_SOUL_RIP: number
	ACT_DOTA_UNDYING_TOMBSTONE: number
	ACT_DOTA_WHIRLING_AXES_RANGED: number
	ACT_DOTA_SHALLOW_GRAVE: number
	ACT_DOTA_COLD_FEET: number
	ACT_DOTA_ICE_VORTEX: number
	ACT_DOTA_CHILLING_TOUCH: number
	ACT_DOTA_ENFEEBLE: number
	ACT_DOTA_FATAL_BONDS: number
	ACT_DOTA_MIDNIGHT_PULSE: number
	ACT_DOTA_ANCESTRAL_SPIRIT: number
	ACT_DOTA_THUNDER_STRIKE: number
	ACT_DOTA_KINETIC_FIELD: number
	ACT_DOTA_STATIC_STORM: number
	ACT_DOTA_MINI_TAUNT: number
	ACT_DOTA_ARCTIC_BURN_END: number
	ACT_DOTA_LOADOUT_RARE: number
	ACT_DOTA_SWIM: number
	ACT_DOTA_FLEE: number
	ACT_DOTA_TROT: number
	ACT_DOTA_SHAKE: number
	ACT_DOTA_SWIM_IDLE: number
	ACT_DOTA_WAIT_IDLE: number
	ACT_DOTA_GREET: number
	ACT_DOTA_TELEPORT_COOP_START: number
	ACT_DOTA_TELEPORT_COOP_WAIT: number
	ACT_DOTA_TELEPORT_COOP_END: number
	ACT_DOTA_TELEPORT_COOP_EXIT: number
	ACT_DOTA_SHOPKEEPER_PET_INTERACT: number
	ACT_DOTA_ITEM_PICKUP: number
	ACT_DOTA_ITEM_DROP: number
	ACT_DOTA_CAPTURE_PET: number
	ACT_DOTA_PET_WARD_OBSERVER: number
	ACT_DOTA_PET_WARD_SENTRY: number
	ACT_DOTA_PET_LEVEL: number
	ACT_DOTA_CAST_BURROW_END: number
	ACT_DOTA_LIFESTEALER_ASSIMILATE: number
	ACT_DOTA_LIFESTEALER_EJECT: number
	ACT_DOTA_ATTACK_EVENT_BASH: number
	ACT_DOTA_CAPTURE_RARE: number
	ACT_DOTA_AW_MAGNETIC_FIELD: number
	ACT_DOTA_CAST_GHOST_SHIP: number
	ACT_DOTA_FXANIM: number
	ACT_DOTA_VICTORY_START: number
	ACT_DOTA_DEFEAT_START: number
	ACT_DOTA_DP_SPIRIT_SIPHON: number
	ACT_DOTA_TRICKS_END: number
	ACT_DOTA_ES_STONE_CALLER: number
}
declare var DOTAMinimapEvent_t: DOTAMinimapEvent_t
interface DOTAMinimapEvent_t {
	DOTA_MINIMAP_EVENT_ANCIENT_UNDER_ATTACK: number
	DOTA_MINIMAP_EVENT_BASE_UNDER_ATTACK: number
	DOTA_MINIMAP_EVENT_BASE_GLYPHED: number
	DOTA_MINIMAP_EVENT_TEAMMATE_UNDER_ATTACK: number
	DOTA_MINIMAP_EVENT_TEAMMATE_TELEPORTING: number
	DOTA_MINIMAP_EVENT_TEAMMATE_DIED: number
	DOTA_MINIMAP_EVENT_TUTORIAL_TASK_ACTIVE: number
	DOTA_MINIMAP_EVENT_TUTORIAL_TASK_FINISHED: number
	DOTA_MINIMAP_EVENT_HINT_LOCATION: number
	DOTA_MINIMAP_EVENT_ENEMY_TELEPORTING: number
	DOTA_MINIMAP_EVENT_CANCEL_TELEPORTING: number
	DOTA_MINIMAP_EVENT_RADAR: number
	DOTA_MINIMAP_EVENT_RADAR_TARGET: number
}
declare var DOTASlotType_t: DOTASlotType_t
interface DOTASlotType_t {
	DOTA_LOADOUT_TYPE_INVALID: number
	DOTA_LOADOUT_TYPE_WEAPON: number
	DOTA_LOADOUT_TYPE_OFFHAND_WEAPON: number
	DOTA_LOADOUT_TYPE_WEAPON2: number
	DOTA_LOADOUT_TYPE_OFFHAND_WEAPON2: number
	DOTA_LOADOUT_TYPE_HEAD: number
	DOTA_LOADOUT_TYPE_SHOULDER: number
	DOTA_LOADOUT_TYPE_ARMS: number
	DOTA_LOADOUT_TYPE_ARMOR: number
	DOTA_LOADOUT_TYPE_BELT: number
	DOTA_LOADOUT_TYPE_NECK: number
	DOTA_LOADOUT_TYPE_BACK: number
	DOTA_LOADOUT_TYPE_LEGS: number
	DOTA_LOADOUT_TYPE_GLOVES: number
	DOTA_LOADOUT_TYPE_TAIL: number
	DOTA_LOADOUT_TYPE_MISC: number
	DOTA_LOADOUT_TYPE_BODY_HEAD: number
	DOTA_LOADOUT_TYPE_MOUNT: number
	DOTA_LOADOUT_TYPE_SUMMON: number
	DOTA_LOADOUT_TYPE_SHAPESHIFT: number
	DOTA_LOADOUT_TYPE_TAUNT: number
	DOTA_LOADOUT_TYPE_AMBIENT_EFFECTS: number
	DOTA_LOADOUT_TYPE_ABILITY_ATTACK: number
	DOTA_LOADOUT_TYPE_ABILITY1: number
	DOTA_LOADOUT_TYPE_ABILITY2: number
	DOTA_LOADOUT_TYPE_ABILITY3: number
	DOTA_LOADOUT_TYPE_ABILITY4: number
	DOTA_LOADOUT_TYPE_ABILITY_ULTIMATE: number
	DOTA_LOADOUT_TYPE_VOICE: number
	DOTA_LOADOUT_TYPE_ACTION_ITEM: number
	DOTA_LOADOUT_TYPE_COURIER: number
	DOTA_LOADOUT_TYPE_ANNOUNCER: number
	DOTA_LOADOUT_TYPE_MEGA_KILLS: number
	DOTA_LOADOUT_TYPE_MUSIC: number
	DOTA_LOADOUT_TYPE_WARD: number
	DOTA_LOADOUT_TYPE_HUD_SKIN: number
	DOTA_LOADOUT_TYPE_LOADING_SCREEN: number
	DOTA_LOADOUT_TYPE_WEATHER: number
	DOTA_LOADOUT_TYPE_HEROIC_STATUE: number
	DOTA_LOADOUT_TYPE_MULTIKILL_BANNER: number
	DOTA_LOADOUT_TYPE_CURSOR_PACK: number
	DOTA_LOADOUT_TYPE_TELEPORT_EFFECT: number
	DOTA_LOADOUT_TYPE_BLINK_EFFECT: number
	DOTA_LOADOUT_TYPE_TEAM_SHOWCASE: number
	DOTA_LOADOUT_TYPE_TERRAIN: number
	DOTA_PLAYER_LOADOUT_START: number
	DOTA_PLAYER_LOADOUT_END: number
	DOTA_LOADOUT_TYPE_NONE: number
	DOTA_LOADOUT_TYPE_COUNT: number
}
declare var modifierfunction: modifierfunction
interface modifierfunction {
	MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE: number
	MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT: number
	MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE: number
	MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL: number
	MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL: number
	MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE: number
	MODIFIER_PROPERTY_PROCATTACK_FEEDBACK: number
	MODIFIER_PROPERTY_PRE_ATTACK: number
	MODIFIER_PROPERTY_INVISIBILITY_LEVEL: number
	MODIFIER_PROPERTY_PERSISTENT_INVISIBILITY: number
	MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT: number
	MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE: number
	MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE: number
	MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE: number
	MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE_2: number
	MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE: number
	MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE_2: number
	MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE: number
	MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN: number
	MODIFIER_PROPERTY_MOVESPEED_LIMIT: number
	MODIFIER_PROPERTY_MOVESPEED_MAX: number
	MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT: number
	MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT_POWER_TREADS: number
	MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT_SECONDARY: number
	MODIFIER_PROPERTY_COOLDOWN_REDUCTION_CONSTANT: number
	MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT: number
	MODIFIER_PROPERTY_ATTACK_POINT_CONSTANT: number
	MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE: number
	MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION: number
	MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE: number
	MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE: number
	MODIFIER_PROPERTY_MAGICDAMAGEOUTGOING_PERCENTAGE: number
	MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE: number
	MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE_UNIQUE: number
	MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE: number
	MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE: number
	MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_CONSTANT: number
	MODIFIER_PROPERTY_INCOMING_SPELL_DAMAGE_CONSTANT: number
	MODIFIER_PROPERTY_EVASION_CONSTANT: number
	MODIFIER_PROPERTY_NEGATIVE_EVASION_CONSTANT: number
	MODIFIER_PROPERTY_AVOID_DAMAGE: number
	MODIFIER_PROPERTY_AVOID_SPELL: number
	MODIFIER_PROPERTY_MISS_PERCENTAGE: number
	MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS: number
	MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_ILLUSIONS: number
	MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE: number
	MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE: number
	MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS: number
	MODIFIER_PROPERTY_MAGICAL_RESISTANCE_ITEM_UNIQUE: number
	MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE: number
	MODIFIER_PROPERTY_BASE_MANA_REGEN: number
	MODIFIER_PROPERTY_MANA_REGEN_CONSTANT: number
	MODIFIER_PROPERTY_MANA_REGEN_CONSTANT_UNIQUE: number
	MODIFIER_PROPERTY_MANA_REGEN_PERCENTAGE: number
	MODIFIER_PROPERTY_MANA_REGEN_TOTAL_PERCENTAGE: number
	MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT: number
	MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE: number
	MODIFIER_PROPERTY_HEALTH_BONUS: number
	MODIFIER_PROPERTY_MANA_BONUS: number
	MODIFIER_PROPERTY_EXTRA_STRENGTH_BONUS: number
	MODIFIER_PROPERTY_EXTRA_HEALTH_BONUS: number
	MODIFIER_PROPERTY_EXTRA_MANA_BONUS: number
	MODIFIER_PROPERTY_EXTRA_HEALTH_PERCENTAGE: number
	MODIFIER_PROPERTY_STATS_STRENGTH_BONUS: number
	MODIFIER_PROPERTY_STATS_AGILITY_BONUS: number
	MODIFIER_PROPERTY_STATS_INTELLECT_BONUS: number
	MODIFIER_PROPERTY_CAST_RANGE_BONUS: number
	MODIFIER_PROPERTY_ATTACK_RANGE_BONUS: number
	MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_UNIQUE: number
	MODIFIER_PROPERTY_MAX_ATTACK_RANGE: number
	MODIFIER_PROPERTY_PROJECTILE_SPEED_BONUS: number
	MODIFIER_PROPERTY_REINCARNATION: number
	MODIFIER_PROPERTY_RESPAWNTIME: number
	MODIFIER_PROPERTY_RESPAWNTIME_PERCENTAGE: number
	MODIFIER_PROPERTY_RESPAWNTIME_STACKING: number
	MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE: number
	MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE_STACKING: number
	MODIFIER_PROPERTY_CASTTIME_PERCENTAGE: number
	MODIFIER_PROPERTY_MANACOST_PERCENTAGE: number
	MODIFIER_PROPERTY_DEATHGOLDCOST: number
	MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE: number
	MODIFIER_PROPERTY_PREATTACK_TARGET_CRITICALSTRIKE: number
	MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK: number
	MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK: number
	MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK_SPECIAL: number
	MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK_UNAVOIDABLE_PRE_ARMOR: number
	MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK: number
	MODIFIER_PROPERTY_OVERRIDE_ANIMATION: number
	MODIFIER_PROPERTY_OVERRIDE_ANIMATION_WEIGHT: number
	MODIFIER_PROPERTY_OVERRIDE_ANIMATION_RATE: number
	MODIFIER_PROPERTY_ABSORB_SPELL: number
	MODIFIER_PROPERTY_REFLECT_SPELL: number
	MODIFIER_PROPERTY_DISABLE_AUTOATTACK: number
	MODIFIER_PROPERTY_BONUS_DAY_VISION: number
	MODIFIER_PROPERTY_BONUS_NIGHT_VISION: number
	MODIFIER_PROPERTY_BONUS_NIGHT_VISION_UNIQUE: number
	MODIFIER_PROPERTY_BONUS_VISION_PERCENTAGE: number
	MODIFIER_PROPERTY_FIXED_DAY_VISION: number
	MODIFIER_PROPERTY_FIXED_NIGHT_VISION: number
	MODIFIER_PROPERTY_MIN_HEALTH: number
	MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PHYSICAL: number
	MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_MAGICAL: number
	MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE: number
	MODIFIER_PROPERTY_IS_ILLUSION: number
	MODIFIER_PROPERTY_ILLUSION_LABEL: number
	MODIFIER_PROPERTY_SUPER_ILLUSION: number
	MODIFIER_PROPERTY_SUPER_ILLUSION_WITH_ULTIMATE: number
	MODIFIER_PROPERTY_TURN_RATE_PERCENTAGE: number
	MODIFIER_PROPERTY_DISABLE_HEALING: number
	MODIFIER_PROPERTY_ALWAYS_ALLOW_ATTACK: number
	MODIFIER_PROPERTY_OVERRIDE_ATTACK_MAGICAL: number
	MODIFIER_PROPERTY_UNIT_STATS_NEEDS_REFRESH: number
	MODIFIER_PROPERTY_BOUNTY_CREEP_MULTIPLIER: number
	MODIFIER_PROPERTY_BOUNTY_OTHER_MULTIPLIER: number
	MODIFIER_EVENT_ON_SPELL_TARGET_READY: number
	MODIFIER_EVENT_ON_ATTACK_RECORD: number
	MODIFIER_EVENT_ON_ATTACK_START: number
	MODIFIER_EVENT_ON_ATTACK: number
	MODIFIER_EVENT_ON_ATTACK_LANDED: number
	MODIFIER_EVENT_ON_ATTACK_FAIL: number
	MODIFIER_EVENT_ON_ATTACK_ALLIED: number
	MODIFIER_EVENT_ON_PROJECTILE_DODGE: number
	MODIFIER_EVENT_ON_ORDER: number
	MODIFIER_EVENT_ON_UNIT_MOVED: number
	MODIFIER_EVENT_ON_ABILITY_START: number
	MODIFIER_EVENT_ON_ABILITY_EXECUTED: number
	MODIFIER_EVENT_ON_ABILITY_FULLY_CAST: number
	MODIFIER_EVENT_ON_BREAK_INVISIBILITY: number
	MODIFIER_EVENT_ON_ABILITY_END_CHANNEL: number
	MODIFIER_EVENT_ON_PROCESS_UPGRADE: number
	MODIFIER_EVENT_ON_REFRESH: number
	MODIFIER_EVENT_ON_TAKEDAMAGE: number
	MODIFIER_EVENT_ON_STATE_CHANGED: number
	MODIFIER_EVENT_ON_ORB_EFFECT: number
	MODIFIER_EVENT_ON_ATTACKED: number
	MODIFIER_EVENT_ON_DEATH: number
	MODIFIER_EVENT_ON_RESPAWN: number
	MODIFIER_EVENT_ON_SPENT_MANA: number
	MODIFIER_EVENT_ON_TELEPORTING: number
	MODIFIER_EVENT_ON_TELEPORTED: number
	MODIFIER_EVENT_ON_SET_LOCATION: number
	MODIFIER_EVENT_ON_HEALTH_GAINED: number
	MODIFIER_EVENT_ON_MANA_GAINED: number
	MODIFIER_EVENT_ON_TAKEDAMAGE_KILLCREDIT: number
	MODIFIER_EVENT_ON_HERO_KILLED: number
	MODIFIER_EVENT_ON_HEAL_RECEIVED: number
	MODIFIER_EVENT_ON_BUILDING_KILLED: number
	MODIFIER_EVENT_ON_MODEL_CHANGED: number
	MODIFIER_PROPERTY_TOOLTIP: number
	MODIFIER_PROPERTY_MODEL_CHANGE: number
	MODIFIER_PROPERTY_MODEL_SCALE: number
	MODIFIER_PROPERTY_IS_SCEPTER: number
	MODIFIER_PROPERTY_TRANSLATE_ACTIVITY_MODIFIERS: number
	MODIFIER_PROPERTY_TRANSLATE_ATTACK_SOUND: number
	MODIFIER_PROPERTY_LIFETIME_FRACTION: number
	MODIFIER_PROPERTY_PROVIDES_FOW_POSITION: number
	MODIFIER_PROPERTY_SPELLS_REQUIRE_HP: number
	MODIFIER_PROPERTY_FORCE_DRAW_MINIMAP: number
	MODIFIER_PROPERTY_DISABLE_TURNING: number
	MODIFIER_PROPERTY_IGNORE_CAST_ANGLE: number
	MODIFIER_PROPERTY_CHANGE_ABILITY_VALUE: number
	MODIFIER_PROPERTY_ABILITY_LAYOUT: number
	MODIFIER_EVENT_ON_DOMINATED: number
	MODIFIER_PROPERTY_TEMPEST_DOUBLE: number
	MODIFIER_PROPERTY_PRESERVE_PARTICLES_ON_MODEL_CHANGE: number
	MODIFIER_EVENT_ON_ATTACK_FINISHED: number
	MODIFIER_PROPERTY_IGNORE_COOLDOWN: number
	MODIFIER_FUNCTION_LAST: number
	MODIFIER_FUNCTION_INVALID: number
}
declare var modifierstate: modifierstate
interface modifierstate {
	MODIFIER_STATE_ROOTED: number
	MODIFIER_STATE_DISARMED: number
	MODIFIER_STATE_ATTACK_IMMUNE: number
	MODIFIER_STATE_SILENCED: number
	MODIFIER_STATE_MUTED: number
	MODIFIER_STATE_STUNNED: number
	MODIFIER_STATE_HEXED: number
	MODIFIER_STATE_INVISIBLE: number
	MODIFIER_STATE_INVULNERABLE: number
	MODIFIER_STATE_MAGIC_IMMUNE: number
	MODIFIER_STATE_PROVIDES_VISION: number
	MODIFIER_STATE_NIGHTMARED: number
	MODIFIER_STATE_BLOCK_DISABLED: number
	MODIFIER_STATE_EVADE_DISABLED: number
	MODIFIER_STATE_UNSELECTABLE: number
	MODIFIER_STATE_CANNOT_MISS: number
	MODIFIER_STATE_SPECIALLY_DENIABLE: number
	MODIFIER_STATE_FROZEN: number
	MODIFIER_STATE_COMMAND_RESTRICTED: number
	MODIFIER_STATE_NOT_ON_MINIMAP: number
	MODIFIER_STATE_NOT_ON_MINIMAP_FOR_ENEMIES: number
	MODIFIER_STATE_LOW_ATTACK_PRIORITY: number
	MODIFIER_STATE_NO_HEALTH_BAR: number
	MODIFIER_STATE_FLYING: number
	MODIFIER_STATE_NO_UNIT_COLLISION: number
	MODIFIER_STATE_NO_TEAM_MOVE_TO: number
	MODIFIER_STATE_NO_TEAM_SELECT: number
	MODIFIER_STATE_PASSIVES_DISABLED: number
	MODIFIER_STATE_DOMINATED: number
	MODIFIER_STATE_BLIND: number
	MODIFIER_STATE_OUT_OF_GAME: number
	MODIFIER_STATE_FAKE_ALLY: number
	MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY: number
	MODIFIER_STATE_TRUESIGHT_IMMUNE: number
	MODIFIER_STATE_LAST: number
}
declare var DOTAModifierAttribute_t: DOTAModifierAttribute_t
interface DOTAModifierAttribute_t {
	MODIFIER_ATTRIBUTE_NONE: number
	MODIFIER_ATTRIBUTE_PERMANENT: number
	MODIFIER_ATTRIBUTE_MULTIPLE: number
	MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE: number
}
declare var Attributes: Attributes
interface Attributes {
	DOTA_ATTRIBUTE_STRENGTH: number
	DOTA_ATTRIBUTE_AGILITY: number
	DOTA_ATTRIBUTE_INTELLECT: number
	DOTA_ATTRIBUTE_MAX: number
	DOTA_ATTRIBUTE_INVALID: number
}
declare var ParticleAttachment_t: ParticleAttachment_t
interface ParticleAttachment_t {
	PATTACH_INVALID: number
	PATTACH_ABSORIGIN: number
	PATTACH_ABSORIGIN_FOLLOW: number
	PATTACH_CUSTOMORIGIN: number
	PATTACH_CUSTOMORIGIN_FOLLOW: number
	PATTACH_POINT: number
	PATTACH_POINT_FOLLOW: number
	PATTACH_EYES_FOLLOW: number
	PATTACH_OVERHEAD_FOLLOW: number
	PATTACH_WORLDORIGIN: number
	PATTACH_ROOTBONE_FOLLOW: number
	PATTACH_RENDERORIGIN_FOLLOW: number
	PATTACH_MAIN_VIEW: number
	PATTACH_WATERWAKE: number
	MAX_PATTACH_TYPES: number
}
declare var DOTA_MOTION_CONTROLLER_PRIORITY: DOTA_MOTION_CONTROLLER_PRIORITY
interface DOTA_MOTION_CONTROLLER_PRIORITY {
	DOTA_MOTION_CONTROLLER_PRIORITY_LOWEST: number
	DOTA_MOTION_CONTROLLER_PRIORITY_LOW: number
	DOTA_MOTION_CONTROLLER_PRIORITY_MEDIUM: number
	DOTA_MOTION_CONTROLLER_PRIORITY_HIGH: number
	DOTA_MOTION_CONTROLLER_PRIORITY_HIGHEST: number
}
declare var DOTASpeechType_t: DOTASpeechType_t
interface DOTASpeechType_t {
	DOTA_SPEECH_USER_INVALID: number
	DOTA_SPEECH_USER_SINGLE: number
	DOTA_SPEECH_USER_TEAM: number
	DOTA_SPEECH_USER_TEAM_NEARBY: number
	DOTA_SPEECH_USER_NEARBY: number
	DOTA_SPEECH_USER_ALL: number
	DOTA_SPEECH_GOOD_TEAM: number
	DOTA_SPEECH_BAD_TEAM: number
	DOTA_SPEECH_SPECTATOR: number
	DOTA_SPEECH_RECIPIENT_TYPE_MAX: number
}
declare var DOTAAbilitySpeakTrigger_t: DOTAAbilitySpeakTrigger_t
interface DOTAAbilitySpeakTrigger_t {
	DOTA_ABILITY_SPEAK_START_ACTION_PHASE: number
	DOTA_ABILITY_SPEAK_CAST: number
}
declare var DotaCustomUIType_t: DotaCustomUIType_t
interface DotaCustomUIType_t {
	DOTA_CUSTOM_UI_TYPE_HUD: number
	DOTA_CUSTOM_UI_TYPE_HERO_SELECTION: number
	DOTA_CUSTOM_UI_TYPE_GAME_INFO: number
	DOTA_CUSTOM_UI_TYPE_GAME_SETUP: number
	DOTA_CUSTOM_UI_TYPE_FLYOUT_SCOREBOARD: number
	DOTA_CUSTOM_UI_TYPE_HUD_TOP_BAR: number
	DOTA_CUSTOM_UI_TYPE_END_SCREEN: number
	DOTA_CUSTOM_UI_TYPE_COUNT: number
	DOTA_CUSTOM_UI_TYPE_INVALID: number
}
declare var DotaDefaultUIElement_t: DotaDefaultUIElement_t
interface DotaDefaultUIElement_t {
	DOTA_DEFAULT_UI_TOP_TIMEOFDAY: number
	DOTA_DEFAULT_UI_TOP_HEROES: number
	DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD: number
	DOTA_DEFAULT_UI_ACTION_PANEL: number
	DOTA_DEFAULT_UI_ACTION_MINIMAP: number
	DOTA_DEFAULT_UI_INVENTORY_PANEL: number
	DOTA_DEFAULT_UI_INVENTORY_SHOP: number
	DOTA_DEFAULT_UI_INVENTORY_ITEMS: number
	DOTA_DEFAULT_UI_INVENTORY_QUICKBUY: number
	DOTA_DEFAULT_UI_INVENTORY_COURIER: number
	DOTA_DEFAULT_UI_INVENTORY_PROTECT: number
	DOTA_DEFAULT_UI_INVENTORY_GOLD: number
	DOTA_DEFAULT_UI_SHOP_SUGGESTEDITEMS: number
	DOTA_DEFAULT_UI_HERO_SELECTION_TEAMS: number
	DOTA_DEFAULT_UI_HERO_SELECTION_GAME_NAME: number
	DOTA_DEFAULT_UI_HERO_SELECTION_CLOCK: number
	DOTA_DEFAULT_UI_TOP_MENU_BUTTONS: number
	DOTA_DEFAULT_UI_TOP_BAR_BACKGROUND: number
	DOTA_DEFAULT_UI_ENDGAME: number
	DOTA_DEFAULT_UI_ENDGAME_CHAT: number
	DOTA_DEFAULT_UI_ELEMENT_COUNT: number
}
declare var PlayerUltimateStateOrTime_t: PlayerUltimateStateOrTime_t
interface PlayerUltimateStateOrTime_t {
	PLAYER_ULTIMATE_STATE_READY: number
	PLAYER_ULTIMATE_STATE_NO_MANA: number
	PLAYER_ULTIMATE_STATE_NOT_LEVELED: number
	PLAYER_ULTIMATE_STATE_HIDDEN: number
}
declare var PlayerOrderIssuer_t: PlayerOrderIssuer_t
interface PlayerOrderIssuer_t {
	DOTA_ORDER_ISSUER_SELECTED_UNITS: number
	DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY: number
	DOTA_ORDER_ISSUER_HERO_ONLY: number
	DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY: number
}
declare var OrderQueueBehavior_t: OrderQueueBehavior_t
interface OrderQueueBehavior_t {
	DOTA_ORDER_QUEUE_DEFAULT: number
	DOTA_ORDER_QUEUE_NEVER: number
	DOTA_ORDER_QUEUE_ALWAYS: number
}
declare var CLICK_BEHAVIORS: CLICK_BEHAVIORS
interface CLICK_BEHAVIORS {
	DOTA_CLICK_BEHAVIOR_NONE: number
	DOTA_CLICK_BEHAVIOR_MOVE: number
	DOTA_CLICK_BEHAVIOR_ATTACK: number
	DOTA_CLICK_BEHAVIOR_CAST: number
	DOTA_CLICK_BEHAVIOR_DROP_ITEM: number
	DOTA_CLICK_BEHAVIOR_DROP_SHOP_ITEM: number
	DOTA_CLICK_BEHAVIOR_DRAG: number
	DOTA_CLICK_BEHAVIOR_LEARN_ABILITY: number
	DOTA_CLICK_BEHAVIOR_PATROL: number
	DOTA_CLICK_BEHAVIOR_VECTOR_CAST: number
	DOTA_CLICK_BEHAVIOR_RIGHT_CLICK_TARGET: number
	DOTA_CLICK_BEHAVIOR_RADAR: number
	DOTA_CLICK_BEHAVIOR_LAST: number
}
declare var AbilityLearnResult_t: AbilityLearnResult_t
interface AbilityLearnResult_t {
	ABILITY_CAN_BE_UPGRADED: number
	ABILITY_CANNOT_BE_UPGRADED_NOT_UPGRADABLE: number
	ABILITY_CANNOT_BE_UPGRADED_AT_MAX: number
	ABILITY_CANNOT_BE_UPGRADED_REQUIRES_LEVEL: number
	ABILITY_NOT_LEARNABLE: number
}