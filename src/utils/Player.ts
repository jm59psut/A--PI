/*!
 * Created on Sun Mar 11 2018
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

class Player {
	id: number

	/**
	 * @param {number} id id of player
	 */
	constructor(id: number = -1) {
		if(id <= -1 || id > DOTALimits_t.DOTA_MAX_PLAYERS || !Players.IsValidPlayerID(id))
			throw `[Player::constructor] Invalid ID ${id}`
		this.id = id
	}

	/**
	 * Return the name of a player.
	 */
	get PlayerName(): string { return Players.GetPlayerName(this.id) }
	
	/**
	 * Get the entity index of the hero controlled by this player.
	 */
	get PlayerHeroEntity(): Entity { return EntityManager.EntityByID(Players.GetPlayerHeroEntityIndex(this.id)) }
	
	/**
	 * Get the entities this player has selected.
	 */
	get SelectedEntities(): Entity[] { return Players.GetSelectedEntities(this.id).map(EntityManager.EntityByID) }
	
	/**
	 * Get the entities this player is querying.
	 */
	get QueryUnit(): Entity { return EntityManager.EntityByID(Players.GetQueryUnit(this.id)) }
	
	/**
	 * Can the player buy back?
	 */
	get CanPlayerBuyback(): boolean { return Players.CanPlayerBuyback(this.id) }
	
	/**
	 * Does this player have a custom game ticket?
	 */
	get HasCustomGameTicketForPlayerID(): boolean { return Players.HasCustomGameTicketForPlayerID(this.id) }
	
	/**
	 * The number of assists credited to a player.
	 */
	get Assists(): number { return Players.GetAssists(this.id) }
	
	get ClaimedDenies(): number { return Players.GetClaimedDenies(this.id) }
	
	get ClaimedMisses(): number { return Players.GetClaimedMisses(this.id) }
	
	/**
	 * The number of deaths a player has suffered.
	 */
	get Deaths(): number { return Players.GetDeaths(this.id) }
	
	/**
	 * The number of denies credited to a player.
	 */
	get Denies(): number { return Players.GetDenies(this.id) }
	
	/**
	 * The amount of gold a player has.
	 */
	get Gold(): number { return Players.GetGold(this.id) }
	
	/**
	 * The number of kills credited to a player.
	 */
	get Kills(): number { return Players.GetKills(this.id) }
	
	get LastBuybackTime(): number { return Players.GetLastBuybackTime(this.id) }
	
	get LastHitMultikill(): number { return Players.GetLastHitMultikill(this.id) }
	
	/**
	 * The number of last hits credited to a player.
	 */
	get LastHits(): number { return Players.GetLastHits(this.id) }
	
	get LastHitStreak(): number { return Players.GetLastHitStreak(this.id) }
	
	/**
	 * The current level of a player.
	 */
	get Level(): number { return Players.GetLevel(this.id) }
	
	get Misses(): number { return Players.GetMisses(this.id) }
	
	get NearbyCreepDeaths(): number { return Players.GetNearbyCreepDeaths(this.id) }
	
	/**
	 * Total reliable gold for this player.
	 */
	get ReliableGold(): number { return Players.GetReliableGold(this.id) }
	
	get RespawnSeconds(): number { return Players.GetRespawnSeconds(this.id) }
	
	get Streak(): number { return Players.GetStreak(this.id) }
	
	/**
	 * Total gold earned in this game by this player.
	 */
	get TotalEarnedGold(): number { return Players.GetTotalEarnedGold(this.id) }
	
	/**
	 * Total xp earned in this game by this player.
	 */
	get TotalEarnedXP(): number { return Players.GetTotalEarnedXP(this.id) }
	
	/**
	 * Total unreliable gold for this player.
	 */
	get UnreliableGold(): number { return Players.GetUnreliableGold(this.id) }
	
	/**
	 * Get the team this player is on.
	 */
	get Team(): number { return Players.GetTeam(this.id) }
	
	/**
	 * Average gold earned per minute for this player.
	 */
	get GoldPerMin(): number { return Players.GetGoldPerMin(this.id) }
	
	/**
	 * Average xp earned per minute for this player.
	 */
	get XPPerMin(): number { return Players.GetXPPerMin(this.id) }
	
	/**
	 * Return the name of the hero a player is controlling.
	 */
	get PlayerSelectedHero(): string { return Players.GetPlayerSelectedHero(this.id) }
	
	/**
	 * Get the player color.
	 * @returns RGB HEXified color
	 */
	get PlayerColor(): string { return Players.GetPlayerColor(this.id).toString(16).substring(2) }
	
	/**
	 * Is this player a spectator.
	 */
	get IsSpectator(): boolean { return Players.IsSpectator(this.id) }
	
	PlayerPortraitClicked(bHoldingCtrl: boolean,  bHoldingAlt: boolean) { return Players.PlayerPortraitClicked(this.id, bHoldingCtrl, bHoldingAlt) }
}

module.exports = { Player }
