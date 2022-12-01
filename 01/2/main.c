/*
    How to execute:
    gcc main.c -o a.out && ./a.out input.txt
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define BUFFER_SIZE (256)

typedef unsigned int uint;

uint findTotalThreeHighestGroups(char* fileName);
uint findIndexOfLowest(int size, uint array[]);
void printUsage(char* argv);

int main(int argc, char* argv[]) {
    if (argc != 2) {
        printUsage(argv[0]);
        exit(1);
    }

    uint total = findTotalThreeHighestGroups(argv[1]);
    printf("Total three highest groups: %u calories\n", total);

    return 0;
}

uint findTotalThreeHighestGroups(char* fileName) {
    // Open file
    FILE* file = fopen(fileName, "r");
    if (file == NULL) {
        perror("Error opening file");
        exit(-1);
    }

    // Read file and look for maximum
    uint maximum[3] = {0};
    uint currentValue = 0;
    uint lowest = 0;
    char buffer[BUFFER_SIZE] = "";
    while(fgets(buffer, BUFFER_SIZE, file) != NULL) {
        // Empty line
        if (strlen(buffer) == 1) {
            if (currentValue > maximum[lowest]) {
                maximum[lowest] = currentValue;
            }

            currentValue = 0;

            lowest = findIndexOfLowest(3, maximum);

            continue;
        }

        currentValue += atoi(buffer);
    }

    // Close file
    fclose(file);

    return maximum[0] + maximum[1] + maximum[2];
}

uint findIndexOfLowest(int size, uint array[]) {
    uint lowest = 0;
    for (int i = 1; i < size; i++) {
        if (array[i] < array[lowest]) {
            lowest = i;
        }
    }
    return lowest;
}

void printUsage(char* argv) {
    printf("Usage: ./a.out fileName\n");
}