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
void printUsage(char* argv);

int main(int argc, char* argv[]) {
    if (argc != 2) {
        printUsage(argv[0]);
        exit(1);
    }

    uint highest = findTotalThreeHighestGroups(argv[1]);
    printf("Maximum: %u calories\n", highest);

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
    uint maximum = 0;
    uint currentValue = 0;
    char buffer[BUFFER_SIZE] = "";
    while(fgets(buffer, BUFFER_SIZE, file) != NULL) {
        // Empty line
        if (strlen(buffer) == 1) {
            if (currentValue > maximum) {
                maximum = currentValue;
            }

            currentValue = 0;
            continue;
        }

        currentValue += atoi(buffer);
    }

    // Close file
    fclose(file);

    return maximum;
}

void printUsage(char* argv) {
    printf("Usage: ./a.out fileName\n");
}