import type { Photo } from "../_components/artifact";

// Printed by `scripts/unsplash.sh get editorial <id> <name>`; alt text rewritten by hand.
export const PHOTOS = {
  kettlebells: { kind: "photo", src: "/mood-boards/editorial/kettlebells.jpg", width: 1000, height: 667, alt: "A row of kettlebells on a gym floor, the front one marked 20 lb", photographer: "Heidi Erickson", photoUrl: "https://unsplash.com/photos/a-row-of-kettles-lined-up-in-a-gym-CPSjcuuV8E8" },
  trackLanes: { kind: "photo", src: "/mood-boards/editorial/track-lanes.jpg", width: 1000, height: 1500, alt: "Lane seven painted in white on a running track", photographer: "Alejandro Barba", photoUrl: "https://unsplash.com/photos/running-track-with-number-seven-X9fNpnH-qTI" },
  raceBib: { kind: "photo", src: "/mood-boards/editorial/race-bib.jpg", width: 1000, height: 1778, alt: "A pack of marathon runners wearing race bibs, one waving", photographer: "Quan-You Zhang", photoUrl: "https://unsplash.com/photos/woman-waves-while-running-in-a-marathon-race-d6Sbmz4O0E4" },
  stopwatch: { kind: "photo", src: "/mood-boards/editorial/stopwatch.jpg", width: 1000, height: 750, alt: "An analog stopwatch on a black background", photographer: "William Warby", photoUrl: "https://unsplash.com/photos/a-close-up-of-a-stopwatch-on-a-black-background-VwqMTcsb0Tg" },
  startingLine: { kind: "photo", src: "/mood-boards/editorial/starting-line.jpg", width: 1000, height: 667, alt: "A sprinter with hands set behind the line at the starting blocks", photographer: "Braden Collum", photoUrl: "https://unsplash.com/photos/man-on-running-field-9HI8UJMSdZA" },
  shoes: { kind: "photo", src: "/mood-boards/editorial/shoes.jpg", width: 1000, height: 667, alt: "Close-up of a knit running shoe with a thick white sole", photographer: "CC PD", photoUrl: "https://unsplash.com/photos/a-black-and-white-running-shoe-with-a-thick-sole-l6YLomZBgTk" },
  runnerLegs: { kind: "photo", src: "/mood-boards/editorial/runner-legs.jpg", width: 1000, height: 667, alt: "A runner and a long shadow on dark pavement", photographer: "Mathias Reding", photoUrl: "https://unsplash.com/photos/runners-legs-in-motion-with-a-long-shadow-G96xGokbTUM" },
  cyclist: { kind: "photo", src: "/mood-boards/editorial/cyclist.jpg", width: 1000, height: 1508, alt: "A cyclist riding along a path beneath a concrete bridge", photographer: "Kelvin Zyteng", photoUrl: "https://unsplash.com/photos/a-person-riding-a-bicycle-under-a-bridge-4KD_cBdejlk" },
  gym: { kind: "photo", src: "/mood-boards/editorial/gym.jpg", width: 1000, height: 1355, alt: "A squat rack and shelves of plates in a brick-walled gym", photographer: "Brett Jordan", photoUrl: "https://unsplash.com/photos/exercise-equipments-in-grayscale-photography-U2q73PfHFpM" },
} satisfies Record<string, Photo>;
