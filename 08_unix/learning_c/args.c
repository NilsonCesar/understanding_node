#include <stdio.h>

int main(int argc, char* argv[]) {
  // argc = argument count
  // argv = argument vector
  
  for (int i = 0; i < argc; i++)
    printf("Argument %i is: %s\n", i, argv[i]);
  return 0;
}
