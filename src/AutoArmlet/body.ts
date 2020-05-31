var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID());
var AutoArmletE = [];
var AutoArmletTickRate = 0.2;
var AutoArmletBlock = false;
var EnemiesDetect=true;
var HPointLimit =5;
var AreaLimit = 1000;
function AutoArmletTick() {
	if(!Entities.IsAlive(MyEnt) || Entities.IsSilenced(MyEnt) || Entities.IsStunned(MyEnt) || AutoArmletBlock) return;
	if(EnemiesDetect) {
		for(var i in AutoArmletE) {
			var e = AutoArmletE[i];
			if(HPointLimit > Entities.GetHealthPercent(MyEnt)) continue;
			if(Entities.GetRangeToUnit(e,MyEnt) > AreaLimit) continue;
			if(!Entities.IsAlive(e)) continue;
			
			var Abil = Entities.GetAbilityByName(MyEnt, 'item_armlet');
			Orders.ToggleAbil(MyEnt, Abil);
			AutoArmletBlock = true;
			$.Schedule(5, function() {AutoArmletBlock = false;});
		}
	}else{
		if(HPointLimit < Entities.GetHealthPercent(MyEnt)) return;
		var Abil = Entities.GetAbilityByName(MyEnt, 'item_armlet');
		Orders.ToggleAbil(MyEnt, Abil);
		AutoArmletBlock = true;
		$.Schedule(5, function() {AutoArmletBlock = false;});
    }
    

}

function PlayerAutoArmlet(){
    var AutoArmletPlayers = EntityManager.PlayersHeroEnts3();
    AutoArmletE = [];
    
    for(var AutoArmletElement in AutoArmletPlayers) {
        if(Entities.IsEnemy(AutoArmletPlayers[AutoArmletElement])) {
            AutoArmletE.push(AutoArmletPlayers[AutoArmletElement]);
        }
}


}

module = {
	name: "Auto Armlet",
	onToggle: checkbox => {
		if (checkbox.checked) {
            Corona.OnTick.push(PlayerAutoArmlet)
			Corona.OnTick.push(AutoArmletTick)
			Utils.ScriptLogMsg("AutoArmlet", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("AutoArmlet", "#ff0000")
		}
	},
	onDestroy: () => Corona.OnTick.remove(AutoArmletTick)
}