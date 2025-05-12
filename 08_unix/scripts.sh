# ls
alias runp='node playground.js'

myFunc() {
  x=120
  y=500
  echo $(($x+$y))
  echo $1
}

myFunc "hello world!"
