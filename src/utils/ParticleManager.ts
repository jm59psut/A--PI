/*!
 * Created on Sun Mar 04 2018
 *
 * This file is part of Fusion.
 * Copyright (c) 2018 Fusion
 *
 * Fusion is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Fusion is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Fusion.  If not, see <http://www.gnu.org/licenses/>.
 */

var ParticleManager = {
	/**
	 * Create a particle from a file with an attachment and an owning entity.
	 */
	CreateParticle(particleName: string, particleAttach : number, owningEntity: Entity | number = 0): number {
		return Particles.CreateParticle(particleName, particleAttach, owningEntity instanceof Entity ? owningEntity.id : owningEntity)
	},

	/**
	 * Release the index of a particle, will make the particle in-accessible from script. This allows another particle
	 * to reuse the freed particle index.
	 */
	ReleaseParticleIndex(particle: number): void { Particles.ReleaseParticleIndex(particle) },

	/**
	 * Destroy a particle. Setting the immediate boolean to true will prevent the endcap from playing.
	 */
	DestroyParticleEffect(particle, immediate = true): void { Particles.DestroyParticleEffect(particle, immediate) },

	/**
	 * Set a particle's control point to a vector value.
	 */
	SetParticleControl(particle: number, controlPoint: number, vec: Vector | number[]): void {
		return Particles.SetParticleControl(particle, controlPoint, vec instanceof Vector ? vec.Common : vec)
	},

	/**
	 * Set a particle's forward control point to a vector value.
	 */
	SetParticleControlForward(particle: number, controlPoint: number, vec: Vector | number[]): void {
		return Particles.SetParticleControlForward(particle, controlPoint, vec instanceof Vector ? vec.Common : vec)
	},

	/**
	 * Unknown use, any info welcome.
	 */
	SetParticleAlwaysSimulate(particle: number): void { Particles.SetParticleAlwaysSimulate(particle) },
	 randomInteger(min, max) {
		return Math.floor(min + Math.random() * (max + 1 - min));
	},
	GetRandomRangeParticleName() {
		var particles_path = "particles/";
		var particles_names = [
			"range_display_aqua",
			"range_display_blue",
			"range_display_green",
			"range_display_magenta",
			"range_display_orange",
			"range_display_pink",
			"range_display_red",
			"range_display_white",
			"range_display_yellow"
		];
		
		var random_particle_name = particles_names[ParticleManager.randomInteger(0, particles_names.length - 1)];
		return particles_path + random_particle_name + ".vpcf";
	},

	/**
	 * Set a particle's control point to an entity's attachment. Most common example is:
	 * ParticleManager.SetPerticleControlEnt(particle, controlPoint, entity, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", [0,0,0], true)
	 */
	SetParticleControlEnt (
		particle: number, controlPoint: number, entity: number | Entity, particleAttach: number,
		attachmentName: string, offset: number[] | Vector, unknown: boolean
	): void {
		return Particles.SetParticleControlEnt (
			particle,
			controlPoint,
			entity instanceof Entity ? entity.id : entity,
			particleAttach,
			attachmentName,
			offset instanceof Vector ? offset.Common : offset,
			unknown
		)
	}
}

module.exports = { ParticleManager }