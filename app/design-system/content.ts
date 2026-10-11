// Nikita's routine (spec §2). Names are as Nikita wrote them.
export const SETS = 3;
export const REPS = 10;

export type DayKind = "Strength" | "Cardio" | "Rest";
export type DayTone = "upper" | "legs" | "cardio" | "rest";

export type WorkoutDay = {
  day: number;
  name: string;
  kind: DayKind;
  tone: DayTone;
  exercises: string[];
};

export const WEEK: WorkoutDay[] = [
  {
    day: 1,
    name: "Back and biceps",
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
  { day: 2, name: "Cardio", kind: "Cardio", tone: "cardio", exercises: [] },
  {
    day: 3,
    name: "Shoulders and triceps",
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
  { day: 4, name: "Cardio", kind: "Cardio", tone: "cardio", exercises: [] },
  {
    day: 5,
    name: "Legs",
    kind: "Strength",
    tone: "legs",
    exercises: ["Hip thrusts", "RDLs", "Bulgarian split squats", "Hip abduction / adduction", "Glute hyperextensions"],
  },
  { day: 6, name: "Cardio", kind: "Cardio", tone: "cardio", exercises: [] },
  { day: 7, name: "Rest", kind: "Rest", tone: "rest", exercises: [] },
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

// Form cues for the Day 5 rows; Bulgarian split squats' cues come from the spec.
export const FORM_CUES: Record<string, string[]> = {
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
