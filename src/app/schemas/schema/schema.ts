export interface Exercise {
    reps: number;
    sets: number;
}

export class ExerciseDefault implements Exercise {
    reps = 3;
    sets = 12;
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
    warmup = 10;
    exercise = new ExerciseDefault();
    exercises = [];
    pauseReps = 60;
    pauseSets = 30;
    intervalReps = 14;
    intervalDuration = 20;
    intervalPause = 10;
}