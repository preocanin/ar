%lex

%%

"|-"                    return '|-';
"T"                     return 'TRUE';
"F"                     return 'FALSE';
[a-zA-Z][a-z0-9]*\b     return 'ATOM';
","                     return ',';
"~"                     return '~';
"&"                     return '&';
"|"                     return '|';
"=>"                    return '=>';
"<=>"                   return '<=>';
"("                     return '(';
")"                     return ')';
\n                      return 'NL';
<<EOF>>                 return 'EOF';
\s+                     /* ignore whitespaces */
.                       return 'INVALID';

/lex

%left '<=>' '=>'
%left '&' '|'
%right '~'

%{
   
   var Formula = require('../../../models/formula');
   var Theorem = require('../../../models/theorem');

%}

%start theorem

%%

theorem     : assumptions '|-' formula EOF
              { 
                  var thm = new Theorem();
                  thm.assumptions = $1;
                  thm.lemma = $3;

                  return thm;
              }
            | formula EOF
              { 
                  var thm = new Theorem();
                  thm.assumptions = [];
                  thm.lemma = $1;

                  return thm;
              }

            | assumptions '|-' formula NL
              { 
                  var thm = new Theorem();
                  thm.assumptions = $1;
                  thm.lemma = $3;

                  return thm;
              }
            | formula NL
              { 
                  var thm = new Theorem();
                  thm.assumptions = [];
                  thm.lemma = $1;

                  return thm;
              }
            | EOF
              { return undefined; }
            | NL
              { return undefined; }
            ;

assumptions : formula
              { $$ = [$1]; }
            | formula ',' assumptions
              { $$ = $3.concat([$1]); }
            ;

formula     : formula '&' formula
              { $$ = new Formula.And($1,$3); }
            | formula '|' formula
              { $$ = new Formula.Or($1,$3); }
            | formula '=>' formula
              { $$ = new Formula.Imp($1,$3); }
            | formula '<=>' formula
              { $$ = new Formula.Iff($1,$3); }
            | '~' formula
              { $$ = new Formula.Not($2); }
            | '(' formula ')'
              { $$ = $2; }
            | TRUE
              { $$ = new Formula.Constant(true); }
            | FALSE
              { $$ = new Formula.Constant(false); }
            | ATOM
              { $$ = new Formula.Atom(yytext); }
            ;

end         : NL 
              {}
            | EOF 
              {}
            ;
