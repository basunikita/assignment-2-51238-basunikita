"use client";

import DetailPanel from "@/app/design-system/components/DetailPanel";
import RestTimer from "@/app/design-system/components/RestTimer";
import SetTracker from "@/app/design-system/components/SetTracker";
import { REST_OPTIONS } from "@/app/design-system/content";
import { restLabel } from "../week";

type ExercisePanelProps = {
  exercise: string | null;
  restSeconds: string;
  done: boolean[];
  onToggle: (index: number) => void;
  onClose: () => void;
};

export default function ExercisePanel({ exercise, restSeconds, done, onToggle, onClose }: ExercisePanelProps) {
  return (
    <DetailPanel exercise={exercise} restLabel={restLabel(REST_OPTIONS, restSeconds)} onClose={onClose}>
      {exercise && (
        <div className="mt-6 grid gap-6">
          <SetTracker exercise={exercise} title="Sets" done={done} onToggle={onToggle} />
          <RestTimer key={`${exercise}-${restSeconds}`} seconds={Number(restSeconds)} buttonVariant="secondary" />
        </div>
      )}
    </DetailPanel>
  );
}
