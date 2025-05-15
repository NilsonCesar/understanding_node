#include <stdio.h>

int main() {
  
  // int, size_t, char, float
  // 4, 8, 1, 4

  // int a = 20, b = 30;
  // int c = a + b;
  // printf("Size of a char: %zu\n", sizeof(char));
  // printf("Size of a float: %zu\n", sizeof(float));

  // size_t t = -1ULL;
  // printf("t: %zu\n", t);

  // for(int i = 0; i < sizeof(size_t); i++)
    // printf("Address of t in %d is: %p. Value is %hhu \n", i, (&t + i), *(&t + i));
 
  // fprintf(stdout, "%d + %d = %d\n", a, b, c);
  
  char my_string[5];

  my_string[0] = 'T';
  my_string[1] = 'e';
  my_string[2] = 's';
  my_string[3] = 't';
  my_string[4] = '\0';

  char *my_other_string = "This is other string";

  printf("My string is: %s\n", my_string);
  printf("My other string is: %s\n", my_other_string);

  return 0;
}
