"use strict";
const pat = new RegExp("\\b(Stability( \\(.?\d+\\))?)\\b", "g");
console.log("You lose Stability (+1) as well as Stability and also Stability (-22)"
    .replace(pat, "<span class='text-keyword'>$1</span>"));
