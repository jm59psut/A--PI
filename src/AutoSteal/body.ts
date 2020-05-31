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

var abils: AutoStealEntry[] = [
		{
			abilName: "axe_culling_blade",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var kill_threshold = abil.SpecialValueFor("kill_threshold"),
					damage = entTo.CalculateDamage(abil.SpecialValueFor("damage"), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL),
					hp = entTo.HealthAfter(abil.CastPoint / Corona.MyTick)
				
				return hp > kill_threshold ? damage : kill_threshold
			}
		},
		{
			abilName: "necrolyte_reapers_scythe",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var DamagePerMissHP = abil.SpecialValueFor("damage_per_health"),
					delta = entTo.HealthAfter(3)
				return entTo.CalculateDamage((entTo.MaxHealth - delta) * DamagePerMissHP, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "zuus_arc_lightning",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var arc_damage = abil.SpecialValueFor("arc_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_zeus_2")
				if(talent && talent.Level > 0)
					arc_damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(arc_damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "zuus_lightning_bolt",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
		},
		{
			abilName: "zuus_thundergods_wrath",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
		},
		{
			abilName: "sniper_assassinate",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("projectile_speed"),
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.HasScepter ? 0 : entTo.CalculateDamage(abil.AbilityDamage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
		},
		{
			abilName: "visage_soul_assumption",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("bolt_speed"),
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var baseDamage = abil.SpecialValueFor("soul_base_damage"),
					stackDamage = abil.SpecialValueFor("soul_charge_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_visage_4")
				if(talent && talent.Level > 0)
					stackDamage += talent.SpecialValueFor("value")
				var stack_buff = entFrom.BuffByName("modifier_visage_soul_assumption"),
					stack_buff_damage = stack_buff ? stack_buff.StackCount * stackDamage : 0
				return entTo.CalculateDamage(baseDamage + stack_buff_damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "rubick_fade_bolt",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
		},
		{
			abilName: "phantom_assassin_stifling_dagger",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP,
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("dagger_speed"),
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entTo.CalculateDamage(abil.SpecialValueFor("base_damage") + ((1 + abil.SpecialValueFor("attack_factor") / 100) * entFrom.Damage), DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL)
		},
		{
			abilName: "tinker_laser",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var laser_damage = abil.SpecialValueFor("laser_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_tinker")
				if(talent && talent.Level > 0)
					laser_damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(laser_damage, DAMAGE_TYPES.DAMAGE_TYPE_PURE)
			}
		},
		{
			abilName: "antimage_mana_void",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entTo.CalculateDamage(abil.SpecialValueFor("mana_void_damage_per_mana") * (entTo.MaxMana - entTo.Mana), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
		},
		{
			abilName: "puck_waning_rift",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilRadiusF: abil => abil.SpecialValueFor("radius") / 2 - 25,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var damage = abil.SpecialValueFor("damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_puck_4")
				if(talent && talent.Level > 0)
					damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "brewmaster_thunder_clap",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilRadiusF: abil => abil.SpecialValueFor("radius") / 2 - 25
		},
		{
			abilName: "obsidian_destroyer_astral_imprisonment",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entTo.CalculateDamage(abil.SpecialValueFor("damage"), DAMAGE_TYPES.DAMAGE_TYPE_PURE) - Math.min(abil.SpecialValueFor("prison_duration") * entTo.HealthThinkRegen * 30 + 1, entTo.MaxHealth - entTo.Health)
		},
		{
			abilName: /item_dagon/,
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entTo.CalculateDamage(abil.SpecialValueFor("damage"), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
		},
		{
			abilName: "bristleback_quill_spray",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP,
			abilRadiusF: abil => abil.SpecialValueFor("radius"),
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("projectile_speed"),
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var baseDamage = abil.SpecialValueFor("quill_base_damage"),
					stackDamage = abil.SpecialValueFor("quill_stack_damage"),
					max_damage = abil.SpecialValueFor("max_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_bristleback_2")
				if(talent && talent.Level > 0)
					stackDamage += talent.SpecialValueFor("value")
				var stack_buff = entTo.BuffByName("modifier_bristleback_quill_spray"),
					stack_buff_damage = stack_buff ? stack_buff.StackCount * stackDamage : 0
				return entTo.CalculateDamage(Math.min(max_damage, baseDamage + stack_buff_damage), DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL)
			}
		},
		{
			abilName: "luna_lucent_beam",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var beam_damage = abil.SpecialValueFor("beam_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_luna_1")
				if(talent && talent.Level > 0)
					beam_damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(beam_damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "alchemist_unstable_concoction",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var max_damage = abil.SpecialValueFor("max_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_alchemist_2")
				if(talent && talent.Level > 0)
					max_damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(max_damage, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL)
			}
		},
		{
			abilName: "alchemist_unstable_concoction_throw",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var max_damage = abil.SpecialValueFor("max_damage"),
					brew_time = abil.SpecialValueFor("brew_time"),
					brew_explosion = abil.SpecialValueFor("brew_explosion"),
					min_stun = abil.SpecialValueFor("min_stun"),
					talent = entFrom.AbilityByName("special_bonus_unique_alchemist_2"),
					modifier_name = "modifier_alchemist_unstable_concoction"
				if(talent && talent.Level > 0)
					max_damage += talent.SpecialValueFor("value")
				var buffs: Buff[] = entFrom.Buffs.filter(buff => buff.Name === modifier_name),
					buff: Buff
				if(buffs.length > 0)
					buff = buff[0]
				else
					return 0
				var elapsed = Math.min(buff.ElapsedTime, brew_time) - min_stun,
					charged = Math.max(elapsed, 0) / brew_time
				if(Buffs.GetElapsedTime(entFrom, buff) > brew_explosion - (abil.CastPoint + Corona.MyTick * 1.5))
					return 99999999 // we don't need to be self-stunned, ye?

				return entTo.CalculateDamage(charged * max_damage, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL)
			}
		},
		{
			abilName: "abaddon_death_coil",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var target_damage = abil.SpecialValueFor("target_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_abaddon_2")
				if(talent && talent.Level > 0)
					target_damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(target_damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "bounty_hunter_shuriken_toss",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("speed"),
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var damage = abil.SpecialValueFor("bonus_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_bounty_hunter_2")
				if(talent && talent.Level > 0)
					damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "ogre_magi_fireblast",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var fireblast_damage = abil.SpecialValueFor("fireblast_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_ogre_magi_2")
				if(talent && talent.Level > 0)
					fireblast_damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(fireblast_damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "ogre_magi_unrefined_fireblast",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entTo.CalculateDamage(abil.SpecialValueFor("fireblast_damage"), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
		},
		{
			abilName: "undying_soul_rip",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entTo.CalculateDamage(abil.SpecialValueFor("damage_per_unit") * Math.min(entTo.AbsOrigin.GetEntitiesInRange(abil.SpecialValueFor("radius")).filter(ent => (ent.IsCreep || ent.IsHero) && !ent.IsEnemy).length, abil.SpecialValueFor("max_units")), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
		},
		{
			abilName: "queenofpain_scream_of_pain",
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("projectile_speed"),
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
		},
		{
			abilName: "leshrac_lightning_storm",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
		},
		{
			abilName: "tusk_walrus_punch",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var crit_multiplier = abil.SpecialValueFor("crit_multiplier"),
					talent = entFrom.AbilityByName("special_bonus_unique_tusk")
				if(talent && talent.Level > 0)
					crit_multiplier += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(entFrom.Damage * crit_multiplier / 100, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL)
			}
		},
		{
			abilName: "centaur_double_edge",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var edge_damage = abil.SpecialValueFor("edge_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_centaur_4")
				if(talent && talent.Level > 0)
					edge_damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(edge_damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "legion_commander_duel",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entTo.CalculateDamage(entFrom.Damage, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL) * 2 - 1
		},/*
		{
			abilName: "legion_commander_overwhelming_odds",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				const ents = entTo.AbsOrigin.GetEntitiesInRange(abil.SpecialValueFor("radius")),
					creeps = ents.filter(ent => ent.IsCreep && ent.IsEnemy),
					heroes = ents.filter(ent => ent.IsHero && ent.IsEnemy)
				return entTo.CalculateDamage(abil.SpecialValueFor("damage") * heroes.length + abil.SpecialValueFor("damage_per_unit") * creeps.length, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},*/
		{
			abilName: "broodmother_spawn_spiderlings",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("projectile_speed"),
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var damage = abil.SpecialValueFor("damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_broodmother_3")
				if(talent && talent.Level > 0)
					damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "crystal_maiden_crystal_nova",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var damage = abil.SpecialValueFor("nova_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_crystal_maiden_2")
				if(talent && talent.Level > 0)
					damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "shadow_shaman_ether_shock",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var damage = abil.SpecialValueFor("damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_shadow_shaman_3")
				if(talent && talent.Level > 0)
					damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "undying_decay",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entTo.CalculateDamage(abil.SpecialValueFor("decay_damage"), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
		},
		{
			abilName: "oracle_purifying_flames",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
		},
		{
			abilName: "lion_impale",
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("speed"),
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
		},
		{
			abilName: "lion_finger_of_death",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDelayF: abil => abil.SpecialValueFor("damage_delay"),
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var damage = abil.SpecialValueFor("damage" + (entFrom.HasScepter ? "_scepter" : "")),
					talent = entFrom.AbilityByName("special_bonus_unique_lion_3")
				if(talent && talent.Level > 0)
					damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "lina_laguna_blade",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDelayF: abil => abil.SpecialValueFor("damage_delay"),
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entTo.CalculateDamage(abil.SpecialValueFor("damage"), entFrom.HasScepter ? DAMAGE_TYPES.DAMAGE_TYPE_PURE : DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
		},
		{
			abilName: "pudge_dismember",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entTo.CalculateDamage(abil.SpecialValueFor("dismember_damage"), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
		},
		{
			abilName: "lich_frost_nova",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
		},
		{
			abilName: "night_stalker_void",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
		},
		{
			abilName: "phantom_lancer_spirit_lance",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("lance_speed"),
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var lance_damage = abil.SpecialValueFor("lance_damage"),
					talent = entFrom.AbilityByName("special_bonus_unique_phantom_lancer_2")
				if(talent && talent.Level > 0)
					lance_damage += talent.SpecialValueFor("value")

				return entTo.CalculateDamage(lance_damage, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},
		{
			abilName: "skeleton_king_hellfire_blast",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("blast_speed")
		},
		{
			abilName: "sven_storm_bolt",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("bolt_speed")
		},
		/*{
			abilName: "storm_spirit_ball_lightning",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => Abilities.GetCastPoint(abil) + entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("ball_lightning_move_speed"),
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => {
				var dist = entFrom.RangeToUnit(entTo) / 100
				if(entFrom.BuffsNames.indexOf("modifier_storm_spirit_ball_lightning") > -1 || entFrom.Mana < Abilities.GetManaCost(abil) + abil.SpecialValueFor("ball_lightning_travel_cost_base") * dist + abil.SpecialValueFor("ball_lightning_travel_cost_percent") / 100 * entFrom.MaxMana * dist)
					return 0

				return entTo.CalculateDamage(dist * Abilities.GetAbilityDamage(abil), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			},
			abilCastF: (abil: Ability, entFrom: Entity, entTo: Entity) => {
				var aoe = abil.SpecialValueFor("ball_lightning_aoe") / 2,
					dist = entFrom.RangeToUnit(entTo),
					time = Abilities.GetCastPoint(abil) + dist / abil.SpecialValueFor("ball_lightning_move_speed"),
					point1 = entTo.VelocityWaypoint(time),
					point2 = Corona.ExtendVector(point1, entFrom.AbsOrigin, aoe),
					point
				if(entTo.CalculateDamage(point1.PointDistance(entFrom.AbsOrigin) * Abilities.GetAbilityDamage(abil), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) > entTo.HealthAfter(time * 30))
					point = point1
				else if(entTo.CalculateDamage(point2.PointDistance(entFrom.AbsOrigin) * Abilities.GetAbilityDamage(abil), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) > entTo.GetHealthAfter(time * 30))
					point = point2
				if(point)
					Orders.CastPosition(entFrom, abil, point, false)
			}
		},*/
		{
			abilName: "furion_wrath_of_nature",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
			abilDamageF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entTo.CalculateDamage(abil.SpecialValueFor("damage" + (entFrom.HasScepter ? "_scepter" : "")), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
		},
		{
			abilName: "beastmaster_primal_roar",
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
		},
		{
			abilName: "sandking_burrowstrike",
			abilDelayF: (abil: Ability, entFrom: Entity, entTo: Entity): number => entFrom.RangeToUnit(entTo) / abil.SpecialValueFor("burrow_speed" + (entFrom.HasScepter ? "_scepter" : "")),
			targets: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
		},
	],
	flag: boolean = false,
	flags: boolean[] = [],
	blink_flag: boolean = false

function GetAvailableAbils() {
	var MyEnt = EntityManager.MyEnt
	return abils.filter (
		abilData => abilData.abilName instanceof RegExp
		|| MyEnt.AbilityByName(abilData.abilName) !== undefined
		|| abilData.abilName.startsWith("item_")
	)
}

function Cast(abil: Ability, entFrom: Entity, entTo?: Entity): void {
	var Behavior = abil.Behavior
	if(Utils.IsFlagSet(Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET))
		Orders.CastNoTarget(entFrom, abil, false)
	else if(Utils.IsFlagSet(Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) || Behavior === 0)
		Orders.CastTarget(entFrom, abil, entTo, false)
	else if(Utils.IsFlagSet(Behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT))
		Orders.CastPosition(entFrom, abil, entTo.VelocityWaypoint(abil.CastPoint), false)
}

function or(arg1: any, arg2: any): any { return arg1 || arg2 }

function getDamage(abil: Ability, entFrom: Entity, entTo: Entity): number {
	return entTo.CalculateDamage(or(abil.AbilityDamage, abil.SpecialValueFor("damage")), abil.AbilityDamageType)
}

function AutoSteal(): void {
	var MyEnt = EntityManager.MyEnt/*,
		selectedHero = /^npc_dota_hero_(.*)$/.exec(MyEnt.UnitName)[1]*/
	if(MyEnt.IsStunned || !MyEnt.IsAlive || flag || Abilities.GetLocalPlayerActiveAbility() !== -1/* || (MyEnt.CanBeVisible && selectedHero !== "riki" && selectedHero !== "treant_protector")*/)
		return
	var availableAbils = GetAvailableAbils().filter(abilData => {
			var abil = abilData.abil
			if(!abil || !abil.IsValidEntity)
				abilData.abil = abil = MyEnt.NByName(abilData.abilName)
			return abil && abil.IsValidEntity && abil.Level !== 0 && !abil.IsHidden && abil.IsCooldownReady && abil.IsOwnersManaEnough
		}),
		zuus_passive = MyEnt.AbilityByName("zuus_static_field"),
		zuus_talent = MyEnt.AbilityByName("special_bonus_unique_zeus"),
		blink = MyEnt.ItemByName("item_blink") || MyEnt.AbilityByName("antimage_blink"),
		targetCreeps = availableAbils.some(abilData => Utils.IsFlagSet(abilData.targets, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP)),
		targets = [EntityManager.PlayersHeroEnts(), targetCreeps ? EntityManager.Creeps : []].map(ar => ar.filter(ent => ent.IsAlive && ent.IsEnemy && !flags[ent.id]))
	availableAbils.some(abilData => {
		var abil: Ability = abilData.abil,
			range = or(abilData.abilRadiusF, abil => abil.CastRange)(abil)
		if (range > 0)
			range += 75
		return targets.some(ents => ents.some(ent => {
			if (
				ent.HasLinkenAtTime(abil.CastPoint) ||
				(ent.IsCreep && !Utils.IsFlagSet(abilData.targets, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP)) ||
				(ent.IsHero && !Utils.IsFlagSet(abilData.targets, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO))
			)
				return false
			var need_blink = false
			if (range > 0)
				if(MyEnt.RangeToUnit(ent) > range)
					if (
						!blink_flag
						&& blink !== undefined
						&& blink.IsCooldownReady
						&& ent.IsHero
						&& MyEnt.RangeToUnit(ent) < range + blink.SpecialValueFor("blink_range")
					)
						need_blink = true
					else return false
			var damage = or(abilData.abilDamageF, getDamage)(abil, MyEnt, ent)
			if(zuus_passive !== undefined && MyEnt.IsEntityInRange(ent, zuus_passive.CastRange))
				damage += (abil.SpecialValueFor("damage_health_pct") + (zuus_talent !== undefined ? zuus_talent.Level === 0 ? 0 : zuus_talent.SpecialValueFor("value") : 0)) / 100 * ent.MaxHealth
			if(damage < ent.HealthAfter(abil.CastPoint / Corona.MyTick))
				return false

			if((blink_flag = !(flag = !need_blink))) {
				Orders.CastPosition(MyEnt, blink, ent.AbsOrigin.ExtendVector(MyEnt.AbsOrigin, range - 100), false)
				$.Schedule(blink.CastPoint + Corona.MyTick, () => blink_flag = false)
			} else {
				flags[ent.id] = true
				$.Schedule(abilData.abilDelayF ? abilData.abilDelayF(abil, MyEnt, ent) + abil.CastPoint + Corona.MyTick * 2 : 0, () => flags[ent.id] = false)
				$.Schedule (
					or (
						or(abilData.abilCastF, Cast)(abil, MyEnt, ent),
						abil.CastPoint
					) + Corona.MyTick,
					() => flag = false
				)
			}

			return true
		}))
	})
}

module = {
	name: "Auto Steal",
	onToggle: checkbox => {
		if (checkbox.checked) {
			Corona.OnTick.push(AutoSteal)
			Utils.ScriptLogMsg("Script enabled: Auto Steal", "#00ff00")
		} else {
			Corona.OnTick.remove(AutoSteal)
			Utils.ScriptLogMsg("Script disabled: Auto Steal", "#ff0000")
		}
	},
	onDestroy: () => {
		abils.forEach(abilData => delete abilData.abil)
		Corona.OnTick.remove(AutoSteal)
	}
}