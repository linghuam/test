/*
*栅格图
*/
define("leaflet/rasterLayer",["leaflet"],function(L){

    // var data = {"ret": 0,"msg": {"record_time": 1486918380,"content": [{"lo": 129,"la": 37,"v": 3},{"lo": 129,"la": 36,"v": 17},{"lo": 129,"la": 35,"v": 903},{"lo": 129,"la": 34,"v": 58},{"lo": 129,"la": 33,"v": 64},{"lo": 129,"la": 32,"v": 43},{"lo": 129,"la": 31,"v": 17},{"lo": 129,"la": 30,"v": 46},{"lo": 129,"la": 29,"v": 12},{"lo": 129,"la": 28,"v": 13},{"lo": 129,"la": 27,"v": 6},{"lo": 129,"la": 26,"v": 1},{"lo": 129,"la": 21,"v": 1},{"lo": 129,"la": 16,"v": 1},{"lo": 129,"la": 14,"v": 1},{"lo": 129,"la": 11,"v": 1},{"lo": 129,"la": 7,"v": 1},{"lo": 128,"la": 37,"v": 2},{"lo": 128,"la": 36,"v": 1},{"lo": 128,"la": 35,"v": 201},{"lo": 128,"la": 34,"v": 578},{"lo": 128,"la": 33,"v": 112},{"lo": 128,"la": 32,"v": 1},{"lo": 128,"la": 31,"v": 5},{"lo": 128,"la": 29,"v": 5},{"lo": 128,"la": 28,"v": 8},{"lo": 128,"la": 27,"v": 8},{"lo": 128,"la": 26,"v": 24},{"lo": 128,"la": 24,"v": 1},{"lo": 128,"la": 23,"v": 1},{"lo": 128,"la": 22,"v": 1},{"lo": 128,"la": 21,"v": 1},{"lo": 128,"la": 19,"v": 1},{"lo": 128,"la": 18,"v": 2},{"lo": 128,"la": 16,"v": 1},{"lo": 128,"la": 13,"v": 1},{"lo": 128,"la": 12,"v": 2},{"lo": 128,"la": 11,"v": 3},{"lo": 128,"la": 10,"v": 1},{"lo": 128,"la": 9,"v": 1},{"lo": 128,"la": 6,"v": 1},{"lo": 127,"la": 34,"v": 454},{"lo": 127,"la": 33,"v": 14},{"lo": 127,"la": 32,"v": 3},{"lo": 127,"la": 31,"v": 4},{"lo": 127,"la": 30,"v": 1},{"lo": 127,"la": 29,"v": 2},{"lo": 127,"la": 28,"v": 2},{"lo": 127,"la": 27,"v": 4},{"lo": 127,"la": 26,"v": 127},{"lo": 127,"la": 25,"v": 5},{"lo": 127,"la": 24,"v": 1},{"lo": 127,"la": 23,"v": 1},{"lo": 127,"la": 22,"v": 1},{"lo": 127,"la": 18,"v": 3},{"lo": 127,"la": 16,"v": 1},{"lo": 127,"la": 15,"v": 2},{"lo": 127,"la": 14,"v": 2},{"lo": 127,"la": 13,"v": 2},{"lo": 127,"la": 10,"v": 2},{"lo": 127,"la": 9,"v": 1},{"lo": 127,"la": 8,"v": 6},{"lo": 127,"la": 7,"v": 5},{"lo": 127,"la": 6,"v": 1},{"lo": 126,"la": 37,"v": 68},{"lo": 126,"la": 36,"v": 25},{"lo": 126,"la": 35,"v": 8},{"lo": 126,"la": 34,"v": 358},{"lo": 126,"la": 33,"v": 12},{"lo": 126,"la": 32,"v": 3},{"lo": 126,"la": 31,"v": 2},{"lo": 126,"la": 30,"v": 2},{"lo": 126,"la": 28,"v": 4},{"lo": 126,"la": 27,"v": 2},{"lo": 126,"la": 26,"v": 3},{"lo": 126,"la": 25,"v": 2},{"lo": 126,"la": 24,"v": 4},{"lo": 126,"la": 23,"v": 1},{"lo": 126,"la": 22,"v": 3},{"lo": 126,"la": 21,"v": 1},{"lo": 126,"la": 20,"v": 1},{"lo": 126,"la": 19,"v": 1},{"lo": 126,"la": 16,"v": 2},{"lo": 126,"la": 15,"v": 2},{"lo": 126,"la": 14,"v": 3},{"lo": 126,"la": 13,"v": 4},{"lo": 126,"la": 12,"v": 3},{"lo": 126,"la": 11,"v": 3},{"lo": 126,"la": 10,"v": 1},{"lo": 126,"la": 9,"v": 6},{"lo": 126,"la": 8,"v": 1},{"lo": 126,"la": 7,"v": 2},{"lo": 126,"la": 6,"v": 1},{"lo": 125,"la": 38,"v": 2},{"lo": 125,"la": 37,"v": 1},{"lo": 125,"la": 36,"v": 3},{"lo": 125,"la": 35,"v": 2},{"lo": 125,"la": 34,"v": 20},{"lo": 125,"la": 33,"v": 5},{"lo": 125,"la": 32,"v": 2},{"lo": 125,"la": 31,"v": 1},{"lo": 125,"la": 30,"v": 3},{"lo": 125,"la": 29,"v": 1},{"lo": 125,"la": 28,"v": 4},{"lo": 125,"la": 27,"v": 4},{"lo": 125,"la": 26,"v": 1},{"lo": 125,"la": 25,"v": 2},{"lo": 125,"la": 24,"v": 10},{"lo": 125,"la": 23,"v": 3},{"lo": 125,"la": 19,"v": 1},{"lo": 125,"la": 18,"v": 3},{"lo": 125,"la": 15,"v": 1},{"lo": 125,"la": 11,"v": 2},{"lo": 125,"la": 10,"v": 4},{"lo": 125,"la": 9,"v": 26},{"lo": 125,"la": 7,"v": 21},{"lo": 125,"la": 6,"v": 14},{"lo": 124,"la": 40,"v": 1},{"lo": 124,"la": 39,"v": 56},{"lo": 124,"la": 38,"v": 3},{"lo": 124,"la": 35,"v": 4},{"lo": 124,"la": 34,"v": 1},{"lo": 124,"la": 32,"v": 4},{"lo": 124,"la": 29,"v": 1},{"lo": 124,"la": 27,"v": 1},{"lo": 124,"la": 26,"v": 3},{"lo": 124,"la": 25,"v": 3},{"lo": 124,"la": 24,"v": 18},{"lo": 124,"la": 23,"v": 4},{"lo": 124,"la": 22,"v": 3},{"lo": 124,"la": 21,"v": 1},{"lo": 124,"la": 20,"v": 1},{"lo": 124,"la": 19,"v": 2},{"lo": 124,"la": 13,"v": 1},{"lo": 124,"la": 12,"v": 11},{"lo": 124,"la": 11,"v": 9},{"lo": 124,"la": 10,"v": 18},{"lo": 124,"la": 9,"v": 2},{"lo": 124,"la": 8,"v": 23},{"lo": 124,"la": 6,"v": 1},{"lo": 123,"la": 39,"v": 105},{"lo": 123,"la": 38,"v": 43},{"lo": 123,"la": 37,"v": 85},{"lo": 123,"la": 36,"v": 17},{"lo": 123,"la": 34,"v": 2},{"lo": 123,"la": 33,"v": 3},{"lo": 123,"la": 32,"v": 8},{"lo": 123,"la": 31,"v": 9},{"lo": 123,"la": 30,"v": 54},{"lo": 123,"la": 29,"v": 26},{"lo": 123,"la": 28,"v": 2},{"lo": 123,"la": 26,"v": 3},{"lo": 123,"la": 25,"v": 13},{"lo": 123,"la": 24,"v": 15},{"lo": 123,"la": 23,"v": 4},{"lo": 123,"la": 22,"v": 5},{"lo": 123,"la": 19,"v": 1},{"lo": 123,"la": 16,"v": 1},{"lo": 123,"la": 13,"v": 1},{"lo": 123,"la": 12,"v": 5},{"lo": 123,"la": 11,"v": 11},{"lo": 123,"la": 10,"v": 112},{"lo": 123,"la": 9,"v": 12},{"lo": 123,"la": 8,"v": 9},{"lo": 123,"la": 6,"v": 4},{"lo": 122,"la": 41,"v": 1},{"lo": 122,"la": 40,"v": 79},{"lo": 122,"la": 39,"v": 91},{"lo": 122,"la": 38,"v": 112},{"lo": 122,"la": 37,"v": 463},{"lo": 122,"la": 36,"v": 921},{"lo": 122,"la": 35,"v": 12},{"lo": 122,"la": 34,"v": 15},{"lo": 122,"la": 33,"v": 70},{"lo": 122,"la": 32,"v": 59},{"lo": 122,"la": 31,"v": 634},{"lo": 122,"la": 30,"v": 2739},{"lo": 122,"la": 29,"v": 3490},{"lo": 122,"la": 28,"v": 224},{"lo": 122,"la": 27,"v": 5},{"lo": 122,"la": 26,"v": 1},{"lo": 122,"la": 25,"v": 36},{"lo": 122,"la": 24,"v": 60},{"lo": 122,"la": 23,"v": 21},{"lo": 122,"la": 22,"v": 7},{"lo": 122,"la": 21,"v": 4},{"lo": 122,"la": 20,"v": 1},{"lo": 122,"la": 19,"v": 1},{"lo": 122,"la": 17,"v": 1},{"lo": 122,"la": 13,"v": 1},{"lo": 122,"la": 12,"v": 5},{"lo": 122,"la": 11,"v": 3},{"lo": 122,"la": 10,"v": 16},{"lo": 122,"la": 9,"v": 2},{"lo": 122,"la": 8,"v": 3},{"lo": 122,"la": 7,"v": 1},{"lo": 122,"la": 6,"v": 9},{"lo": 121,"la": 40,"v": 126},{"lo": 121,"la": 39,"v": 207},{"lo": 121,"la": 38,"v": 578},{"lo": 121,"la": 37,"v": 311},{"lo": 121,"la": 36,"v": 115},{"lo": 121,"la": 35,"v": 31},{"lo": 121,"la": 34,"v": 38},{"lo": 121,"la": 33,"v": 123},{"lo": 121,"la": 32,"v": 249},{"lo": 121,"la": 31,"v": 3273},{"lo": 121,"la": 30,"v": 887},{"lo": 121,"la": 29,"v": 1310},{"lo": 121,"la": 28,"v": 2352},{"lo": 121,"la": 27,"v": 1106},{"lo": 121,"la": 26,"v": 15},{"lo": 121,"la": 25,"v": 293},{"lo": 121,"la": 24,"v": 51},{"lo": 121,"la": 23,"v": 9},{"lo": 121,"la": 22,"v": 11},{"lo": 121,"la": 21,"v": 6},{"lo": 121,"la": 20,"v": 2},{"lo": 121,"la": 19,"v": 3},{"lo": 121,"la": 13,"v": 55},{"lo": 121,"la": 12,"v": 14},{"lo": 121,"la": 11,"v": 11},{"lo": 121,"la": 10,"v": 7},{"lo": 121,"la": 9,"v": 3},{"lo": 121,"la": 8,"v": 5},{"lo": 121,"la": 7,"v": 2},{"lo": 121,"la": 6,"v": 5},{"lo": 120,"la": 40,"v": 28},{"lo": 120,"la": 39,"v": 78},{"lo": 120,"la": 38,"v": 266},{"lo": 120,"la": 37,"v": 202},{"lo": 120,"la": 36,"v": 232},{"lo": 120,"la": 35,"v": 254},{"lo": 120,"la": 34,"v": 297},{"lo": 120,"la": 33,"v": 428},{"lo": 120,"la": 32,"v": 1337},{"lo": 120,"la": 31,"v": 2621},{"lo": 120,"la": 30,"v": 1400},{"lo": 120,"la": 29,"v": 1},{"lo": 120,"la": 28,"v": 21},{"lo": 120,"la": 27,"v": 599},{"lo": 120,"la": 26,"v": 687},{"lo": 120,"la": 25,"v": 129},{"lo": 120,"la": 24,"v": 114},{"lo": 120,"la": 23,"v": 18},{"lo": 120,"la": 22,"v": 512},{"lo": 120,"la": 21,"v": 2},{"lo": 120,"la": 20,"v": 3},{"lo": 120,"la": 19,"v": 7},{"lo": 120,"la": 18,"v": 7},{"lo": 120,"la": 17,"v": 4},{"lo": 120,"la": 16,"v": 2},{"lo": 120,"la": 14,"v": 95},{"lo": 120,"la": 13,"v": 41},{"lo": 120,"la": 12,"v": 11},{"lo": 120,"la": 11,"v": 1},{"lo": 120,"la": 10,"v": 7},{"lo": 120,"la": 9,"v": 10},{"lo": 120,"la": 8,"v": 7},{"lo": 120,"la": 7,"v": 10},{"lo": 120,"la": 6,"v": 2},{"lo": 119,"la": 40,"v": 2},{"lo": 119,"la": 39,"v": 332},{"lo": 119,"la": 38,"v": 294},{"lo": 119,"la": 37,"v": 244},{"lo": 119,"la": 36,"v": 1},{"lo": 119,"la": 35,"v": 585},{"lo": 119,"la": 34,"v": 676},{"lo": 119,"la": 33,"v": 627},{"lo": 119,"la": 32,"v": 2952},{"lo": 119,"la": 31,"v": 193},{"lo": 119,"la": 30,"v": 82},{"lo": 119,"la": 29,"v": 25},{"lo": 119,"la": 26,"v": 659},{"lo": 119,"la": 25,"v": 496},{"lo": 119,"la": 24,"v": 96},{"lo": 119,"la": 23,"v": 104},{"lo": 119,"la": 22,"v": 49},{"lo": 119,"la": 21,"v": 1},{"lo": 119,"la": 20,"v": 1},{"lo": 119,"la": 19,"v": 1},{"lo": 119,"la": 18,"v": 6},{"lo": 119,"la": 17,"v": 12},{"lo": 119,"la": 16,"v": 13},{"lo": 119,"la": 15,"v": 25},{"lo": 119,"la": 14,"v": 11},{"lo": 119,"la": 13,"v": 7},{"lo": 119,"la": 12,"v": 1},{"lo": 119,"la": 10,"v": 1},{"lo": 119,"la": 9,"v": 1},{"lo": 119,"la": 7,"v": 4},{"lo": 119,"la": 6,"v": 5},{"lo": 118,"la": 40,"v": 1},{"lo": 118,"la": 39,"v": 116},{"lo": 118,"la": 38,"v": 692},{"lo": 118,"la": 37,"v": 49},{"lo": 118,"la": 36,"v": 1},{"lo": 118,"la": 34,"v": 62},{"lo": 118,"la": 33,"v": 889},{"lo": 118,"la": 32,"v": 747},{"lo": 118,"la": 31,"v": 1649},{"lo": 118,"la": 29,"v": 5},{"lo": 118,"la": 28,"v": 2},{"lo": 118,"la": 25,"v": 59},{"lo": 118,"la": 24,"v": 1116},{"lo": 118,"la": 23,"v": 25},{"lo": 118,"la": 22,"v": 2},{"lo": 118,"la": 21,"v": 1},{"lo": 118,"la": 18,"v": 3},{"lo": 118,"la": 17,"v": 2},{"lo": 118,"la": 16,"v": 1},{"lo": 118,"la": 15,"v": 3},{"lo": 118,"la": 14,"v": 3},{"lo": 118,"la": 13,"v": 1},{"lo": 118,"la": 12,"v": 2},{"lo": 118,"la": 11,"v": 3},{"lo": 118,"la": 9,"v": 2},{"lo": 118,"la": 8,"v": 2},{"lo": 118,"la": 7,"v": 1},{"lo": 118,"la": 6,"v": 1},{"lo": 117,"la": 39,"v": 47},{"lo": 117,"la": 38,"v": 574},{"lo": 117,"la": 37,"v": 1},{"lo": 117,"la": 36,"v": 1},{"lo": 117,"la": 35,"v": 1},{"lo": 117,"la": 34,"v": 271},{"lo": 117,"la": 33,"v": 1},{"lo": 117,"la": 32,"v": 3},{"lo": 117,"la": 31,"v": 318},{"lo": 117,"la": 30,"v": 964},{"lo": 117,"la": 29,"v": 1},{"lo": 117,"la": 24,"v": 114},{"lo": 117,"la": 23,"v": 392},{"lo": 117,"la": 22,"v": 23},{"lo": 117,"la": 21,"v": 1},{"lo": 117,"la": 20,"v": 1},{"lo": 117,"la": 18,"v": 5},{"lo": 117,"la": 17,"v": 6},{"lo": 117,"la": 16,"v": 3},{"lo": 117,"la": 15,"v": 2},{"lo": 117,"la": 14,"v": 3},{"lo": 117,"la": 10,"v": 1},{"lo": 117,"la": 9,"v": 4},{"lo": 117,"la": 8,"v": 5},{"lo": 117,"la": 7,"v": 1},{"lo": 116,"la": 43,"v": 1},{"lo": 116,"la": 38,"v": 1},{"lo": 116,"la": 35,"v": 5},{"lo": 116,"la": 34,"v": 43},{"lo": 116,"la": 30,"v": 297},{"lo": 116,"la": 29,"v": 732},{"lo": 116,"la": 28,"v": 3},{"lo": 116,"la": 23,"v": 207},{"lo": 116,"la": 22,"v": 49},{"lo": 116,"la": 21,"v": 10},{"lo": 116,"la": 18,"v": 2},{"lo": 116,"la": 17,"v": 5},{"lo": 116,"la": 16,"v": 6},{"lo": 116,"la": 15,"v": 2},{"lo": 116,"la": 12,"v": 1},{"lo": 116,"la": 8,"v": 5},{"lo": 116,"la": 7,"v": 7},{"lo": 116,"la": 6,"v": 8},{"lo": 115,"la": 38,"v": 1},{"lo": 115,"la": 32,"v": 1},{"lo": 115,"la": 30,"v": 203},{"lo": 115,"la": 29,"v": 523},{"lo": 115,"la": 28,"v": 93},{"lo": 115,"la": 26,"v": 1},{"lo": 115,"la": 22,"v": 309},{"lo": 115,"la": 21,"v": 17},{"lo": 115,"la": 15,"v": 3},{"lo": 115,"la": 14,"v": 4},{"lo": 115,"la": 13,"v": 3},{"lo": 115,"la": 8,"v": 3},{"lo": 115,"la": 7,"v": 5},{"lo": 115,"la": 6,"v": 6},{"lo": 114,"la": 30,"v": 800},{"lo": 114,"la": 29,"v": 1},{"lo": 114,"la": 23,"v": 17},{"lo": 114,"la": 22,"v": 1746},{"lo": 114,"la": 21,"v": 155},{"lo": 114,"la": 20,"v": 2},{"lo": 114,"la": 17,"v": 3},{"lo": 114,"la": 14,"v": 4},{"lo": 114,"la": 13,"v": 5},{"lo": 114,"la": 12,"v": 2},{"lo": 114,"la": 7,"v": 4},{"lo": 114,"la": 6,"v": 4},{"lo": 113,"la": 30,"v": 47},{"lo": 113,"la": 29,"v": 945},{"lo": 113,"la": 25,"v": 1},{"lo": 113,"la": 24,"v": 17},{"lo": 113,"la": 23,"v": 957},{"lo": 113,"la": 22,"v": 4320},{"lo": 113,"la": 21,"v": 466},{"lo": 113,"la": 20,"v": 4},{"lo": 113,"la": 17,"v": 2},{"lo": 113,"la": 16,"v": 4},{"lo": 113,"la": 15,"v": 1},{"lo": 113,"la": 14,"v": 1},{"lo": 113,"la": 13,"v": 2},{"lo": 113,"la": 12,"v": 6},{"lo": 113,"la": 11,"v": 2},{"lo": 113,"la": 9,"v": 1},{"lo": 113,"la": 6,"v": 2},{"lo": 112,"la": 38,"v": 1},{"lo": 112,"la": 30,"v": 400},{"lo": 112,"la": 29,"v": 259},{"lo": 112,"la": 28,"v": 26},{"lo": 112,"la": 24,"v": 1},{"lo": 112,"la": 23,"v": 657},{"lo": 112,"la": 22,"v": 314},{"lo": 112,"la": 21,"v": 181},{"lo": 112,"la": 20,"v": 6},{"lo": 112,"la": 13,"v": 2},{"lo": 112,"la": 12,"v": 1},{"lo": 112,"la": 11,"v": 3},{"lo": 112,"la": 10,"v": 3},{"lo": 112,"la": 6,"v": 1},{"lo": 111,"la": 43,"v": 1},{"lo": 111,"la": 37,"v": 1},{"lo": 111,"la": 33,"v": 1},{"lo": 111,"la": 32,"v": 1},{"lo": 111,"la": 30,"v": 881},{"lo": 111,"la": 29,"v": 6},{"lo": 111,"la": 23,"v": 31},{"lo": 111,"la": 22,"v": 2},{"lo": 111,"la": 21,"v": 628},{"lo": 111,"la": 20,"v": 31},{"lo": 111,"la": 17,"v": 3},{"lo": 111,"la": 16,"v": 1},{"lo": 111,"la": 13,"v": 2},{"lo": 111,"la": 12,"v": 5},{"lo": 111,"la": 11,"v": 5},{"lo": 111,"la": 10,"v": 4},{"lo": 111,"la": 9,"v": 3},{"lo": 111,"la": 7,"v": 1},{"lo": 110,"la": 31,"v": 46},{"lo": 110,"la": 30,"v": 335},{"lo": 110,"la": 23,"v": 3},{"lo": 110,"la": 21,"v": 199},{"lo": 110,"la": 20,"v": 345},{"lo": 110,"la": 19,"v": 35},{"lo": 110,"la": 15,"v": 2},{"lo": 110,"la": 14,"v": 2},{"lo": 110,"la": 13,"v": 1},{"lo": 110,"la": 12,"v": 1},{"lo": 110,"la": 11,"v": 8},{"lo": 110,"la": 10,"v": 2},{"lo": 110,"la": 9,"v": 4},{"lo": 110,"la": 8,"v": 3},{"lo": 110,"la": 7,"v": 5},{"lo": 110,"la": 6,"v": 2},{"lo": 109,"la": 31,"v": 138},{"lo": 109,"la": 30,"v": 22},{"lo": 109,"la": 23,"v": 16},{"lo": 109,"la": 22,"v": 4},{"lo": 109,"la": 21,"v": 570},{"lo": 109,"la": 20,"v": 97},{"lo": 109,"la": 19,"v": 310},{"lo": 109,"la": 18,"v": 419},{"lo": 109,"la": 17,"v": 4},{"lo": 109,"la": 15,"v": 1},{"lo": 109,"la": 13,"v": 1},{"lo": 109,"la": 12,"v": 3},{"lo": 109,"la": 11,"v": 5},{"lo": 109,"la": 10,"v": 2},{"lo": 109,"la": 9,"v": 6},{"lo": 109,"la": 8,"v": 8},{"lo": 109,"la": 7,"v": 7},{"lo": 109,"la": 6,"v": 3},{"lo": 108,"la": 30,"v": 233},{"lo": 108,"la": 22,"v": 1},{"lo": 108,"la": 21,"v": 367},{"lo": 108,"la": 20,"v": 32},{"lo": 108,"la": 19,"v": 188},{"lo": 108,"la": 18,"v": 34},{"lo": 108,"la": 16,"v": 55},{"lo": 108,"la": 15,"v": 1},{"lo": 108,"la": 11,"v": 1},{"lo": 108,"la": 10,"v": 2},{"lo": 108,"la": 9,"v": 1},{"lo": 108,"la": 8,"v": 2},{"lo": 108,"la": 7,"v": 8},{"lo": 108,"la": 6,"v": 10},{"lo": 107,"la": 30,"v": 73},{"lo": 107,"la": 29,"v": 314},{"lo": 107,"la": 20,"v": 41},{"lo": 107,"la": 17,"v": 8},{"lo": 107,"la": 12,"v": 5},{"lo": 107,"la": 10,"v": 13},{"lo": 107,"la": 9,"v": 5},{"lo": 107,"la": 8,"v": 2},{"lo": 107,"la": 7,"v": 3},{"lo": 107,"la": 6,"v": 7},{"lo": 106,"la": 29,"v": 274},{"lo": 106,"la": 20,"v": 49},{"lo": 106,"la": 18,"v": 3},{"lo": 106,"la": 15,"v": 1},{"lo": 106,"la": 10,"v": 2},{"lo": 106,"la": 9,"v": 3},{"lo": 106,"la": 8,"v": 4},{"lo": 106,"la": 7,"v": 3},{"lo": 106,"la": 6,"v": 1},{"lo": 105,"la": 29,"v": 17},{"lo": 105,"la": 28,"v": 55},{"lo": 105,"la": 18,"v": 1},{"lo": 105,"la": 8,"v": 3},{"lo": 104,"la": 28,"v": 1},{"lo": 104,"la": 26,"v": 1},{"lo": 104,"la": 8,"v": 3},{"lo": 104,"la": 6,"v": 2},{"lo": 103,"la": 37,"v": 1},{"lo": 103,"la": 8,"v": 5},{"lo": 103,"la": 7,"v": 4},{"lo": 103,"la": 6,"v": 1},{"lo": 102,"la": 12,"v": 1},{"lo": 102,"la": 10,"v": 1},{"lo": 102,"la": 9,"v": 3},{"lo": 102,"la": 8,"v": 3},{"lo": 102,"la": 7,"v": 1},{"lo": 101,"la": 12,"v": 8},{"lo": 101,"la": 11,"v": 13},{"lo": 101,"la": 10,"v": 3},{"lo": 101,"la": 9,"v": 13},{"lo": 101,"la": 8,"v": 5},{"lo": 101,"la": 7,"v": 1},{"lo": 100,"la": 13,"v": 175},{"lo": 100,"la": 12,"v": 79},{"lo": 100,"la": 11,"v": 3},{"lo": 100,"la": 10,"v": 1},{"lo": 100,"la": 9,"v": 3},{"lo": 100,"la": 8,"v": 5},{"lo": 100,"la": 7,"v": 15},{"lo": 99,"la": 22,"v": 2},{"lo": 99,"la": 17,"v": 1},{"lo": 99,"la": 13,"v": 1},{"lo": 99,"la": 11,"v": 1},{"lo": 99,"la": 10,"v": 8},{"lo": 99,"la": 9,"v": 7},{"lo": 99,"la": 8,"v": 1},{"lo": 99,"la": 6,"v": 5},{"lo": 98,"la": 8,"v": 12},{"lo": 98,"la": 7,"v": 5},{"lo": 97,"la": 37,"v": 1},{"lo": 97,"la": 14,"v": 1},{"lo": 97,"la": 12,"v": 2},{"lo": 97,"la": 9,"v": 1},{"lo": 97,"la": 8,"v": 8},{"lo": 97,"la": 7,"v": 4},{"lo": 97,"la": 6,"v": 6},{"lo": 96,"la": 16,"v": 14},{"lo": 96,"la": 15,"v": 3},{"lo": 96,"la": 14,"v": 2},{"lo": 96,"la": 13,"v": 2},{"lo": 96,"la": 12,"v": 3},{"lo": 96,"la": 9,"v": 3},{"lo": 96,"la": 8,"v": 1},{"lo": 96,"la": 6,"v": 4}        ]    }};

	L.GridLayer.RasterLayer = L.GridLayer.extend({
        
        initialize: function (options) {
		    L.GridLayer.prototype.initialize.call(this,options);		    
	    },
         
        //重写方法  获取切片
        createTile: function (coords) {
        	var tile = document.createElement('div');           
            var pts = this.getPointsInRaster(coords);
            if(!pts.length){            	
                 tile.style.opacity = 0;                
            }else{
               var sum = this.calculateSumValue(pts);
               tile.innerHTML = sum;              
               tile.style.textAlign = "center";
               tile.style.lineHeight = this.options.tileSize+"px";
               tile.style.color="#000";
               tile.style.backgroundColor= this.getBgColor(sum);
               tile.style.fontSize = "16px";
               tile.style.fontWeight = "bold";
            }
            return tile;
        },
        
        //自定义方法 根据值获取背景颜色
        getBgColor:function(value){

        	if(value<=10){
        		return "#91E201";
        	}else if(value>10 && value<=50){
                return "#009E01";
        	}else if(value>50 && value<=100){
        		return "#FFFF01";
        	}else if(value>100 && value<=500){
        		return "#FCCF00";
        	}else if(value>500 && value<=1000){
        		return "#FD910B";
        	}else if(value>1000 && value<=5000){
        		return "#FA5E11";
        	}else if(value>5000){
        		return "#F11415";
        	}

        },
        
        //自定义方法 计算平均值
        calculateMeanValue:function(pts){
        	var len = pts.length;
        	var sum =0;
        	for(var i=0;i<len;i++){
        		sum += pts[i].v;
        	}
        	return parseInt(sum/len);

        },

        //自定义方法 求和
        calculateSumValue:function(pts){
        	var len = pts.length;
        	var sum =0;
        	for(var i=0;i<len;i++){
        		sum += pts[i].v;
        	}
        	return parseInt(sum);

        }, 

        //自定义方法 求最大值
        calculateMaxValue:function(pts){
        	var len = pts.length;
        	var max =0;
        	for(var i=0;i<len;i++){
        		var val = pts[i].v;
        		if(val>max) max = val;
        	}
        	return max;

        },  

        //自定义方法 求最小值
        calculateMinValue:function(pts){
        	var len = pts.length;
        	var min =0;
        	for(var i=0;i<len;i++){
        		var val = pts[i].v;
        		if(val<min) min = val;
        	}
        	return min;

        },                      
        
        //自定义方法 通过经纬度和缩放级别获取对应的栅格行列号
        getCoorBylatlng:function(latlng){
        	var  coor = {};
        	var pt = this._map.project(latlng,this._tileZoom);
        	coor.x = parseInt(pt.x/this.options.tileSize);
        	coor.y = parseInt(pt.y/this.options.tileSize);
        	coor.z = this._map.getZoom();
        	return coor;
        },
        
        //自定义方法 获取在栅格内的所有点
        getPointsInRaster:function(coords){
        	var pts =[];
        	var data = this.options.data;
            for(var i=0,len=data.length;i<len;i++){
            	var obj = data[i];
            	var latlng = L.latLng(obj.lat/600000,obj.lon/600000);
            	var cor = this.getCoorBylatlng(latlng);
            	if(cor.x === coords.x && cor.y === coords.y){
                    pts.push(obj);
            	}
            }
            return pts;
        }

	});
	
	L.gridLayer.rasterLayer = function(options) {
		return new L.GridLayer.RasterLayer(options);
	};

});
