#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char * format_number(char * number, char begin, char divider) {
    int length = strlen(number);
    int formatted_length = length + length / 3 + 2;
    char * formatted_number = (char *) malloc(formatted_length * sizeof(char));

    int j = 0, comma_count = length % 3;
    formatted_number[j++] = begin;

    for (int i = 0; i < length; i++) {
        formatted_number[j++] = number[i];

        if (i < length - 1 && (i + 1) % 3 == comma_count) 
            formatted_number[j++] = divider;   
    }

    formatted_number[j] = '\0';
    return formatted_number;
}

int main(int argc, char* argv[]) {

    FILE * output_file = fopen(argv[1], "w");
    int c = fgetc(stdin);
    char * number = (char *) malloc(10 * sizeof(char));
    int index = 0;

    while (c != EOF) {
        if (c != ' ') 
            number[index++] = c;
        else if (index > 0) {
            number[index++] = '\0';

            char * formatted_number = format_number(number, argv[2][0], argv[3][0]);

            fprintf(output_file, "%s ", formatted_number);
            free(formatted_number);

            index = 0;
        }

        c = fgetc(stdin);
    }

    fclose(output_file);
    free(number);

    return 0;
}