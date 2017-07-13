%lex

%%

[1-9][0-9]*\b           return 'NUMBER';
[bB][aA][cC][kK]\b      return 'BACK';
[dD][oO][nN][eE]\b      return 'DONE';
[hH][eE][lL][pP]\b      return 'HELP';
[qQ][uU][iI][tT]\b      return 'QUIT';
[rR][uU][lL][eE]\b      return 'RULE';
[eE][rR][uU][lL][eE]\b  return 'ERULE';
"assumption"            return 'ASSUMPTION';
"impI"                  return 'IMPI';
"impE"                  return 'IMPE';
"mp"                    return 'MP';
"notE"                  return 'NOTE';
"notI"                  return 'NOTI';
"conjI"                 return 'CONJI';
"conjE"                 return 'CONJE';
"disjI1"                return 'DISJI1';
"disjI2"                return 'DISJI2';
"disjE"                 return 'DISJE';
"ccontr"                return 'CCONTR';
\n                      return 'NL';
<<EOF>>                 return 'EOF';
\s+                     /* ignore whitespaces */
.                       return 'INVALID';

/lex

%{

%}

%start type

%%

type        : ASSUMPTION end
              {
                return { type: "assumption" };
              }
            | RULE rule end
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
            | CONJI
              { $$ = yytext; }
            | DISJI1
              { $$ = yytext; }
            | DISJI2
              { $$ = yytext; }
            | CCONTR
              { $$ = yytext; }
            ;

erule       : IMPE
              { $$ = yytext; }
            | MP 
              { $$ = yytext; }
            | NOTE
              { $$ = yytext; }
            | CONJE
              { $$ = yytext; }
            | DISJE
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
