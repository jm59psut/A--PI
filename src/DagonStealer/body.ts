    var damage = [400,500,600,700,800]
    var manacost = [200,200,200,200,200]
    var manacoste = 200
    var rangee = 800
    var dagonrange = [600,650,700,750,800]
    var rangeCast 
    var DagonLvl = -1
    var ItemDagon = -1
    var ItemBlink = -1
    var Lense = false
    var cast
    
    //Buffs that should be ignored
    var IgnoreBuffss = [
        "modifier_abaddon_borrowed_time",
        "modifier_skeleton_king_reincarnation_scepter_active",
        "modifier_brewmaster_primal_split",
        "modifier_omniknight_repel",
        "modifier_phoenix_supernova_hiding",
        "modifier_tusk_snowball_movemEnemyEntity",
        "modifier_tusk_snowball_movemEnemyEntity_friendly",
        "modifier_juggernaut_blade_fury",
        "modifier_medusa_stone_gaze",
        "modifier_nyx_assassin_spiked_carapace",
        "modifier_templar_assassin_refraction_absorb",
        "modifier_oracle_false_promise",
        "modifier_dazzle_shallow_grave",
        "modifier_treant_living_armor",
        "modifier_life_stealer_rage",
        "modifier_item_aegis"
    ]

    //Debbufs 
    
    var DebuffsAddMagicDmg = [
        ["modifier_bloodthorn_debuff", 1.3],
        ["modifier_orchid_malevolence_debuff", 1.3],
        ["modifier_item_mask_of_madness_berserk", 1.25],
        ["modifier_bloodseeker_bloodrage", [1.25,1.3,1.35,1.4]],
        ["modifier_ursa_enrage", 0.2],
    ]
    
    
    var BuffsAbsorbMagicDmgg = [
        ["modifier_item_pipe_barrier", 400],
        ["modifier_item_hood_of_defiance_barrier", 400],
        ["modifier_item_infused_raindrop", 120],
        ["modifier_abaddon_aphotic_shield", [110,140,170,200]],
        ["modifier_ember_spirit_flame_guard", [50,200,350,500]]
    ]
    //
    var BuffsAddMagicDmgForMe = [
        ["modifier_bloodseeker_bloodrage", [1.25,1.3,1.35,1.4]]
    ] 
    
    function DagonStealerF(){
    
        var Me = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
        if(Entities.IsInvisible(Me) || 
         !Entities.IsAlive(Me) || Entities.IsStunned(Me) || Game.IsGamePaused()) return;
        if (GetAbilityByName(Me,'item_dagon') != -1) 
        {
            ItemDagon = GetAbilityByName(Me,'item_dagon')
            DagonLvl = 0
        }
        if (GetAbilityByName(Me,'item_dagon_2') != -1) 
        {
            ItemDagon = GetAbilityByName(Me,'item_dagon_2')
            DagonLvl = 1
        }
        if (GetAbilityByName(Me,'item_dagon_3') != -1)
        {
            ItemDagon = GetAbilityByName(Me,'item_dagon_3')
            DagonLvl = 2
        }
        if (GetAbilityByName(Me,'item_dagon_4') != -1) 
        {
            ItemDagon = GetAbilityByName(Me,'item_dagon_4')
            DagonLvl = 3
        }
        if (GetAbilityByName(Me,'item_dagon_5') != -1)
        {
            ItemDagon = GetAbilityByName(Me,'item_dagon_5')
            DagonLvl = 4
        }
    
        if (ItemDagon == -1)
            return
        if (GetAbilityByName(Me, 'item_aether_lens') !=-1)
            Lense = true
        else
            Lense = false
        if ( Abilities.GetCooldownTimeRemaining(ItemDagon) != 0 || Entities.GetMana(Me) < manacost[DagonLvl])
            return
        if (Lense){
            rangeCast = 200 + dagonrange[DagonLvl]
        } else
        {
            rangeCast = dagonrange[DagonLvl]		
        }
        var MagicDamage = damage[DagonLvl]
      var  MyPos = Entities.GetAbsOrigin(Me)
        var HEnts = EntityManager.PlayersHeroEnts3()
        for (var i in HEnts) {
           var ent = HEnts[i]
         var   entPos = Entities.GetAbsOrigin(ent)
            cast = true
            if(ent==Me)
                continue	
            if (Utils.PointDistance(entPos,MyPos) > rangeCast) {
                cast = false
            }
            if (cast){
                var buffsnames = Utils.GetBuffsNames(ent)
                if ( !Entities.IsEnemy(ent) || Entities.IsMagicImmune(ent) || !Entities.IsAlive(ent) || Utils.IntersecArrays(buffsnames, IgnoreBuffss) || Entities.GetAllHeroEntities().indexOf(ent)==-1 )
                    continue
                var MagicResist = Entities.GetArmorReductionForDamageType( ent, 2 )*100
                var buffs = Utils.GetBuffs(ent)
                for(var m in buffs)
                    for(var k in DebuffsAddMagicDmg)
                        if(Buffs.GetName(ent,buffs[m]) === DebuffsAddMagicDmg[k][0])
                            if(Array.isArray(DebuffsAddMagicDmg[k][1]))
                                MagicDamage *= DebuffsAddMagicDmg[k][1][Abilities.GetLevel(Buffs.GetAbility(ent,buffs[i]))-1]
                            else
                                MagicDamage *= DebuffsAddMagicDmg[k][1]
                var buffsme = Utils.GetBuffs(Me)
                for(m in buffsme)
                    for(k in BuffsAddMagicDmgForMe)
                        if(Buffs.GetName(ent,buffsme[m]) === BuffsAddMagicDmgForMe[k][0])
                            if(Array.isArray(BuffsAddMagicDmgForMe[k][1]))
                                MagicDamage *= BuffsAddMagicDmgForMe[k][1][Abilities.GetLevel(buffsme.GetAbility(ent,buffsme[i]))-1]
                            else
                                MagicDamage *= BuffsAddMagicDmgForMe[k][1]
                            
                for(m in buffs)
                    for(k in BuffsAbsorbMagicDmgg)
                        if(Buffs.GetName(ent,buffs[m]) === BuffsAbsorbMagicDmgg[k][0])
                            if(Array.isArray(BuffsAbsorbMagicDmgg[k][1]))
                                MagicDamage -= BuffsAbsorbMagicDmgg[k][1][Abilities.GetLevel(Entities.GetAbility(ent,buffs[i]))-1]
                            else
                                MagicDamage -= BuffsAbsorbMagicDmgg[k][1]
                            
    
                var Inv = GetInventory(Me) 
                var TempInt = 0;
                for(var key in Inv){
                    var Item = parseInt(Inv[key])
                    TempInt += Abilities.GetSpecialValueFor( Item, 'bonus_intellect' )
                    TempInt += Abilities.GetSpecialValueFor( Item, 'bonus_all_stats' )
                }
                var StatAbil = Entities.GetAbilityByName(Me, "attribute_bonus")
                var TempStat = GetStats(Entities.GetUnitName(Me))
                TempInt += TempStat[6] + (TempStat[7] * (Abilities.GetLevel(Me)) - TempStat[7]) + 2 * (Abilities.GetLevel(StatAbil))
                var Int = TempInt / 16
                MagicDamage = MagicDamage * (1 + Int / 100)
    
                var dmgclear = MagicDamage - MagicDamage/100*MagicResist
                var bool1 = false
    
                if (bool1){
                    var HP = Entities.GetHealth(ent) + Entities.GetHealthThinkRegen(ent)
                    if ( HP <= dmgclear && HP>400 ){
                    if (Entities.GetAbilityByName(ent,'item_sphere') != -1)
                    { 
                        var Linka = Entities.GetAbilityByName(ent,'item_sphere')
                        if (Abilities.GetCooldownTimeRemaining(Linka) != 0)
                        {
                            GameUI.SelectUnit(Me, false);
                            Orders.CastTarget(Me, ItemDagon,ent,false)
                        }
    
                    } else {
                        GameUI.SelectUnit(Me, false);
                        Orders.CastTarget(Me, ItemDagon,ent,false)
                    }
                }
                } else {
                    var HP = Entities.GetHealth(ent) + Entities.GetHealthThinkRegen(ent)
                    if ( HP <= dmgclear ){
                    if (Entities.GetAbilityByName(ent,'item_sphere') != -1)
                    { 
                        var Linka = Entities.GetAbilityByName(ent,'item_sphere')
                        if (Abilities.GetCooldownTimeRemaining(Linka) != 0)
                        {
                            GameUI.SelectUnit(Me, false);
                            Orders.CastTarget(Me, ItemDagon,ent,false)
                        }
    
                    } else {
                        GameUI.SelectUnit(Me, false);
                       Orders.CastTarget(Me, ItemDagon,ent,false)
                    }
                }
                }
                    
                
                cast = false
            }
    
        }
    }

    function  GetAbilityByName  (ent,name){
        var GABN = Entities.GetAbilityByName( ent, name )
        if (GABN!=-1)
            return GABN
        for(var i=0;i<6;i++){
            var item = Entities.GetItemInSlot( ent, i )
            if(Abilities.GetAbilityName(item)==name)
                return item
        }
        return -1
    }
    
