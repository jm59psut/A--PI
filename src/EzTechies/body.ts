/*!
 * Created on Sun Mar 04 2018
 *
 * This file is part of Corona.
 * Copyright (c) 2018 Corona
 *
 * Corona is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Corona is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Corona.  If not, see <http://www.gnu.org/licenses/>.
 */

var EzTechies_config = { // do not edit this unless you know what you're doing!
	blow_expiring_mines: false
}

const rmineTimeout = 595 // 600 is mine duration
function ScheduleExplode(rmine: Entity): void {
	if(!EzTechies_config.blow_expiring_mines) return
	$.Schedule(rmineTimeout, () => {
		if(!EzTechies.RMines.some(([ent]) => rmine === ent))
			return

		Orders.CastNoTarget(rmine, rmine.AbilityByName("techies_remote_mines_self_detonate"), false)
	})
}

function HandleEntity(ent: Entity): void {
	var range = 400 // same for land mines and stasis traps
	switch(ent.UnitName) {
		case "npc_dota_techies_remote_mine":
			range = EzTechies.TriggerRadius * 0.85
			if(!ent.IsEnemy) {
				const techies = EzTechies.Techies,
					Ulti = techies.AbilityByName("techies_remote_mines")
				$.Schedule(Ulti.CastPoint, () => {
					if(!ent.IsAlive)
						return
					EzTechies.RMines.push([ent, Ulti.SpecialValueFor("damage" + (techies.HasScepter ? "_scepter" : ""))])
					ScheduleExplode(ent)
				})
			}
		case "npc_dota_techies_stasis_trap":
		case "npc_dota_techies_land_mine":
			EzTechies.Particles[ent.id] = Utils.CreateCustomRange(ent, range, [255, 0, 0])
		default:
			break
	}
}

function HandleMines(): void {
	EntityManager.Entities.filter(ent =>
		!ent.IsEnemy
		&& ent.IsAlive
		&& !ent.IsBuilding
		&& !ent.IsInvulnerable
	).forEach(HandleEntity)
}

function RemoteMines_EzTechies(techies: Entity, ents: Entity[]): void {
	var NeedMagicDmg = -1

	ents.forEach(ent => {
		var need = ent.HealthAfter(EzTechies.blowDelay) * ent.MagicMultiplier
		if(need > NeedMagicDmg)
			NeedMagicDmg = need
	})
	if(NeedMagicDmg === -1)
		return
	var RMinesToBlow = [],
		RMinesDmg = 0
	EzTechies.RMines.filter(([rmine]) => ents.some(ent => rmine.IsEntityInRange(ent, EzTechies.TriggerRadius * 0.85))).every(([rmine, dmg]) => {
		RMinesToBlow.push(rmine)
		RMinesDmg += dmg
		if(Corona.debug)
			$.Msg("EzTechies", `There's ${RMinesDmg}, needed ${NeedMagicDmg}`)
		if(RMinesDmg > NeedMagicDmg) {
			RMinesToBlow.forEach(rmine => Orders.CastNoTarget(rmine, rmine.AbilityByName("techies_remote_mines_self_detonate"), false))
			return false
		}
		return true
	})
}

function SubscribeEvents(): void {
	if(!Corona.Subscribes.EzTechies.MinesSpawn)
		Corona.Subscribes.EzTechiesMinesSpawn = GameEvents.Subscribe("npc_spawned", event => HandleEntity(EntityManager.EntityByID(event.entindex)))

	if(!Corona.Subscribes.EzTechies.MineDeath)
		Corona.Subscribes.EzTechiesMineDeath = GameEvents.Subscribe("entity_killed", event => {
			var ent = event.entindex_killed

			if(ent.UnitName === "npc_dota_techies_remote_mine")
				EzTechies.RemoveRMine(ent)
		})
}

module = {
	name: "EzTechies",
	exports: {
		EzTechies: {
			blowDelay: 0.25 * 30 + 1, // in ticks
			RMines: [], // ([rmine, damage])
			Particles: [],
			RemoveRMine: rmine => {
				const ar = EzTechies.RMines.filter(([rmine2]) => rmine2 === rmine)
				if(ar.length === 1)
					EzTechies.RMines.remove(ar[0])
			},
			get Techies() { return EzTechies.__Techies__ || (EzTechies.__Techies__ = EzTechies.FindTechies()) },
			FindTechies: () => { // finds 1st techies
				var MyEnt = EntityManager.MyEnt
				if(MyEnt === undefined) return
				if(MyEnt.AbilityByName("techies_remote_mines") !== undefined)
					return MyEnt
				var techies
				EntityManager.PlayersHeroEnts().filter(ent => ent.AbilityByName("techies_remote_mines") !== undefined).every(ent => {
					techies = ent
					return false
				})
				return techies
			},
			TriggerRadius: 425 // always stays static
		}
	},
	onPreload: (): void => {
		Corona.Subscribes.EzTechies = []
		if(EzTechies.RMines.length === 0)
			HandleMines()
		SubscribeEvents()
	
		if(!Corona.Commands.EzTechies) {
			Corona.Commands.EzTechies = () => {
				try {
					var techies = EzTechies.Techies
					if(!techies || techies.IsEnemy) {
						$.Msg("EzTechies", "Isn't techies, also don't have one in team")
						return
					}
					var heroEnts = EntityManager.PlayersHeroEnts(),
						ents = Utils.CursorWorldVec.GetEntitiesInRange(EzTechies.TriggerRadius * 0.85, true).filter(ent => heroEnts.indexOf(ent) !== -1)
	
					RemoteMines(techies, ents.filter(ent => ent.MagicMultiplier !== 0))
				} catch(e) { $.Msg("EzTechies", e) }
			}
			Game.AddCommand("__EzTechies", Corona.Commands.EzTechies, "", 0)
		}
	},
	onDestroy: () => {
		if(Corona.Subscribes.EzTechies)
			Corona.Subscribes.EzTechies.forEach(sub => GameEvents.Unsubscribe(sub))
		if(EzTechies.Particles)
		EzTechies.Particles.forEach(par => ParticleManager.DestroyParticleEffect(par, true))
	},
	isVisible: false
}