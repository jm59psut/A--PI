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

var EntitiesCache: Item[] = []
var EntityManager = {
	/**
	 * @returns {Entity[]} all the entities
	 */
	get Entities(): Entity[] { return Entities.GetAllEntities().map(this.EntityByID) },

	/**
	 * @returns {Entity[]} all the building entities
	 */
	get BuildingEntities(): Entity[] { return Entities.GetAllBuildingEntities().map(this.EntityByID) },

	/**
	 * @returns {Entity[]} all the creature entities
	 */
	get CreatureEntities(): Entity[] { return Entities.GetAllCreatureEntities().map(this.EntityByID) },

	/**
	 * @returns {Entity[]} all hero entities (including illusions)
	 */
	get HeroEntities(): Entity[] { return Entities.GetAllHeroEntities().map(this.EntityByID) },

	/**
	 * @returns {Entity[]} all creeps
	 */
	get Creeps(): Entity[] { return this.Entities.filter(ent => ent.IsCreep) },

	/**
	 * @returns {Entity[]} all lane creeps
	 */
	get LaneCreeps(): Entity[] { return this.Entities.filter(ent => ent.IsLaneCreep) },

	/**
	 * @returns {Entity} localplayer's entity
	 */
	get MyEnt(): Entity { return PlayerManager.LocalPlayer.PlayerHeroEntity },

	/**
	 * @returns {Entity} entity that localplayer's selected
	 */
	get LocalPlayerPortraitUnit(): Entity { return this.EntityByID(Players.GetLocalPlayerPortraitUnit()) },

	/**
	 * @returns {Ability} current ability that're in ability phase
	 */
	get LocalPlayerActiveAbility(): Ability { return this.EntityByID(Abilities.LocalPlayerActiveAbility()) },

	/**
	 * @param {string} pszName name
	 * @returns {Entity[]} all the entities with a given name.
	 */
	GetAllEntitiesByName(pszName: string): Entity[] { return Entities.GetAllEntitiesByName(pszName).map(this.EntityByID) },

	/**
	 * @param {string} pszName classname
	 * @returns {Entity[]} all the entities with a given classname.
	 */
	GetAllEntitiesByClassname(pszName: string): Entity[] { return Entities.GetAllEntitiesByClassname(pszName).map(this.EntityByID) },

	/**
	 * @param {boolean} returnNotVisible do we want to get entities in FoW?
	 * @returns {Entity[]} array of players hero entities
	 */
	PlayersHeroEnts(returnNotVisibleToo: boolean = false): Entity[] {
		var playerEnts = PlayerManager.Players
				.filter(player => !player.IsSpectator)
				.map(player => player.PlayerHeroEntity)
				.filter(ent => ent !== undefined)
		if(!returnNotVisibleToo) {
			let ents = EntityManager.Entities
			playerEnts = playerEnts.filter(ent => ents.indexOf(ent) > -1)
		}

		return playerEnts
	},
PlayersHeroEntity2(){
	var PlayersEnt2 = []
	var PlayersIDs = Game.GetAllPlayerIDs()
	for(var i in PlayersIDs)
		PlayersEnt2.push( Players.GetPlayerHeroEntityIndex( PlayersIDs[i] ) )
	return PlayersEnt2

},
PlayersHeroEnts3(){
	var PlayersEnt = []
	var PlayersIDs = Game.GetAllPlayerIDs()
	for(var i in PlayersIDs)
		PlayersEnt.push( Players.GetPlayerHeroEntityIndex( PlayersIDs[i] ) )
	return PlayersEnt
},
	/**
	 * @param {number} id entity ID
	 * @returns {Item} entity from given ID
	 */
	EntityByID(id: number = -1): Item {
		if(id <= -1)
			return undefined
		var cached_result = EntitiesCache[id]
		if(cached_result !== undefined) return cached_result

		return EntitiesCache[id] = new Item(id)
	}
}

module.exports = { EntityManager }