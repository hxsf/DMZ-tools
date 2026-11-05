import type { ItemId } from "../types/item";

import axion from "../assets/third-party/items/dmzhub/axion.webp";
import ballisticFabric from "../assets/third-party/items/dmzhub/ballistic-fabric.webp";
import bandage from "../assets/third-party/items/dmzhub/bandage.webp";
import bindingCatalyst from "../assets/third-party/items/dmzhub/binding-catalyst.webp";
import biomaterials from "../assets/third-party/items/dmzhub/biomaterials.webp";
import chemicals from "../assets/third-party/items/dmzhub/chemicals.webp";
import cronenSquall from "../assets/third-party/items/dmzhub/cronen-squall.webp";
import electronicSensors from "../assets/third-party/items/dmzhub/electronic-sensors.webp";
import electronics from "../assets/third-party/items/dmzhub/electronics.webp";
import highTenacityFibers from "../assets/third-party/items/dmzhub/high-tenacity-fibers.webp";
import hyeonBurst from "../assets/third-party/items/dmzhub/hyeon-burst.webp";
import isoNightshade from "../assets/third-party/items/dmzhub/iso-nightshade.webp";
import kastov762 from "../assets/third-party/items/dmzhub/kastov-762.webp";
import m4 from "../assets/third-party/items/dmzhub/m4.webp";
import mediumBackpack from "../assets/third-party/items/dmzhub/medium-backpack.webp";
import medkit from "../assets/third-party/items/dmzhub/medkit.webp";
import metals from "../assets/third-party/items/dmzhub/metals.webp";
import oden from "../assets/third-party/items/dmzhub/oden.webp";
import patriotXmr from "../assets/third-party/items/dmzhub/patriot-xmr.webp";
import radiationBlockers from "../assets/third-party/items/dmzhub/radiation-blockers.webp";
import reconDrone from "../assets/third-party/items/dmzhub/recon-drone.webp";
import rigidSynthetics from "../assets/third-party/items/dmzhub/rigid-synthetics.webp";
import sedativeInhaler from "../assets/third-party/items/dmzhub/sedative-inhaler.webp";
import smallSecureBackpack from "../assets/third-party/items/dmzhub/small-secure-backpack.webp";
import structuralAlloy from "../assets/third-party/items/dmzhub/structural-alloy.webp";
import synthetics from "../assets/third-party/items/dmzhub/synthetics.webp";

/** 原图与出处逐项登记在 assets/third-party/items/dmzhub/ATTRIBUTION.md。
 * 未收集到的物品不提供替代图；武器手册使用其 weaponId 查找。
 */
export const itemImages: Partial<Record<ItemId, string>> = {
  "item:axion": axion,
  "item:ballistic-fabric": ballisticFabric,
  "item:bandage": bandage,
  "item:binding-catalyst": bindingCatalyst,
  "item:biomaterials": biomaterials,
  "item:chemicals": chemicals,
  "item:cronen-squall": cronenSquall,
  "item:electronic-sensors": electronicSensors,
  "item:electronics": electronics,
  "item:high-tenacity-fibers": highTenacityFibers,
  "item:hyeon-burst": hyeonBurst,
  "item:iso-nightshade": isoNightshade,
  "item:kastov-762": kastov762,
  "item:m4": m4,
  "item:medium-backpack": mediumBackpack,
  "item:medkit": medkit,
  "item:metals": metals,
  "item:oden": oden,
  "item:patriot-xmr": patriotXmr,
  "item:radiation-blockers": radiationBlockers,
  "item:recon-drone": reconDrone,
  "item:rigid-synthetics": rigidSynthetics,
  "item:sedative-inhaler": sedativeInhaler,
  "item:small-secure-backpack": smallSecureBackpack,
  "item:structural-alloy": structuralAlloy,
  "item:synthetics": synthetics,
};
