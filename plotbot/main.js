var my_a_clauses;
var treeData;
var root;
var current_nodes = [];
var MAX_CHILDREN = 10;

// debug: Fallin into misfortune - Third last bconflict

var main = function() {
  var chosen_a_clause, chosen_b_clause, chosen_c_clause;
  chosen_a_clause = $('.a_clause.current').text();
  chosen_b_clause = $('.b_clause.current').text();
  chosen_c_clause = $('.c_clause.current').text();






  $('.a_clause').click(function() {
    $('.a_clause').removeClass('current');
    $(this).addClass('current');
    chosen_a_clause = $(this).text();
  });
  $('.b_clause').click(function() {
    $('.b_clause').removeClass('current');
    $(this).addClass('current');
    chosen_b_clause = $(this).text();
  })
  $('.c_clause').click(function() {
    $('.c_clause').removeClass('current');
    $(this).addClass('current');
    chosen_c_clause = $(this).text();
  })
  $('#preview').click(function() {
    $('#output-box').text(chosen_a_clause + "\n" + chosen_b_clause + "\n" + chosen_c_clause);
    console.log("Clicked");
  });

  $('#proceed').click(function() {
    $('#preview').click();

    var currentConfList = getConflictByTheme(chosen_b_clause);
    $('#prompt1').toggle();
    $('#proceed2').show();
    $('html, body').animate({
      scrollTop: $('#prompt1').offset().top
    }, 1000);
    $('.first-conflicts').remove();


    for (var i=0; i<currentConfList.length; i++) {

      var conflict = currentConfList[i];
      if ($.isArray(conflict.conflict_text)) {
        for (conf_text in conflict.conflict_text) {
          var btn = $('<button class="first-conflicts">Test</button>');
          btn.html(conflict.conflict_text[conf_text]);
          btn.data("index", conflict.index + conflict.sub_index);
          bconflicts[conflict.label].chosen_text = conflict.conflict_text[conf_text]
          $('#first-conflict').append(btn);
        }
      }
      else {
        var btn = $('<button class="first-conflicts">Test</button>');
        btn.html(conflict.conflict_text);
        btn.data("index", conflict.index + conflict.sub_index);
        $('#first-conflict').append(btn);
      }
    }
  });

  $('body').on('click', '.first-conflicts', function() {
    $('.first-conflicts').removeClass('chosen-b-conflict');
    $(this).addClass('chosen-b-conflict');
    chosen_b_conflict = $(this);
    console.log("Clicked on conflcit")
    // Scroll so proceed button is at bottom.
    $('#tree-group').show();
    $('#current-story').show();
    $('html, body').animate({
      scrollTop: $('#tree-group').offset().top
    }, 1000);

    var index = $('.chosen-b-conflict').data("index");
    var root = bconflicts[index];
    console.log("LABEL: ", root.label);
    treeData = constructTree2(root, 5, []);
    console.log("treeData: ", treeData);

    $('#conflict-tree').children().remove();
    $('#conflict-tree').html(treeJSON());
    // $('#tree-group').css("display", "inline-block");
    // $('#preview-box').text(chosen_b_conflict.conflict_text);

  })

  $('#select').click(function() {
    $(this).toggleClass("off on");
  })


  // var filtered_conflicts = bconflicts.filter(function (el) {
  //   return el.theme.contains("The");
  // });


}

var getConflictByTheme = function(theme) {
  rVal = [];
  for (var conflict in bconflicts) {
    // console.log("key = " + conflict + " conf: " + bconflicts[conflict].index);
    if (stringCompare(theme, bconflicts[conflict].theme)){
      rVal.push(bconflicts[conflict]);
    }
  }
  return rVal;
}

var stringCompare = function(str1, str2) {
  var setStr1 = new Set(str1.toLowerCase().split(" "));
  var setStr2 = new Set(str2.toLowerCase().split(" "));
  var diff=0;
  var threshold = 8;
  setStr1.forEach(function(value) {
    if (!setStr2.has(value)) {
      diff+=1;
    }
  });
  setStr2.forEach(function(value) {
    if (!setStr1.has(value)) {
      diff+=1;
    }
  });

  return (diff < threshold);
}

var constructTree2 = function(node, depth) {
  node.name = node.label;
  node.children = [];
  node.selected = false;
  if (depth == 0) { return node; }

  for (sequel in node.sequels) {
    if (sequel in bconflicts) {
      console.log("sequel: ", sequel, "current_nodes: ", current_nodes);
      if (current_nodes.indexOf(bconflicts[sequel].label) === -1) {
        node.children.push(bconflicts[sequel]);
        current_nodes.push(bconflicts[sequel].label);
      }
    }
  }
  for (child in node.children) {
    if (node.children[child] != null) {
      constructTree2(node.children[child], depth-1);
    }
  }
  return node;
}

var isConflictInList = function(l, inName) {
  var found = false;
  for (conflict in l) {
    if (l[conflict].name == inName) {
      found = true;
      break;
    }
  }
  return found;
}

$(document).ready(main);
