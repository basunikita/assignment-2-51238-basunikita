import type { Photo } from "../_components/artifact";

// Printed by `scripts/unsplash.sh get calm <id> <name>`; alt text rewritten by hand.
export const PHOTOS = {
  sunriseRoad: { kind: "photo", src: "/mood-boards/calm/sunrise-road.jpg", width: 1000, height: 1500, alt: "A lone walker on a road through golden morning fog", photographer: "Jonas Jaeken", photoUrl: "https://unsplash.com/photos/a-person-walking-down-a-road-in-the-fog-l-w96bIRnVA" },
  dawnPath: { kind: "photo", src: "/mood-boards/calm/dawn-path.jpg", width: 1000, height: 667, alt: "A runner in silhouette on a path with the sun low behind her", photographer: "McCarthy Beckan", photoUrl: "https://unsplash.com/photos/woman-running-in-golden-hour-light-a6FHROHuQ9o" },
  morningGym: { kind: "photo", src: "/mood-boards/calm/morning-gym.jpg", width: 1000, height: 563, alt: "Treadmills facing tall windows full of morning sun", photographer: "Hera Reyes", photoUrl: "https://unsplash.com/photos/a-gym-with-a-view-of-the-city-lvMR5ebekPM" },
  stretching: { kind: "photo", src: "/mood-boards/calm/stretching.jpg", width: 1000, height: 790, alt: "A woman stretching her arms overhead on a bed by a bright window", photographer: "bruce mars", photoUrl: "https://unsplash.com/photos/woman-sitting-on-white-bed-while-stretching-wBuPCQiweuA" },
  bikeDawn: { kind: "photo", src: "/mood-boards/calm/bike-dawn.jpg", width: 1000, height: 1333, alt: "A bicycle with the sun bursting through its back wheel", photographer: "Adam Stefanca", photoUrl: "https://unsplash.com/photos/rigid-bicycle-under-sunrays-JrM_SWb2gJA" },
  shoesLaced: { kind: "photo", src: "/mood-boards/calm/shoes-laced.jpg", width: 1000, height: 1500, alt: "A runner in gray running shoes striding along an orange line on asphalt", photographer: "Jakob Owens", photoUrl: "https://unsplash.com/photos/person-running-in-gray-asics-sneakers-A4579vLezz8" },
  pastelSky: { kind: "photo", src: "/mood-boards/calm/pastel-sky.jpg", width: 1000, height: 667, alt: "A pink, peach and lavender sky at dawn", photographer: "Fernando Strabuli", photoUrl: "https://unsplash.com/photos/pink-yellow-and-purple-cloudy-sky-iW1WzbuWMcA" },
  stairClimber: { kind: "photo", src: "/mood-boards/calm/stair-climber.jpg", width: 1000, height: 665, alt: "Concrete steps with leaf shadows in warm golden light", photographer: "Naturalist Boat", photoUrl: "https://unsplash.com/photos/concrete-stairs-with-plant-shadows-r1S00URwPMI" },
} satisfies Record<string, Photo>;
