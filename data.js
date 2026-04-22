const EQUIPMENT = [
  {
    id: 1,
    name: "Linear Leg Press",
    type: "machine",
    category: "Legs",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-plate-loaded-linear-leg-press_1024x1024.jpg",
    exercises: ["Leg Press"]
  },
  {
    id: 2,
    name: "Iso-Lateral Row",
    type: "machine",
    category: "Back",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-plate-loaded-iso-lateral-row_1024x1024.jpg",
    exercises: ["Seated Row"]
  },
  {
    id: 3,
    name: "Seated Arm Curl",
    type: "machine",
    category: "Arms",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-seated-arm-curl_1024x1024.jpg",
    exercises: ["Bicep Curl"]
  },
  {
    id: 4,
    name: "Iso-Lateral Bench Press",
    type: "machine",
    category: "Chest",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-plate-loaded-iso-lateral-bench-press_1024x1024.jpg",
    exercises: ["Bench Press"]
  },
  {
    id: 5,
    name: "Iso-Lateral Incline Press",
    type: "machine",
    category: "Chest",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-plate-loaded-iso-lateral-incline-press_1024x1024.jpg",
    exercises: ["Incline Press"]
  },
  {
    id: 6,
    name: "Vertical Smith Machine",
    type: "machine",
    category: "Full Body",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-plate-loaded-vertical-smith-machine_1024x1024.jpg",
    exercises: ["Squat", "Bench Press", "Row"]
  },
  {
    id: 7,
    name: "Front Lat Pulldown",
    type: "machine",
    category: "Back",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-plate-loaded-iso-lateral-front-lat-pulldown_1024x1024.jpg",
    exercises: ["Lat Pulldown"]
  },
  {
    id: 8,
    name: "Shoulder Press",
    type: "machine",
    category: "Shoulders",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-plate-loaded-iso-lateral-shoulder-press_1024x1024.jpg",
    exercises: ["Shoulder Press"]
  },
  {
    id: 9,
    name: "Belt Squat",
    type: "machine",
    category: "Legs",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-plate-loaded-belt-squat_1024x1024.jpg",
    exercises: ["Squat"]
  },
  {
    id: 10,
    name: "Glute Drive",
    type: "machine",
    category: "Legs",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-plate-loaded-glute-drive_1024x1024.jpg",
    exercises: ["Hip Thrust"]
  },
  {
    id: 11,
    name: "Multi-Adjustable Bench",
    type: "bench",
    category: "Full Body",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-home-multi-adjustable-bench_1024x1024.jpg",
    exercises: ["Bench Press", "Incline Press", "Decline Press"]
  },
  {
    id: 12,
    name: "Leg Extension",
    type: "machine",
    category: "Legs",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-select-leg-extension_1024x1024.jpg",
    exercises: ["Leg Extension"]
  },
  {
    id: 13,
    name: "Seated Leg Curl",
    type: "machine",
    category: "Legs",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-select-seated-leg-curl_1024x1024.jpg",
    exercises: ["Leg Curl"]
  },
  {
    id: 14,
    name: "Hack Squat",
    type: "machine",
    category: "Legs",
    imageURL: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-plate-loaded-hack-squat_1024x1024.jpg",
    exercises: ["Squat"]
  },
  {
    id: 15,
    name: "Cable Crossover",
    type: "cable",
    category: "Chest",
    imageURL: "",
    exercises: ["Cable Fly", "Tricep Pushdown"]
  },
  {
    id: 16,
    name: "Squat Rack",
    type: "free-weight",
    category: "Legs",
    imageURL: "",
    exercises: ["Back Squat", "Front Squat"]
  },
  {
    id: 17,
    name: "Dumbbells",
    type: "free-weight",
    category: "Full Body",
    imageURL: "",
    exercises: ["DB Press", "DB Row", "DB Curl"]
  },
  {
    id: 18,
    name: "Barbell",
    type: "free-weight",
    category: "Full Body",
    imageURL: "",
    exercises: ["Bench Press", "Squat", "Deadlift"]
  }
];

const WORKOUT_PROGRAMS = {
  fundamentals: {
    name: "Fundamentals (Beginner)",
    weeks: 8,
    splits: ["Full Body", "Upper/Lower", "Body Part"]
  },
  pushPullLegs: {
    name: "Push/Pull/Legs (Intermediate)",
    weeks: 16,
    blocks: 2,
    splits: ["Legs", "Push", "Pull"]
  }
};

const EXERCISE_TEMPLATES = {
  push: [
    { id: "p1", name: "Bench Press", muscle: "Chest", sets: 4, reps: "8-10", rest: 90, equipment: [4, 11, 18], prKey: "bench_press" },
    { id: "p2", name: "Incline Press", muscle: "Chest", sets: 3, reps: "10-12", rest: 90, equipment: [5, 11], prKey: "incline_press" },
    { id: "p3", name: "Shoulder Press", muscle: "Shoulders", sets: 3, reps: "8-10", rest: 90, equipment: [8, 17], prKey: "shoulder_press" },
    { id: "p4", name: "Lateral Raise", muscle: "Shoulders", sets: 3, reps: "12-15", rest: 60, equipment: [17], prKey: "lateral_raise" },
    { id: "p5", name: "Tricep Dip", muscle: "Triceps", sets: 3, reps: "10-12", rest: 60, equipment: [15], prKey: "tricep_dip" }
  ],
  pull: [
    { id: "pl1", name: "Lat Pulldown", muscle: "Back", sets: 4, reps: "8-10", rest: 90, equipment: [7, 15], prKey: "lat_pulldown" },
    { id: "pl2", name: "Seated Row", muscle: "Back", sets: 3, reps: "10-12", rest: 90, equipment: [2, 15], prKey: "seated_row" },
    { id: "pl3", name: "Face Pull", muscle: "Back", sets: 3, reps: "15-20", rest: 60, equipment: [15], prKey: "face_pull" },
    { id: "pl4", name: "Bicep Curl", muscle: "Biceps", sets: 3, reps: "10-12", rest: 60, equipment: [3, 17, 18], prKey: "bicep_curl" }
  ],
  legs: [
    { id: "l1", name: "Squat", muscle: "Quads", sets: 4, reps: "6-8", rest: 120, equipment: [9, 14, 16, 18], prKey: "squat" },
    { id: "l2", name: "Leg Press", muscle: "Quads", sets: 3, reps: "10-12", rest: 90, equipment: [1], prKey: "leg_press" },
    { id: "l3", name: "Leg Extension", muscle: "Quads", sets: 3, reps: "12-15", rest: 60, equipment: [12], prKey: "leg_extension" },
    { id: "l4", name: "Leg Curl", muscle: "Hamstrings", sets: 3, reps: "10-12", rest: 60, equipment: [13], prKey: "leg_curl" },
    { id: "l5", name: "Hip Thrust", muscle: "Glutes", sets: 3, reps: "10-12", rest: 90, equipment: [10], prKey: "hip_thrust" },
    { id: "l6", name: "Calf Raise", muscle: "Calves", sets: 4, reps: "12-15", rest: 60, equipment: [], prKey: "calf_raise" }
  ]
};

const WEEKLY_SCHEDULE = [
  { day: "Monday", workout: "Legs" },
  { day: "Tuesday", workout: "Push" },
  { day: "Wednesday", workout: "Pull" },
  { day: "Thursday", workout: "Rest" },
  { day: "Friday", workout: "Legs" },
  { day: "Saturday", workout: "Push" },
  { day: "Sunday", workout: "Pull" }
];
