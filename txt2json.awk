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
  PAGES = "Pages";
  PAGES_REGEX = "^" SPACES_STAR SPECIAL_START SPACES_STAR PAGES SPACES_STAR \
    SPECIAL_END SPACES_STAR "$";
  # /\s*{{\s*Pages\s*}}\s*
  SEGMENTS = "Segments";
  SEGMENTS_REGEX = ""

  reading_page = 0;
  reading_segment = 0;
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

function open_pages() {
  print TAB "\"" PAGES "\": ["
}

function close_pages() {
  print 
}




is_page($0) {
  if(reading_page) {
    
  }
  reading_page = 1;
}

END {
  if(reading_page) {
    close_page();
  }
}