
 function CreateCustomRangeRadiusF(){
     var a=1200
            var MyEnt = Players.GetPlayerHeroEntityIndex( Game.GetLocalPlayerID() )
            Fusion.Particles.CustomRangeRadius = ParticleManager.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW , MyEnt)
            Particles.SetParticleControl(Fusion.Particles.CustomRangeRadius, 1, [a,0,0])
    }
    function Destroy(): void {
        ParticleManager.DestroyParticleEffect(Fusion.Particles.CustomRangeRadius.get(a), true)
		Fusion.Particles.CustomRangeRadius.delete(a)
    }  
    module = {
        name: "Blink Range",
        onToggle: checkbox => {
            if (checkbox.checked) {
               CreateCustomRangeRadiusF()
                Utils.ScriptLogMsg("Script enabled: Blink Range", "#00ff00")
            } else {
                Destroy()
                module.onDestroy()
    
                Utils.ScriptLogMsg("Script disabled: Blink Range", "#ff0000")
            }
        },
        onDestroy: () => Fusion.OnTick.remove(Destroy)
    }
    
    