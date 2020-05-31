var ShadowGraveRanges = [0, 550, 700, 850, 1000]
var ShadowGraveMinHPPercent = 20

function DazzleWTFGraveOnInterval(): void {
	var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	if(Entities.IsStunned(MyEnt))
		return
	var HEnts = EntityManager.PlayersHeroEnts()
	
	ShadowGrave(MyEnt, HEnts)
}

function ShadowGrave(MyEnt, HEnts) {
	var Abil = Entities.GetAbilityByName(MyEnt, 'dazzle_shallow_grave')
	var AbilLvl = parseInt(Abilities.GetLevel(Abil))
	if(AbilLvl === 0)
		return
	var AbilRange = ShadowGraveRanges[AbilLvl]
	
	
	for (var i in HEnts) {
		var ent = parseInt(HEnts[i])
		if(Entities.IsEnemy(ent) || !Entities.IsAlive(ent))
			continue
		if(Entities.GetRangeToUnit(MyEnt, ent) > AbilRange)
			continue
		var buffsNames = Utils.GetBuffsNames(ent)
		if(Utils.IntersecArrays(buffsNames, ["modifier_dazzle_shallow_grave"]))
			continue
		if(!Entities.IsEnemy(ent) && Entities.GetHealthPercent(ent) > ShadowGraveMinHPPercent)
			continue
		
		Orders.CastTarget(MyEnt, Abil, ent, false)
	}
}


module = {
	name: "Dazzle Auto Grave",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Corona.OnTick.push(DazzleWTFGraveOnInterval)
			Utils.ScriptLogMsg("Dazzle Auto Grave", "#00ff00")
		} else {
			Corona.OnTick.remove(DazzleWTFGraveOnInterval)
			Utils.ScriptLogMsg("Dazzle Auto Grave", "#ff0000")
		}
	},
	onDestroy: () => {
		abils.forEach(abilData => delete abilData.abil)
		Corona.OnTick.remove(DazzleWTFGraveOnInterval)
	}
}