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

module = {
	name: "Custom games tools",
	onPreload: (): void => {
		if(!Corona.Commands.SetTimeoutForHost) {
			Corona.Commands.SetTimeoutForHost = () => { //Host-troll
				Game.SetAutoLaunchEnabled(false)
				Game.SetAutoLaunchEnabled(true)
				Game.SetAutoLaunchDelay(1500000000000)
				Game.SetRemainingSetupTime(400000000000000)
			}
			Game.AddCommand("__SetTimeoutForHost", Corona.Commands.SetTimeoutForHost, "", 0)
		}
	
		if(!Corona.Commands.Set1TimeoutForHost) {
			Corona.Commands.Set1TimeoutForHost = () => { //Host-antitroll
				Game.SetAutoLaunchEnabled(false)
				Game.SetAutoLaunchEnabled(true)
				Game.SetAutoLaunchDelay(0)
				Game.SetRemainingSetupTime(0)
			}
	
			Game.AddCommand("__Set1TimeoutForHost", Corona.Commands.Set1TimeoutForHost, "", 0)
		}
	},
	isVisible: false
}