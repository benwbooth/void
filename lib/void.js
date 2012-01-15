// special characters: (){}[]'"` and \\
'use strict';

var console = require('console'),
    fs = require('fs'),
    render = require('render'),
    reparse = require('reparse');

// Taken from XRegExp (http://xregexp.com/)
var categories = {
  punct: "0021-00230025-002A002C-002F003A003B003F0040005B-005D005F007B007D00A100AB00B700BB00BF037E0387055A-055F0589058A05BE05C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E0964096509700DF40E4F0E5A0E5B0F04-0F120F3A-0F3D0F850FD0-0FD4104A-104F10FB1361-13681400166D166E169B169C16EB-16ED1735173617D4-17D617D8-17DA1800-180A1944194519DE19DF1A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601C3B-1C3F1C7E1C7F1CD32010-20272030-20432045-20512053-205E207D207E208D208E2329232A2768-277527C527C627E6-27EF2983-299829D8-29DB29FC29FD2CF9-2CFC2CFE2CFF2E00-2E2E2E302E313001-30033008-30113014-301F3030303D30A030FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFABEBFD3EFD3FFE10-FE19FE30-FE52FE54-FE61FE63FE68FE6AFE6BFF01-FF03FF05-FF0AFF0C-FF0FFF1AFF1BFF1FFF20FF3B-FF3DFF3FFF5BFF5DFF5F-FF65", 
  symbol: "0024002B003C-003E005E0060007C007E00A2-00A900AC00AE-00B100B400B600B800D700F702C2-02C502D2-02DF02E5-02EB02ED02EF-02FF03750384038503F604820606-0608060B060E060F06E906FD06FE07F609F209F309FA09FB0AF10B700BF3-0BFA0C7F0CF10CF20D790E3F0F01-0F030F13-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F13601390-139917DB194019E0-19FF1B61-1B6A1B74-1B7C1FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE20442052207A-207C208A-208C20A0-20B8210021012103-21062108210921142116-2118211E-2123212521272129212E213A213B2140-2144214A-214D214F2190-2328232B-23E82400-24262440-244A249C-24E92500-26CD26CF-26E126E326E8-26FF2701-27042706-2709270C-27272729-274B274D274F-27522756-275E2761-276727942798-27AF27B1-27BE27C0-27C427C7-27CA27CC27D0-27E527F0-29822999-29D729DC-29FB29FE-2B4C2B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F309B309C319031913196-319F31C0-31E33200-321E322A-32503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A700-A716A720A721A789A78AA828-A82BA836-A839AA77-AA79FB29FDFCFDFDFE62FE64-FE66FE69FF04FF0BFF1C-FF1EFF3EFF40FF5CFF5EFFE0-FFE6FFE8-FFEEFFFCFFFD", 
  letter: "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05250531-055605590561-058705D0-05EA05F0-05F20621-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280904-0939093D09500958-0961097109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510D0-10FA10FC1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209421022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2D00-2D252D30-2D652D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2F300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A65FA662-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78BA78CA7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
};
Object.keys(categories).forEach(function(x) {
  categories[x] = categories[x].replace((/([0-9a-f]{4})/gi),'\\u$1'); 
});

// parse a, then b, then a, ... repeatedly until either a or b fails.
// Don't backtrack. Return a concatenated list of results.
reparse.ReParse.prototype.manyab = function manyab(a, b) {
  var result = [];
  try {
    while (!this.eof()) {
      result = result.concat(this.produce(a));
      result = result.concat(this.produce(b));
    }
  } catch (err) {
    if (err !== this.fail)
      throw err;
  }
  return result;
}

