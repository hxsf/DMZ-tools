import type { ItemId } from "../types/item";

import image1PlateArmorVest from "../assets/third-party/items/dmzhub/1-plate-armor-vest.webp";
import image2PlateArmorVest from "../assets/third-party/items/dmzhub/2-plate-armor-vest.webp";
import image2PlateBallisticGelVest from "../assets/third-party/items/dmzhub/2-plate-ballistic-gel-vest.webp";
import image2PlateHelmetArmorVest from "../assets/third-party/items/dmzhub/2-plate-helmet-armor-vest.webp";
import image3PlateArmorVest from "../assets/third-party/items/dmzhub/3-plate-armor-vest.webp";
import image3PlateBallisticGelVest from "../assets/third-party/items/dmzhub/3-plate-ballistic-gel-vest.webp";
import image3PlateHelmetArmorVest from "../assets/third-party/items/dmzhub/3-plate-helmet-armor-vest.webp";
import imageAdvancedUav from "../assets/third-party/items/dmzhub/advanced-uav.webp";
import imageAlloyedPlating from "../assets/third-party/items/dmzhub/alloyed-plating.webp";
import imageAmmoBox from "../assets/third-party/items/dmzhub/ammo-box.webp";
import imageArmorBox from "../assets/third-party/items/dmzhub/armor-box.webp";
import imageArtilleryBeacon from "../assets/third-party/items/dmzhub/artillery-beacon.webp";
import imageAxion from "../assets/third-party/items/dmzhub/axion.webp";
import imageBallisticFabric from "../assets/third-party/items/dmzhub/ballistic-fabric.webp";
import imageBandage from "../assets/third-party/items/dmzhub/bandage.webp";
import imageBindingCatalyst from "../assets/third-party/items/dmzhub/binding-catalyst.webp";
import imageBiomaterials from "../assets/third-party/items/dmzhub/biomaterials.webp";
import imageBombGlider from "../assets/third-party/items/dmzhub/bomb-glider.webp";
import imageBombingRun from "../assets/third-party/items/dmzhub/bombing-run.webp";
import imageC4 from "../assets/third-party/items/dmzhub/c4.webp";
import imageCarePackage from "../assets/third-party/items/dmzhub/care-package.webp";
import imageChemicals from "../assets/third-party/items/dmzhub/chemicals.webp";
import imageClaymore from "../assets/third-party/items/dmzhub/claymore.webp";
import imageCombatDrone from "../assets/third-party/items/dmzhub/combat-drone.webp";
import imageCommsModule from "../assets/third-party/items/dmzhub/comms-module.webp";
import imageControlUnit from "../assets/third-party/items/dmzhub/control-unit.webp";
import imageCpu from "../assets/third-party/items/dmzhub/cpu.webp";
import imageCronenSquall from "../assets/third-party/items/dmzhub/cronen-squall.webp";
import imageCrossfire from "../assets/third-party/items/dmzhub/crossfire.webp";
import imageDdos from "../assets/third-party/items/dmzhub/ddos.webp";
import imageDecoyGrenade from "../assets/third-party/items/dmzhub/decoy-grenade.webp";
import imageDefibrillator from "../assets/third-party/items/dmzhub/defibrillator.webp";
import imageDetonators from "../assets/third-party/items/dmzhub/detonators.webp";
import imageDisposableParachute from "../assets/third-party/items/dmzhub/disposable-parachute.webp";
import imageDoorBreacherCharge from "../assets/third-party/items/dmzhub/door-breacher-charge.webp";
import imageDrillCharge from "../assets/third-party/items/dmzhub/drill-charge.webp";
import imageDurableGasMask from "../assets/third-party/items/dmzhub/durable-gas-mask.webp";
import imageElectronicSensors from "../assets/third-party/items/dmzhub/electronic-sensors.webp";
import imageElectronics from "../assets/third-party/items/dmzhub/electronics.webp";
import imageEliteNightVisionGoggles from "../assets/third-party/items/dmzhub/elite-night-vision-goggles.webp";
import imageEnergyDrink from "../assets/third-party/items/dmzhub/energy-drink.webp";
import imageExperimentalCompounds from "../assets/third-party/items/dmzhub/experimental-compounds.webp";
import imageFlash from "../assets/third-party/items/dmzhub/flash.webp";
import imageFragGrenade from "../assets/third-party/items/dmzhub/frag-grenade.webp";
import imageFultonDropMarker from "../assets/third-party/items/dmzhub/fulton-drop-marker.webp";
import imageGasMask from "../assets/third-party/items/dmzhub/gas-mask.webp";
import imageHeartbeatSensor from "../assets/third-party/items/dmzhub/heartbeat-sensor.webp";
import imageHighTenacityFibers from "../assets/third-party/items/dmzhub/high-tenacity-fibers.webp";
import imageHyeonBurst from "../assets/third-party/items/dmzhub/hyeon-burst.webp";
import imageImpactWarhead from "../assets/third-party/items/dmzhub/impact-warhead.webp";
import imageInflatableDecoy from "../assets/third-party/items/dmzhub/inflatable-decoy.webp";
import imageIsoNightshade from "../assets/third-party/items/dmzhub/iso-nightshade.webp";
import imageKastov762 from "../assets/third-party/items/dmzhub/kastov-762.webp";
import imageLargeBackpack from "../assets/third-party/items/dmzhub/large-backpack.webp";
import imageLargeScavengerBackpack from "../assets/third-party/items/dmzhub/large-scavenger-backpack.webp";
import imageLargeSecureBackpack from "../assets/third-party/items/dmzhub/large-secure-backpack.webp";
import imageM4 from "../assets/third-party/items/dmzhub/m4.webp";
import imageMediumBackpack from "../assets/third-party/items/dmzhub/medium-backpack.webp";
import imageMediumScavengerBackpack from "../assets/third-party/items/dmzhub/medium-scavenger-backpack.webp";
import imageMediumSecureBackpack from "../assets/third-party/items/dmzhub/medium-secure-backpack.webp";
import imageMediumWeaponBackpack from "../assets/third-party/items/dmzhub/medium-weapon-backpack.webp";
import imageMedkit from "../assets/third-party/items/dmzhub/medkit.webp";
import imageMetals from "../assets/third-party/items/dmzhub/metals.webp";
import imageMilitaryComposites from "../assets/third-party/items/dmzhub/military-composites.webp";
import imageMolotovCocktail from "../assets/third-party/items/dmzhub/molotov-cocktail.webp";
import imageNanoStructuredAlloy from "../assets/third-party/items/dmzhub/nano-structured-alloy.webp";
import imageNightVisionGoggles from "../assets/third-party/items/dmzhub/night-vision-goggles.webp";
import imageNitroCompounds from "../assets/third-party/items/dmzhub/nitro-compounds.webp";
import imageNylonCloth from "../assets/third-party/items/dmzhub/nylon-cloth.webp";
import imageNylonLaminate from "../assets/third-party/items/dmzhub/nylon-laminate.webp";
import imageOden from "../assets/third-party/items/dmzhub/oden.webp";
import imagePainKillers from "../assets/third-party/items/dmzhub/pain-killers.webp";
import imageParachute from "../assets/third-party/items/dmzhub/parachute.webp";
import imagePatriotXmr from "../assets/third-party/items/dmzhub/patriot-xmr.webp";
import imagePortableRadar from "../assets/third-party/items/dmzhub/portable-radar.webp";
import imagePowerRegulator from "../assets/third-party/items/dmzhub/power-regulator.webp";
import imagePrintedCircuitBoard from "../assets/third-party/items/dmzhub/printed-circuit-board.webp";
import imagePrototypeRfModule from "../assets/third-party/items/dmzhub/prototype-rf-module.webp";
import imageProximityMine from "../assets/third-party/items/dmzhub/proximity-mine.webp";
import imageRadiationBlockers from "../assets/third-party/items/dmzhub/radiation-blockers.webp";
import imageRailgunSentry from "../assets/third-party/items/dmzhub/railgun-sentry.webp";
import imageRazorWireTrap from "../assets/third-party/items/dmzhub/razor-wire-trap.webp";
import imageReactiveMetals from "../assets/third-party/items/dmzhub/reactive-metals.webp";
import imageRebreather from "../assets/third-party/items/dmzhub/rebreather.webp";
import imageReconDrone from "../assets/third-party/items/dmzhub/recon-drone.webp";
import imageRevivePistol from "../assets/third-party/items/dmzhub/revive-pistol.webp";
import imageRigidSynthetics from "../assets/third-party/items/dmzhub/rigid-synthetics.webp";
import imageRiotShield from "../assets/third-party/items/dmzhub/riot-shield.webp";
import imageSamAirburstTurret from "../assets/third-party/items/dmzhub/sam-airburst-turret.webp";
import imageScreamerMine from "../assets/third-party/items/dmzhub/screamer-mine.webp";
import imageSecureScavengerBackpack from "../assets/third-party/items/dmzhub/secure-scavenger-backpack.webp";
import imageSedativeInhaler from "../assets/third-party/items/dmzhub/sedative-inhaler.webp";
import imageSeekerDrone from "../assets/third-party/items/dmzhub/seeker-drone.webp";
import imageSelfReviveKit from "../assets/third-party/items/dmzhub/self-revive-kit.webp";
import imageSemtex from "../assets/third-party/items/dmzhub/semtex.webp";
import imageShockStick from "../assets/third-party/items/dmzhub/shock-stick.webp";
import imageSmallBackpack from "../assets/third-party/items/dmzhub/small-backpack.webp";
import imageSmallSecureBackpack from "../assets/third-party/items/dmzhub/small-secure-backpack.webp";
import imageSmellingSalts from "../assets/third-party/items/dmzhub/smelling-salts.webp";
import imageSmokeGrenade from "../assets/third-party/items/dmzhub/smoke-grenade.webp";
import imageSmokeWall from "../assets/third-party/items/dmzhub/smoke-wall.webp";
import imageSnapshotGrenade from "../assets/third-party/items/dmzhub/snapshot-grenade.webp";
import imageSpotterScope from "../assets/third-party/items/dmzhub/spotter-scope.webp";
import imageStabilizedReagents from "../assets/third-party/items/dmzhub/stabilized-reagents.webp";
import imageStim from "../assets/third-party/items/dmzhub/stim.webp";
import imageStockRod from "../assets/third-party/items/dmzhub/stock-rod.webp";
import imageStructuralAlloy from "../assets/third-party/items/dmzhub/structural-alloy.webp";
import imageStunGrenade from "../assets/third-party/items/dmzhub/stun-grenade.webp";
import imageSynthetics from "../assets/third-party/items/dmzhub/synthetics.webp";
import imageTemperedArmorVest from "../assets/third-party/items/dmzhub/tempered-armor-vest.webp";
import imageThermite from "../assets/third-party/items/dmzhub/thermite.webp";
import imageThrowingKnife from "../assets/third-party/items/dmzhub/throwing-knife.webp";
import imageTripWire from "../assets/third-party/items/dmzhub/trip-wire.webp";
import imageTrophySystem from "../assets/third-party/items/dmzhub/trophy-system.webp";
import imageTurnedComponents from "../assets/third-party/items/dmzhub/turned-components.webp";
import imageUav from "../assets/third-party/items/dmzhub/uav.webp";
import imageVolatileExplosives from "../assets/third-party/items/dmzhub/volatile-explosives.webp";
import imageWeakNightVisionGoggles from "../assets/third-party/items/dmzhub/weak-night-vision-goggles.webp";
import imageZipGun from "../assets/third-party/items/dmzhub/zip-gun.webp";
import image50Gs from "../assets/third-party/items/dmztracker/50-gs.webp";
import imageApoc338 from "../assets/third-party/items/dmztracker/apoc-338.webp";
import imageAstaroth57 from "../assets/third-party/items/dmztracker/astaroth-57.webp";
import imageFinnLmg from "../assets/third-party/items/dmztracker/finn-lmg.webp";
import imageJokr from "../assets/third-party/items/dmztracker/jokr.webp";
import imageKg7Vulcan from "../assets/third-party/items/dmztracker/kg-7-vulcan.webp";
import imageKraitP68 from "../assets/third-party/items/dmztracker/krait-p68.webp";
import imageMar9 from "../assets/third-party/items/dmztracker/mar-9.webp";
import imageMojave357 from "../assets/third-party/items/dmztracker/mojave-357.webp";
import imageMosinNagant from "../assets/third-party/items/dmztracker/mosin-nagant.webp";
import imageOris86 from "../assets/third-party/items/dmztracker/oris-86.webp";
import imagePila from "../assets/third-party/items/dmztracker/pila.webp";
import imagePm40Anvil from "../assets/third-party/items/dmztracker/pm-40-anvil.webp";
import imagePpsh41 from "../assets/third-party/items/dmztracker/ppsh-41.webp";
import imageRezi12 from "../assets/third-party/items/dmztracker/rezi-12.webp";
import imageRpg8 from "../assets/third-party/items/dmztracker/rpg-8.webp";
import imageSang9mm from "../assets/third-party/items/dmztracker/sang-9mm.webp";
import imageSignal50 from "../assets/third-party/items/dmztracker/signal-50.webp";
import imageType73 from "../assets/third-party/items/dmztracker/type-73.webp";
import imageVel46 from "../assets/third-party/items/dmztracker/vel-46.webp";
import imageHan86 from "../assets/third-party/items/mw4field/han-86.webp";
import imageWarlord from "../assets/third-party/items/dmztracker/warlord.webp";
import imageWz55Striga from "../assets/third-party/items/dmztracker/wz-55-striga.webp";
import imageX58Nyx from "../assets/third-party/items/dmztracker/x-58-nyx.webp";

