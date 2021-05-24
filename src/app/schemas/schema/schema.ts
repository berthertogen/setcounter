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
    pauseExercise: number;
    pauseReps: number;
    intervalReps: number;
    intervalDuration: number;
    intervalPause: number;
}

export class SchemaDefault implements Schema {
    warmup = 10;
    exercise = new ExerciseDefault();
    exercises = [];
    pauseExercise = 60;
    pauseReps = 30;
    intervalReps = 14;
    intervalDuration = 20;
    intervalPause = 10;
}