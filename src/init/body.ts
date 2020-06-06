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

var Corona = {
	Configs: <any> {},
	Commands: <any> {},
	Panels: <any> {},
	Particles: <any> {},
	Subscribes: <any> {},
	Scripts: new Map<String, CoronaModule>(),
	MyTick: <number> 1 / 30,
	debug: <boolean> false,
	debugLoad: <boolean> false,
	debugAnimations: <boolean> false,
	CoronaServer: <string> "http://localhost:4297",
	SteamID: <string> "0",
	OnTick: <((/*self: */Function) => void)[]> [],
	OnUpdate: <((/*self: */Function) => void)[]> [],

	ForceStaffUnits: <number> 600,

	ServerRequest(name?: string, path?: string, data?: any): Promise<string | Array<any> | any> { return null },
	SteamAPIRequest(type: string, IName: string, methodName: string, parameters: any, methodVersion: string): Promise<string | Array<any> | any> { return null },
	
	GetScript(scriptName: string): Promise<string> { return null },
	GetXML(file: string): Promise<string> { return null },
	GetStyle(file: string): Promise<string> { return null },
	SaveConfig(scriptName: string, config: any): Promise<string> { return null },
	GetConfig(scriptName: string): Promise<string | Array<any> | any> { return null },

	ReloadCorona(): void {},
	LoadCorona(): Promise<void> { return null },
	AddScriptToList(script: CoronaModule): void {},
	LoadScriptFromString(scriptCode: string): any {}
}

Game.allCreeps = []

Object.defineProperty(Array.prototype, "orderBy", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: function(cb: Function) {
		return this.sort((a, b) => cb(a) - cb(b))
	}
})
Object.defineProperty(Array.prototype, "remove", { // remove value from array without creating new array
	enumerable: false,
	configurable: false,
	writable: false,
	value: function(obj: any) {
		var i
		while((i = this.indexOf(obj)) > -1)
			this.splice(i, 1)
		return this
	}
})

if (!String.prototype.repeat) // FIXME: remove in native, as anyway there'll be ES6 support
	Object.defineProperty(String.prototype, "repeat", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(count: number): String {
			if (this == null)
				throw new TypeError(`Can't convert ${this} to object`)
			var str = "" + this
			count += 1
			if (count != count)
				count = 0
			if (count < 0)
				throw new RangeError("Repeat count must be non-negative")
			if (count == Infinity)
				throw new RangeError("Repeat count must be less than infinity")
			count = Math.floor(count)
			if (str.length == 0 || count == 0)
				return ""
			if (str.length * count >= 1 << 28)
				throw new RangeError("Repeat count must not overflow maximum String size")
			var rpt = ""
			for (;;) {
				if ((count & 1) == 1)
					rpt += str
				count >>>= 1
				if (count == 0)
					break
				str += str
			}
			return rpt
		}
	})

if (!String.prototype.startsWith) // FIXME: remove in native, as anyway there'll be ES6 support
	Object.defineProperty(String.prototype, "startsWith", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(searchString: String, position: number = 0) {
			return this.indexOf(searchString, position) === position
		}
	})

if(!$.Msg_old) {
	$.Msg_old = $.Msg
	$.Msg = (tag: string, ...msg: any[]): void => {
		if(msg.length === 0) {
			msg = [tag]
			tag = "Unspecified"
		}
		$.Msg_old(`[${tag}] `, ...msg.map(msg_ => msg_.toString()))
		Corona.ServerRequest("log", tag, msg.map(msg_ => msg_.toString()))
	}
}
if(!$.Schedule_old) {
	$.Schedule_old = $.Schedule
	$.Schedule = (delay: number, callback: (callbackID: number) => void): number => {
		if(isNaN(delay) || !isFinite(delay) || delay === undefined) {
			$.Msg("$.Schedule", callback || "undefined callback")
			$.Msg("$.Schedule", delay || "undefined delay")
			throw "$.Schedule error"
		} else
			return $.Schedule_old(delay, callback)
	}
}

