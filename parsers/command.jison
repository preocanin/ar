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
"notI"                  return 'NOTI';
"impE"                  return 'IMPE';
"notE"                  return 'NOTE';
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
            | ERULE erule end
              {
                  return { type: $2, argument: 1 };
              }
            | ERULE erule number end
              {
                  return { type: $2, argument: $3 };
              }
            | BACK end 
              {   
                  return { type: "back", argument: 1 }; 
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
              { $$ = yytext; }
            | NOTI
              { $$ = yytext; }
            ;

erule       : IMPE
              { $$ = yytext; }
            | NOTE
              { $$ = yytext; }
            ;

number      : NUMBER 
              { 
                  $$ = Number(yytext); 
              }
            ;

end         : NL
            | EOF
            ;
