export interface Exercise {
    reps: number;
    sets: number;
}

export class ExerciseDefault implements Exercise {
    reps = 0;
    sets = 0;
}

export interface Schema {
    warmup: number;
    exercise: Exercise;
    exercises: Exercise[];
    pauseReps: number;
    pauseSets: number;
    intervalReps: number;
    intervalDuration: number;
    intervalPause: number;
}

export class SchemaDefault implements Schema {
    warmup = 0;
    exercise = new ExerciseDefault();
    exercises = [];
    pauseReps = 0;
    pauseSets = 0;
    intervalReps = 0;
    intervalDuration = 0;
    intervalPause = 0;
}