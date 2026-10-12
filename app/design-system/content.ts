// Nikita's routine (spec §2). Names are as Nikita wrote them.
export const SETS = 3;
export const REPS = 10;

export type DayKind = "Strength" | "Cardio" | "Rest";
export type DayTone = "upper" | "legs" | "cardio" | "rest";

export type WorkoutDay = {
  day: number;
  name: string;
  // The day strip's label.
  short: string;
  kind: DayKind;
  tone: DayTone;
  exercises: string[];
};

export const WEEK: WorkoutDay[] = [
  {
    day: 1,
    name: "Back and biceps",
    short: "BACK/BIS",
    kind: "Strength",
    tone: "upper",
    exercises: [
      "Lat pulldowns",
      "Face pulls",
      "Single-arm dumbbell rows",
      "Lower back hyperextensions",
      "African bicep curls",
      "Cable bicep curls",
      "Barbell curls",
    ],
  },
  { day: 2, name: "Cardio", short: "CARDIO", kind: "Cardio", tone: "cardio", exercises: [] },
  {
    day: 3,
    name: "Shoulders and triceps",
    short: "SHOULDERS/TRIS",
    kind: "Strength",
    tone: "upper",
    exercises: [
      "Cable lateral raise",
      "Shoulder superset: O movements and serving platters",
      "Archer pull",
      "Front raise cable",
      "Overhead tricep extension cable",
      "Tricep cross extension",
      "Tricep press",
    ],
  },
  { day: 4, name: "Cardio", short: "CARDIO", kind: "Cardio", tone: "cardio", exercises: [] },
  {
    day: 5,
    name: "Legs",
    short: "LEGS",
    kind: "Strength",
    tone: "legs",
    exercises: ["Hip thrusts", "RDLs", "Bulgarian split squats", "Hip abduction / adduction", "Glute hyperextensions"],
  },
  { day: 6, name: "Cardio", short: "CARDIO", kind: "Cardio", tone: "cardio", exercises: [] },
  { day: 7, name: "Rest", short: "REST", kind: "Rest", tone: "rest", exercises: [] },
];

export const DAY_FILTERS = ["All", "Strength", "Cardio", "Rest"] as const;
export type DayFilter = (typeof DAY_FILTERS)[number];

export const CARDIO_OPTIONS = [
  { value: "run", label: "Run 30 min", detail: "Walk 5 min, run 30 min, walk 5 min" },
  { value: "intervals", label: "Run–walk intervals", detail: "Walk 5 min, (run 15 min, walk 1 min) × 3, walk 5 min" },
  { value: "incline", label: "Incline walk", detail: "30 min walking at level 12 incline, 3 mph" },
  { value: "stairs", label: "Stairs", detail: "25 min of stairs at intensity 7" },
];

export const REST_OPTIONS = [
  { value: "60", label: "60 s" },
  { value: "90", label: "90 s" },
  { value: "120", label: "2 min" },
];

// Form cues for every strength exercise. Nikita wrote them for African bicep curls, the shoulder
// superset, archer pull, tricep cross extension and tricep press; Bulgarian split squats' come
// from the design-system spec.
export const FORM_CUES: Record<string, string[]> = {
  "Lat pulldowns": [
    "Grip the bar a little wider than your shoulders, thighs under the pad.",
    "Pull the bar to your upper chest, leading with your elbows.",
    "Let it rise slowly until your arms are straight.",
  ],
  "Face pulls": [
    "Set the rope at face height and step back until your arms are straight.",
    "Pull the rope toward your face, hands ending beside your ears.",
    "Squeeze your shoulder blades, then return slowly.",
  ],
  "Single-arm dumbbell rows": [
    "One hand and knee on the bench, back flat.",
    "Pull the dumbbell toward your hip, elbow close to your side.",
    "Lower it until your arm is straight, without twisting.",
  ],
  "Lower back hyperextensions": [
    "Pad just below your hips, feet anchored.",
    "Lower with a flat back.",
    "Rise until your body is straight; don't arch past it.",
  ],
  "African bicep curls": [
    "Curl the weight up with a standard underhand grip, palms up.",
    "As you lower it, rotate your wrists into a neutral hammer grip, palms in.",
    "Or alternate hammer and standard curl paths, to work both the bicep and the forearm.",
  ],
  "Cable bicep curls": [
    "Stand tall, elbows at your sides.",
    "Curl the handle up without moving your elbows.",
    "Lower slowly until your arms are straight.",
  ],
  "Barbell curls": [
    "Hands shoulder-width apart, elbows at your sides.",
    "Curl the bar to your shoulders without swinging.",
    "Lower it slowly all the way down.",
  ],
  "Cable lateral raise": [
    "Stand side-on to a low cable, handle in your far hand.",
    "Raise your arm out to the side to shoulder height, elbow soft.",
    "Lower slowly, without shrugging.",
  ],
  "Shoulder superset: O movements and serving platters": [
    "O movements: arms straight, move your hands from your thighs up above your head.",
    "Serving platters: arms straight in front of you, bring them back in toward your chest, then extend them straight out to your sides.",
  ],
  "Archer pull": [
    "Set the cable at shoulder height.",
    "Pull the attachment back like drawing a bow and arrow.",
    "Repeat on the other side.",
  ],
  "Front raise cable": [
    "Stand facing away from a low cable, handle in front of your thighs.",
    "Raise your straight arm in front of you to shoulder height.",
    "Lower slowly, keeping your body still.",
  ],
  "Overhead tricep extension cable": [
    "Face away from the cable, rope behind your head, elbows by your ears.",
    "Straighten your arms overhead without moving your elbows.",
    "Bend back slowly until you feel the stretch.",
  ],
  "Tricep cross extension": [
    "Set the cable at shoulder height.",
    "Pull the attachment diagonally across your body.",
    "Focus on your triceps as you pull.",
  ],
  "Tricep press": ["Use the tricep press machine."],
  "Hip thrusts": [
    "Upper back on the bench, bar across your hips.",
    "Drive through your heels until your hips are level with your knees.",
    "Pause and squeeze at the top, then lower slowly.",
  ],
  RDLs: [
    "Soft knees, weight in your heels.",
    "Push your hips back and lower the weight along your legs with a flat back.",
    "Stand by driving your hips forward.",
  ],
  "Bulgarian split squats": [
    "Rear foot on the bench behind you.",
    "Lower straight down until your front thigh is about level.",
    "Drive through your front heel to stand.",
  ],
  "Hip abduction / adduction": [
    "Sit tall with your back against the pad.",
    "Press the pads out (abduction) or in (adduction) in a slow, even arc.",
    "Return slowly; don't let the weights slam.",
  ],
  "Glute hyperextensions": [
    "Pad just below your hips, feet anchored.",
    "Lower with a flat back.",
    "Rise by squeezing your glutes until your body is straight; don't arch past it.",
  ],
};

export const UI_STATE_COPY = {
  empty: "Rest day: no workout today",
  loading: "Loading your week…",
  error: "Couldn't load this workout",
  success: "Workout logged. Nice work.",
};
