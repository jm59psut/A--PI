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

var Fusion = {
	Configs: <any> {},
	Commands: <any> {},
	Panels: <any> {},
	Particles: <any> {},
	Subscribes: <any> {},
	Scripts: new Map<String, FusionModule>(),
	MyTick: <number> 1 / 30,
	debug: <boolean> false,
	debugLoad: <boolean> false,
	debugAnimations: <boolean> false,
	FusionServer: <string> "http://localhost:4297",
	SteamID: <string> "0",
	OnTick: <((/*self: */Function) => void)[]> [],
	OnUpdate: <((/*self: */Function) => void)[]> [],

	ForceStaffUnits: <number> 600,

	ServerRequest(name?: string, path?: string, data?: any): Promise<string | Array<any> | any> { return null },
	SteamAPIRequest(type: string, IName: string, methodName: string, parameters: any, methodVersion: string): Promise<string | Array<any> | any> { return null },
	
	GetScript(scriptName: string): Promise<string> { return null },
	GetXML(file: string): Promise<string> { return null },
	SaveConfig(scriptName: string, config: any): Promise<string> { return null },
	GetConfig(scriptName: string): Promise<string | Array<any> | any> { return null },

	ReloadFusion(): void {},
	LoadFusion(): Promise<void> { return null },
	AddScriptToList(script: FusionModule): void {},
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
		Fusion.ServerRequest("log", tag, msg.map(msg_ => msg_.toString()))
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
Fusion.LoadScriptFromString = (scriptCode: String): any => { // works like a scriptsCode.forEach(requireFromString)
	try {
		var module: any = []
		eval(<string> scriptCode)
		if(module.name)
			Fusion.Scripts.set(module.name, module)
		return module
	} catch(e) {
		$.Msg("Fusion.LoadScriptFromString", `${scriptCode.substring(0, 2 ** 16 - 1)}\n`);
	}
}

Fusion.ReloadFusion = (): void => {
	Fusion.Scripts.forEach((script, scriptName) => {
		if(script.onDestroy !== undefined)
			try {
				script.onDestroy()
			} catch(e) { $.Msg(`onDestroy@${script.name}`, e) }

		Fusion.Scripts.delete(scriptName)
	})
	Fusion.OnUpdate = []
	Fusion.OnTick = []

	if(Fusion.Panels.MainPanel) {
		Fusion.Panels.MainPanel.DeleteAsync(0) // it'll be reinitialized by Fusion.LoadFusion
		delete Fusion.Panels.MainPanel
	}

	Fusion.ServerRequest("scriptlist")
		.then(response => Promise.all(response.map(str => `${str}/body`).map(Fusion.GetScript)))
		.then(scriptsCode => {
			scriptsCode.map(scriptCode => {
				const script = Fusion.LoadScriptFromString(<string> scriptCode)
				if(script.onInit !== undefined)
					try {
						script.onInit()
					} catch(e) { $.Msg(`onInit@${script.name}`, e) }
				return script
			}).filter(script => script.exports !== undefined).forEach(script => {
				for(let k in script.exports) // as it's object
					this[k] = script.exports[k]
			})
			Fusion.LoadFusion().then(() => {
				Fusion.Scripts.forEach(script => {
					if(script.onPreload !== undefined)
						try {
							script.onPreload()
						} catch(e) { $.Msg(`onPreload@${script.name}`, e) }

					Fusion.AddScriptToList(script) // must be defined somewhere in loaded files (ex.: gui)
				})

				Fusion.Panels.MainPanel.visible = true // unhide popup
			})
		}).catch(err => $.Msg("Fusion.ReloadFusion", `Error: ${err || ""}`))
}

Fusion.ServerRequest = (name: string = "", path: string = "", data: any = ""): Promise<string> => new Promise(resolve => {
	var args = {
		type: "POST",
		data: {
			steamid: Fusion.SteamID,
			name: name,
			path: path,
			data: data
		},
		success: resolve,
		error: response => {
			if(Fusion.debugLoad)
				var log = `Can't load "${name}" @ ${path}, returned ${JSON.stringify(response)}.`
			if(response.status !== 403) {
				if(Fusion.debugLoad)
					$.Msg("Fusion.ServerRequest", log + " Trying again.")

				$.AsyncWebRequest(<string> Fusion.FusionServer, args)
			} else {
				if(Fusion.debugLoad)
					$.Msg("Fusion.ServerRequest", log)
				resolve("") // bad things happen if we'll use reject [Promise.all will fail]
			}
		}
	}

	$.AsyncWebRequest(<string> Fusion.FusionServer, args)
})
Fusion.SteamAPIRequest = (type: String, IName: String, methodName: String, parameters: any, methodVersion: String): Promise<String> => new Promise(resolve => {
	var addr = `https://api.steampowered.com/${IName}/${methodName}/${methodVersion || "v1"}/`,
		args = {
			type: type,
			data: parameters,
			success: resolve,
			error: response => {
				if(Fusion.debugLoad)
					var log = `Can't get SteamAPI "${IName}/${methodName}" with ${JSON.stringify(parameters)}, returned ${JSON.stringify(response)}.`
				if(response.status !== 403) {
					if(Fusion.debugLoad)
						$.Msg("Fusion.SteamAPIRequest", log + " Trying again.")

					$.AsyncWebRequest(addr, args)
				} else {
					if(Fusion.debugLoad)
						$.Msg("Fusion.SteamAPIRequest", log)
					resolve("") // bad things happen if we'll use reject
				}
			}
		}

	$.AsyncWebRequest(addr, args)
})

Fusion.GetScript = (scriptName: string): Promise<string> => Fusion.ServerRequest("getscript", scriptName)
Fusion.GetXML = (file: string): Promise<string> => Fusion.ServerRequest("getxml", file)
Fusion.SaveConfig = (scriptName: string, config: any): Promise<string> => Fusion.ServerRequest("writeconfig", scriptName, [config])
Fusion.GetConfig = (scriptName: string): Promise<any> => new Promise(resolve => Fusion.ServerRequest("getconfig", scriptName).then(json => resolve(json[0])))

Fusion.LoadFusion = (): Promise<void> => new Promise(resolve => {
	if(Fusion.Panels.MainPanel) {
		Utils.UnrestrictedCmd("bind Home __TogglePanel")
		Game.ServerCmd('bind Home __TogglePanel')
		Fusion.Panels.MainPanel.DeleteAsync(0)
		delete Fusion.Panels.MainPanel
	}

	Fusion.Panels.MainPanel = $.CreatePanel("Panel", Fusion.Panels.Main, "DotaOverlay")
	Fusion.GetXML("init/hud").then(layout_String => {
		if(Fusion.debugLoad)
			$.Msg("Fusion.LoadFusion", "HUD now are initializing...")

		Fusion.Panels.MainPanel.BLoadLayoutFromString(layout_String, false, false)
		Fusion.Panels.MainPanel.visible = false // automatically hide popup
		Fusion.GetScript("gui/body").then(eval).then(() => {
			if(Fusion.debugLoad)
				$.Msg("Fusion.LoadFusion", "HUD initializing finished!")

			if(Fusion.debugLoad)
				$.Msg("Fusion.LoadFusion", "Calling callback (usually - load scripts)...")
			resolve()
			if(Fusion.debugLoad)
				$.Msg("Fusion.LoadFusion", "Callback called successfully!")

			Fusion.GetConfig("init").then(config => {
				Fusion.Configs.init = config

				if(Fusion.debugLoad)
					$.Msg("Fusion.LoadFusion", "Setting ConVars...")

				for(let key in config.ConVars) // as it's object
					Utils.SetConvar(key, config.ConVars[key])

				if(Fusion.debugLoad)
					$.Msg("Fusion.LoadFusion", "Executing commands...")

				for(let key in config.Commands) // as it's object
					Utils.UnrestrictedCmd(config.Commands[key])

				if(Fusion.debugLoad)
					$.Msg("Fusion.LoadFusion", "Initializing slider...")

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

if(Fusion.Panels.MainPanel !== undefined)
	Fusion.Panels.MainPanel.DeleteAsync(0)

function InstallMainHUD(): void {
	var globalContext = $.GetContextPanel()
	while(globalContext.paneltype !== "DOTAHud")
		globalContext = globalContext.GetParent()
	Fusion.Panels.Main = globalContext
	Fusion.Panels.Main.HUDElements = Fusion.Panels.Main.FindChild("HUDElements")
}

function SetCameraPitch(angle: number): void {
	GameUI.SetCameraPitchMin(angle)
	GameUI.SetCameraPitchMax(angle)
}

function OnTick(): void {
	Fusion.OnTick.forEach(func => {
		try {
			func(func)
		} catch(e) {
			$.Msg("OnTick", func)
			$.Msg("OnTick", e)
			Fusion.OnTick.remove(func)
		}
	})

	$.Schedule(Fusion.MyTick, OnTick)
}

function OnUpdate(): void {
	Fusion.OnUpdate.forEach(func => {
		try {
			func(func)
		} catch(e) {
			$.Msg("OnUpdate", func)
			$.Msg("OnUpdate", e)
			Fusion.OnUpdate.remove(func)
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
		Fusion.Configs.init.Slider.Value = cam_dist
		Fusion.SaveConfig("init", Fusion.Configs.init)
	}
	cam_dist_struct.lastValue = cam_dist
	GameUI.SetCameraDistance(cam_dist)
	Utils.SetConvar("r_farz", cam_dist * 2)
}

var StatsEnabled = true,
	MinimapActsEnabled = true
function WaitForGameStart(): void {
	$.Schedule(Fusion.MyTick, () => {
		if(Players.GetLocalPlayer() !== -1) {
			Fusion.SteamID = Game.GetLocalPlayerInfo().player_steamid
			InstallMainHUD()
			SetCameraPitch(60)
			Game.ServerCmd('bind Home __TogglePanel')
			Game.AddCommand('__MapHack',()=>'dota_use_particle_fow 0;fog_enable 0;r_farz 20000;dota_camera_distance 1134;bind Home __TogglePanel;fow_client_nofiltering 1;dota_new_player false',"",0)
			Game.AddCommand("_MouseUp", () => ChangeCamDist(cam_dist_struct.lastValue - (GameUI.IsControlDown() ? 25 : 0)), "", 0)
			Game.AddCommand("_MouseDown", () => ChangeCamDist(cam_dist_struct.lastValue + (GameUI.IsControlDown() ? 25 : 0)), "", 0)
			Game.AddCommand("__ReloadFusion", Fusion.ReloadFusion, "", 0)
			Game.AddCommand("__TogglePanel", () => Fusion.Panels.MainPanel.visible = !Fusion.Panels.MainPanel.visible, "",0)
			Game.AddCommand("__eval", (name, code) => $.Msg("__eval", eval(code)), "", 0)
			Game.AddCommand("__ToggleMinimapActs", () => Fusion.Panels.Main.HUDElements.FindChildTraverse("GlyphScanContainer").visible = MinimapActsEnabled = !MinimapActsEnabled, "",0)
			Game.AddCommand("__ToggleStats", () => Fusion.Panels.Main.HUDElements.FindChildTraverse("quickstats").visible = StatsEnabled = !StatsEnabled, "",0)
			Fusion.ReloadFusion()

		} else
			WaitForGameStart()
	})
}

WaitForGameStart()
OnTick()
OnUpdate()
