function WTFBristle(): void {
    var MyEnt = EntityManager.MyEnt
    var Quill = MyEnt.AbilityByName("bristleback_quill_spray")
    
        if(MyEnt.Mana<35)
            return
        if(MyEnt.IsInvisible)
            return
        if(Quill !== undefined && Quill.IsCooldownReady)
            Orders.CastNoTarget(MyEnt, Quill, false)
        if(MyEnt.IsStunned || !MyEnt.IsAlive)
            Utils.ScriptLogMsg("Player Dead or Stunned")
            return
    
}

module = {
name: "RetardedBristle",
onToggle: checkbox => {
    if (checkbox.checked) {
        Corona.OnTick.push(WTFBristle)
        Utils.ScriptLogMsg("Script enabled: RetardedBristle", "#00ff00")
    } else {
        Corona.OnTick.remove(WTFBristle)
        Utils.ScriptLogMsg("Script disabled: RetardedBristle", "#ff0000")
    }
},
onDestroy: () => Corona.OnTick.remove(WTFBristle)
}