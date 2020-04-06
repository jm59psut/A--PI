
    var a = []; function AutoHookExecuteFunction() {var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID());
    function AutoHookFunction() {
        var AutoHookInterval = 0.2;
        MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID());
        
        if(  !Entities.IsAlive(MyEnt) || Entities.IsSilenced(MyEnt) || Entities.IsStunned(MyEnt) || Abilities.GetCooldownTimeRemaining(Entities.GetAbility(MyEnt, 0)) != 0 || Entities.GetMana(MyEnt) < Abilities.GetManaCost(Entities.GetAbility(MyEnt, 0))) {
            return;
        }
        var HEnts = EntityManager.PlayersHeroEnts3()
        for (var i in HEnts) {
            if(Entities.IsEnemy(HEnts[i]) && Entities.GetRangeToUnit(MyEnt,HEnts[i]) < Abilities.GetCastRange(Entities.GetAbility(MyEnt, 0)) && Entities.IsAlive(HEnts[i])) {
                var temp1 = Entities.GetAbsOrigin(HEnts[i]);
                AutoHookInterval = 4; $.Schedule(4,function(){ AutoHookInterval = 0.2; });
         $.Schedule(0.01,function(){
             var temp2 = Entities.GetAbsOrigin(HEnts[i]);
                var IsEnemyMoving = false;
             if(String(temp1) != String(temp2)) {
                    var zxc = Entities.GetAbsOrigin(HEnts[i]);
                    var forward = Entities.GetForward(HEnts[i]);
                    var movespeed = Entities.GetIdealSpeed(HEnts[i]);
                    var targetPoint = CalculateAutohook(zxc, forward, movespeed, 0.7);
                    Orders.CastPosition2(MyEnt, Entities.GetAbility(MyEnt, 0), targetPoint, false);
                }else{
                    Orders.CastPosition2(MyEnt, Entities.GetAbility(MyEnt, 0), Entities.GetAbsOrigin(HEnts[i]), false);
                        Orders.CastTarget(MyEnt, Entities.GetAbility(MyEnt, 3), HEnts[i], true);
                       Orders.ToggleAbil(MyEnt, Entities.GetAbility(MyEnt, 1), true);
                    
                }
                });
                return;
            }
        }
    }
    
    function CalculateAutohook(zxc, forward, movespeed, time) {
        return [zxc[0]+forward[0]*movespeed*time,zxc[1]+forward[1]*movespeed*time,zxc[2]+forward[2]*movespeed*time]
    }
    
    Game.AddCommand("__Autohook", Fusion.Commands.AutoHookFunction, "", 0);

    module = {
        name: "Auto Hook",
        isVisible: false,
        onPreload: (): void => {
            AutoHookExecuteFunction();
        }
    } 

}
AutoHookExecuteFunction();