/**
 * Loads standartized script
 * @param scriptCode script's code to load
 * @returns script's exports if present
 */
Corona.LoadScriptFromString = (scriptCode: String): any => { // works like a scriptsCode.forEach(requireFromString)
	try {
		var module: any = []
		eval(<string> scriptCode)
		if(module.name)
			Corona.Scripts.set(module.name, module)
		return module
	} catch(e) {
		$.Msg("Corona.LoadScriptFromString", `${scriptCode.substring(0, 2 ** 16 - 1)}\n`);
	}
}

Corona.ReloadCorona = (): void => {
	Corona.Scripts.forEach((script, scriptName) => {
		if(script.onDestroy !== undefined)
			try {
				script.onDestroy()
			} catch(e) { $.Msg(`onDestroy@${script.name}`, e) }

		Corona.Scripts.delete(scriptName)
	})
	Corona.OnUpdate = []
	Corona.OnTick = []

	if(Corona.Panels.MainPanel) {
		Corona.Panels.MainPanel.DeleteAsync(0) // it'll be reinitialized by Corona.LoadCorona
		delete Corona.Panels.MainPanel
	}

	if(Corona.Panels.MenuButton) {
		Corona.Panels.MenuButton.DeleteAsync(0)
		delete Corona.Panels.MenuButton
	}

	Corona.ServerRequest("scriptlist")
		.then(response => Promise.all(response.map(str => `${str}/body`).map(Corona.GetScript)))
		.then(scriptsCode => {
			scriptsCode.map(scriptCode => {
				const script = Corona.LoadScriptFromString(<string> scriptCode)
				if(script.onInit !== undefined)
					try {
						script.onInit()
					} catch(e) { $.Msg(`onInit@${script.name}`, e) }
				return script
			}).filter(script => script.exports !== undefined).forEach(script => {
				for(let k in script.exports) // as it's object
					this[k] = script.exports[k]
			})
			Corona.LoadCorona().then(() => {
				Corona.Scripts.forEach(script => {
					if(script.onPreload !== undefined)
						try {
							script.onPreload()
						} catch(e) { $.Msg(`onPreload@${script.name}`, e) }

					Corona.AddScriptToList(script) // must be defined somewhere in loaded files (ex.: gui)
				})

				Corona.Panels.MainPanel.visible = true // unhide popup
			})
		}).catch(err => $.Msg("Corona.ReloadCorona", `Error: ${err || ""}`))
}

Corona.ServerRequest = (name: string = "", path: string = "", data: any = ""): Promise<string> => new Promise(resolve => {
	var args = {
		type: "POST",
		data: {
			steamid: Corona.SteamID,
			name: name,
			path: path,
			data: data
		},
		success: resolve,
		error: response => {
			if(Corona.debugLoad)
				var log = `Can't load "${name}" @ ${path}, returned ${JSON.stringify(response)}.`
			if(response.status !== 403) {
				if(Corona.debugLoad)
					$.Msg("Corona.ServerRequest", log + " Trying again.")

				$.AsyncWebRequest(<string> Corona.CoronaServer, args)
			} else {
				if(Corona.debugLoad)
					$.Msg("Corona.ServerRequest", log)
				resolve("") // bad things happen if we'll use reject [Promise.all will fail]
			}
		}
	}

	$.AsyncWebRequest(<string> Corona.CoronaServer, args)
})
Corona.SteamAPIRequest = (type: String, IName: String, methodName: String, parameters: any, methodVersion: String): Promise<String> => new Promise(resolve => {
	var addr = `https://api.steampowered.com/${IName}/${methodName}/${methodVersion || "v1"}/`,
		args = {
			type: type,
			data: parameters,
			success: resolve,
			error: response => {
				if(Corona.debugLoad)
					var log = `Can't get SteamAPI "${IName}/${methodName}" with ${JSON.stringify(parameters)}, returned ${JSON.stringify(response)}.`
				if(response.status !== 403) {
					if(Corona.debugLoad)
						$.Msg("Corona.SteamAPIRequest", log + " Trying again.")

					$.AsyncWebRequest(addr, args)
				} else {
					if(Corona.debugLoad)
						$.Msg("Corona.SteamAPIRequest", log)
					resolve("") // bad things happen if we'll use reject
				}
			}
		}

	$.AsyncWebRequest(addr, args)
})

