var interval = 0.1;
var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID()); 
var FEnts = []; 
var EEnts = [];
var HighPriorityPlayers = [];
var block = false;

function DazzleFunc() {
	if(!Entities.IsAlive(MyEnt) || Entities.IsSilenced(MyEnt) || Entities.IsStunned(MyEnt) || block) 
	{ return; }
	
	for(var i in FEnts) {
		var e = FEnts[i];
		
		if(Entities.GetHealthPercent(e) > 30 || Entities.IsMagicImmune(e) || !Entities.IsAlive(e)) { continue; }
		
		for(var j in EEnts) {
			if(Entities.GetRangeToUnit(e,EEnts[j]) > 1300 || !Entities.IsAlive(EEnts[j])) { continue; }
			
			if(Entities.GetMana(MyEnt) >= Abilities.GetManaCost(Entities.GetAbility(MyEnt,1))
			&& Abilities.GetCooldownTimeRemaining(Entities.GetAbility(MyEnt,1)) == 0 
		        && Entities.GetRangeToUnit(MyEnt,e) <= Abilities.GetCastRange(Entities.GetAbility(MyEnt,1))) {
				Utils.ScriptLogMsg('Saving '+Entities.GetUnitName(e), '#00ff00');
				Orders.CastTarget(MyEnt,Entities.GetAbility(MyEnt, 1),e,false);
				block = true;
				$.Schedule(8,function () {block = false;});
			}
			
			break;
		}
		
		if(Entities.GetMana(MyEnt) >= Abilities.GetManaCost(Entities.GetAbility(MyEnt,2))
		&& Abilities.GetCooldownTimeRemaining(Entities.GetAbility(MyEnt,2)) == 0
		&& Entities.GetRangeToUnit(MyEnt,e) <= Abilities.GetCastRange(Entities.GetAbility(MyEnt,2))) {
			Orders.CastTarget(MyEnt,Entities.GetAbility(MyEnt, 2),e,false);
			block = true;
			$.Schedule(8,function () {block = false;});
		}
	}
}
	
var RG_AutoGravecheckbox = function(){
	
	MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID());
	if(Entities.GetUnitName(MyEnt) != "npc_dota_hero_dazzle") {
		return;
	}
	
	FEnts = [];
	var HEnts = EntityManager.PlayersHeroEnts3() 
	var players = Game.GetAllPlayerIDs(); 
 
	for (var a in players) {
		var eID = Game.GetPlayerInfo(players[a]).player_steamid; 
		var ent = Players.GetPlayerHeroEntityIndex(players[a]);

		if(inArray([eID],HighPriorityPlayers) && !Entities.IsEnemy(ent) && MyEnt != ent) {
			FEnts.push(ent);
		}
	}
	
	for (var i in HEnts) {
		if(!Entities.IsEnemy(HEnts[i]) && !inArray([HEnts[i]],FEnts) && Entities.GetUnitName(HEnts[i]) != "npc_dota_hero_dazzle") {
			FEnts.push(HEnts[i]);
		}
		
		if(Entities.IsEnemy(HEnts[i])) {
			EEnts.push(HEnts[i]);
		}
	}
	
	FEnts.push(MyEnt); 
	
	function maincheck(){ $.Schedule( interval,function(){
		DazzleFunc()

			maincheck()
	})}
	
	maincheck()
	
}

function inArray(arr1,arr2) {
	var found = false;
	arr2.forEach( function (a) {
		arr1.forEach( function (b) {
			if(a == b) {
				found = true;
			}
		});
	});
	return found;
}
module = {
	name: "Dazzle Auto Grave",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.OnTick.push(RG_AutoGravecheckbox)
			Utils.ScriptLogMsg("Script enabled: Dazzle Auto Grave", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: Dazzle Auto Grave", "#ff0000")
		}
	},
	onDestroy: () => Fusion.OnTick.remove(RG_AutoGravecheckbox)
}

