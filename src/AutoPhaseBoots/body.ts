function AutoPhaseBoots(): void {
    var MyEnt = EntityManager.MyEnt
    var PBoots = MyEnt.ItemByName("item_phase_boots")

if(MyEnt.IsInvisible)
return
        if(PBoots !== undefined && PBoots.IsCooldownReady&&MyEnt.IsMoving)
        Orders.CastNoTarget(MyEnt, PBoots, false)
                if(MyEnt.IsStunned || !MyEnt.IsAlive)
                return
    
}

module = {
name: "Auto PhaseBoots",
onToggle: checkbox => {
    if (checkbox.checked) {
        Fusion.OnTick.push(AutoPhaseBoots)
        Utils.ScriptLogMsg("Script enabled: AutoPhaseBoots", "#00ff00")
    } else {
        Fusion.OnTick.remove(AutoPhaseBoots)
        Utils.ScriptLogMsg("Script disabled: AutoPhaseBoots", "#ff0000")
    }
},
onDestroy: () => Fusion.OnTick.remove(AutoPhaseBoots)
}