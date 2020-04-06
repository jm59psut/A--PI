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

var name_cache = []
var Utils = {
	IsFlagSet(base: number, flag: number) {
		return (base & flag) > 0
	},

	Debug() {
		var w = Game.GetScreenWidth(),
			h = Game.GetScreenHeight(),
			getPosAtPercents = (wp: number, hp: number): [number, number, number] => GameUI.GetScreenWorldPosition([w * wp / 100, h * hp / 100]),
			positions: number[][][] = [
				[ // bot
					getPosAtPercents(0, 100), // left
					getPosAtPercents(50, 100), // mid
					getPosAtPercents(100, 100), // right
				],
				[ // mid
					getPosAtPercents(0, 50), // left
					getPosAtPercents(50, 50), // mid
					getPosAtPercents(100, 50), // right
				],
				[ // top
					getPosAtPercents(0, 0), // left
					getPosAtPercents(50, 0), // mid
					getPosAtPercents(100, 0), // right
				]
			],
			offset = positions[0][0]
		
		var test = [
			Utils.DrawLineInGameWorld(positions[0][0], positions[0][2], 0xf44242), // bot, red
			Utils.DrawLineInGameWorld(positions[2][0], positions[2][2], 0xf1f441), // top, yellow
			Utils.DrawLineInGameWorld(positions[0][0], positions[2][0], 0x70f441), // bot left => top left, lime
			Utils.DrawLineInGameWorld(positions[0][2], positions[2][2], 0x41f4f4), // bot right => top right, cyan
			Utils.DrawLineInGameWorld(positions[0][0], positions[2][2], 0x415bf4), // bot left => top right, blue
			Utils.DrawLineInGameWorld(positions[2][0], positions[0][2], 0xe841f4)  // top left => bot right, purple
		]
		test.forEach(par => $.Schedule(15, () => ParticleManager.DestroyParticleEffect(par, true)))
		positions = positions.map(positions2 => positions2.map(pos => [pos[0] - offset[0], pos[1] - offset[1], pos[2] - offset[2]]))
		$.Msg(`Screen resolution: ${w}x${h}`)
		$.Msg(`Positions: \n${JSON.stringify(positions, null, "\t")}`)
	},

	/**
	 * Creates custom range on specified entity
	 * @param {number} range range
	 * @param {Entity} ent entity on which range will be active
	 * @param {[number, number, number] | number} color RGB color of displayed range
	 * @returns {number} particle ID
	 */
	CreateCustomRange(ent: Entity, range: number, color: [number, number, number] | number = 0x00FF00): number {
		const par = ParticleManager.CreateParticle("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
		ParticleManager.SetParticleControlEnt(par, 2, ent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "", [0, 0, 0], true)
		ParticleManager.SetParticleControl(par, 3, [range, 0, 0])
		ParticleManager.SetParticleControl(par, 4, typeof color === "number" ? [color >> 16, (color >> 8) & 0xFF, color & 0xFF] : color)
		return par
	},

	/**
	 * Draws line in game world
	 * @param {Vector | [number, number, number] | number[]} a Starting vector
	 * @param {Vector | [number, number, number] | number[]} b Ending vector
	 * @param {[number, number, number] | number} color RGB color of displayed line
	 * @returns {number} particle ID
	 */
	DrawLineInWorld(a: Vector | [number, number, number] | number[], b: Vector | [number, number, number] | number[], color: [number, number, number] | number = 0xFFFFFF): number { // TODO: replace with lua
		var temp = ParticleManager.CreateParticle("particles/ui_mouseactions/bounding_area_view_a.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN)
		ParticleManager.SetParticleControl(temp, 0, a)
		ParticleManager.SetParticleControl(temp, 1, b)
		ParticleManager.SetParticleControl(temp, 15, typeof color === "number" ? [(color >> 16) & 0xFF, (color >> 8) & 0xFF, color & 0xFF] : color)
		return temp
	},

	/**
	 * I don't think that $.Localize are optimized properly, so.. I've added this method.
	 */
	Localize(name: string) {
		var cached_result = name_cache[name]
		if(cached_result !== undefined) return cached_result
		return name_cache[name] = $.Localize(name)
	},

	/**
	 * DEPRECATED: usually you don't need this.
	 * Selects entity group passed in array
	 * @param {Entity[] | number[]} group group that we need to select
	 * @param {boolean} first do we need to remove current selection?
	 */
	SelectGroup(group/*: Entity[] | number[]*/, first: boolean = false): void {
		group.forEach(ent => {
			GameUI.SelectUnit(ent instanceof Entity ? ent.id : ent, !first)
			first = false
		})
	},

	/**
	 * Transforms angle to vector
	 * @param {number} angle angle to transform
	 * @returns {Vector} transformed angle
	 */
	Angle2Vector(angle: number): Vector { return new Vector(Math.cos(angle), Math.sin(angle)) },

	/**
	 * @param {Entity} ent
	 * @returns {Item} chop item for passed entity (quelling blade / battlefury / tango)
	 */
	GetChopItem(ent: Entity): Item { return ent.ItemByName(/item_quelling_blade|item_bfury|item_tango/) },

	/**
	 * @param {Entity} ent
	 * @returns {Item} hide item for passed entity (shadow amulet / glimmer cape / shadow blade / silver edge)
	 */
	GetHideItem(ent: Entity): Item { return ent.ItemByName(/item_shadow_amulet|item_glimmer_cape|item_invis_sword|item_silver_edge/) },

	/**
	 * DO NOT USE
	 * For ex. this can be used to predict tinker's laser
	 * @param {Entity[]} ents entities on which script will iterate
	 * @param {number} maxRadius maximum radius between two entities
	 * @returns {Entity[][]} array of entity pairs
	 */
	BuildNearMap(ents: Entity[], maxRadius: number): Entity[][] {
		var ignore = []
		return ents.map(ent => {
			ignore.push(ent)
			return [ent, ent.FindNearestEntity(maxRadius, ents, ignore)]
		})
	},

	/**
	 * Works only at screen entities
	 * @param {Vector} vec vector that we need to search at
	 * @returns {Entity[]} array of entities located at this vector
	 */
	GetEntitiesOnPosition(vec: Vector): Entity[] {
		return GameUI.FindScreenEntities (
			[
				Game.WorldToScreenX(vec.x, vec.z, vec.y),
				Game.WorldToScreenY(vec.x, vec.z, vec.y)
			]
		).map(entData => EntityManager.EntityByID(entData.entityIndex))
	},

	/**
	 * Useful for debug
	 * @returns {number[]} array of entity IDs
	 */
	FindScreenEntitiesAtCursor(): number[] {
		return GameUI.FindScreenEntities(GameUI.GetCursorPosition()).map(entData => entData.entityIndex).filter((item, pos, ar) => ar.indexOf(item) === pos)
	},

	/**
	 * Does this arrays intersect?
	 * @param {Array} a 1st array
	 * @param {Array} b 2nd array
	 */
	IntersectArrays(a: Array<any>, b: Array<any>): boolean { return a.some(val1 => b.some(val2 => val1 === val2)) },

	/**
	 * Makes deep equals
	 * @param {Object} x 1st object
	 * @param {Object} y 2nd object
	 */
	DeepEquals(x: Object, y: Object): boolean {
		if((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
			if(Object.keys(x).length != Object.keys(y).length)
				return false

			for(let prop in x) {
				if(y.hasOwnProperty(prop)) {
					if(!this.DeepEquals(x[prop], y[prop])) return false
				} else return false
			}

			return true
		} else
			return x === y
	},

	/**
	 * https://github.com/ccapo/elegant-pair
	 * @returns {number} elegant pairing function's result
	 */
	PairNumbers(a: number, b: number): number { return (a >= b) ? (a ** 2 + a + b) : (b ** 2 + a) },

	/**
	 * @returns {Vector} cursor world location
	 */
	get CursorWorldVec(): Vector {
		var curPos = GameUI.GetCursorPosition()
		return new Vector(Game.ScreenXYToWorld(curPos[0], curPos[1]))
	},

	/**
	 * @param {Entity} MyEnt to remove from array
	 * @param {number} range range from Utils#CursorWorldVec to search
	 * @param {boolean} onlyEnemies return only enemies?
	 * @returns {Entity} nearest [enemy] to cursor
	 */
	NearestToMouse(MyEnt: Entity, range: number, onlyEnemies: boolean): Entity {
		var curVec = Utils.CursorWorldVec,
			heroEnts = EntityManager.PlayersHeroEnts(),
			ents = Array.prototype.orderBy.call(curVec.GetEntitiesInRange(range, onlyEnemies).filter(ent => ent !== MyEnt && heroEnts.indexOf(ent) !== -1), ent => curVec.PointDistance(ent.AbsOrigin))

		return ents.length > 0 ? ents[0] : undefined
	},
	GetMainHUD(){
		var globalContext=$.GetContextPanel()
		while(true){
			if(globalContext.paneltype == "DOTAHud"){
				break
			}else{
				globalContext = globalContext.GetParent()
			}
		}
		return globalContext
	}, 
	PlayersEnemyHeroEnts(){
		var PlayersEnt = []
		var PlayersIDs = Game.GetAllPlayerIDs()
		for(var i in PlayersIDs) {
			var EntID = Players.GetPlayerHeroEntityIndex(PlayersIDs[i]);
			if(Entities.IsEnemy(EntID))
				PlayersEnt.push( EntID )
		}
		return PlayersEnt
	},
	GetBuffsNames(ent){
		var buffs = []
		if(!Entities.IsValidEntity(ent))
			return buffs
		for(var i=0;i<Entities.GetNumBuffs(ent);i++)
			buffs.push(Buffs.GetName(ent,Entities.GetBuff(ent,i)))
		return buffs
	},
    IntersecArrays(a,b){
		for(var i in a)
			for(var m in b)
				if(a[i]==b[m])
					return true
		return false
	},
	GetBuffs(ent){
		var buffs = []
		for(var i=0;i<Entities.GetNumBuffs(ent);i++)
			buffs.push(ent,Entities.GetBuff(ent,i))
		return buffs
	},
	PointDistance(a,b){
		return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2))
	},

	/**
	 * Allows panel move by Ctrl + left click
	 * @param {Panel} a panel
	 * @param {Function} callback callback with panel
	 */
	MovePanel(a: Panel, callback: Function) {
		var onactivateF = () => {
			var m = true
			if (!GameUI.IsControlDown())
				return
			var color = a.style.backgroundColor
			a.style.backgroundColor = "#FFFF00FF"
			var uiw = Fusion.Panels.Main.actuallayoutwidth,
				uih = Fusion.Panels.Main.actuallayoutheight
			var linkpanel = () => {
				a.style.position = `${(GameUI.GetCursorPosition()[0] / uiw * 100)}% ${(GameUI.GetCursorPosition()[1] / uih * 100)}% 0`
				if (GameUI.IsMouseDown(0)) {
					m = false
					a.SetPanelEvent("onactivate", onactivateF)
					a.style.backgroundColor = color
					callback(a)
				}
			}
			function L() {
				$.Schedule (
					0,
					() => {
						L()
						if(m)
							linkpanel()

					}
				)
			}
			L()
		}
		a.SetPanelEvent("onactivate", onactivateF)
	},

	/**
	 * Applies style String to the panel
	 * @param {Panel} panel panel that needs style
	 * @param {string} styleStr style String
	 */
	InstallStyle(panel: Panel, styleStr: string): void {
		var fix = /^(.*)(?:\s+)?;(?:\s+)?$/.exec(styleStr)
		if(fix !== null)
			styleStr = fix[1]
		if(!panel.style) {
			panel.style = []
			$.Msg("Utils.InstallStyle", `Alert: panel ${panel.paneltype} ${panel.id} don't have style property!`)
		}
		styleStr.split(/;(?:\s+)?/).forEach(styleStr2 => {
			try {
				const style = styleStr2.split(/:(?:\s+)?/)
				panel.style[style[0]] = style[1]
			} catch(e) { $.Msg("Utils.InstallStyle", e) }
		})
	},

	/**
	 * Animates panel with passed arguments
	 * @param {Panel} panel panel that needs animation
	 * @param {string} styleStr style String
	 * @param {number} duration duration of animation
	 * @param {string} ease
	 * @param {number} delay
	 */
	AnimatePanel(panel: Panel, styleStr: string, duration: number, ease: string, delay: number): void {
		var fix = /^(.*)(?:\s+)?;(?:\s+)?$/.exec(styleStr)
		if(fix !== null)
			styleStr = fix[1]
		duration = duration || 0.3
		delay = delay || 0
		ease = ease || "linear"

		var transitionString = `transition: ${duration * 1000}ms ${ease} ${delay * 1000}ms`,
			finalTransition = "",
			isFirst = true
		styleStr.split(/;(?:\s+)?/).forEach(styleStr2 => {
			try {
				const style = styleStr2.split(/:(?:\s+)?/)
				finalTransition += `transition: ${!isFirst ? ", " : ""}${style[0]}=${style[1]}; ${transitionString}`
				if(isFirst)
					isFirst = false
			} catch(e) { $.Msg("Utils.AnimatePanel", `Error ${e} happened at ${styleStr2}`) }
		})

		Utils.InstallStyle(panel, `transition: ${finalTransition}`)
	},

	/**
	 * Displays message in GUI logs
	 * @param {string} msg message to be displayed
	 * @param {string} color color that will apply to message
	 */
	ScriptLogMsg(msg: string, color?: string): void {
		var ScriptLog = Fusion.Panels.MainPanel.ScriptLog || (Fusion.Panels.MainPanel.ScriptLog = Fusion.Panels.MainPanel.FindChildTraverse("ScriptLog")),
			ScriptLogMessage = $.CreatePanel("Label", ScriptLog, "ScriptLogMessage")
		ScriptLogMessage.BLoadLayoutFromString("\
	<root>\
		<Label/>\
	</root>", false, false)
		ScriptLogMessage.style.fontSize = "15px"
		var text = `	•••	${msg}`
		ScriptLogMessage.text = text
		if (color) {
			ScriptLogMessage.style.color = color
			ScriptLogMessage.style.textShadow = `0px 0px 4px 1.2 ${color}33`
		}
		Utils.AnimatePanel(ScriptLogMessage, "opacity: 0", 2, "linear", 4)
		ScriptLogMessage.DeleteAsync(7)
	},
	GetCFG(script){
		for(var i in Fusion)
			if(Fusion[i].script_name == script) {
				Config = JSON.parse(Fusion[i].script_config)
				return(Config)
			}
	},
	

	/**
	 * Sends code to D2Lua
	 * @param {string} code unescaped code to execute
	 */
	EvalLuaCode(code: string): void { GameEvents.SendEventClientSide("tree_cut", { code: code }) },

	/**
	 * Sets specified ConVar... try it in action. (bypasses sv_cheats)
	 * @param {string} key ConVar name
	 * @param {*} val ConVar value
	 */
	SetConvar(key: string, val: any): void { Utils.EvalLuaCode(`Convars:SetStr("${key}", "${val}")`) },

	/**
	 * Allows unrestricted command execution (bypasses sv_cheats)
	 * @param {string} command escaped command to execute
	 */
	UnrestrictedCmd(command: string): void { Utils.EvalLuaCode(`SendToConsole("${command}")`) },
	
  MovePanelClick (a, callback){
		var e = function(){
			var m = true
			var color = a.style.backgroundColor
			a.style.backgroundColor = '#FFFF00FF'
			var uiw =Utils.GetMainHUD().actuallayoutwidth
			var uih = Utils.GetMainHUD().actuallayoutheight
			var linkpanel = function(){
				a.style.position = (GameUI.GetCursorPosition()[0]/uiw*100) + '% ' + (GameUI.GetCursorPosition()[1]/uih*100) + '% ' + '0'
				if (GameUI.IsMouseDown( 0 )){
					m = false
					a.SetPanelEvent('onactivate', e)
					a.style.backgroundColor = color
					callback(a)
				}
			}
			function L(){ $.Schedule( 0,function(){L();if(m){linkpanel()}})}
			L()
		}
		a.SetPanelEvent( 'onactivate', e)
	},
	
	

	//Slider
 AddSlider(type,panel,width,name,min,max,def,enabled,callback1,callback2,callback3,obj){
	 
	var HO =-1
	var ScreenHO = [
	   [640, 480, 2.3],
	   [720, 480, 2.2],
	   [720, 576, 1.9],
	   [800, 600, 1.8],
	   [1024, 768, 1.4],
	   [1152, 864, 1.25],
	   [1280, 720, 1.5],
	   [1280, 768, 1.4],
	   [1280, 800, 1.36],
	   [1280, 960, 1.1],
	   [1280, 1024, 1.035],
	   [1360, 768, 1.4],
	   [1366, 768, 1.4],
	   [1440, 900, 1.2],
	   [1440, 960, 1.13],
	   [1600, 900, 1.2],
	   [1600, 1024, 1.05],
	   [1680, 1050, 1.03],
	   [1920, 1080, 1]
   ]

		if(def==null || def=='undefined')
			def=min
		if(callback1==null || callback1=='undefined')
			callback1 = function(){}
		if(callback2==null || callback1=='undefined')
			callback2 = function(){}
		if(callback3==null || callback1=='undefined')
			callback3 = function(){}
		var val = def
		var s = $.CreatePanel( "Panel", panel, "" )
		s.BLoadLayoutFromString( '\
			<root>\
				\
				<Panel class="Slider" style="width:'+width+'px;">\
					<Panel class="SliderTrack"></Panel>\
					<Button class="SliderM"></Button>\
					<Label class="min"/>\
					<Label class="max"/>\
					<Label class="slidername" text="'+name+' '+def.toString()+'"/>\
				</Panel>\
			</root>'
		, false, false )
		s.Children()[2].text = min
		s.Children()[3].text = max
		var o = (val-min)/(max-min)
		var ow = (width-120)*o+50
		s.Children()[1].style.position = ( ow )+'px 0 0'
		function SliderActivate(){
			callback3()
			var p = GameUI.GetCursorPosition()[0]
			var _p = parseInt(s.Children()[1].style.position.split(' ')[0])
			function f(){ $.Schedule( 0,function(){
				if(!GameUI.IsMouseDown(0)){
					obj.val = val;
					callback2(val)
					return
				}
				f()
			
				var offset = _p + (GameUI.GetCursorPosition()[0] - p)*HO - 10
				if(offset<40){
					s.Children()[1].style.position = '50px 0 0'
					val = min
					s.Children()[4].text = name+' '+val
					callback1(val)
					return
				}
				if(offset>width-80){
					val = max
					s.Children()[4].text = name+' '+val
					callback1(val)
					return
				}
				s.Children()[1].style.position = (offset+10)+'px 0 0'
				val = Math.round((((0-50)/(width-120)*(max-min)+min)*10)/10)
				s.Children()[4].text = name+' '+val
				callback1(val)
			})}
			f()
		}
		var h = false
		s.Children()[1].SetPanelEvent('onmouseover',function(){
			h = true
			function z(){ $.Schedule( 0,function(){
				if(GameUI.IsMouseDown(0)&&h){
					SliderActivate()
				}else{
					if(h)
						z()
				}
			})}
			z()
		})
		s.SetPanelEvent('onmouseout',function(){
			h = false
		})
		return s
	}
}


module.exports = { Utils }