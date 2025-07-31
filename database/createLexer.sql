BEGIN
  CTX_DDL.CREATE_PREFERENCE('german_lexer', 'BASIC_LEXER');
  CTX_DDL.SET_ATTRIBUTE('german_lexer', 'base_letter', 'YES');
  CTX_DDL.SET_ATTRIBUTE('german_lexer', 'printjoins', '-');
END;