Corona.GetScript = (scriptName: string): Promise<string> => Corona.ServerRequest("getscript", scriptName)
Corona.GetXML = (file: string): Promise<string> => Corona.ServerRequest("getxml", file)
Corona.GetStyle = (file: string): Promise<string> => Corona.ServerRequest("getstyle", file)
Corona.SaveConfig = (scriptName: string, config: any): Promise<string> => Corona.ServerRequest("writeconfig", scriptName, [config])
Corona.GetConfig = (scriptName: string): Promise<any> => new Promise(resolve => Corona.ServerRequest("getconfig", scriptName).then(json => resolve(json[0])))

Corona.LoadCorona = (): Promise<void> => new Promise(resolve => {
	if(Corona.Panels.MainPanel) {
		Utils.UnrestrictedCmd("bind Home __TogglePanel")
		Game.ServerCmd('bind Home __TogglePanel')
		Corona.Panels.MainPanel.DeleteAsync(0)
		delete Corona.Panels.MainPanel
	}

	var menuButtons = Corona.Panels.Main.HUDElements.FindChild('MenuButtons').FindChild('ButtonBar')
	Corona.Panels.MenuButton = $.CreatePanel("Button", menuButtons, "ToggleCoronaButton")
	Corona.Panels.MenuButton.BLoadLayoutFromString(`
		<root>\
			<Button style="background-image: url('s2r://panorama/images/control_icons/guild_leader_png.vtex'); background-size: 26px;"/>\
		</root>
	`, false, false)
	Corona.Panels.MenuButton.SetPanelEvent("onactivate", () => {
		Corona.Panels.MainPanel.visible = !Corona.Panels.MainPanel.visible
	})

	Corona.Panels.MainPanel = $.CreatePanel("Panel", Corona.Panels.Main, "DotaOverlay")
	Corona.GetXML("init/hud").then(layout_String => {
		if(Corona.debugLoad)
			$.Msg("Corona.LoadCorona", "HUD now are initializing...")

		Corona.Panels.MainPanel.BLoadLayoutFromString(layout_String, false, false)
		Corona.Panels.MainPanel.visible = false // automatically hide popup
		Corona.GetScript("gui/body").then(eval).then(() => {
			if(Corona.debugLoad)
				$.Msg("Corona.LoadCorona", "HUD initializing finished!")

			if(Corona.debugLoad)
				$.Msg("Corona.LoadCorona", "Calling callback (usually - load scripts)...")
			resolve()
			if(Corona.debugLoad)
				$.Msg("Corona.LoadCorona", "Callback called successfully!")

			Corona.GetConfig("init").then(config => {
				Corona.Configs.init = config

				if(Corona.debugLoad)
					$.Msg("Corona.LoadCorona", "Setting ConVars...")

				for(let key in config.ConVars) // as it's object
					Utils.SetConvar(key, config.ConVars[key])

				if(Corona.debugLoad)
					$.Msg("Corona.LoadCorona", "Executing commands...")

				for(let key in config.Commands) // as it's object
					Utils.UnrestrictedCmd(config.Commands[key])

				if(Corona.debugLoad)
					$.Msg("Corona.LoadCorona", "Initializing slider...")

				cam_dist_struct.min = parseInt(config.Slider.Min)
				cam_dist_struct.max = parseInt(config.Slider.Max)
				cam_dist_struct.lastValue = -1 // -1 to make sure camera distance will be changed
				ChangeCamDist(parseInt(config.Slider.Value))

				if(config.BindMouse) {
					Utils.UnrestrictedCmd("bind mwheelup _MouseUp")
					Utils.UnrestrictedCmd("bind mwheeldown _MouseDown")
				}
			})
		})
	})
})

