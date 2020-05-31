Corona.Particles.Snatcher = []
var TruePickupRadius = 150,
	PickupRadius = 450,
	RoshpitCenter = [-2388, 1761, 159],
	RoshpitRadius = 450,
	Interval = 0.1,
	enabled = false

function IsInRoshpit(vec) {
	return Utils.PointDistance(vec, RoshpitCenter) < RoshpitRadius
}

function DestroyParticles() {
	Corona.Particles.Snatcher.forEach(par => {
		Particles.DestroyParticleEffect(par, true)
		delete Corona.Particles.Snatcher[par]
	})
}

function CreateParticle() {
	var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID()),
		par;
	
	par = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, MyEnt)
	Particles.SetParticleControl(par, 1, [PickupRadius, 0, 0])
	Corona.Particles.Snatcher.push(par)

	par = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, MyEnt)
	Particles.SetParticleControl(par, 1, [TruePickupRadius, 0, 0])
	Corona.Particles.Snatcher.push(par)
}
function eq(ar1, ar2) {
	return !ar1.some((el, id) => ar2[id] !== el)
}

function SnatcherF() {
    var IsTree = ent => ent > 10000
   var IsRune = ent => !IsTree(ent) && !Entities.IsSelectable(ent) && !Entities.IsItemPhysical(ent) && eq(Entities.GetUp(ent), [0, 0, 1])
   
	var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	if(Game.IsGamePaused() || Entities.IsStunned(MyEnt) || !Entities.IsAlive(MyEnt)) {
		if(enabled)
			$.Schedule(Interval, SnatcherF)
		return
	}

    var nearbyRunes = Entities.GetAllEntities().filter(ent =>
        


			IsRune(ent)
			&& !Entities.IsBuilding(ent)
			&& Entities.IsEntityInRange(MyEnt, ent, PickupRadius) // position calculations are latest, as it's most time-consuming
		),
		items = Entities.GetAllEntitiesByClassname("").filter(ent =>
			!Entities.IsSelectable(ent)
			&& Entities.IsItemPhysical(ent)
			&& Entities.IsEntityInRange(MyEnt, ent, PickupRadius) // position calculations are latest, as it's most time-consuming
			&& IsInRoshpit(Entities.GetAbsOrigin(ent))
		)
	if(nearbyRunes.length === 0 && items.length === 0) {
		Interval = Corona.MyTick * 3
		if(enabled)
			$.Schedule(Interval, SnatcherF)
		return
	} else
		Interval = Corona.MyTick
	
	nearbyRunes.every(Rune => {
		Orders.PickupRune(MyEnt, Rune, false)
		return false
	})
	items.every(ent => {
		Orders.PickupItem(MyEnt, ent, false)
		return false
	})
	
	if(enabled)
		$.Schedule(Interval, SnatcherF)
}

module = {
	name: "Snatcher",
	onToggle: checkbox => {
		if (checkbox.checked) {
            CreateParticle()
            Corona.OnTick.push(SnatcherF)
			Utils.ScriptLogMsg("Script enabled: Snatcher", "#00ff00")
		} else {
            Corona.OnTick.remove(CreateParticle)
            Corona.OnTick.remove(SnatcherF)
			Utils.ScriptLogMsg("Script disabled: Snatcher", "#ff0000")
		}
	},
	onDestroy: () => {
        Corona.OnTick.remove(SnatcherF)
        Corona.OnTick.remove(CreateParticle)
    
	}
}