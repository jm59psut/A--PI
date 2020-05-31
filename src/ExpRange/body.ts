
var ExpRange = 1500,
	DaggerRange = 1200

module = {
	name: "Experience Range",
	onToggle: checkbox => {
		if (checkbox.checked) {
			var MyEnt = EntityManager.MyEnt
			Corona.Particles.ExpRange = Utils.CreateCustomRange(MyEnt, ExpRange)
			Corona.Particles.DaggerRange = Utils.CreateCustomRange(MyEnt, DaggerRange)

			Utils.ScriptLogMsg("Script enabled: ExpRange", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: ExpRange", "#ff0000")
		}
	},
	onDestroy: (): void => {
		if(Corona.Particles.ExpRange) {
			ParticleManager.DestroyParticleEffect(Corona.Particles.ExpRange, true)
			delete Corona.Particles.ExpRange
		}
	
		if(Corona.Particles.DaggerRange) {
			ParticleManager.DestroyParticleEffect(Corona.Particles.DaggerRange, true)
			delete Corona.Particles.DaggerRange
		}
	}
}