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

var enabled: boolean = false,
	str:     string  = "a".repeat(0xFE)

function ChatSpammerF(): void {
	/*var randHero = heroes.randomElement()
	suggest_hero_pick(randHero)
	suggest_hero_pick(randHero)*/
	suggest_hero_role(str)

	if(enabled)
		$.Schedule(Fusion.MyTick * 5, ChatSpammerF)
}

function suggest_hero_role(roleName: string): void {
	
	Game.ServerCmd(`say Spam`)
}

module = {
	name: "Chat Spammer",
	onToggle: checkbox => {
		enabled = checkbox.checked

		if (enabled) {
			ChatSpammerF()
			Utils.ScriptLogMsg("Script enabled: Chat Spammer", "#00ff00")
		} else
			Utils.ScriptLogMsg("Script disabled: Chat Spammer", "#ff0000")
	},
	onDestroy: () => enabled = false
}