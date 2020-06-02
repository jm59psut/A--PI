module = {
	name: "LastHit [TEST]",
	onToggle: checkbox => {
		if (checkbox.checked) {
            Corona.OnTick.push(LastHitCreepFunc)
			Utils.ScriptLogMsg("Script enabled: LastHit [TEST]", "#00ff00")
		} else {
        	Corona.OnTick.remove(LastHitCreepFunc)
			Utils.ScriptLogMsg("Script disabled: LastHit [TEST]", "#ff0000")
		}
	},
	onDestroy: () => {
	
	}
}


destroy()
var interval = 0.1
//debugg
var debug = true
Corona.Particles.LastHitCreep = []
var z = []
var Rang3 = 0
var CurCreep = 0

//DmgMultimler
var buffsMulDmg = 
[
	["modifier_item_quelling_blade", 1.4],
	["modifier_item_bfury", 1.6],
	["modifier_item_iron_talon", 1.4],
	["modifier_bloodseeker_bloodrage", [1.25,1.3,1.35,1.4]],
]

//Creep List and Entities
function CreepsList (){
	var CreepsEnt =  Entities.GetAllEntitiesByClassname('npc_dota_creep_lane')
	CreepsEnt.concat(Entities.GetAllEntitiesByClassname('npc_dota_creep_neutral'))
	return CreepsEnt
}

function destroy()
{
	for(var i in Corona.Particles.LastHitCreep)
	try{ Particles.DestroyParticleEffect(Corona.Particles.LastHitCreep[i],Corona.Particles.LastHitCreep[i]) }catch(e){}
	Rang3=0
}

function LastHitCreepFunc(){
	var User = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var UserBuffs = Utils.GetBuffsNames(User)
	var UserDmg = 1
	
	if ((Rang3==0)||(Rang3!=Entities.GetAttackRange(User)))
	{
		destroy()
		Corona.Particles.LastHitCreep[0] = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW , User)
		Rang3 = Entities.GetAttackRange(User)
		Particles.SetParticleControl(Corona.Particles.LastHitCreep[0], 1,  [Rang3,0,0])
	}
	
	UserDmg = (Entities.GetDamageMax(User)-Entities.GetDamageMin(User))/2
	UserDmg += Entities.GetDamageMin(User)
	UserDmg += Entities.GetDamageBonus(User)
	
	var MulDmg = 1

	for (var ibuff in UserBuffs)
		for ( var mulbuff in buffsMulDmg)			
		if(UserBuffs[ibuff] == buffsMulDmg[mulbuff][0])
		{
            var i
			//if(debug) $.Msg( 'My buffs: ' + UserBuffs[ibuff])
			if(Array.isArray(buffsMulDmg[mulbuff][1]))
            MulDmg *= buffsMulDmg[mulbuff][1][Abilities.GetLevel(Entities.GetAbility(User,UserBuffs[i]))-1];
            else
                MulDmg *= buffsMulDmg[mulbuff][1];
		}	
	
	//if(debug) $.Msg( 'My dmg: ' + UserDmg + MulDmg + (MulDmg*UserDmg))
	
	var Creeps = Entities.GetAllEntitiesByClassname('npc_dota_creep_lane')
	Creeps.concat(Entities.GetAllEntitiesByClassname('npc_dota_creep_neutral'))

	
	if (Entities.IsAlive(User))
	for (var icreep in Creeps) 
	{
		var CreepArmor =(Entities.GetBonusPhysicalArmor(Creeps[icreep])+Entities.GetPhysicalArmorValue(Creeps[icreep]))
		if (CreepArmor>=0)
			CreepArmor = 1+((0.06 * CreepArmor) / (1 + 0.06 * CreepArmor))
		else
			CreepArmor = 0.94
		
		if ((Entities.IsAlive(Creeps[icreep]))&&(Entities.IsEntityInRange(Creeps[icreep],User,800))&&
				((((UserDmg*MulDmg)>=(Entities.GetHealth(Creeps[icreep])*CreepArmor))&&(Entities.IsEnemy(Creeps[icreep])))||(UserDmg>=(Entities.GetHealth(Creeps[icreep])*CreepArmor))))
		{
			if ((Entities.IsEnemy(Creeps[icreep]))&&((Entities.IsEntityInRange(Creeps[icreep],User,Rang3))||(Entities.IsEntityInRange(Creeps[icreep],User,250))))
			{
				Orders.AttackTarget(User,Creeps[icreep],0)	
				CurCreep = Creeps[icreep]
				break
			}
			else
				CreateFollowParticle(2,'particles/units/heroes/hero_sniper/sniper_crosshair.vpcf',Creeps[icreep])
		}
	}		
}

function CreateFollowParticle(time,particlepath,someobj){
	if(z.indexOf(someobj)!=-1)
		return
	var p = Particles.CreateParticle(particlepath, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, someobj)
	Particles.SetParticleControl(p, 0,  0)
	z.push(someobj)
	$.Schedule(time+0.1,function(){ Particles.DestroyParticleEffect(p,p); z.splice(z.indexOf(someobj),1); })
}

