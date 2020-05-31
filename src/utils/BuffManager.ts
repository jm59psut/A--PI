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

var BuffsCache: Buff[] = []
var BuffManager = {
	/**
	 * btw it can be any other algo that'll generate unique hash for different pairs
	 * @param {number} ent entity ID that have buff
	 * @param {number} id buff ID on entity
	 * @returns {any}
	 */
	GetBuffUID(ent: number, id: number): any { return Utils.PairNumbers(ent, id) },

	/**
	 * @param {Entity | number} ent entity ID that have buff
	 * @param {number} id buff ID on entity
	 * @returns {Buff}
	 */
	GetBuff(ent: Entity | number, id: number): Buff {
		const uid = BuffManager.GetBuffUID(ent instanceof Entity ? ent.id : ent, id)
		var cached_result = BuffsCache[uid]
		if(cached_result !== undefined) return cached_result

		return BuffsCache[uid] = new Buff(ent, id)
	}
}

module.exports = { BuffManager }