if(Corona.Panels.MainPanel !== undefined)
	Corona.Panels.MainPanel.DeleteAsync(0)

function InstallMainHUD(): void {
	var globalContext = $.GetContextPanel()
	while(globalContext.paneltype !== "DOTAHud") {
		globalContext = globalContext.GetParent()
	}
	Corona.Panels.Main = globalContext
	Corona.Panels.Main.HUDElements = Corona.Panels.Main.FindChild("HUDElements")
}

function SetCameraPitch(angle: number): void {
	GameUI.SetCameraPitchMin(angle)
	GameUI.SetCameraPitchMax(angle)
}

function OnTick(): void {
	Corona.OnTick.forEach(func => {
		try {
			func(func)
		} catch(e) {
			$.Msg("OnTick", func)
			$.Msg("OnTick", e)
			Corona.OnTick.remove(func)
		}
	})

	$.Schedule(Corona.MyTick, OnTick)
}

function OnUpdate(): void {
	Corona.OnUpdate.forEach(func => {
		try {
			func(func)
		} catch(e) {
			$.Msg("OnUpdate", func)
			$.Msg("OnUpdate", e)
			Corona.OnUpdate.remove(func)
		}
	})

	$.Schedule(0, OnUpdate)
}

var cam_dist_struct = {
	min: 500,
	max: 1134,
	lastValue: -1 // -1 to make sure camera distance will be changed
}
function ChangeCamDist(cam_dist: number) {
	if (cam_dist_struct.lastValue === cam_dist) return
	if (cam_dist_struct.lastValue !== -1) {
		Corona.Configs.init.Slider.Value = cam_dist
		Corona.SaveConfig("init", Corona.Configs.init)
	}
	cam_dist_struct.lastValue = cam_dist
	GameUI.SetCameraDistance(cam_dist)
	Utils.SetConvar("r_farz", cam_dist * 2)
}

var StatsEnabled = true,
	MinimapActsEnabled = true
function WaitForGameStart(): void {
	$.Schedule(Corona.MyTick, () => {
		if(Players.GetLocalPlayer() !== -1) {
			Corona.SteamID = Game.GetLocalPlayerInfo().player_steamid
			InstallMainHUD()
			SetCameraPitch(60)
			Game.ServerCmd('bind Home __TogglePanel')
			Game.AddCommand("_MouseUp", () => ChangeCamDist(cam_dist_struct.lastValue - (GameUI.IsControlDown() ? 25 : 0)), "", 0)
			Game.AddCommand("_MouseDown", () => ChangeCamDist(cam_dist_struct.lastValue + (GameUI.IsControlDown() ? 25 : 0)), "", 0)
			Game.AddCommand("__ReloadCorona", Corona.ReloadCorona, "", 0)
			Game.AddCommand("__TogglePanel", () => Corona.Panels.MainPanel.visible = !Corona.Panels.MainPanel.visible, "",0)
			Game.AddCommand("__ToggleMenuButton", () => Corona.Panels.MenuButton.visible = !Corona.Panels.MenuButton.visible, "",0)
			Game.AddCommand("__eval", (name, code) => $.Msg("__eval", eval(code)), "", 0)
			Game.AddCommand("__ToggleMinimapActs", () => Corona.Panels.Main.HUDElements.FindChildTraverse("GlyphScanContainer").visible = MinimapActsEnabled = !MinimapActsEnabled, "",0)
			Game.AddCommand("__ToggleStats", () => Corona.Panels.Main.HUDElements.FindChildTraverse("quickstats").visible = StatsEnabled = !StatsEnabled, "",0)
			Corona.ReloadCorona()

		} else
			WaitForGameStart()
	})
}

WaitForGameStart()
OnTick()
OnUpdate()
