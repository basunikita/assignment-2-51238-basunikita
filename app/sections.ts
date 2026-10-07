export type Section = {
  href: string;
  title: string;
};

export type SectionGroup = {
  heading: string;
  sections: Section[];
};

// Mood board N is the source for design system N; the final site uses one design system.
export const SECTION_GROUPS: SectionGroup[] = [
  {
    heading: "Mood boards",
    sections: [
      { href: "/moods/1/", title: "Mood board 1" },
      { href: "/moods/2/", title: "Mood board 2" },
      { href: "/moods/3/", title: "Mood board 3" },
    ],
  },
  {
    heading: "Design systems",
    sections: [
      { href: "/systems/1/", title: "Design system 1" },
      { href: "/systems/2/", title: "Design system 2" },
      { href: "/systems/3/", title: "Design system 3" },
    ],
  },
  {
    heading: "Final site",
    sections: [{ href: "/site/", title: "A week of workouts" }],
  },
];
