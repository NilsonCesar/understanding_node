#include <stdio.h>
#include <stdlib.h>

int main() {
  // int is 4 bytes (32 bits) - signed
  int a = 3500;
  /**
   * a: number
   * &a: address of a (normally in hexadecimal)
  */

  int * my_pointer = &a;
  // type casting
  my_pointer = (char *) my_pointer;

  printf("%p\n", my_pointer);

  // stack (8 MB), heap
  int * allocated_memory = malloc(12); // 12 bytes
  
  for (int i = 0; i < 3; i++) {
    allocated_memory[i] = 1937208183;
  }

  for (int i = 0; i < 3; i++) {
    printf("Number is: %d\n", allocated_memory[i]);
  }

  char * char_allocated_memory = (char *) allocated_memory;

  for (int i = 0; i < 12; i++) {
    printf("Char is: %c\n", char_allocated_memory[i]);
  }

  return 0;
}
