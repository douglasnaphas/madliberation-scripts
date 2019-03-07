# txt2json: convert a Mad Liberation script .txt file to JSON
#  input: a text file conforming to the script format described at
#    https://github.com/douglasnaphas/madliberation-scripts
#  output: JSON that can be saved as a file and used as a script by Mad
#    Liberation
BEGIN {
  TAB="  ";
  SPECIAL_START = "{{";
  SPECIAL_END = "}}";
  SPACES_STAR = "\\s*";
  PAGE = "Page";
  PAGES = "Pages";
  PAGES_REGEX = "^" SPACES_STAR "#" SPACES_STAR SPECIAL_START SPACES_STAR \
    PAGE SPACES_STAR SPECIAL_END SPACES_STAR "$";
  # /\s*{{\s*Pages\s*}}\s*
  LINES = "Lines";
  SEGMENTS = "Segments";
  H1_REGEX = "^\\s*#\\s+";



  reading_page = 0;
  reading_segment = 0;

  open_script();
  open_pages();
}

function open_script() {
  print "{";
}
function close_script() {
  print "}";
}
function is_page(s) {
  return s ~ PAGES_REGEX;
}
function open_page() {
  print TAB TAB "{"
  open_lines();
}
function open_lines() {
  print TAB TAB TAB "\"" LINES "\": [";
}
function close_lines() {
  print TAB TAB TAB "]";
}
function close_page() {
  close_lines();
}
function close_last_page() {
  close_lines();
  print TAB TAB "}"
}
function open_pages() {
  print TAB "\"" PAGES "\": ["
}
function close_pages() {
  print TAB "]";
}
function segment_type(s) {
  
}



is_page($0) {
  if(reading_page) {
    close_page();
  }
  reading_page = 1;
  open_page();
  
}

(! is_page($0)) && $0 ~ H1_REGEX {
  print TAB TAB TAB TAB "{";
  print TAB TAB TAB TAB TAB "\"type\": \"h1\",";
  print TAB TAB TAB TAB TAB "\"Segments\": [";
}

END {
  if(reading_page) {
    close_last_page();
  }

  
  close_pages();
  close_script();
}