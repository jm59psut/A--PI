var interval = 0.1;
var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID()); 
var FEnts = []; 
var EEnts = [];
var HighPriorityPlayers = [];
var block = false;

function OracleFunc() {
	if(!Entities.IsAlive(MyEnt) || Entities.IsSilenced(MyEnt) || Entities.IsStunned(MyEnt) || block) 
	{ return; }
	
	for(var i in FEnts) {
		var e = FEnts[i];
		
		if(Entities.GetHealthPercent(e) > 35 || Entities.IsMagicImmune(e) || !Entities.IsAlive(e)) { continue; }
		
		for(var j in EEnts) {
			if(Entities.GetRangeToUnit(e,EEnts[j]) > 1000 || !Entities.IsAlive(EEnts[j])) { continue; }
			
			if(Entities.GetMana(MyEnt) >= Abilities.GetManaCost(Entities.GetAbilityByName(MyEnt,'oracle_false_promise'))
			&& Abilities.GetCooldownTimeRemaining(Entities.GetAbilityByName(MyEnt,'oracle_false_promise')) == 0 
		        && Entities.GetRangeToUnit(MyEnt,e) <= Abilities.GetCastRange(Entities.GetAbilityByName(MyEnt,'oracle_false_promise'))) {
				Utils.ScriptLogMsg('Saving '+Entities.GetUnitName(e), '#00ff00');
				Orders.CastTarget(MyEnt,Entities.GetAbilityByName(MyEnt,'oracle_false_promise'),e,false);
				block = true;
				$.Schedule(8,function () {block = false;});
			}
			
			break;
		}
		
		if(Entities.GetMana(MyEnt) >= Abilities.GetManaCost(Entities.GetAbilityByName(MyEnt,'oracle_false_promise'))
		&& Abilities.GetCooldownTimeRemaining(Entities.GetAbilityByName(MyEnt,'oracle_false_promise')) == 0
		&& Entities.GetRangeToUnit(MyEnt,e) <= Abilities.GetCastRange(Entities.GetAbilityByName(MyEnt,'oracle_false_promise'))) {
			Orders.CastTarget(MyEnt,Entities.GetAbilityByName(MyEnt, 'oracle_false_promise'),e,false);
			block = true;
			$.Schedule(8,function () {block = false;});
		}
	}
}
	
var RG_OracleSavecheckbox = function(){
	
	MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID());
	if(Entities.GetUnitName(MyEnt) != "npc_dota_hero_oracle") {
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
		if(!Entities.IsEnemy(HEnts[i]) && !inArray([HEnts[i]],FEnts) && Entities.GetUnitName(HEnts[i]) != "npc_dota_hero_oracle") {
			FEnts.push(HEnts[i]);
		}
		
		if(Entities.IsEnemy(HEnts[i])) {
			EEnts.push(HEnts[i]);
		}
	}
	
	FEnts.push(MyEnt); 
	
	function maincheck(){ $.Schedule( interval,function(){
		OracleFunc()

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
	name: "Oracle Auto-Save",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.OnTick.push(RG_OracleSavecheckbox)
			Utils.ScriptLogMsg("Script enabled: Oracle Auto-Save", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: Oracle Auto-Save", "#ff0000")
		}
	},
	onDestroy: () => Fusion.OnTick.remove(RG_OracleSavecheckbox)
}

