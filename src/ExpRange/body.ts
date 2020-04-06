
var ExpRange = 1500,
	DaggerRange = 1200

module = {
	name: "Experience Range",
	onToggle: checkbox => {
		if (checkbox.checked) {
			var MyEnt = EntityManager.MyEnt
			Fusion.Particles.ExpRange = Utils.CreateCustomRange(MyEnt, ExpRange)
			Fusion.Particles.DaggerRange = Utils.CreateCustomRange(MyEnt, DaggerRange)

			Utils.ScriptLogMsg("Script enabled: ExpRange", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: ExpRange", "#ff0000")
		}
	},
	onDestroy: (): void => {
		if(Fusion.Particles.ExpRange) {
			ParticleManager.DestroyParticleEffect(Fusion.Particles.ExpRange, true)
			delete Fusion.Particles.ExpRange
		}
	
		if(Fusion.Particles.DaggerRange) {
			ParticleManager.DestroyParticleEffect(Fusion.Particles.DaggerRange, true)
			delete Fusion.Particles.DaggerRange
		}
	}
}