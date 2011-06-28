var Reparse = require('reparse');

function parse(data) {
  // Taken from XRegexp (http://xregexp.com/)
  var categories = {
    punct: "0021-00230025-002A002C-002F003A003B003F0040005B-005D005F007B007D00A100AB00B700BB00BF037E0387055A-055F0589058A05BE05C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E0964096509700DF40E4F0E5A0E5B0F04-0F120F3A-0F3D0F850FD0-0FD4104A-104F10FB1361-13681400166D166E169B169C16EB-16ED1735173617D4-17D617D8-17DA1800-180A1944194519DE19DF1A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601C3B-1C3F1C7E1C7F1CD32010-20272030-20432045-20512053-205E207D207E208D208E2329232A2768-277527C527C627E6-27EF2983-299829D8-29DB29FC29FD2CF9-2CFC2CFE2CFF2E00-2E2E2E302E313001-30033008-30113014-301F3030303D30A030FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFABEBFD3EFD3FFE10-FE19FE30-FE52FE54-FE61FE63FE68FE6AFE6BFF01-FF03FF05-FF0AFF0C-FF0FFF1AFF1BFF1FFF20FF3B-FF3DFF3FFF5BFF5DFF5F-FF65", 
    symbol: "0024002B003C-003E005E0060007C007E00A2-00A900AC00AE-00B100B400B600B800D700F702C2-02C502D2-02DF02E5-02EB02ED02EF-02FF03750384038503F604820606-0608060B060E060F06E906FD06FE07F609F209F309FA09FB0AF10B700BF3-0BFA0C7F0CF10CF20D790E3F0F01-0F030F13-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F13601390-139917DB194019E0-19FF1B61-1B6A1B74-1B7C1FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE20442052207A-207C208A-208C20A0-20B8210021012103-21062108210921142116-2118211E-2123212521272129212E213A213B2140-2144214A-214D214F2190-2328232B-23E82400-24262440-244A249C-24E92500-26CD26CF-26E126E326E8-26FF2701-27042706-2709270C-27272729-274B274D274F-27522756-275E2761-276727942798-27AF27B1-27BE27C0-27C427C7-27CA27CC27D0-27E527F0-29822999-29D729DC-29FB29FE-2B4C2B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F309B309C319031913196-319F31C0-31E33200-321E322A-32503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A700-A716A720A721A789A78AA828-A82BA836-A839AA77-AA79FB29FDFCFDFDFE62FE64-FE66FE69FF04FF0BFF1C-FF1EFF3EFF40FF5CFF5EFFE0-FFE6FFE8-FFEEFFFCFFFD", 
    letter: "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05250531-055605590561-058705D0-05EA05F0-05F20621-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280904-0939093D09500958-0961097109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510D0-10FA10FC1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209421022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2D00-2D252D30-2D652D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2F300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A65FA662-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78BA78CA7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
  };
  Object.keys(categories).forEach(function(k) {
    categories[k] = categories[k].replace((/([0-9a-f]{4})/gi),'\\u\1'); 
  });

  function document() {
    var doc = this.many(toplevel);
    this.eof();
    return doc;
  }

  // parse a series of literate comments and indented lists
  function toplevel() {
    var indent = this.produce(spacesLine);
    return this.choice(literateComment, indentedList(indent));
  }

  // Parse a series of literate comment lines
  function literateComment() {
    return this.many1(this.match(/^\S[^\n]+\n/)).join();
  }

  // Parse optional whitespace
  function spacesLine() {
    return this.match(/^([ \r\t]*)/);
  }
  // Parse obligatory whitespace
  function spacesLine1() {
    return this.match(/^([ \r\t]+)/);
  }

  // parse a list at the given indentation level
  function indentedList(indent) {
    return function() {
      var elements = this.produce(indentedListLine);
      var children = [].concat.apply(null, this.many(indentedListChild(indent)));
      return elements + children;
    };
  }
  function indentedListChild(parent_indent) {
    return function() {
      var indent = this.produce(spacesLine); 
      if (indent.length > parent_indent.length) {
        if (indent.substring(0,parent_indent.length) === parent_indent) {
          return this.produce(indentedList(indent));
        }
        else {
          return this.fail("Inconsistent whitespace usage in indentation");
        }
      }
      else {
        return []; 
      }
    }; 
  }

  // Parse an line of element clusters
  function indentedListLine() {
    return this.sepEndBy(elementCluster, spacesLine);
  }
  function elementCluster() {
    return this.choice(prefixInfix, firstItem); 
  }
  function prefixInfix() {
    var op = this.produce(operator);
    var item = this.option(item, []);
    if (item.length) {
      var more = this.many(infixPostfix);
      return item + [].concat.apply(null, more);
    }
    else {
      return op; 
    }
  }
  function firstItem() {
    var item = this.produce(item);
    var more = this.many(infixPostfix);
    return item + [].concat.apply(null, more);
  }
  function infixPostfix() {
    var op = this.produce(operator);
    var item = this.option(item, []);
    if (item.length) {
      return [op] + item;
    }
    else {
      return op;
    }
  }

  // Parse an Item
  function item() {
    var item_ = this.choice(
        quoted, 
        doubleQuoted, 
        number, 
        symbol, 
        list, 
        squareBracketList, 
        curlyBraceList,
        indentedString,
        ); 
    return item_;
  }
  
  // Lists
  function list() {
    this.match(/^\(/); 
    var elements = this.many(this.choice(parseLiterateComment, tokenLine));
    this.match(/^\)/); 
    return [].concat.apply(null, elements);
  }
  function squareBracketList() {
    this.match(/^\[/); 
    var elements = this.many(this.choice(parseLiterateComment, tokenLine));
    this.match(/^\]/); 
    return [].concat.apply(null, elements);
  }
  // Curly brace blocks are like regular parenthesized list blocks,
  // but are indentation-sensitive
  function curlyBraceList() {
    this.match(/^\{/); 
    var elements = this.many(toplevel);
    this.match(/^\}/); 
    return [].concat.apply(null, elements);
  }
  // Parse an indent-agnostic line of tokens
  function tokenLine() {
    // skip indentation
    this.produce(spacesLine1);
    // The line can contain just a comment or a list of tokens
    return this.choice(comment, tokens);
  }
  function tokens() {
    var elements = this.sepEndBy(elementCluster, spacesLine1); 
    // The line may end with a comment
    var postComment = this.option(comment, []);
    return [].concat.apply(null, elements) + postComment;
  }

  // Indented String literals
  function indentedString() {
    this.match(/^(?:"""[ \t\r]*\n|'''[ \t\r]*\n)/);
    var indent = this.produce(spacesLine);
    return this.many(indentedStringLine(indent));
  }
  function indentedStringLine(indent) {
    return function() {
      this.match(indent);
      return this.match(/^[^\n]*\n/);
    };
  }

  // String literals
  function quoted() {
    return this.match(/^'([^']|'')*'/);
  }
  function doubleQuoted() {
    return this.match(/^"([^"]|"")*"/);
  }
  function backtickQuoted() {
    return this.match(/^`([^`]|``)*`/);
  }

  // Symbols
  function symbol() {
    return this.match(new Regexp('^[_'+categories[letter]+'][_0-9'+categories[letter]+']*'); 
  }

  // Operators
  function operator() {
    return this.choice(backtickQuoted, 
        this.match(new Regexp('^(?:(?=[^_(){}\\[\\]\'"`])['+categories[punct]+categories[symbol]+'])+'));
  }

  // One-line \\ Comments
  function comment() {
    return this.match(/^\\\\([^\n]*)\n/); 
  }

  // Numeric literals
  function number() {
    return this.choice(zeroNum, decimal);
  }
  function zeroNum() {
    this.match(/(?=0)/); 
    return this.choice(decimal, hex, oct, binary);
  }
  function decimal() {
    return parseFloat(this.match(/^\-?\d+(?:\.\d+)?(?:[eE][\+\-]?\d+)?/));
  }
  function hex() {
    return parseInt(this.match(/^0x([0-9a-f]+)/i), 16); 
  }
  function oct() {
    return parseInt(this.match(/^0o([0-7]+)/i), 8); 
  }
  function binary() {
    return parseInt(this.match(/^0b([01]+)/i), 2); 
  }

  return (new Reparse(data+"\n", false)).start(document);
}

exports.parse = parse;

