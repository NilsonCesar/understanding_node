#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    fprintf(stdout, "Some text from stdout. Hello from C!\n");
    fprintf(stderr, "Some text from stderr. Hello from C!\n");

    char c = fgetc(stdin);
    while (c != EOF) {
        fprintf(stdout, "%c", c);
        fflush(stdout);
        c = fgetc(stdin);
    }

    return 0;
}