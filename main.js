images = {};
appcat = "Faces";
masterpbw = "";
app = {};

function start() {

  if (! $('#i-iswatchapp').prop("checked")) {
    $('#watchapponly').hide();
  }

  if ($('#i-sw-usesamescreenshots').prop("checked")) {
    $('#scr-allsame').hide();
    $('#scr-diff').show();
  } else {
    $('#scr-allsame').show();
    $('#scr-diff').hide();
  }

  //Register Handlers
  $( ".rbtype" ).change(function() {
    if ($('#i-iswatchapp').prop("checked")) {
      $('#watchapponly').show();
    } else {
      $('#watchapponly').hide();
    }
    $('#watchapptype').removeClass("danger");
  });
  $( ".rbcat" ).change(function() {
    $('#watchcat').removeClass("danger");
    appcat = this.value;
  });
  $( "#i-sw-usesamescreenshots" ).change(function() {
    if ($('#i-sw-usesamescreenshots').prop("checked")) {
      $('#scr-allsame').hide();
      $('#scr-diff').show();
    } else {
      $('#scr-allsame').show();
      $('#scr-diff').hide();
    }
  });
  $( "input" ).focusout(function() {
    $(this).removeClass("danger");
  })
  $( "img" ).click(function() {
    $(this).removeClass("danger");
  })

  //this is pretty hacky, future me please fix this
  $(".screenshot").click(function() {
    console.log("Select " + this.id);
    $('.activeImage').removeClass("activeImage");
    $(this).addClass("activeImage");
  });

}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('.activeImage').attr('src', e.target.result).width(114).height(168);

            var i = null;
            $('.activeImage').each(function () {
              i = this.id;
            });
            images[i] = e.target.result.split("base64,")[1];
            console.log("Image ID " + i + " = " + e.target.result)
            // $('.activeImage').css('display', 'inline');

        };

        reader.readAsDataURL(input.files[0]);
    }
}
function readPBW(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          console.log("pbw: " + e.target.result)
          console.log("pbw2: " + e.target.result.split("base64,")[1])
          masterpbw = e.target.result.split("base64,")[1];
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function buildError(msg, ehid) {
  $('#' + ehid).addClass("danger");
  $('#buildbtn').removeClass("btn-primary");
  $('#buildbtn').addClass("btn-danger");
  $('#buildbtn').html(msg);
  setTimeout(function () {
    $('#buildbtn').removeClass("btn-danger");
    $('#buildbtn').addClass("btn-primary");
    $('#buildbtn').html("Build zip package");
  }, 2000);
}
function build() {
  $('.danger').removeClass(".danger");
  $('#buildbtn').html('<span class="spinner-border spinner-grow-sm" role="status" aria-hidden="true"></span>  <span class="sr-only">Loading...</span> Building zip package');

  app = {};

  app.pbw = masterpbw;

  //Sanity check
  if ($('#i-appname').val() == null || $('#i-appname').val() == "") {
    buildError("App name cannot be blank", "i-appname");
    return;
  } else {
    app.title = $('#i-appname').val();
  }

  if ($('#i-weburl').val() != null) {
    app.website = $('#i-weburl').val();
  }

  if ($('#i-sourceurl').val() != null) {
    app.source = $('#i-sourceurl').val();
  }

  if ($('#i-supportemail').val() != null) {
    app.support = $('#i-supportemail').val();
  }

  if ($('#i-iswatchface').prop("checked")) {
    app.type = "watchface"
  } else if ($('#i-iswatchapp').prop("checked")) {
    app.type = "watchapp"
  } else {
    buildError("Must select app type", "watchapptype");
    return;
  }

  if ($('#i-iswatchapp').prop("checked")) {

    if (appcat == null || appcat == "") {
      buildError("Must select app category", "watchcat");
      return;
    } else {
      app.category = appcat
    }

  }

  if ($('#i-appdesc').val() == null || $('#i-appdesc').val() == "") {
    buildError("App description cannot be blank", "i-appdesc");
    return;
  } else {
    app.description = $('#i-appdesc').val();
  }

  if ($('#i-apprelnotes').val() == null || $('#i-apprelnotes').val() == "") {
    buildError("Release notes cannot be blank", "i-apprelnotes");
    return;
  } else {
    app.releasenotes = $('#i-apprelnotes').val();
  }

  if ((app.type == "watchapp") && (images["i-icon-1"] == null || images["i-icon-1"] == "")) {
    buildError("Large icon is required for watchapp", "i-icon-1");
    return;
  } else {
    app.icons = {};
    app.icons.large = images["i-icon-1"];
  }

  if ((app.type == "watchapp") && (images["i-icon-2"] == null || images["i-icon-2"] == "")) {
    buildError("Small icon is required for watchapp", "i-icon-2");
    return;
  } else {
    app.icons.small = images["i-icon-2"];
  }

  app.screenshots = {};
  app.screenshots.aplite = [];
  app.screenshots.basalt = [];
  app.screenshots.chalk = [];
  app.screenshots.diorite = [];
  app.screenshots.emery = [];
  //app.screenshots.emery will always be blank :'(

  if ($('#i-sw-usesamescreenshots').prop("checked")) {

    //Use different screenshots

    var totalScreenshots = 0;
    //aplite
    if (images["i-scr-aplite-1"] != null && images["i-scr-aplite-1"] != "") {
      for (i = 1; i < 6; i++) {
        if (images["i-scr-aplite-" + i] != null && images["i-scr-aplite-" + i] != "") {
          app.screenshots.aplite.push(images["i-scr-aplite-" + i]);
          totalScreenshots += 1;
        }
      }
    }
    //basalt
    if (images["i-scr-basalt-1"] != null && images["i-scr-basalt-1"] != "") {
      for (i = 1; i < 6; i++) {
        if (images["i-scr-basalt-" + i] != null && images["i-scr-basalt-" + i] != "") {
          app.screenshots.basalt.push(images["i-scr-basalt-" + i]);
          totalScreenshots += 1;
        }
      }
    }
    //chalk
    if (images["i-scr-chalk-1"] != null && images["i-scr-chalk-1"] != "") {
      for (i = 1; i < 6; i++) {
        if (images["i-scr-chalk-" + i] != null && images["i-scr-chalk-" + i] != "") {
          app.screenshots.chalk.push(images["i-scr-chalk-" + i]);
          totalScreenshots += 1;
        }
      }
    }
    //diorite
    if (images["i-scr-diorite-1"] != null && images["i-scr-diorite-1"] != "") {
      for (i = 1; i < 6; i++) {
        if (images["i-scr-diorite-" + i] != null && images["i-scr-diorite-" + i] != "") {
          app.screenshots.diorite.push(images["i-scr-diorite-" + i]);
          totalScreenshots += 1;
        }
      }
    }

    if (totalScreenshots < 1) {
      buildError("At least one screenshot must be provided");
      return;
    }

  } else {

    //Use the same screenshots
    if (images["i-scr-a-1"] == null || images["i-scr-a-1"] == "") {

      buildError("At least one screenshot is required", "i-scr-a-1");
      return;

    } else {

      for (i = 1; i < 6; i++) {
        if (images["i-scr-a-" + i] != null && images["i-scr-a-" + i] != "") {
          app.screenshots.aplite.push(images["i-scr-a-" + i]);
          app.screenshots.basalt.push(images["i-scr-a-" + i]);
          app.screenshots.chalk.push(images["i-scr-a-" + i]);
          app.screenshots.diorite.push(images["i-scr-a-" + i]);

        }
      }

    }

  }

  // if (images["i-ban"] == null || images["i-ban"] == "") {
  //
  //   buildError("At least one screenshot is required", "i-scr-a-1");
  //   return;
  //
  // } else {
  app.header = images["i-ban"];



  //We've assembled the data, generate the yaml
  //Could use a library, but I don't want to

  var yaml = "";
  var pbwfile = $('#i-f-pbw').val().split("\\")[2]
  console.log("pbwfile: " + pbwfile)

  yaml = yaml + "pbw_file: " + pbwfile + "\n"
  yaml = yaml + "header: banners/Banner.png\n"
  yaml = yaml + "description: |\n" + app.description + "\n"
  yaml = yaml + "assets:\n"
  yaml = yaml + "-\n"
  yaml = yaml + "  name: aplite\n"
  yaml = yaml + "  screenshots:\n"
  for (var i = 0; i < app.screenshots.aplite.length; i++) {
    yaml = yaml + "    - screenshots/screenshot-aplite-" + i + ".png\n"
  }
  yaml = yaml + "-\n"
  yaml = yaml + "  name: basalt\n"
  yaml = yaml + "  screenshots:\n"
  for (var i = 0; i < app.screenshots.basalt.length; i++) {
    yaml = yaml + "    - screenshots/screenshot-basalt-" + i + ".png\n"
  }
  yaml = yaml + "-\n"
  yaml = yaml + "  name: chalk\n"
  yaml = yaml + "  screenshots:\n"
  for (var i = 0; i < app.screenshots.chalk.length; i++) {
    yaml = yaml + "    - screenshots/screenshot-chalk-" + i + ".png\n"
  }
  yaml = yaml + "-\n"
  yaml = yaml + "  name: diorite\n"
  yaml = yaml + "  screenshots:\n"
  for (var i = 0; i < app.screenshots.diorite.length; i++) {
    yaml = yaml + "    - screenshots/screenshot-diorite-" + i + ".png\n"
  }

  yaml = yaml + "category: " + app.category + "\n";
  if (app.type == "watchapp") {
    yaml = yaml + "large_icon: icons/Large.png\n"
    yaml = yaml + "small_icon: icons/Small.png\n"
  }
  yaml = yaml + "title: " + app.title + "\n";
  yaml = yaml + "source: " + app.source + "\n";
  yaml = yaml + "type: " + app.type + "\n";
  yaml = yaml + "website: " + app.website + "\n";
  yaml = yaml + "release_notes: " + app.releasenotes + "\n";

  //yaml complete, build the .zip

  var zip = new JSZip();

  zip.file("build.yaml", yaml);
  zip.file(pbwfile, app.pbw, {base64: true})

  var ban = zip.folder("banners");
  ban.file("Banner.png", app.header, {base64: true});

  var icon = zip.folder("icons");
  if (app.icons.large != null && app.icons.large != "") {
    icon.file("Large.png", app.icons.large, {base64: true});
  }

  if (app.icons.small != null && app.icons.small != "") {
    icon.file("Small.png", app.icons.small, {base64: true});
  }

  var img = zip.folder("screenshots");

  for (var i = 0; i < app.screenshots.aplite.length; i++) {
    var n = i+1;
    img.file("screenshot-aplite-" + i + ".png", app.screenshots.aplite[i], {base64: true});
  }
  for (var i = 0; i < app.screenshots.basalt.length; i++) {
    var n = i+1;
    img.file("screenshot-basalt-" + i + ".png", app.screenshots.basalt[i], {base64: true});
  }
  for (var i = 0; i < app.screenshots.chalk.length; i++) {
    var n = i+1;
    img.file("screenshot-chalk-" + i + ".png", app.screenshots.chalk[i], {base64: true});
  }
  for (var i = 0; i < app.screenshots.diorite.length; i++) {
    var n = i+1;
    img.file("screenshot-diorite-" + i + ".png", app.screenshots.diorite[i], {base64: true});
  }


  zip.generateAsync({type:"blob"}).then(function(content) {
    // see FileSaver.js
    saveAs(content, app.title.replace(/\s/g,'') + ".zip");

    $('#buildbtn').removeClass("btn-primary");
    $('#buildbtn').addClass("btn-success");
    $('#buildbtn').html("Success! Downloading .zip");
    setTimeout(function () {
      $('#buildbtn').removeClass("btn-success");
      $('#buildbtn').addClass("btn-primary");
      $('#buildbtn').html("Build zip package");
    }, 5000);
});

  // $("body").html(JSON.stringify(app))

}
