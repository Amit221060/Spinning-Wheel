import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-3';
import { UserService } from "./apicallservice";
import { Profile } from 'selenium-webdriver/firefox';
import { timeout } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  profile = {};
  constructor(public userService: UserService) {

    }

  ngOnInit() {
   // debugger;
    this.userService.getUser().subscribe(data => this.profile = data);
    if(this.profile!== null)
        { this.showPage();}   
   
    
  }
  
 showPage() {
    document.getElementById("off").style.display = "none";
    document.getElementById("show").style.display = "block";
    var padding = { top: 20, right: 40, bottom: 0, left: 0 },
      w = 430 - padding.left - padding.right,
      h = 430 - padding.top - padding.bottom,
      r = Math.min(w, h) / 2,
      rotation = 0,
      oldrotation = 0,
      picked = 100000,
      oldpick = [],
      color = d3.scale.category20();

    var data = [
      { "label": "Hola", "value": 1, "question": "OH MY GOD You won my Heart" },
      { "label": " Try Again", "value": 1, "question": "I can only give you one more chance" },
      { "label": "Nice", "value": 1, "question": "It's Ok lets have a project for You" },
      { "label": "Not Lucky Today", "value": 1, "question": "Oh NO Luck is not with you today " },
      { "label": "Awesome", "value": 1, "question": "Great! You won $10000, but GST Included :)" },
      { "label": "Nope", "value": 1, "question": "Well I need to say Bye to you" },
      { "label": "Winner", "value": 1, "question": "Oh Great You won a foreign Trip" },
      { "label": "Champion", "value": 1, "question": "You are a Born Champion So one more chance to you" }


    ];
    var svg = d3.select("#chart")
      .append("svg")
      .data([data])
      .attr("width", w + padding.left + padding.right)
      .attr("height", h + padding.top + padding.bottom);
    var container = svg.append("g")
      .attr("class", "chartholder")
      .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
    var vis = container
      .append("g");

    var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
    // declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);
    // select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice")
      .data(pie)
      .enter()
      .append("g")
      .attr("class", "slice");

    arcs.append("path")
      .attr("fill", function (d, i) { return color(i); })
      .attr("d", function (d) { return arc(d); });
    // add the text
    arcs.append("text").attr("transform", function (d) {
      d.innerRadius = 0;
      d.outerRadius = r;
      d.angle = (d.startAngle + d.endAngle) / 2;
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
    })
      .attr("text-anchor", "end")
      .text(function (d, i) {
        return data[i].label;
      });
    container.on("click", spin);
    function spin(d) {

      container.on("click", null);
      //all slices have been seen, all done
      console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
      if (oldpick.length == data.length) {
        console.log("done");
        container.on("click", null);
        return;
      }
      var ps = 360 / data.length,
        pieslice = Math.round(1440 / data.length),
        rng = Math.floor((Math.random() * 1440) + 360);

      rotation = (Math.round(rng / ps) * ps);

      picked = Math.round(data.length - (rotation % 360) / ps);
      picked = picked >= data.length ? (picked % data.length) : picked;
      if (oldpick.indexOf(picked) !== -1) {
        d3.select(this).call(spin);
        return;
      } else {
        oldpick.push(picked);
      }
      rotation += 90 - Math.round(ps / 2);
      vis.transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .each("end", function () {
          //mark question as seen
          d3.select(".slice:nth-child(" + (picked + 1) + ") path")
            .attr("fill", "#111");
          //populate question
          d3.select("#question h1")
            .text(data[picked].question);
          oldrotation = rotation;

          container.on("click", spin);
        });
    }
    //make arrow
    svg.append("g")
      .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h / 2) + padding.top) + ")")
      .append("path")
      .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
      .style({ "fill": "black" });
    //draw spin circle
    container.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 60)
      .style({ "fill": "white", "cursor": "pointer" });
    //spin text
    container.append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("SPIN")
      .style({ "font-weight": "bold", "font-size": "30px" });


    function rotTween(to) {
      var i = d3.interpolate(oldrotation % 360, rotation);
      return function (t) {
        return "rotate(" + i(t) + ")";
      };
    }


    function getRandomNumbers() {
      var array = new Uint16Array(1000);
      var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
      if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {
        window.crypto.getRandomValues(array);
        console.log("works");
      } else {
        //no support for crypto, get crappy random numbers
        for (var i = 0; i < 1000; i++) {
          array[i] = Math.floor(Math.random() * 100000) + 1;
        }
      }
      return array;
    }

  }
  refresh(): void {
    window.location.reload();
  }

}