//Probably needs calibration
    var stats = 
    [["npc_dota_hero_antimage",2,22,1.200000,22,2.800000,15,1.800000],
    ["npc_dota_hero_axe",1,25,2.500000,20,2.200000,18,1.600000],
    ["npc_dota_hero_bane",3,22,2.100000,22,2.100000,22,2.100000],
    ["npc_dota_hero_bloodseeker",2,23,2.400000,24,3.000000,18,1.700000],
    ["npc_dota_hero_crystal_maiden",3,16,1.700000,16,1.600000,16,2.900000],
    ["npc_dota_hero_drow_ranger",2,17,1.900000,26,1.900000,15,1.400000],
    ["npc_dota_hero_earthshaker",1,22,2.900000,12,1.400000,16,1.800000],
    ["npc_dota_hero_juggernaut",2,20,1.900000,26,2.400000,14,1.400000],
    ["npc_dota_hero_mirana",2,17,1.850000,20,3.30000,17,1.650000],
    ["npc_dota_hero_nevermore",2,15,2.000000,20,2.900000,18,2.000000],
    ["npc_dota_hero_morphling",2,19,2.000000,24,3.700000,17,1.500000],
    ["npc_dota_hero_phantom_lancer",2,21,1.700000,29,2.600000,21,2.000000],
    ["npc_dota_hero_puck",3,15,1.700000,22,1.700000,25,2.400000],
    ["npc_dota_hero_pudge",1,25,3.200000,14,1.500000,14,1.500000],
    ["npc_dota_hero_razor",2,21,2.300000,22,2.000000,19,1.800000],
    ["npc_dota_hero_sand_king",1,22,2.600000,19,2.100000,16,1.800000],
    ["npc_dota_hero_storm_spirit",3,19,1.500000,22,1.800000,24,3.000000],
    ["npc_dota_hero_sven",1,23,2.700000,21,2.00000,16,1.300000],
    ["npc_dota_hero_tiny",1,26,3.000000,9,0.900000,17,1.600000],
    ["npc_dota_hero_vengefulspirit",2,18,2.600000,27,3.300000,13,1.50000],
    ["npc_dota_hero_windrunner",3,15,2.500000,17,1.400000,22,2.600000],
    ["npc_dota_hero_zuus",3,19,2.300000,11,1.200000,20,2.700000],
    ["npc_dota_hero_kunkka",1,24,3,14,1.300000,18,1.500000],
    ["npc_dota_hero_lina",3,18,1.500000,16,1.500000,27,3.200000],
    ["npc_dota_hero_lich",3,18,1.550000,15,2,18,3.250000],
    ["npc_dota_hero_lion",3,16,1.700000,15,1.500000,20,3.000000],
    ["npc_dota_hero_shadow_shaman",3,21,1.800000,16,1.600000,21,3.000000],
    ["npc_dota_hero_slardar",1,21,2.800000,17,2.400000,15,1.500000],
    ["npc_dota_hero_tidehunter",1,22,3.000000,15,1.500000,16,1.700000],
    ["npc_dota_hero_witch_doctor",3,16,1.800000,13,1.400000,24,2.900000],
    ["npc_dota_hero_riki",2,17,1.600000,34,2.200000,14,1.300000],
    ["npc_dota_hero_enigma",3,17,2.100000,14,1,20,3.400000],
    ["npc_dota_hero_tinker",3,17,2.000000,13,1.200000,30,2.200000],
    ["npc_dota_hero_sniper",2,16,1.700000,21,2.500000,15,2.600000],
    ["npc_dota_hero_necrolyte",3,16,2.000000,15,1.700000,22,2.500000],
    ["npc_dota_hero_warlock",3,22,2.500000,10,1.000000,24,2.700000],
    ["npc_dota_hero_beastmaster",1,23,2.200000,18,1.600000,16,1.900000],
    ["npc_dota_hero_queenofpain",3,16,1.700000,18,2,24,2.500000],
    ["npc_dota_hero_venomancer",2,18,1.850000,22,2.600000,17,1.80000],
    ["npc_dota_hero_faceless_void",2,23,1.800000,23,2.65000,15,1.500000],
    ["npc_dota_hero_skeleton_king",1,22,2.900000,18,1.700000,18,1.600000],
    ["npc_dota_hero_death_prophet",3,17,1.900000,14,1.400000,23,3.000000],
    ["npc_dota_hero_phantom_assassin",2,20,1.850000,23,3.150000,15,1.400000],
    ["npc_dota_hero_pugna",3,17,1.200000,16,1.000000,26,4.50000],
    ["npc_dota_hero_templar_assassin",2,18,2.100000,23,2.700000,20,2.000000],
    ["npc_dota_hero_viper",2,20,2.100000,21,2.900000,15,1.800000],
    ["npc_dota_hero_luna",2,15,2.200000,18,3.300000,16,1.850000],
    ["npc_dota_hero_dragon_knight",1,19,2.800000,19,2.200000,15,1.700000],
    ["npc_dota_hero_dazzle",3,16,1.850000,21,1.700000,27,3.400000],
    ["npc_dota_hero_rattletrap",1,24,2.900000,13,2.300000,17,1.300000],
    ["npc_dota_hero_leshrac",3,16,1.500000,23,1.700000,26,3],
    ["npc_dota_hero_furion",3,19,1.800000,18,1.900000,25,2.900000],
    ["npc_dota_hero_life_stealer",1,25,3.000000,18,1.900000,15,1.75000],
    ["npc_dota_hero_dark_seer",3,22,2.300000,12,1.200000,25,2.700000],
    ["npc_dota_hero_clinkz",2,15,1.600000,22,3.300000,16,1.55000],
    ["npc_dota_hero_omniknight",1,22,2.80000,15,1.750000,17,1.800000],
    ["npc_dota_hero_enchantress",3,16,1.000000,19,1.800000,16,2.800000],
    ["npc_dota_hero_huskar",1,21,2.400000,15,1.40000,18,1.500000],
    ["npc_dota_hero_night_stalker",1,23,2.800000,18,2.250000,16,1.600000],
    ["npc_dota_hero_broodmother",2,17,2.500000,18,2.200000,18,2.000000],
    ["npc_dota_hero_bounty_hunter",2,17,1.800000,21,3.000000,19,2.000000],
    ["npc_dota_hero_weaver",2,15,1.500000,14,2.500000,15,1.800000],
    ["npc_dota_hero_jakiro",3,25,2.300000,10,1.200000,28,2.800000],
    ["npc_dota_hero_batrider",3,23,2.400000,15,1.500000,24,2.500000],
    ["npc_dota_hero_chen",3,23,1.500000,15,2.100000,21,2.800000],
    ["npc_dota_hero_spectre",2,19,2.000000,23,1.800000,16,1.900000],
    ["npc_dota_hero_doom_bringer",1,26,3.200000,11,0.900000,13,2.100000],
    ["npc_dota_hero_ancient_apparition",3,18,1.400000,20,2.200000,25,2.600000],
    ["npc_dota_hero_ursa",2,23,2.700000,18,2.100000,16,1.500000],
    ["npc_dota_hero_spirit_breaker",1,29,2.400000,17,1.700000,14,1.800000],
    ["npc_dota_hero_gyrocopter",2,18,1.800000,24,2.800000,19,2.100000],
    ["npc_dota_hero_alchemist",1,25,1.800000,11,1.200000,25,1.800000],
    ["npc_dota_hero_invoker",3,17,1.700000,14,1.900000,16,4.000000],
    ["npc_dota_hero_silencer",3,17,2.200000,22,3.000000,27,2.500000],
    ["npc_dota_hero_obsidian_destroyer",3,19,2.30000,24,2.00000,26,2.700000],
    ["npc_dota_hero_lycan",1,22,3.0000,16,1.900000,17,1.550000],
    ["npc_dota_hero_brewmaster",1,23,2.900000,22,1.950000,14,1.250000],
    ["npc_dota_hero_shadow_demon",3,17,1.900000,18,2.200000,23,2.700000],
    ["npc_dota_hero_lone_druid",2,17,2.100000,24,2.700000,13,1.400000],
    ["npc_dota_hero_chaos_knight",1,20,2.900000,14,2.100000,16,1.200000],
    ["npc_dota_hero_meepo",2,23,1.600000,23,2.200000,20,1.600000],
    ["npc_dota_hero_treant",1,25,3.300000,15,2.000000,17,1.800000],
    ["npc_dota_hero_ogre_magi",3,23,3.200000,14,1.550000,17,2.400000],
    ["npc_dota_hero_undying",1,22,2.100000,10,0.800000,27,2.800000],
    ["npc_dota_hero_rubick",3,19,1.500000,14,1.600000,27,2.400000],
    ["npc_dota_hero_disruptor",3,19,1.900000,15,1.400000,22,2.500000],
    ["npc_dota_hero_nyx_assassin",2,18,2.000000,19,2.200000,18,2.100000],
    ["npc_dota_hero_naga_siren",2,21,2.500000,21,2.750000,21,2.0000],
    ["npc_dota_hero_keeper_of_the_light",3,14,1.800000,15,1.600000,25,2.800000],
    ["npc_dota_hero_wisp",1,17,1.900000,14,1.600000,23,1.700000],
    ["npc_dota_hero_visage",3,22,2.400000,11,1.300000,24,2.500000],
    ["npc_dota_hero_slark",2,21,1.800000,21,1.500000,16,1.900000],
    ["npc_dota_hero_medusa",2,14,1.650000,20,2.500000,19,2.1000],
    ["npc_dota_hero_troll_warlord",2,20,2.200000,21,2.750000,13,1.000000],
    ["npc_dota_hero_centaur",1,23,4.000000,15,2.000000,15,1.600000],
    ["npc_dota_hero_magnataur",1,21,2.90000,15,2.500000,19,1.650000],
    ["npc_dota_hero_shredder",1,22,1.800000,16,1.300000,21,2.400000],
    ["npc_dota_hero_bristleback",1,22,2.200000,17,1.800000,14,2.800000],
    ["npc_dota_hero_tusk",1,23,2.300000,23,2.100000,18,1.700000],
    ["npc_dota_hero_skywrath_mage",3,19,1.500000,13,0.800000,27,3.600000],
    ["npc_dota_hero_abaddon",1,23,2.700000,17,1.500000,21,2.000000],
    ["npc_dota_hero_elder_titan",1,24,2.300000,14,1.500000,23,1.600000],
    ["npc_dota_hero_legion_commander",1,26,2.600000,18,1.700000,20,2.200000],
    ["npc_dota_hero_ember_spirit",2,19,2.000000,22,1.800000,20,1.800000],
    ["npc_dota_hero_earth_spirit",1,21,2.900000,17,1.500000,18,2.100000],
    ["npc_dota_hero_terrorblade",2,15,1.400000,22,3.200000,19,1.750000],
    ["npc_dota_hero_phoenix",1,17,2.900000,12,1.300000,18,1.800000],
    ["npc_dota_hero_oracle",3,18,1.900000,15,1.700000,23,2.900000],
    ["npc_dota_hero_techies",3,17,2.000000,14,1.300000,22,2.900000],
    ["npc_dota_hero_winter_wyvern",3,24,2.100000,16,1.900000,25,3.100000],
    ["npc_dota_hero_arc_warden",2,24,2.3,15,1.8,24,2.6]];

    function GetStats (a){
        for (var i = 0; stats.length - 1; i++){
            if (a == stats[i][0])
            {
                return	stats[i]
            }
        }
    }

    function GetInventory (entity){
        var inv = []
        for(var i = 0; i<6; i++){
            if(Entities.GetItemInSlot( entity, i )!=-1)
                inv.push(Entities.GetItemInSlot( entity, i ))
        }
        return inv
    }

    module = {
        name: "Dagon Stealer [BETA]",
        onToggle: checkbox => {
            if (checkbox.checked) {
                Corona.OnTick.push(DagonStealerF)
                Utils.ScriptLogMsg("Dagon Stealer", "#00ff00")
            } else {
                Corona.OnTick.remove(DagonStealerF)
                Utils.ScriptLogMsg("Dagon Stealer", "#ff0000")
            }
        },
        onDestroy: () => {
            Corona.OnTick.remove(DagonStealerF)
        }
    }