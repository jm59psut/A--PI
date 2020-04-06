var spots: any[] = [
		[[-4243.42939897017,   3501.8235973011365,  256], false], // 1
		[[-2742.2740799753287, 4587.608038651316,   256], false], // 2 not calibrated properly
		[[-1987.66181640625,   4254.620751953125,   256], false], // 3 not calibrated properly
		[[2563.1559992609796,  96.42265794083879,   384], false], // 4
		[[3904.6480305989585,  -570.9649353027344,  256],  true], // 5
		[[69.18981283682363,   -1888.7627314814815, 384], false], // 6
		[[365.6284604279891,   -4687.083113960598,  384],  true]  // 7 not calibrated properly
	].orderBy(obj => -obj[1]).map(obj => obj[0]),
	is_stacking: boolean = false,
	last_notify_time: number = -1,
	notify_xml: string

function KunkkaAutoStack_Notify(cur_time: number) {
	if(last_notify_time == cur_time / 60)
		return
	
	last_notify_time = cur_time / 60
	var A = $.CreatePanel("Panel", Fusion.Panels.Main, "KunkkaAutoStack_Notify")
	A.BLoadLayoutFromString(notify_xml, false, false)
	Game.EmitSound("kunkka_kunk_bounty_01")
	$.Schedule(2, () => A.DeleteAsync(0))
}

function KunkkaAutoStack_OnUpdate() {
	if(EntityManager.MyEnt == undefined || is_stacking) return
	var torrent: Ability = EntityManager.MyEnt.AbilityByName("kunkka_torrent")
	if(torrent == undefined || !torrent.IsCooldownReady || !torrent.IsOwnersManaEnough)
		return
	var cur_time: number = Game.GetDOTATime(false, true)
	if (cur_time < 60)
		return
	if (
		Math.abs (
			(cur_time % 60) - 47
		) <= Fusion.MyTick
	)
		KunkkaAutoStack_Notify(cur_time)
	if (
		Math.abs (
			(cur_time % 60) -
			(60 - (torrent.CastPoint + torrent.SpecialValueFor("delay") + 0.6)) // it tooks ~0.6sec to raise y coord of creeps
		) >= Fusion.MyTick
	)
		return
	var my_vec: Vector = EntityManager.MyEnt.AbsOrigin,
		cast_range: number = torrent.CastRange
	spots.filter(spot => spot.PointDistance(my_vec) < cast_range).orderBy(spot => spot.PointDistance(my_vec)).every(spot => {
		Orders.CastPosition(EntityManager.MyEnt, torrent, spot, OrderQueueBehavior_t.DOTA_ORDER_QUEUE_NEVER)
		is_stacking = true
		$.Schedule(torrent.CastPoint + Fusion.MyTick, () => is_stacking = false)
		return false
	})
}

module = {
	name: "KunkkaAutoStack",
	onPreload: () => {
		spots = spots.map((spot: [number, number, number]) => new Vector(spot))
		Fusion.GetXML("KunkkaAutoStack/notify").then(response => notify_xml = response)
		if(Fusion.Commands.KunkkaAutoStack || Fusion.Commands.KunkkaAutoStack_Notify)
			return
	
		Fusion.Commands.KunkkaAutoStack = () => {
			var MyEnt = EntityManager.MyEnt,
				torrent = MyEnt.AbilityByName("kunkka_torrent"),
				torrent_radius = torrent.SpecialValueFor("radius"),
				ancients = Utils.CursorWorldVec.GetEntitiesInRange(1000, true).filter(ent => ent.IsCreep && !ent.IsLaneCreep)
			var ancientsPositionSum = ancients.map(ancient => ancient.AbsOrigin).reduce((sum, vec) => sum ? new Vector(sum.x + vec.x, sum.z + vec.z, sum.y + vec.y) : vec),
				ancientsPosition = new Vector(ancientsPositionSum.x / ancients.length, ancientsPositionSum.z / ancients.length, ancientsPositionSum.y / ancients.length)
			var failed = ancients.some(ancient => ancient.AbsOrigin.PointDistance(ancientsPosition) >= torrent_radius)
			if(!failed) {
				$.Msg(ancientsPosition)
				Orders.CastPosition(MyEnt, torrent, ancientsPosition, OrderQueueBehavior_t.DOTA_ORDER_QUEUE_NEVER)
			} else
				$.Msg("can't stack it.")
		}
		Game.AddCommand("__FindPerfectTorrent", Fusion.Commands.KunkkaAutoStack, "", 0)
		Fusion.Commands.KunkkaAutoStack_Notify = true
		Game.AddCommand("__KunkkaAutoStack_Notify", KunkkaAutoStack_Notify, "", 0)
	},
	onToggle: checkbox => {
		if (checkbox.checked) {
			Fusion.OnUpdate.push(KunkkaAutoStack_OnUpdate)
			Utils.ScriptLogMsg("Script enabled: KunkkaAutoStack", "#00ff00")
		} else {
			module.onDestroy()
			Utils.ScriptLogMsg("Script disabled: KunkkaAutoStack", "#ff0000")
		}
	},
	onDestroy: () => Fusion.OnUpdate.remove(KunkkaAutoStack_OnUpdate)
}