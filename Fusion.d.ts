declare var Fusion: Fusion;
declare var module: FusionModule;
declare var ComboOptions: ComboOptions;
declare var _this: any;

interface Fusion {
	Configs: any
	Commands: any
	Panels: any
	Particles: any
	Subscribes: any
	Scripts: Map<String, FusionModule>
	MyTick: number
	debug: boolean
	debugLoad: boolean
	debugAnimations: boolean
	FusionServer: string
	SteamID: string
	OnTick: ((/*self: */Function) => void)[]
	OnUpdate: ((/*self: */Function) => void)[]

	ForceStaffUnits: number

	ServerRequest(name?: string, path?: string, data?: any): Promise<string | Array<any> | any>
	SteamAPIRequest(type: string, IName: string, methodName: string, parameters: any, methodVersion: string): Promise<string | Array<any> | any>
	
	GetScript(scriptName: string): Promise<string>
	GetXML(file: string): Promise<string>
	SaveConfig(scriptName: string, config: any): Promise<string>
	GetConfig(scriptName: string): Promise<string | Array<any> | any>

	ReloadFusion(): void
	LoadFusion(): Promise<void>
	AddScriptToList(script: FusionModule): void
	LoadScriptFromString(scriptCode: string): any
}

interface Array<T> {
	remove(obj: T): boolean
	orderBy(sortF: (arg: T) => number): Array<T>
}

interface $ {
	Msg_old(...args: any[]): void
	/**
	 * Log a message
	 */
	Msg(tag: string, ...msg: any[]): void

	Schedule_old(delay: number, callback: (callbackID: number) => void): number
	/**
	 * Schedule a function to be called later
	 */
	Schedule(delay: number, callback: (callbackID: number) => void): number
}

interface CScriptBindingPR_Game {
	allCreeps: Entity[]
}

interface FusionModule {
	name?: string
	isVisible?: boolean

	onInit?: () => void
	onPreload?: () => void
	onToggle?: (checkbox: Panel) => void
	onDestroy?: () => void

	exports?: any
}


interface ComboOptions {
	combo_delay?: number
	dynamicDelay?: (abil: Ability, caster: Entity, ent: Entity) => number
	castCondition?: (abil: Ability, caster: Entity, ent: Entity) => boolean
	custom_cast?: (caster: Entity, ent: Entity) => /*delay: */number
}
