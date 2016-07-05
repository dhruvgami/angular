// USGBC LEED Plaque - IDEO D-Shop (Tobias Toft and Ethan Klein)
// IDEO password for LEED api username: ideo password: password


// the Object Literal 'plaque' contains our js code.
// reference any function or property via 'plaque.width' etc.
var plaque = plaque || {
  width: 750,
  height: 750,
  radius: 216/2, // radius for the inner-most track
  radiusIncrement: 37,
  totalScore: 24,
  fadeSpeed: 1000,
  page: 'home',
  LEED: '1000005063',
  ID: '',
  key: '',
  buildingData: {},
  catColors: {'energy': '#D0DD3D', 'water': '#55CAF5', 'waste': '#84CCAF', 'transportation': '#A39F92', 'human': '#F2AC41', 'human_fuel': '#9e8fc4'},  // #ldpf-37 human_fuel added for co2 and voc charts color under human experience section
  trackColors: {},
  assosiatedCategories: [],
  setupTrack: {},
  setupTrack_main: {},
  setupTrack_lastMonth: {},
  setupTrack_lastYear: {},
  physicalScale : 1,

  // plaque.setup gets called when the DOM is ready
  setup: function(args, forcefully) {
    plaque.page = args.page;
    plaque.tl = new TimelineMax();
    plaque.raphael = Raphael(args.container, plaque.width, plaque.height);
    plaque.customShapes();

    if (plaque.page == "overview"){
      plaque.getData(forcefully);
    }
    else{
      plaque.getData(); // get json
    }
    // to be called if backend is problematic (comment out line above - getData())
    // plaque.offline()
  },

  kill: function(){
    TweenMax.killAll();
  },

  //Initiate all animations from here
  animateAll: function() {
    if (plaque.page === "overview") {
      $("#score-puck").fadeIn(plaqueNav.pageSwitchSpeed);
    }
    
      var scorepuck = document.getElementById('score-puck');
    if (plaque.buildingData.certification == "" || plaque.buildingData.certification == "Denied" || plaque.buildingData.certification == "None")     {
        $('.nav .home').html("Score");
        $('.nav .home').css("padding-top", "25px");
        $('img.leed_logo_small').attr("src", '/static/dashboard/img/leed_logo_blank_small.png')
        //$('score-puck').css("background", "url(../img/score-puck_nonleed.svg) no-repeat");
        //var scorepuck = document.getElementById('score-puck');
        scorepuck.style.backgroundImage = 'url(/static/dashboard/img/score-puck_nonleed.svg)';
    }
    else{
        $('.nav .home').html("LEED Score");
        $('.nav .home').css("padding-top", "22px");
        $('img.leed_logo_small').attr("src", '/static/dashboard/img/leed_logo_small.png');
        scorepuck.style.backgroundImage = 'url(/static/dashboard/img/score-puck.svg)';
    }
      
    plaque.animateTracks(0);
  },

  animateTracks: function(delay){
    //Animate tracks in
    delay /= 1000; //convert ms to s for tweenmax

    if (plaque.page == "overview"){
      for (var i = (plaque.assosiatedCategories).length-1; i > -1; i--) {
        plaque.setupTrack[plaque.assosiatedCategories[i]["category"]].animateIn(delay);
      };
    }
    else{
      plaque.setupTrack_main[plaque.page].animateIn(delay);
      plaque.setupTrack_lastMonth[plaque.page].animateIn(delay);
      plaque.setupTrack_lastYear[plaque.page].animateIn(delay);
    }
  },

  // track constructor
  track: function(args) {  
    this.val = 0;
    this.rVal = args.val; //for storing a potential real value for visualizing sub 12 o'clock values
    this.max = args.max;
    this.radius = args.radius;
    this.name = args.label;
    this.front = plaque.raphael.set(); //top layer  (for most text)
    this.back = plaque.raphael.set(); //bottom layer (for gfx + max labels) 
    this.color = args.color;
    this.thickness = args.thickness || 30;
    this.factors = args.factors;
    this.type = args.type || "default";
    this.args = args;
    if (args.type === 'detail-main'){
      this.averages = {local:args.averages.local, global:(args.averages.global || -1)};
    }

    //check for special cases of naming and data availability
    var name = this.name;
    var disabledClass = "";
    if (this.type === "detail-main"){
      // SDH : don't use the current month name
      name = "current"; //plaque.getMonthName();
    }

    if (args.val < 0){
      name = "No previous data to compare";
      disabledClass = " disabled";
    }

    //lighten color if necessary
    if (args.type === 'detail-sub'){
      this.color = tinycolor.lighten(this.color, 20).toHexString();
    }

    //draw ghost track
    this.ghost = plaque.raphael.path().attr({arc: [100, 100, this.radius, false, this.thickness]}).attr({stroke: '#ddd', opacity: 0});

    //draw max label
    var x = this.ghost.getPointAtLength(this.ghost.getTotalLength()).x;
    var y = 306; //for some reason Raphael.js does not calculate the correct/same Y value for all track radii, so we're setting it manually.
    this.maxLabel = plaque.raphael.text(x, y, this.max).attr({'opacity': 0});
    this.maxLabel.node.setAttribute('class', 'arc-label max'+disabledClass);

    //set Y offset depending on track type
    var offsetY = 0; //standard center (2px adjusted)
    if (args.type === 'detail-main'){
      offsetY = -30;
    }
    
    //draw name label
    this.label = plaque.raphael.text(140, plaque.height/2-this.radius+2+offsetY, name).attr({'text-anchor': 'start', opacity:0});
    this.label.node.setAttribute('class', 'arc-label name'+disabledClass);

    //draw factor labels if available
    var factorLabels = [];
    var that = this;
    if (this.factors){
      var factors;
      $.each(this.factors, function(index, factor){
        var factorLabel = plaque.raphael.text(140, plaque.height/2-that.radius+offsetY+20+index*15, factor).attr({'text-anchor': 'start', opacity:0});
        factorLabel.node.setAttribute('class', 'arc-label factors');
        factorLabels.push(factorLabel);
        that.front.push(factorLabel);
      });
    }

    // draw icon
    if (args.icon != false){
        var image = "/static/dashboard/img/icon_water.png";
        for (var i = 0; i < plaque.assosiatedCategories.length; i++) {
          if (plaque.assosiatedCategories[i]["label"] == this.name){
            image = plaque.assosiatedCategories[i]["img_path"];
            break;
          }
        };
        // if (this.name === "Human Experience") {
        //   image = "/static/dashboard/img/icon_human.png";
        // } else {
        //   image = "/static/dashboard/img/icon_" + this.name.toLowerCase() + ".png";
        // }
        this.icon = plaque.raphael.image(image, 109, (plaque.height/2 - this.radius - 10) + offsetY, 20, 20).attr({opacity:0});  
    }

    //draw track & get endpoint
    this.track = plaque.raphael.path().attr({arc: [this.val, this.max, this.radius, true, this.thickness]}).attr({stroke: this.color, opacity:0});
    this.endPoint = this.track.getPointAtLength(this.track.getTotalLength()+1);

    //draw little triangle at the end of the track
    this.triangle = plaque.raphael.path().attr({triangle: [this.endPoint.x, this.endPoint.y, this.thickness, this.thickness]}).attr({"fill": this.color, "stroke": 0, opacity:0});
    
    this.drawNeedle = function(category, parent){
      //draw average needle
      var averageVal;
      if (category === 'local'){
        averageVal = parent.averages.local;
      } else {
        averageVal = parent.averages.global;
      }
      
      var mid = {x: plaque.width/2, y: plaque.height/2};
      var avg = averageVal/parent.max;
      var avgPoint;
      if (averageVal == parent.args.val){
        avgPoint = parent.endPoint;
      } else {
        // offset the beginning a little so that it doesn't bunch up with the labels
        avgPoint = parent.ghost.getPointAtLength(((parent.ghost.getTotalLength()- 74)*avg) + 74);
      }

      var avgAngle = (Math.atan2(mid.y-avgPoint.y, mid.x-avgPoint.x) * 180/Math.PI) - 90; //angle in degrees
      
      if (1000*avg < parent.track.thresholds.break1) {
        avgAngle = 0;
      } else if (avgAngle > -90 && avgAngle < -1) {
        avgAngle = -90;
      }

      var returnObj = [];

      if (averageVal != parent.args.val) {
        var label = plaque.raphael.text(avgPoint.x-4, avgPoint.y, averageVal).attr({opacity:0});
        label.transform("r"+avgAngle+" ," + avgPoint.x + "," + avgPoint.y + "r"+-avgAngle); //then rotate
        label.node.setAttribute('class', 'arc-label value average');
        returnObj.push(label);
      }

      if (parent.averages.local == parent.averages.global) {
        if (category == "local") avgAngle += 20;
        else avgAngle -= 20;
      }

      var needle = plaque.raphael.image("/static/dashboard/img/needle.png", avgPoint.x-10, avgPoint.y-53, 15, 13).attr({opacity:0});
      needle.transform("r"+avgAngle+" ," + avgPoint.x + "," + avgPoint.y); //then rotate
      returnObj.push(needle);

      var icon = plaque.raphael.image("/static/dashboard/img/" + category + ".png", avgPoint.x-38, avgPoint.y-130, 75, 75).attr({opacity:0});
      icon.transform("r"+avgAngle+" ," + avgPoint.x + "," + avgPoint.y + "r"+-avgAngle); //then rotate
      returnObj.push(icon);

      return returnObj;
    }

    this.fadeInAverages = function(parent){
      if (parent.type === 'detail-main'){
        var needles = [];
        if (parent.type === "detail-main"){
          $.each(parent.drawNeedle('global', parent), function(index, item){
            needles.push(item);
          });

          if (parent.averages.local != null){
            $.each(parent.drawNeedle('local', parent), function(index, item){
              needles.push(item);
            });
          }
        }

        if(needles.length > 0){
          TweenMax.to(needles, 0.5, {raphael:{opacity:1}});
        }
      }
    }

    //draw value label
    this.valueLabel = plaque.raphael.text(this.endPoint.x, this.endPoint.y, this.val).attr({opacity:0});
    this.valueLabel.node.setAttribute('class', 'arc-label value');

    //Put stuff on their layers to make sure the order is correct
    this.back.push(this.track, this.maxLabel, this.ghost);
    this.back.toBack();

    this.front.push(this.label, this.valueLabel);
    this.front.toFront();

    //Function for the intro animation
    this.animateIn = function(del){
      //Animate ghost first
      var objs = [this.ghost, this.maxLabel, this.icon, this.label];
      if (factorLabels.length > 0){
        TweenMax.to(factorLabels, 1, {raphael:{opacity:1}, delay:del});
      } 

      TweenMax.to(objs, 1, {raphael:{opacity:1}, delay:del});


      if (args.val > 0){
        //Fix value if it results in an animation below 12 o'clock
        var twelveoclock = this.max*(this.track.thresholds.break1/1000);
        var adjusted = false;

        if (args.val < twelveoclock) {
          args.val += twelveoclock; //momentarily altering val while animating, real val is stored in rVal
          adjusted = true;
        }

        //Then the rest     
        TweenMax.to(this.track, 1, {raphael:{opacity:1}, delay:del});
        TweenMax.to(this.triangle, 1, {raphael:{opacity:1}, delay:del});

        //And last the needles and the track
        var timing = (args.val/args.max) * 4; //4 = max 4 seconds
        TweenMax.to(this, timing, {val: args.val, ease:Cubic.easeOut, onUpdate:plaque.changeTrack, onUpdateParams:[this, adjusted], onComplete:this.fadeInAverages, onCompleteParams:[this], delay:del});  
      }
    }

    //Function for mid-animation visual simplification
    this.simplify = function(){
      TweenMax.to(this.ghost, 2, {raphael:{opacity:0}});
      TweenMax.to(this.valueLabel, 2, {raphael:{opacity:0}});
    }
  },

  // gets called by tweenmax at each moment of animation
  changeTrack: function(obj, adjusted) {
    var val = obj.val;
    if (adjusted){
      val = obj.rVal;
    }

    obj.track.attr({arc: [obj.val, obj.max, obj.radius, true, obj.thickness]});

    //Update fill, calculate the endpoint
    obj.endPoint = obj.track.getPointAtLength(obj.track.getTotalLength()-1);

    //Check if we have a valid endPoint, otherwise skip ahead – it'll be ready in the next iteration
    if(!isNaN(obj.endPoint.x) && !isNaN(obj.endPoint.y)){

      //Calculate angle between center and endpoint, so we can rotate the triangle
      var mid = {x: plaque.width/2, y: plaque.height/2};
      var angle = (Math.atan2(mid.y-obj.endPoint.y, mid.x-obj.endPoint.x) * 180/Math.PI) - 90; //angle in degrees
      
      if (obj.track.progress < obj.track.thresholds.break1) {
        angle = 0;
      } else if (angle > -90 && angle < -1) {
        angle = -90;
      }

      //Flatten triangle if we reach the end of the track
      var stopY = obj.ghost.getPointAtLength(obj.ghost.getTotalLength()-1).y + obj.thickness + 5;
      var triangleHeight = obj.thickness;
      if (obj.track.progress > 750 && obj.endPoint.y < stopY){
        triangleHeight += obj.endPoint.y - stopY;
      }

      //Rotate that pesky triangle
      obj.triangle.attr({triangle: [obj.endPoint.x, obj.endPoint.y, obj.thickness, triangleHeight]}); //move first
      obj.triangle.transform("r"+angle+"," + obj.endPoint.x + "," + obj.endPoint.y); //then rotate

      //Move the label
      var lblY = obj.endPoint.y;
      if (obj.track.progress > 750){
        lblY = Math.max(obj.maxLabel.attr('y')-1, lblY);
      }
      
      obj.valueLabel.attr({x: obj.endPoint.x, y: lblY, text: Math.round(val)});
    }

    // fade-in value label after 12oclock
    if (obj.track.progress >= obj.track.thresholds.break1) {
      TweenMax.to(obj.valueLabel, 0.2, {raphael:{opacity:1}})
    }  

    // Update the total score puck
    obj.val = val;

    if (plaque.page === "overview") {
      $('#score-puck>.text').text(Math.round(plaque.data.totalScore));
    }
  },

  //Set up the 5 tracks
  setupTracks: function() {
    for (var i = (plaque.assosiatedCategories).length-1; i > -1; i--) {
      if (plaque.page == "overview"){
        //For Overview
        number_of_gaps               = (plaque.assosiatedCategories).length - 1
        total_gap                    = number_of_gaps * 7
        total_track_thickness        = 178 - total_gap
        track_thickness              = parseInt(total_track_thickness/((plaque.assosiatedCategories).length))
        delta_track_thickness        = track_thickness - 30
        increment_in_radiusIncrement = delta_track_thickness/2
        factor                       = (5-(plaque.assosiatedCategories).length)* 7
        new_radiusIncrement          = this.radiusIncrement + increment_in_radiusIncrement + factor
        track_radius                 = (plaque.radius+factor)+new_radiusIncrement*(((plaque.assosiatedCategories).length-1)-i)
        
        // track_radius = plaque.radius + ((total_track_thickness + 7)*(((plaque.assosiatedCategories).length-1)-i))
        plaque.setupTrack[plaque.assosiatedCategories[i]["category"]] = new plaque.track({label: plaque.assosiatedCategories[i]["label"], val: plaque.data[plaque.assosiatedCategories[i]["category"]]["score"], max: plaque.data[plaque.assosiatedCategories[i]["category"]]["max"], radius: track_radius, color: plaque.assosiatedCategories[i]["color"], thickness: track_thickness});
      }
      else{
        //For individual categories
        factors_arr = (plaque.assosiatedCategories[i]["factors"]).split(',')
        plaque.setupTrack_main[plaque.assosiatedCategories[i]["category"]] = new plaque.track({label: plaque.assosiatedCategories[i]["label"], val: plaque.data[plaque.assosiatedCategories[i]["category"]]["score"], max: plaque.data[plaque.assosiatedCategories[i]["category"]]["max"], radius: 225, color: plaque.assosiatedCategories[i]["color"], thickness: 100, type: 'detail-main', factors: factors_arr, averages: {local:plaque.data[plaque.assosiatedCategories[i]["category"]]["localAverage"], global:plaque.data[plaque.assosiatedCategories[i]["category"]]["globalAverage"]}});
        plaque.setupTrack_lastMonth[plaque.assosiatedCategories[i]["category"]] = new plaque.track({label: plaque.getMonthName(-1), val: plaque.data[plaque.assosiatedCategories[i]["category"]]["lastMonth"], max: plaque.data[plaque.assosiatedCategories[i]["category"]]["max"], radius: 150, color: plaque.assosiatedCategories[i]["color"], thickness: 35, icon: false, type: 'detail-sub'});
        plaque.setupTrack_lastYear[plaque.assosiatedCategories[i]["category"]] = new plaque.track({label: plaque.getMonthName(-12, true), val: plaque.data[plaque.assosiatedCategories[i]["category"]]["lastYear"], max: plaque.data[plaque.assosiatedCategories[i]["category"]]["max"], radius: 107, color: plaque.assosiatedCategories[i]["color"], thickness: 35, icon: false, type: 'detail-sub'});
      }
    };
  }, 

  //Set up Raphael.js custom attributes
  customShapes: function() {
    //Triangle
    plaque.raphael.customAttributes.triangle = function(x, y, size, height) {
      var path = ["M", x, y-size/2]; //start out in the top left corner
      path = path.concat(["L", x+5, y-size/2]); //short straight line
      path = path.concat(["L", x+5+height/2, y]); //line to the tip
      path = path.concat(["L", x+5, y+size/2]); //line back to lower left corner
      path = path.concat(["L", x, y+size/2]); //short straight line
      path = path.concat(["z"]).join(" ");

      return {path: path};
    };

    //Custom arc
    plaque.raphael.customAttributes.arc = function (value, total, radius, shortened, thickness) {
      var strokewidth = thickness;
      
      var stopline = (plaque.height/2) - plaque.radius + strokewidth - 7; //stop y              
      var startline = 104; //start x
      if (thickness === 100) {
        stopline = (plaque.height/2) - plaque.radius + 34 - 7; //stop y
      }

      if (plaque.page !== "overview") {
        startline = 100; //start x
      }

      //progress is max 1000 units
      this.progress = 1000/total * value;
      this.thresholds = {break1: 220, break2: 950};

      var hwidth = plaque.radius + (4 * plaque.radiusIncrement) + strokewidth/2; //horizontal line max width
      //start path
      var path = ["M", startline, plaque.width/2-radius];


      //first draw the straight line until we hit thresholds.break1
      hwidth = Math.min(hwidth, hwidth * this.progress/this.thresholds.break1);

      if (plaque.page !== "overview") {
        hwidth = Math.min((plaque.width/2)-startline, hwidth * this.progress/this.thresholds.break1);
      }

      path.push(["H", hwidth+startline]);

      //draw arc until progress hits thresholds.break2
      if (this.progress > this.thresholds.break1){
        var alpha = Math.min(Math.map(this.progress, this.thresholds.break1, this.thresholds.break2, 0, 270), 270);

        var a = (90 - alpha) * Math.PI / 180;
        var x = plaque.width/2 + radius * Math.cos(a);
        var y = plaque.height/2 - radius * Math.sin(a);
        
        path.push(['M',plaque.width/2,plaque.height/2-radius]);
        path.push(['A', radius, radius, 0, +(alpha > 180), 1, x, y]);

        //and the last 100 is the little bit at the end
        if (this.progress > this.thresholds.break2){
          path.push(['M',x,y]);
          if (shortened) {stopline += 4;} //shorten the stopline
          path.push(['V',Math.map(this.progress, this.thresholds.break2, 1000, stopline+(plaque.height/2-stopline), stopline) ]);
        }
      }

      //return the complete path
      return {path: path, 'stroke-width': strokewidth};
    };

  },

  offline: function() {
    var dataFromRemote;

    // if the ajax call has already been made and plaque.data exists, don't make the call again
    if (plaque.data) {

      //Set up data dependent graphics
      $(".plaque_score").text(plaque.data.currentCertificationScore);
      plaque.setupTracks(); 
      plaque.animateAll();

    } else {
      // build default object
      plaque.data = {
              'totalScore': 30, 
              'baseScore': 12,
              'currentCertificationScore': 69, //Placeholder, needs to be pulled from BR
              'nationalAvg': 70,

              'water': {
                score: 12,
                color: plaque.trackColors.water,
                max: 15,
                localAverage: 7,
                globalAverage: 5,
                lastMonth: 4,
                lastYear: 7
              },

              'humanexperience': {
                score: 13,
                color: plaque.trackColors.human,
                max: 15,
                localAverage: 12,
                globalAverage: 10,
                lastMonth: 4,
                lastYear: 7
              },

              'transportation': {
                score: 15,
                color: plaque.trackColors.transportation,
                max: 15,
                localAverage: 12,
                globalAverage: 5,
                lastMonth: -1,
                lastYear: -1
              },

              'energy': {
                score: 12,
                color: plaque.trackColors.energy,
                max: 15,
                localAverage: 6,
                globalAverage: 5,
                lastMonth: 6,
                lastYear: 7
              },

              'waste': {
                score: 30,
                color: plaque.trackColors.waste,
                max: 30,
                localAverage: 30,
                globalAverage: 22,
                lastMonth: 4,
                lastYear: 7
              }
      };
      //Set up data dependent graphics
      $(".plaque_score").text(plaque.data.currentCertificationScore);
      plaque.setupTracks(); 
      plaque.animateAll();

    }    
  },

  getData: function(forceCall) {
    var forceCall = (typeof forceCall === "undefined") ? false : forceCall;
    var dataFromRemote;

    // if the ajax call has already been made and plaque.data exists, don't make the call again
    if (plaque.data && !forceCall) {

      //Set up data dependent graphics
      $(".plaque_score").text(plaque.data.currentCertificationScore);
      plaque.setupTracks(); 
      plaque.animateAll();

    } else {

      // login with key http://shakeup.buildingrobotics.com/buildings/LEED:1000005228/performance/?key=fe0f7438f87cc6ee74a963bd
      // Building Robotics test building: http://shakeup.buildingrobotics.com/buildings/LEED:1000005063/performance/?key=dae17c00693b7dda7c020d09
        var now = new Date()
        var lastMonthTS = (now.getFullYear()) + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-01";
        now.setMonth(now.getMonth() + 1);
        var lastYearTS = (now.getFullYear() - 1) + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-01";
        
      // Building with meter data: http://shakeup.buildingrobotics.com/buildings/LEED:1000009301/meters/
	// 2013-09-06: DG: Added "&within=31" to get latest reading avaialble in previous month/year
        if(plaque.LEED != '0' && logIn == 'True' && access_to_project == 'True')
        {
            $.when($.ajax({ type: "GET",
                url: "/buildings/LEED:" + plaque.LEED + "/performance/"}),
               $.ajax({ type: "GET",
                url: "/comparables/"}),
               $.ajax({ type: "GET",
                url: "/buildings/LEED:" + plaque.LEED + "/performance/?at=" + lastMonthTS + "&within=1"}),
               $.ajax({ type: "GET",
                url: "/buildings/LEED:" + plaque.LEED + "/performance/?at=" + lastYearTS + "&within=1"}))
            .done(function(score, global_avgs, last_month, last_year) {
            var dataFromRemote = score[0];
            bldg = plaque.buildingData;
            global_avgs = global_avgs[0];
            last_month = last_month[0].scores;
            last_year = last_year[0].scores;
            $.ajax({ type: "GET",
                 url: "/comparables/" + bldg.state + "/"})
                .success(function (local_avgs) {

                //Check maxima values

          if (dataFromRemote.maxima==undefined){
            $.ajax({
              type: "GET",
              url: "/weights/",
              async: false,
              success: function (data_maxima) {
                dataFromRemote.maxima = data_maxima
              }
            });
          }

          //Calc a matching score
                var totalScore = plaque.checkValue(dataFromRemote.scores.water) + 
                    plaque.checkValue(dataFromRemote.scores.human_experience) + 
                    plaque.checkValue(dataFromRemote.scores.transport) + 
                    plaque.checkValue(dataFromRemote.scores.energy) + 
                    plaque.checkValue(dataFromRemote.scores.waste) + 
                    plaque.checkValue(dataFromRemote.scores.base);

                // initialize all data
                plaque.data = {
                    'totalScore': totalScore,
                    'baseScore': dataFromRemote.scores.base,
                    'currentCertificationScore': dataFromRemote.scores.base,
                    'nationalAvg': global_avgs.water_avg + 
                    global_avgs.human_experience_avg +
                    global_avgs.transport_avg +
                    global_avgs.energy_avg + 
                    global_avgs.waste_avg +
                    global_avgs.base_avg,

                    'water': {
                    score: plaque.checkValue(dataFromRemote.scores.water),
                    color: "#55CAF5", //"#78c5b5"
                    max: plaque.checkValue(dataFromRemote.maxima.water),
                    localAverage: local_avgs.water_avg,
                    globalAverage: global_avgs.water_avg,
                    lastMonth: last_month.water,
                    lastYear: last_year.water,
                    },

                    'humanexperience': {
                    score: plaque.checkValue(dataFromRemote.scores.human_experience),
                    color: "#F2AC41", //"#6c7fb9"
                    max: plaque.checkValue(dataFromRemote.maxima.human_experience),
                    localAverage: local_avgs.human_experience_avg,
                    globalAverage: global_avgs.human_experience_avg,
                    lastMonth: last_month.human_experience,
                    lastYear: last_year.human_experience,
                    },

                    'transportation': {
                    score: plaque.checkValue(dataFromRemote.scores.transport),
                    color: "#A39F92", //"#b5a68c"
                    max: plaque.checkValue(dataFromRemote.maxima.transport),
                    localAverage: local_avgs.transport_avg,
                    globalAverage: global_avgs.transport_avg,
                    lastMonth: last_month.transport,
                    lastYear: last_year.transport,
                    },

                    'energy': {
                    score: plaque.checkValue(dataFromRemote.scores.energy),
                    color: plaque.trackColors.energy,
                    max: plaque.checkValue(dataFromRemote.maxima.energy),
                    localAverage: local_avgs.energy_avg,
                    globalAverage: global_avgs.energy_avg,
                    lastMonth: last_month.energy,
                    lastYear: last_year.energy,
                    },

                    'waste': {
                    score: plaque.checkValue(dataFromRemote.scores.waste),
                    color: "#84CCAF", //"#c5da4f"
                    max: plaque.checkValue(dataFromRemote.maxima.waste),
                    localAverage: local_avgs.waste_avg,
                    globalAverage: global_avgs.waste_avg,
                    lastMonth: last_month.waste,
                    lastYear: last_year.waste,
                    }
                };

                //Set up data dependent graphics
                $(".plaque_score").text(plaque.data.currentCertificationScore);
                plaque.setupTracks(); 
                plaque.animateAll();
                }).fail(function()
                {
                
                    if (dataFromRemote.maxima==undefined){
                      $.ajax({
                        type: "GET",
                        url: "/weights/",
                        async: false,
                        success: function (data_maxima) {
                          dataFromRemote.maxima = data_maxima
                        }
                      });
                    }

                      //Calc a matching score
                            var totalScore = plaque.checkValue(dataFromRemote.scores.water) + 
                                plaque.checkValue(dataFromRemote.scores.human_experience) + 
                                plaque.checkValue(dataFromRemote.scores.transport) + 
                                plaque.checkValue(dataFromRemote.scores.energy) + 
                                plaque.checkValue(dataFromRemote.scores.waste) + 
                                plaque.checkValue(dataFromRemote.scores.base);

                            // initialize all data
                            plaque.data = {
                                'totalScore': totalScore,
                                'baseScore': dataFromRemote.scores.base,
                                'currentCertificationScore': dataFromRemote.scores.base,
                                'nationalAvg': global_avgs.water_avg + 
                                global_avgs.human_experience_avg +
                                global_avgs.transport_avg +
                                global_avgs.energy_avg + 
                                global_avgs.waste_avg +
                                global_avgs.base_avg,

                                'water': {
                                score: plaque.checkValue(dataFromRemote.scores.water),
                                color: plaque.trackColors.water,
                                max: plaque.checkValue(dataFromRemote.maxima.water),
                                globalAverage: global_avgs.water_avg,
                                lastMonth: last_month.water,
                                lastYear: last_year.water,
                                },

                                'humanexperience': {
                                score: plaque.checkValue(dataFromRemote.scores.human_experience),
                                color: plaque.trackColors.human,
                                max: plaque.checkValue(dataFromRemote.maxima.human_experience),
                                globalAverage: global_avgs.human_experience_avg,
                                lastMonth: last_month.human_experience,
                                lastYear: last_year.human_experience,
                                },

                                'transportation': {
                                score: plaque.checkValue(dataFromRemote.scores.transport),
                                color: plaque.trackColors.transportation,
                                max: plaque.checkValue(dataFromRemote.maxima.transport),
                                globalAverage: global_avgs.transport_avg,
                                lastMonth: last_month.transport,
                                lastYear: last_year.transport,
                                },

                                'energy': {
                                score: plaque.checkValue(dataFromRemote.scores.energy),
                                color: plaque.trackColors.energy,
                                max: plaque.checkValue(dataFromRemote.maxima.energy),
                                globalAverage: global_avgs.energy_avg,
                                lastMonth: last_month.energy,
                                lastYear: last_year.energy,
                                },

                                'waste': {
                                score: plaque.checkValue(dataFromRemote.scores.waste),
                                color: plaque.trackColors.waste,
                                max: plaque.checkValue(dataFromRemote.maxima.waste),
                                globalAverage: global_avgs.waste_avg,
                                lastMonth: last_month.waste,
                                lastYear: last_year.waste,
                                }
                            };

                            //Set up data dependent graphics
                            $(".plaque_score").text(plaque.data.currentCertificationScore);
                            plaque.setupTracks(); 
                            plaque.animateAll();
                
                })
            })    
        }
        else if (plaque.LEED == '0' || logIn == 'False' || access_to_project == 'False')
        {
      	var dataFromRemote;
        $.when($.ajax({ type: "GET",
              url: "/buildings/LEED:" + plaque.LEED + "/performance/"}))
          .done(function(score) {
            if(score == "LEED Score is not public for LEED ID " + plaque.LEED)
             {
                    if(plaqueNav.getParameterByName('req_access') == 'true')
                    {
                        $("#permission_needed_request").click();                    }
                    else
                    {
                        $('#leed_score_not_public').modal('show');    
                    }
             }
             else{
                plaque.drawPlaquefromPublicScore(score);
             }
          }).fail(function()
           {
            dataFromRemote = {
                                  "scores": {
                                      "energy": null,
                                      "water": null,
                                      "base": null,
                                      "human_experience": null,
                                      "waste": null,
                                      "effective_at": null,
                                      "transport": null
                                  }
                                };
            plaque.drawPlaquefromPublicScore(dataFromRemote);

          });
        }
    }
  }, 

  drawPlaquefromPublicScore: function(dataFromRemote){
    //Check maxima values

    if (dataFromRemote.maxima==undefined){
      $.ajax({
        type: "GET",
        url: "/weights/",
        async: false,
        success: function (data_maxima) {
          dataFromRemote.maxima = data_maxima
        }
      });
    }

    //Calc a matching score
      var totalScore = plaque.checkValue(dataFromRemote.scores.water) + 
          plaque.checkValue(dataFromRemote.scores.human_experience) + 
          plaque.checkValue(dataFromRemote.scores.transport) + 
          plaque.checkValue(dataFromRemote.scores.energy) + 
          plaque.checkValue(dataFromRemote.scores.waste) + 
          plaque.checkValue(dataFromRemote.scores.base);

      // initialize all data
      plaque.data = {
          'totalScore': totalScore,
          'baseScore': dataFromRemote.scores.base,
          'currentCertificationScore': dataFromRemote.scores.base,

          'water': {
          score: plaque.checkValue(dataFromRemote.scores.water),
          color: plaque.trackColors.water,
          max: plaque.checkValue(dataFromRemote.maxima.water),
          },

          'humanexperience': {
          score: plaque.checkValue(dataFromRemote.scores.human_experience),
          color: plaque.trackColors.human,
          max: plaque.checkValue(dataFromRemote.maxima.human_experience),
          },

          'transportation': {
          score: plaque.checkValue(dataFromRemote.scores.transport),
          color: plaque.trackColors.transportation,
          max: plaque.checkValue(dataFromRemote.maxima.transport),
          },

          'energy': {
          score: plaque.checkValue(dataFromRemote.scores.energy),
          color: plaque.trackColors.energy,
          max: plaque.checkValue(dataFromRemote.maxima.energy),
          },

          'waste': {
          score: plaque.checkValue(dataFromRemote.scores.waste),
          color: plaque.trackColors.waste,
          max: plaque.checkValue(dataFromRemote.maxima.waste),
          }
      };

      //Set up data dependent graphics
      $(".plaque_score").text(plaque.data.currentCertificationScore);
      plaque.setupTracks(); 
      plaque.animateAll();
  },

  checkValue: function(value){
    if (!value){
      return 0; //we don't want nothing
    } else {
      return value;
    }
  },

  getMonthName: function(offset, withYear){
    var now = new Date();
    var yearString = "";

    if (typeof(offset)=='undefined'){ offset = 0; }
    now.setMonth(now.getMonth()+offset);

    if (withYear){
      yearString = " " + now.getFullYear();
    }
    
    return plaque.months[now.getMonth()] + yearString;
  },

  racetracksize: function (page_name) {
    if (Modernizr.touch){
      plaque.physicalScale = 1;
    }
    var relative_width  = 765;
    var container_width = $('.main_container').width();

    if (container_width < 1300){
      var required_plaque_size = (((container_width)/1300).toFixed(2))*1.7;

      if (required_plaque_size > 1){
        required_plaque_size = 1;
      }

      $("#racetrack_" + page_name).css('-webkit-transform', 'scale(' + required_plaque_size + ')');
      var calculate_left = (1300-container_width) / 1.7
      // $("#track_container").css('margin-left', 361 - calculate_left);
    }
    else{
      $("#racetrack_" + page_name).css('-webkit-transform', 'scale(' + plaque.physicalScale + ')');
      // $("#track_container").css('margin-left', '361px');
    }
  },

  months: [ "January", "February", "March", "April", "May", "June", 
               "July", "August", "September", "October", "November", "December" ],

};

//Extend Math class with a map function
Math.map = function (value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

$( window ).resize(function() {
  if (plaque.assosiatedCategories.length){
    for (var i = 0; i < plaque.assosiatedCategories.length; i++) {
      if ($('#racetrack_' + plaque.assosiatedCategories[i]["category"]) ) {
        plaque.racetracksize(plaque.assosiatedCategories[i]["category"]);
      }
    };
  }
});