function parse(data) {
  function document() {
    console.log('enter', arguments.callee.name, [this.input]);
    this.state = {
      indent: '', // most recently parsed indentation
      literate_comment: [] // most recently parsed literate comment
    };
    var ret = {type: 'List', value: this.produce(toplevel)};
    console.log('exit', arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }

  function toplevel() {
    console.log('enter', arguments.callee.name, [this.input]);
    var _indent = this.state.indent;
    this.produce(indent);
    var childrenList = this.produce(indentedListChildren(''));
    var ret = [].concat.apply([], childrenList);
    this.state.indent = _indent;
    if (this.state.literate_comment.length) {
      console.log(arguments.callee.name, "add comment: ",render.cf(this.state.literate_comment));
      ret = ret.concat(this.state.literate_comment); 
      this.state.literate_comment = [];
    }
    console.log('exit', arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }

  // Parse optional whitespace
  function spacesLine() {
    console.log('enter', arguments.callee.name,[this.input]);
    var ret = this.option(function() {return this.match(/^([ \r\t]*)/)}, '');
    console.log('exit', arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  // Parse obligatory whitespace
  function spacesLine1() {
    console.log('enter', arguments.callee.name,[this.input]);
    var ret = this.match(/^([ \r\t]+)/);
    console.log('exit', arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  // parse indentation at the beginning of a line. Store the indentation as
  // state in this.state.indent.
  function indent() {
    console.log('enter', arguments.callee.name,[this.input]);
    this.state.indent = this.produce(spacesLine);
    console.log('exit', arguments.callee.name, [this.input], render.cf(this.state.indent));
    return this.state.indent;
  }
  function indent1() {
    console.log('enter', arguments.callee.name,[this.input]);
    this.state.indent = this.produce(spacesLine1);
    console.log('exit', arguments.callee.name, [this.input], render.cf(this.state.indent));
    return this.state.indent;
  }

  // parse a literate comment.
  function literateComment() {
    // attempt to parse a comment, and parse the next indent
    var comment = this.manyab(
        // multi-line literate comment
        function() {
          if (this.state.indent.length === 0) {
            var comment = this.option((/^(?:\S[^\n]*\n)+/),'');
            this.produce(indent);
            return [comment];
          }
          else {
            return []; 
          }
        }, 
        function() {
          return this.choice(
            // blank line
            function() {
              var newline = this.match(/^\n/);
              this.produce(indent);
              return [newline];
            }, 
            // one line comment
            function() {
              var comment = this.match(/^\\\\([^\n]*\n)/);
              this.produce(indent);
              return [comment]; 
            });
        }).join('').replace((/^\s*/),'').replace((/\s*$/),'');

    if (comment.length) {
      this.state.literate_comment = this.state.literate_comment.concat([{type: 'Comment', value: comment}]);
      console.log('literate comment: ',render.cf(this.state.literate_comment));
    }
    return [];
  }

  // parse a list at the given indentation level
  function indentedList() {
    console.log('enter', arguments.callee.name, [this.input]);

    // check to see if an orphaned literate comment exists. If so,
    // save it and attach it to this when we're done parsing the list.
    var literate_comment = [];
    if (this.state.literate_comment.length) {
      literate_comment = literate_comment.concat(this.state.literate_comment);
      this.state.literate_comment = [];
    }

    var line = this.produce(tokenLine);
    if (!line.tokens.length) {
      this.fail();
    }

    var newline = this.option(/^\n/, '');
    var rest = [];
    if (newline) {
      var parent_indent = this.state.indent;
      this.produce(indent);
      rest = this.produce(indentedListChildren(parent_indent));
    }
    var elements = line.tokens.concat(rest);

    var ret = elements.length <= 1? 
      elements: 
      [{type: 'List', value: elements}];

    if (literate_comment.length || line.comment.length) {
      ret[0].comment = literate_comment.concat(line.comment);
    }

    console.log('exit', arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }

  function indentedListChildren(parent_indent) {
    var callee = arguments.callee.name;
    return function() {
      console.log('enter',callee,[this.input]);

      var ret = this.manyab(
        literateComment,
        function() {
          var ret;
          if (this.state.indent.length <= parent_indent.length) {
            // dedent
            this.fail();
          }
          else if (this.state.indent.substring(0, parent_indent.length) === parent_indent) {
            ret = this.produce(indentedList);
          }
          else {
            throw "Inconsistent whitespace usage in indented list";
          }
          return ret;
        });

      console.log('exit',callee, [this.input], render.cf(ret));
      return ret;
    };
  }

  function tokenLine() {
    console.log('enter',arguments.callee.name,[this.input]);
    var elements = this.sepEndBy(elementCluster, spacesLine1); 
    var line = [].concat.apply([], elements);

    var comment = line.length && line[line.length-1].type === 'Comment'? 
        line.slice(-1) : [];
    var tokens = line.length && line[line.length-1].type === 'Comment'? 
        line.slice(0,-1) : line;

    var ret = {
      tokens: tokens,
      comment: comment
    };
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }

  function elementCluster() {
    console.log('enter',arguments.callee.name,[this.input]);
    var ret = this.choice(line_comment, prefixInfix, firstItem); 
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  function prefixInfix() {
    console.log('enter',arguments.callee.name,[this.input]);
    var ops = this.many1(operator);
    var item_ = this.option(item, []);
    var ret;
    if (item_.length) {
      var more = this.many(infixSuffix);
      ret = ops.map(function(op) {return {type: 'PrefixOperator', value: op};}).
        concat(item_, [].concat.apply([], more));
    }
    else {
      ret = ops.map(function(op) {return {type: 'Operator', value: op};});
    }
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  function firstItem() {
    console.log('enter',arguments.callee.name,[this.input]);
    var item_ = this.produce(item);
    var more = this.many(infixSuffix);
    var ret = item_.concat([].concat.apply([], more));
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  function infixSuffix() {
    console.log('enter',arguments.callee.name,[this.input]);
    var ops = this.many1(operator);
    var item_ = this.option(item, []);
    console.log('item_=',item_);
    var ret;
    if (item_.length) {
      ret = ops.map(function(op) {return {type: 'Operator', value: op};}).concat(item_);
    }
    else {
      ret = ops.map(function(op) {return {type: 'SuffixOperator', value: op};});
    }
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }

  // Parse an Item
  function item() {
    console.log('enter',arguments.callee.name,[this.input]);
    var item_ = this.choice(
        quoted('Symbol', "'"), 
        quoted('String', '"'), 
        list('List', (/^\(/), (/^\)/)),
        list('QuotedList', (/^\[/), (/^\]/)),
        curlyBraceBlock,
        number, 
        symbol
        );
    console.log('exit',arguments.callee.name, [this.input], render.cf(item_));
    return item_;
  }
  
<<<<<<< HEAD
  // Lists
  function list() {
    console.log('enter',arguments.callee.name,[this.input]);
    this.match(/^\(/); 
    var first = this.option(tokenLine, []);
    var elements = this.many(tokenLine1);
    this.match(/^\)/); 
    var ret = {type: 'List', value: [].concat.apply([], first.concat(elements))};
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  function squareBracketList() {
    console.log('enter',arguments.callee.name,[this.input]);
    this.match(/^\[/); 
    var first = this.option(tokenLine, []);
    var elements = this.many(tokenLine1);
    this.match(/^\]/); 
    var ret = {type: 'Vector', value: [].concat.apply([], first.concat(elements))};
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  // Parse an indent-agnostic line of tokens
  function tokenLine() {
    console.log('enter',arguments.callee.name,[this.input]);
    // skip indentation
    this.produce(spacesLine);
    var ret = this.produce(tokens);
    this.match(/^(?:\n)?/);
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  function tokenLine1() {
    console.log('enter',arguments.callee.name,[this.input]);
    // skip indentation
    this.produce(spacesLine1);
    var ret = this.produce(tokens);
    this.match(/^(?:\n)?/);
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  // Indentation-insensitive lists
  function list(type, begin, end) {
    var callee = arguments.callee.name;
    return function() {
      console.log('enter', callee, [this.input]);
      this.match(begin); 
      var _indent = this.state.indent;
      this.produce(spacesLine);
      var first = this.produce(tokenLine);
      var rest = this.many(multilineList);
      this.state.indent = _indent;
      this.match(end);
      var ret = [{type: type, value: [].concat.apply([], first.tokens.concat(rest))}];
      if (first.comment.length) {
        ret[0].comment = (ret[0].comment||[]).concat(first.comment); 
      }
      if (ret[0].value.length && this.state.literate_comment.length) {
        ret = ret.concat(this.state.literate_comment);
        this.state.literate_comment = [];
      }
      console.log('exit', callee, [this.input], render.cf(ret));
      return ret;
    };
  }
  function multilineList() {
    console.log('enter',arguments.callee.name,[this.input]);
    this.match(/^\n/); 
    this.produce(indent);
    this.produce(literateComment);
    var line = this.produce(tokenLine);
    if (line.tokens.length && (this.state.literate_comment.length || line.comment.length))
    {
      line.tokens[0].comment = (line.tokens[0].comment||[]).concat(this.state.literate_comment, line.comment);
      this.state.literate_comment = [];
    }
    console.log('exit',arguments.callee.name, [this.input], render.cf(line.tokens));
    return line.tokens;
  }

  // Indentation-sensitive block
  function curlyBraceBlock() {
    console.log('enter',arguments.callee.name,[this.input]);
    this.match(/^{/);
    var _indent = this.state.indent;
    this.produce(spacesLine);
    var elements = this.choice(
        function () {
          this.match(/^}/);
          return [];
        },
        function() {
          this.match(/^\n/);
          var ret = this.produce(toplevel);
          this.match(/^}/);
          return ret;
        });
    this.state.indent = _indent;
    //var ret = [{type: 'List', value: elements}];
    var ret = elements;
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }

  // String literals
  function quoted(type, delim) {
    var callee = arguments.callee.name;
    return function () {
      console.log('enter', callee, [this.input]);
      var str = this.produce(quotedString(delim));
      var ret = [{type: type, value: str}];
      console.log('exit', callee, [this.input], render.cf(ret));
      return ret;
    };
  }
  function quotedString(delim) {
    var callee = arguments.callee.name;
    return function () {
      console.log('enter', callee, [this.input]);
      this.match(new RegExp('^'+delim));
      var ret = this.choice(indentedString(delim), innerQuoted(delim, ''));
      console.log('exit', callee, [this.input], render.cf(ret));
      return ret;
    };
  }
  function innerQuoted(delim, parsed) {
    var callee = arguments.callee.name;
    return function() {
      console.log('enter', callee, [this.input]);
      var ret = (parsed+
        this.match(new RegExp('^(?:[^'+delim+']|'+delim+delim+')*'))).
        replace(new RegExp(delim+delim,'g'),delim);
      this.match(new RegExp('^'+delim));
      console.log('exit', callee, [this.input], render.cf(ret));
      return ret;
    };
  }
  // Indented strings: start with /(?:'''|""")\s*\n/.
  // First non-blank line determines the indentation level.
  // Provide a prefix macro `>` that removes up to the first non-blank line 
  // of a string literal, to allow for multiline string literals 
  // with indentation. Any lines consisting of only whitespace 
  // where indentation is inconsistent are converted into newlines ("\n").
  function indentedString(delim) {
    var callee = arguments.callee.name;
    return function() {
      console.log('enter', callee, [this.input]);
      // parse a second and third delimiter, then optional whitespace, then
      // a new line. Test each parse; if any fails, parse a regular string
      // instead.
      var d2 = this.option(new RegExp('^'+delim+delim), '');
      if (d2.length === 0) return this.produce(innerQuoted(delim, ''));
      var ws = this.produce(spacesLine);
      var nl = this.option((/^\n/), '');
      if (nl.length === 0) return this.produce(innerQuoted(delim, d2+ws));

      var block_indent='';
      var ret = this.manyab(
          function() {
            this.produce(indent);
            return [];
          },
          function() {
            // test if this is a blank line
            var newline = this.option(/^\n/, '');
            var line = '';
            if (!newline.length) {
              if (!this.state.indent.length || this.state.indent.length < block_indent.length) {
                this.fail(); 
              }
              else {
                line = this.produce(/^[^\n]+\n/);
                if (!block_indent.length) {
                  block_indent = this.state.indent;
                }
                if (this.state.indent.substring(0, block_indent.length) !== block_indent) {
                  throw "Inconsistent whitespace usage in indented quoted literal";
                }
              }
            }
            var line_indent = block_indent.length && 
              this.state.indent.substring(0, block_indent.length) === block_indent?
                this.state.indent.substring(block_indent.length) : '';
            console.log('block_indent=',[block_indent],'line_indent=',[line_indent],'line=',[line]);

            return line_indent+line; 
          }).join('');
      // parse blank lines and convert to new lines
      // first non-blank line determines indent level
      console.log('exit', callee, [this.input], render.cf(ret));
      return ret;
    };
  }

  // Symbols
  function symbol() {
    console.log('enter',arguments.callee.name, [this.input]);
    var ret = [{
      type: 'Symbol', 
      value: this.match(
        new RegExp('^[_'+categories.letter+'][_0-9'+categories.letter+']*')) 
    }];
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }

  // Operators
  function operator() {
    console.log('enter',arguments.callee.name, [this.input]);
    var ret = this.choice(quotedString('`'), bareOperator);
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  function bareOperator() {
    console.log('enter',arguments.callee.name, [this.input]);
    var ret = this.match(
      new RegExp('^(?:(?=[^_(){}\\[\\]\'"`])['+categories.punct+categories.symbol+'])+'));
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }

  // One-line \\ Comments
  function line_comment() {
    console.log('enter',arguments.callee.name, [this.input]);
    var comment = this.match(/^\\\\([^\n]*)/);
    var ret = [{type: 'Comment', comment: comment}];
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }

  // Numeric literals
  function number() {
    console.log('enter',arguments.callee.name, [this.input]);
    var ret = [{type: 'Numeric', value: this.choice(zeroNum, decimal)}];
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  function zeroNum() {
    console.log('enter',arguments.callee.name, [this.input]);
    this.match(/^(?=0)/); 
    var ret = this.choice(hex, oct, binary, decimal);
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  function decimal() {
    console.log('enter',arguments.callee.name, [this.input]);
    var ret = this.match(/^\-?\d+(?:\.\d+)?(?:[eE][\+\-]?\d+)?/);
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  function hex() {
    console.log('enter',arguments.callee.name, [this.input]);
    var ret = this.match(/^0x[0-9a-f]+/i); 
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  function oct() {
    console.log('enter',arguments.callee.name, [this.input]);
    var ret = this.match(/^0o[0-7]+/i); 
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }
  function binary() {
    console.log('enter',arguments.callee.name, [this.input]);
    var ret = this.match(/^0b[01]+/i); 
    console.log('exit',arguments.callee.name, [this.input], render.cf(ret));
    return ret;
  }

  return (new reparse.ReParse(data+"\n", false)).start(document);
}

console.log('argv=',process.argv);

process.argv.slice(2).forEach(function(filename) {
  var input = fs.readFileSync(filename);
  console.log('filename=', filename);
  parse(input);
});


module.exports.parse = parse;

