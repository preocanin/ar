%lex

%%

[1-9][0-9]*\b           return 'NUMBER';
[bB][aA][cC][kK]\b      return 'BACK';
[dD][oO][nN][eE]\b      return 'DONE';
[hH][eE][lL][pP]\b      return 'HELP';
[qQ][uU][iI][tT]\b      return 'QUIT';
[rR][uU][lL][eE]\b      return 'RULE';
[eE][rR][uU][lL][eE]\b  return 'ERULE';
"impI"                  return 'IMPI';
"impE"                  return 'IMPE';
\n                      return 'NL';
<<EOF>>                 return 'EOF';
\s+                     /* ignore whitespaces */
.                       return 'INVALID';

/lex

%{

%}

%start type

%%

type        : RULE rule end
              {
                  return { type: $2 };
              }
            | RULE rule number end
              {
                  return { type: $2, argument: $3 };
              }
            | ERULE erule end
              {
                  return { type: $2, argument: 0 };
              }
            | ERULE erule number end
              {
                  return { type: $2, argument: $3 };
              }
            | BACK end 
              {   
                  return { type: "back", argument: 0 }; 
              }
            | BACK number end
              { 
                  return { type: "back", argument: $2 }; 
              }
            | DONE end
              {
                  return { type: "done" };
              }
            | HELP end
              {
                  return { type: "help" };
              }
            | QUIT end
              {
                  return { type: "quit" };
              }
            ;

rule        : IMPI
              { $$ = "impI"; }
            ;

erule       : IMPE
              { $$ = "impE"; }
            ;

number      : NUMBER 
              { 
                  $$ = Number(yytext); 
              }
            ;

end         : NL
              {}
            | EOF
              {}
            ;
