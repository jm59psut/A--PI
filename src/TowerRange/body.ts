Corona.Particles.TowerRange = [];
var LastTowersLength = 0;
var IsNowNightTime = false;
function IsNight() {
	return Utils.GetMainHUD().Children()[0].Children()[1].Children()[8].visible;
}
var TowerLoad = function(){
	TowerRangeCleanUp();
	var Buildings = Entities.GetAllEntitiesByClassname("npc_dota_tower") 
	for(var i in Buildings) {
		var e = Buildings[i];		
				var CurrentTowerParticle = ParticleManager.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW , e);
				if(IsNowNightTime)
					Particles.SetParticleControl(CurrentTowerParticle, 1, [Entities.GetNightTimeVisionRange(e),0,0])
				else
					Particles.SetParticleControl(CurrentTowerParticle, 1, [Entities.GetAttackRange(e) + Entities.GetHullRadius(e) + 20,0,0])
			Corona.Particles.TowerRange.push(CurrentTowerParticle);
			
				var CurrentTowerParticle = ParticleManager.CreateParticle("particles/ui_mouseactions/range_display_b.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW , e);
				if(IsNowNightTime)
					Particles.SetParticleControl(CurrentTowerParticle, 1, [Entities.GetNightTimeVisionRange(e),0,0])
				else
					Particles.SetParticleControl(CurrentTowerParticle, 1, [Entities.GetAttackRange(e) + Entities.GetHullRadius(e) + 20,0,0])
				Corona.Particles.TowerRange.push(CurrentTowerParticle);
		
		}
	}
function TowerRangeCleanUp() {
	for(var temp in Corona.Particles.TowerRange) {
		if(typeof Corona.Particles.TowerRange[temp] == 'number') {
			Particles.DestroyParticleEffect(Corona.Particles.TowerRange[temp], true);
		}
	}
}
module = {
	name: "Tower Range [STABLE]",
	onToggle: checkbox => {
		if (checkbox.checked) {
			TowerLoad()		

			Utils.ScriptLogMsg("Script enabled: Tower Range", "#00ff00")
		} else {
			TowerRangeCleanUp();
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: Tower Range", "#ff0000")
		}
	},
	onDestroy: () => Corona.OnTick.remove(TowerRangeCleanUp)
}