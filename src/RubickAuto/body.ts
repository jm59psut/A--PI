try{
	Fusion.Panels.RubickAutoSteal.DeleteAsync(0)
}catch(e){}

var interval = 0.1
var LenseBonusRange = 200
var flag = false
var StealIfThere = true
var LastSpells = {}
var Config = []

function RubickAutoStealF(){
	if(flag)
		return
	var AbPanel = Fusion.Panels.RubickAutoSteal.Children()
	var z = []
	for(var i in AbPanel)
		if(AbPanel[i].style.opacity==1 || AbPanel[i].style.opacity==null)
			z.push(AbPanel[i].Children()[0].abilityname)
            var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var Ulti = Entities.GetAbilityByName(MyEnt, 'rubick_spell_steal' )
	var UltiRange = Abilities.GetCastRange( Ulti )
	if(Entities.HasItemInInventory( MyEnt, 'item_aether_lens'))
		UltiRange+=LenseBonusRange
	var UltiLvl = Abilities.GetLevel(Ulti)
	var UltiCd = Abilities.GetCooldownTimeRemaining( Ulti )
	if(UltiLvl==0)
		return
        var HEnts = EntityManager.PlayersHeroEnts3()
	for(i in LastSpells)
		if(HEnts.indexOf(i)==-1)
			LastSpells[i]=-1
	for (i in HEnts) {
		var ent = parseInt(HEnts[i])
		if( !Entities.IsEnemy(ent) || Entities.IsMagicImmune(ent) || !Entities.IsAlive(ent))
			continue
		var Range = Entities.GetRangeToUnit(MyEnt, ent)
		if(Range>UltiRange)
			continue
		var Count = Entities.GetAbilityCount( ent )
		for(var x=0;x<Count;x++){
			var ab = Entities.GetAbility( ent, x )
			var lvl = Abilities.GetLevel( ab )
			if(lvl==-1 || !Abilities.IsDisplayedAbility(ab) || Abilities.IsPassive(ab) )
				continue
			var name = Abilities.GetAbilityName( ab )
			if(z.indexOf(name)==-1)
				continue
			var cd = Abilities.GetCooldownTimeRemaining( ab )
			var cda = Abilities.GetCooldown( ab )
			var me = Entities.GetAbilityByName(MyEnt, name)
			if(me!=-1 && !StealIfThere)
				continue
			if( Math.ceil(cd)==cda && cda!=0 ){
				LastSpells[ent] = ab
			}
			if(LastSpells[ent]>0){
				flag = true
				$.Schedule(0.3,function(){ flag=false })
				GameUI.SelectUnit(MyEnt,false)
				Orders.EntStop(MyEnt, false)
				Orders.CastTarget(MyEnt, Ulti, ent, false)
			}
		}
	}
}
function RubickAutoStealCreatePanel(){
	Fusion.Panels.RubickAutoSteal = $.CreatePanel( 'Panel', Utils.GetMainHUD(), 'RubickAutoStealAbilities' )
	Fusion.Panels.RubickAutoSteal.BLoadLayoutFromString( '<root><Panel style="border: 1px solid #000;background-color:#000000EE;flow-children:down-wrap;max-width:200px;border-radius:10px;padding:5px 3px;" onactivate="Add()"></Panel></root>', false, false )
	Utils.MovePanel(Fusion.Panels.RubickAutoSteal,function(p){
		var position = p.style.position.split(' ')
		Fusion.Panels.MainPanel.x = position[0]
		Fusion.Panels.MainPanel.y = position[1]
	})
	var HEnts = EntityManager.PlayersHeroEnts3()
	for (var i in HEnts) {
        var ent = parseInt(HEnts[i])
		if(!Entities.IsEnemy(ent))
			continue
		var Count = Entities.GetAbilityCount( ent )
		for(var y=0;y<Count;y++){
			var ab = Entities.GetAbility( ent, y )
			if(!Abilities.IsDisplayedAbility(ab) || Abilities.IsPassive(ab) || Abilities.GetCooldown(ab)==0 )
				continue
			var name = Abilities.GetAbilityName( ab )
			var Item = $.CreatePanel( 'Panel', Fusion.Panels.RubickAutoSteal, 'RubickAutoStealAbilities' )
			//Item.BLoadLayoutFromString( '<root><Panel><DOTAAbilityImage style="width:35px;"/></Panel></root>', false, false )
			Item.BLoadLayoutFromString( '<root><script>function Add(){$.GetContextPanel().style.opacity="0.1";$.GetContextPanel().SetPanelEvent("onactivate", Rem)}function Rem(){$.GetContextPanel().style.opacity="1.0";$.GetContextPanel().SetPanelEvent("onactivate", Add)}</script><Panel style="border: 1px solid #000; border-radius: 10px;" onactivate="Rem()"><DOTAAbilityImage style="width:35px;"/></Panel></root>', false, false )
			Item.style.opacity = 0.1
			Item.Children()[0].abilityname=name
		}
	}
}


module = {
	name: "Rubick AutoSteal",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Utils.ScriptLogMsg("Script enabled: Rubick AutoSteal", "#00ff00")
			function f(){ $.Schedule( interval,function(){
		RubickAutoStealF()
			f()
	})}
	f()
	RubickAutoStealCreatePanel()
}
if (!checkbox.checked) {
	Fusion.Panels.RubickAutoSteal.DeleteAsync(0)
	Utils.ScriptLogMsg("Script disabled: Rubick AutoSteal", "#00ff00")
}
		else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: Rubick AutoSteal", "#ff0000")
		}
	},onPreload: (): void => {
		Fusion.Commands.RubickRefresh=()=>{
			Fusion.Panels.RubickAutoSteal.DeleteAsync(0)
			delete Fusion.Panels.RubickAutoSteal
			RubickAutoStealF()
			RubickAutoStealCreatePanel()
		
		}
		Game.AddCommand("__RubickRefresh", Fusion.Commands.RubickRefresh, "", 0)
	},
	onDestroy: () => Fusion.OnTick.remove(RubickAutoStealCreatePanel)
	
}