/* 


function isVisible(){
var Me=EntityManager.MyEnt
if(Me.DayTimeVisionRange||Me.NightTimeVisionRange){
    var par = ParticleManager.CreateParticle("particles/items_fx/aura_shivas.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, Me)
    Fusion.Particles.AbilityRange.set(Me, par)
}

}
module = {
	name: "Visible by Enemy",
	onPreload: (): void => {
	Fusion.OnTick.push(isVisible) 
	}
} */