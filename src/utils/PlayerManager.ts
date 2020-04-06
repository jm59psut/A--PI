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

var PlayersCache: Player[] = []
var PlayerManager = {
	/**
	 * @returns all the players
	 */
	get Players(): Player[] { return Game.GetAllPlayerIDs().map(this.PlayerByID) },

	get LocalPlayer(): Player { return PlayerManager.PlayerByID(Players.GetLocalPlayer()) },

	/**
	 * @param {number} id player ID
	 * @returns {Item} player from given ID
	 */
	PlayerByID(id: number = -1): Player {
		if(id <= -1)
			return undefined
		var cached_result = PlayersCache[id]
		if(cached_result !== undefined) return cached_result

		return PlayersCache[id] = new Player(id)
	}
}

module.exports = { PlayerManager }