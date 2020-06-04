
var BlinkRadius = 1200

// Reworked this hack cuz idk the other solution didnt want to destory the particle

module = {
	name: "Blink Range [STABLE]",
	onToggle: checkbox => {
		if (checkbox.checked) {
			var MyEnt = EntityManager.MyEnt
			Corona.Particles.BlinkRange = Utils.CreateCustomRange(MyEnt, BlinkRadius)
	

			Utils.ScriptLogMsg("Script enabled: Blink Range", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: Blink Range", "#ff0000")
		}
	},
	onDestroy: (): void => {
		if(Corona.Particles.BlinkRange) {
			ParticleManager.DestroyParticleEffect(Corona.Particles.BlinkRange, true)
			delete Corona.Particles.BlinkRange
		}
	
	}
}
