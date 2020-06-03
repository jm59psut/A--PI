var a = 1200
function CreateBlinkRangeRadiusF() {
  var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
  Corona.Particles.BlinkRangeRadius = ParticleManager.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, MyEnt)
  Particles.SetParticleControl(Corona.Particles.BlinkRangeRadius, 1, [a, 0, 0])
}
function Destroy(): void {
  ParticleManager.DestroyParticleEffect(Corona.Particles.BlinkRangeRadius.get(a), true)
  Corona.Particles.BlinkRangeRadius.delete(a)
}
module = {
  name: "Blink Range",
  onToggle: checkbox => {
    if (checkbox.checked) {
      CreateBlinkRangeRadiusF()
      Utils.ScriptLogMsg("Script enabled: Blink Range", "#00ff00")
    } else {
      Destroy()
      module.onDestroy()

      Utils.ScriptLogMsg("Script disabled: Blink Range", "#ff0000")
    }
  },
  onDestroy: () => Corona.OnTick.remove(Destroy)
}