/** 原图与出处逐项登记在 assets/third-party/items/ 下各来源的 ATTRIBUTION.md。
 * 未收集到的物品不提供替代图；武器手册使用其 weaponId 查找。
 */
export const itemImages: Partial<Record<ItemId, string>> = {
  "item:1-plate-armor-vest": image1PlateArmorVest,
  "item:2-plate-armor-vest": image2PlateArmorVest,
  "item:2-plate-ballistic-gel-vest": image2PlateBallisticGelVest,
  "item:2-plate-helmet-armor-vest": image2PlateHelmetArmorVest,
  "item:3-plate-armor-vest": image3PlateArmorVest,
  "item:3-plate-ballistic-gel-vest": image3PlateBallisticGelVest,
  "item:3-plate-helmet-armor-vest": image3PlateHelmetArmorVest,
  "item:50-gs": image50Gs,
  "item:advanced-uav": imageAdvancedUav,
  "item:alloyed-plating": imageAlloyedPlating,
  "item:ammo-box": imageAmmoBox,
  "item:apoc-338": imageApoc338,
  "item:armor-box": imageArmorBox,
  "item:artillery-beacon": imageArtilleryBeacon,
  "item:astaroth-57": imageAstaroth57,
  "item:axion": imageAxion,
  "item:ballistic-fabric": imageBallisticFabric,
  "item:bandage": imageBandage,
  "item:binding-catalyst": imageBindingCatalyst,
  "item:biomaterials": imageBiomaterials,
  "item:bomb-glider": imageBombGlider,
  "item:bombing-run": imageBombingRun,
  "item:c4": imageC4,
  "item:care-package": imageCarePackage,
  "item:chemicals": imageChemicals,
  "item:claymore": imageClaymore,
  "item:combat-drone": imageCombatDrone,
  "item:comms-module": imageCommsModule,
  "item:control-unit": imageControlUnit,
  "item:cpu": imageCpu,
  "item:cronen-squall": imageCronenSquall,
  "item:crossfire": imageCrossfire,
  "item:ddos": imageDdos,
  "item:decoy-grenade": imageDecoyGrenade,
  "item:defibrillator": imageDefibrillator,
  "item:detonators": imageDetonators,
  "item:disposable-parachute": imageDisposableParachute,
  "item:door-breacher-charge": imageDoorBreacherCharge,
  "item:drill-charge": imageDrillCharge,
  "item:durable-gas-mask": imageDurableGasMask,
  "item:electronic-sensors": imageElectronicSensors,
  "item:electronics": imageElectronics,
  "item:elite-night-vision-goggles": imageEliteNightVisionGoggles,
  "item:energy-drink": imageEnergyDrink,
  "item:experimental-compounds": imageExperimentalCompounds,
  "item:finn-lmg": imageFinnLmg,
  "item:flash": imageFlash,
  "item:frag-grenade": imageFragGrenade,
  "item:fulton-drop-marker": imageFultonDropMarker,
  "item:gas-mask": imageGasMask,
  "item:han-86": imageHan86,
  "item:heartbeat-sensor": imageHeartbeatSensor,
  "item:high-tenacity-fibers": imageHighTenacityFibers,
  "item:hyeon-burst": imageHyeonBurst,
  "item:impact-warhead": imageImpactWarhead,
  "item:inflatable-decoy": imageInflatableDecoy,
  "item:iso-nightshade": imageIsoNightshade,
  "item:jokr": imageJokr,
  "item:kastov-762": imageKastov762,
  "item:kg-7-vulcan": imageKg7Vulcan,
  "item:krait-p68": imageKraitP68,
  "item:large-backpack": imageLargeBackpack,
  "item:large-scavenger-backpack": imageLargeScavengerBackpack,
  "item:large-secure-backpack": imageLargeSecureBackpack,
  "item:m4": imageM4,
  "item:mar-9": imageMar9,
  "item:medium-backpack": imageMediumBackpack,
  "item:medium-scavenger-backpack": imageMediumScavengerBackpack,
  "item:medium-secure-backpack": imageMediumSecureBackpack,
  "item:medium-weapon-backpack": imageMediumWeaponBackpack,
  "item:medkit": imageMedkit,
  "item:metals": imageMetals,
  "item:military-composites": imageMilitaryComposites,
  "item:mojave-357": imageMojave357,
  "item:molotov-cocktail": imageMolotovCocktail,
  "item:mosin-nagant": imageMosinNagant,
  "item:nano-structured-alloy": imageNanoStructuredAlloy,
  "item:night-vision-goggles": imageNightVisionGoggles,
  "item:nitro-compounds": imageNitroCompounds,
  "item:nylon-cloth": imageNylonCloth,
  "item:nylon-laminate": imageNylonLaminate,
  "item:oden": imageOden,
  "item:oris-86": imageOris86,
  "item:pain-killers": imagePainKillers,
  "item:parachute": imageParachute,
  "item:patriot-xmr": imagePatriotXmr,
  "item:pila": imagePila,
  "item:pm-40-anvil": imagePm40Anvil,
  "item:portable-radar": imagePortableRadar,
  "item:power-regulator": imagePowerRegulator,
  "item:ppsh-41": imagePpsh41,
  "item:printed-circuit-board": imagePrintedCircuitBoard,
  "item:prototype-rf-module": imagePrototypeRfModule,
  "item:proximity-mine": imageProximityMine,
  "item:radiation-blockers": imageRadiationBlockers,
  "item:railgun-sentry": imageRailgunSentry,
  "item:razor-wire-trap": imageRazorWireTrap,
  "item:reactive-metals": imageReactiveMetals,
  "item:rebreather": imageRebreather,
  "item:recon-drone": imageReconDrone,
  "item:revive-pistol": imageRevivePistol,
  "item:rezi-12": imageRezi12,
  "item:rigid-synthetics": imageRigidSynthetics,
  "item:riot-shield": imageRiotShield,
  "item:rpg-8": imageRpg8,
  "item:sam-airburst-turret": imageSamAirburstTurret,
  "item:sang-9mm": imageSang9mm,
  "item:screamer-mine": imageScreamerMine,
  "item:secure-scavenger-backpack": imageSecureScavengerBackpack,
  "item:sedative-inhaler": imageSedativeInhaler,
  "item:seeker-drone": imageSeekerDrone,
  "item:self-revive-kit": imageSelfReviveKit,
  "item:semtex": imageSemtex,
  "item:shock-stick": imageShockStick,
  "item:signal-50": imageSignal50,
  "item:small-backpack": imageSmallBackpack,
  "item:small-secure-backpack": imageSmallSecureBackpack,
  "item:smelling-salts": imageSmellingSalts,
  "item:smoke-grenade": imageSmokeGrenade,
  "item:smoke-wall": imageSmokeWall,
  "item:snapshot-grenade": imageSnapshotGrenade,
  "item:spotter-scope": imageSpotterScope,
  "item:stabilized-reagents": imageStabilizedReagents,
  "item:stim": imageStim,
  "item:stock-rod": imageStockRod,
  "item:structural-alloy": imageStructuralAlloy,
  "item:stun-grenade": imageStunGrenade,
  "item:synthetics": imageSynthetics,
  "item:tempered-armor-vest": imageTemperedArmorVest,
  "item:thermite": imageThermite,
  "item:throwing-knife": imageThrowingKnife,
  "item:trip-wire": imageTripWire,
  "item:trophy-system": imageTrophySystem,
  "item:turned-components": imageTurnedComponents,
  "item:type-73": imageType73,
  "item:uav": imageUav,
  "item:vel-46": imageVel46,
  "item:volatile-explosives": imageVolatileExplosives,
  "item:warlord": imageWarlord,
  "item:weak-night-vision-goggles": imageWeakNightVisionGoggles,
  "item:wz-55-striga": imageWz55Striga,
  "item:x-58-nyx": imageX58Nyx,
  "item:zip-gun": imageZipGun,
};
