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

var exportsAr = [
		"Combo", "Entity", "Buff", "BuffManager", // base classes
		"Vector", "EntityManager", "Orders",
		"ParticleManager", "Utils", "Player",
		"PlayerManager",
		"Ability", "Item" // extends
	],
	onDestroyAr: Function[] = []
function onInitF() { // custom loader because of "extends" shit and of my laziness to fix it by rewriting some code in Babel
	Promise.all(exportsAr.map(str => `utils/${str}`).map(Corona.GetScript)).then(scriptsCode => scriptsCode.forEach(scriptCode => {
		const script = Corona.LoadScriptFromString(scriptCode)
		try {
			for(let k in script.exports) // as it's object
				_this[k] = script.exports[k]
			if(script.onDestroy !== undefined)
				onDestroyAr.push(script.onDestroy)
		} catch(e) { $.Msg(`utils.__init__::onInitF => ${e || "Unknown error"}`) }
	}))
}

module = {
	name: "Utilities",
	onDestroy: () => onDestroyAr.forEach(func => func()),
	onInit: onInitF,
	isVisible: false
}