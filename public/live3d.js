/* live3d.js: «Глобус эфира», 3D hologram for orbstudio.org/live
   three.js r128 (cdnjs). No other scripts, models, textures, logos or fonts.
   window.OrbLive3D = { init(el) -> true/false, update(data), stats() }; data = GET /api/v1/live response.
   Rules: nothing invented (no field / no coordinate -> no element), no text in 3D (HTML tooltip only, textContent, https links),
   no symbols or judgements, deterministic (no Math.random; phases from hash(id); sun from data.updated),
   pause when hidden/offscreen, prefers-reduced-motion, horizontal drag rotates, vertical swipe scrolls (touch-action: pan-y).
   Coastline: Natural Earth 1:110m coastline (public domain), simplified + 0.1° quantized, delta-encoded. */
(function () {
  "use strict";
  var COAST = [[-1637,-786,25,2,20,-11,-19,-1,-26,10],[-62,539,2,-7,-8,-9,-32,-5,8,11,-5,10,21,12,19,-5,-5,-7],[1410,-26,36,-13,14,-16,16,-6,3,-5,-9,-1,2,-7,35,-32,-28,5,-19,20,-13,5,-14,-6,1,-8,-8,-3,-35,12,-15,-3,11,11,-8,19,-42,19,-7,-6,-10,13,17,6,-15,0,-17,13,19,5,16,-4,4,-20,11,-6,19,17,36,-9],[1142,45,25,24,25,-15,-19,-22,6,-14,11,-9,-12,-1,-3,-16,-9,-7,-5,-25,-1,3,-11,-4,-16,10,-12,-4,-4,5,-15,1,-1,13,-10,11,0,18,6,7,15,-1,2,8,16,4,12,14],[-936,750,-6,-4,-26,3,19,7,13,-6],[-938,775,-26,3,26,-3],[-968,788,12,-4,-17,-5,-13,10,18,-1],[-882,744,-42,4,-5,11,-10,4,-32,5,4,4,51,-4,9,-4,-3,-3,18,-5,81,1,10,-4,3,-4,-7,-2,-77,-3],[-1113,782,14,-2,-3,-3,-33,0,22,5],[-1110,788,13,-2,-28,-2,15,4],[-823,232,40,-7,41,-22,-36,-4,7,5,-10,3,-6,9,-31,6,-4,2,4,2,-32,-7,27,13],[-556,513,-12,-15,7,4,6,-3,-3,-3,23,-4,-3,-7,7,2,5,-12,-5,-8,-11,1,0,10,-12,-9,-6,0,7,5,-10,2,-30,0,5,7,-4,2,18,22,15,9,3,-3],[-839,651,38,-14,-9,-3,-21,7,-24,-10,-4,5,-13,-1,8,5,5,17,20,-6],[-788,724,10,3,36,-9,1,-5,19,3,34,-11,18,-13,-18,-5,69,-18,-20,-19,-28,14,-13,-1,-1,-6,28,-13,6,-10,-3,-7,-38,10,26,-18,-48,10,-38,18,-29,-5,-9,4,7,7,39,2,1,8,12,10,-6,8,-36,8,7,2,-28,11,-23,-5,-74,7,-8,4,10,4,-14,0,-3,10,18,13,26,3,-8,-6,8,-7,9,8,26,5,17,-11,-1,-6,19,3],[-945,741,40,-2,-38,-19,-11,1,-6,13,15,7],[-1004,727,-11,7,11,4,30,0,3,-3,-10,-5,16,-4,-2,-9,-17,-4,-41,12,21,2],[-1078,758,19,2,2,-5,-6,-5,-59,-6,-17,3,21,5,-59,0,23,13,63,-10,-14,9,9,4,11,-1,7,-9],[-1229,761,38,14,29,1,-1,-7,-8,-4,-58,-4],[-1215,744,39,-2,21,-7,-37,-10,-13,-11,-26,-5,-28,10,20,18,-10,6,34,1],[-1532,580,11,-4,-19,-9,-5,3,-2,5,15,5],[-1254,500,15,-9,4,-6,-5,-1,-44,21,30,-5],[-1717,638,30,-5,-8,-3,-21,3,-1,5],[-1055,793,47,-5,11,-9,-55,5,10,3,-13,6],[263,353,-16,-4,-12,4,2,4,26,-4],[495,-125,9,-32,-7,0,1,-12,-27,-80,-17,-7,-14,6,-7,22,1,15,11,19,-5,20,4,12,19,4,14,12,15,26,3,-5],[-487,-780,20,2,28,-7,6,-15,-72,-10,-37,4,32,10,23,16],[-663,-803,44,-1,13,8,10,-4,-6,-10,-43,1,-18,6],[-739,-713,18,1,4,17,14,6,20,-25,-5,-8,-36,-3,5,4,-31,0,0,4,11,4],[-1023,-719,55,-1,6,-5,-46,0,-15,6],[-1226,-737,39,2,-15,-6,-24,4],[-1273,-735,33,-4,-33,4],[1658,-211,13,-11,-9,1,-22,20,18,-10],[1513,-58,-16,-5,-14,6,15,2,3,5,1,-5,6,0,8,7,-1,6,6,1,2,-8,-10,-9],[1769,-401,-9,-12,-8,-4,-5,4,5,8,-14,10,8,7,1,14,-21,29,17,-8,17,-23,25,-1,-5,-15,-8,1,-3,-10],[1697,-436,31,31,4,-8,8,4,2,-4,-15,-21,4,-5,-16,-3,-9,-17,-13,-7,-28,7,32,23],[1477,-408,6,-1,-4,-23,-19,-3,-13,28,17,-4,13,3],[1261,-322,-19,-8,-5,-9,-38,-1,-19,-11,-14,1,-16,8,8,20,-25,61,5,-4,-4,9,8,-7,-8,19,3,19,4,7,1,-7,25,18,42,10,21,33,4,-9,5,2,-4,5,3,5,5,-2,14,21,14,4,13,-11,12,-1,-2,6,12,19,20,4,-8,8,6,2,29,-11,12,3,5,-5,-10,-9,-5,-17,47,-27,11,13,4,40,8,17,14,-38,7,3,8,-8,10,-40,24,-14,9,-19,10,-1,2,-11,20,-18,7,-28,-7,-35,-26,-41,-3,-17,-37,-16,-14,6,1,5,-14,-9,-30,8,-10,19,-15,5,1,12,-14,-9,11,17,-1,7,-18,-20,-8,4,-9,19,-30,11,-52,-7],[818,75,-2,-10,-13,-5,-6,22,4,16,17,-23],[1294,-28,11,-3,3,-8,-29,5,2,6,13,0],[1279,22,8,-11,-6,-20,-7,19,5,12],[1229,9,22,7,-7,-12,-42,-2,-2,-7,9,-9,24,8,-18,-13,17,-34,-10,0,5,8,-12,-1,-5,20,-7,-3,1,-26,-6,-2,-4,3,1,19,-7,7,10,30,11,11,20,-4],[1213,-85,16,4,-1,-5,-15,-3,-14,5,14,-1],[1085,-64,41,-5,4,-7,27,-8,-11,-4,-81,14,-11,5,7,10,24,-5],[1044,-11,5,-12,12,-8,-3,-28,-11,0,-33,31,-28,46,-33,37,22,-3,31,-31,19,-7,13,-13,-4,-8,10,-4],[1264,84,1,-12,-3,-9,-4,10,-4,-5,0,-12,-12,6,0,12,-6,4,-17,-6,16,15,3,-5,17,8,-1,8,8,-5,2,-9],[1218,244,-11,-24,-6,16,14,17,3,-9],[1419,392,-9,-10,-7,-31,-31,-5,-14,-11,-7,3,0,8,-41,-7,10,-8,-7,-16,-6,-5,-5,4,2,9,-10,10,32,21,31,1,10,18,7,-5,20,14,9,30,11,2,5,-22],[1446,440,7,4,2,-11,-14,-3,-9,-10,-16,7,-5,-11,-11,0,-2,10,5,7,11,1,6,22,26,-16],[-42,586,12,0,-11,-10,21,1,-11,-17,10,-1,26,-30,12,-2,-6,-9,3,-5,-8,-5,-64,-6,24,12,-19,6,11,3,-6,5,2,7,15,-1,2,6,-19,8,-2,10,-6,-5,-5,15,11,18,8,0],[-145,665,-2,-7,11,-7,-51,-16,-41,5,10,4,-22,5,18,5,-21,2,6,7,16,1,15,-7,15,6,46,2],[1429,537,3,-19,15,-28,-15,3,-6,-14,9,-11,0,-7,-8,6,-6,-7,1,50,-6,9,1,14,9,5,-4,4,5,2,2,-7],[1185,93,-13,-9,23,30,2,-8,-12,-13],[1223,182,2,-11,-8,-12,0,-16,23,-5,1,-13,-12,11,-2,-4,-7,6,-14,1,4,6,-4,-1,-7,10,8,31,16,-3],[1255,122,3,-12,-8,3,3,-9,-5,-3,-5,14,6,3,-6,8,12,-4],[-774,87,17,7,8,17,15,1,16,12,7,-3,-8,-7,2,-23,7,8,-4,11,12,4,3,8,17,-16,20,0,13,-5,6,5,24,1,-8,-3,3,-5,16,-5,1,-8,16,-6,20,-20,31,-2,27,-17,8,-22,5,-2,-7,-15,3,-3,18,-1,0,-10,8,6,29,-10,3,-11,12,3,34,-5,28,-19,16,-3,9,-22,-4,-17,-36,-41,-6,-48,-16,-40,-11,-11,-26,-4,-30,-15,-9,-10,-4,-28,-49,-57,-24,-5,-22,10,17,-25,-10,-18,-46,-6,2,-19,-30,-4,1,-10,12,1,3,-6,-17,-9,-4,-15,-17,-6,-3,-7,20,-9,-4,-9,-31,-26,10,-16,-27,-6,-6,-10,-35,16],[-779,72,8,-34,-13,-12,-5,-12,-12,-6,-8,-19,-1,-11,12,-5,-16,-20,5,-10,-3,-4,14,-11,38,-74,45,-28,11,-9,2,-15,-7,-78,-6,-13,1,-35,-18,-47,-4,-1,4,-21,-11,-39,6,-2,3,13,7,-3,-5,-21,-12,4,-3,-17,-9,-8,15,-3,-15,-18,7,-36],[-747,-528,36,-13,8,12,17,3,9,-12,26,-9,-4,-5,-15,3,-11,-7,-11,1,-31,10,-24,17],[448,806,67,1,-39,-7,-11,2,6,4,-23,0],[535,737,24,9,-3,5,56,12,70,6,7,-4,-104,-22,-31,-19,2,-9,19,-8,-38,1,-21,7,-1,5,10,2,-1,6,20,8,-9,1],[274,801,-44,-7,-56,9,55,4,45,-6],[247,779,-40,-2,7,2,-6,4,21,2,18,-6],[151,797,19,4,45,-11,-25,-4,-19,-18,-12,0,-21,6,9,3,-35,12,-8,8,47,0],[-779,72,-3,11,-9,7,-13,-7,4,-8,-4,-2,-31,11,-12,15,-4,-3,-6,3,0,12,-20,18,2,4,-37,6,-35,23,-19,-5,-69,26,-20,16,2,15,-7,14,-33,28,0,8,-29,26,-9,22,-8,4,-9,2,1,-16,31,-35,9,-24,13,-9,-6,-6,-22,19,-1,13,-28,17,9,9,-13,10,-18,34,-12,10,-21,6,-38,57,-1,25,6,27,-8,27,16,-2,5,-9,-2,19,-46,18,-5,15,-12,5,-2,8,-27,19,-21,26,-25,1,-33,13,-72,14,-11,-2,2,-7,-37,-8,3,15,11,3,-3,3,-34,-19,7,-5,-9,-8,-42,-21,-64,-16,71,32,7,13,-21,-5,-13,7,-16,-4,1,9,-19,2,-23,17,15,16,38,7,-7,6,7,4,-42,-4,-31,13,36,9,8,0,-1,-5,21,0,-51,23,6,5,30,5,13,9,53,11,23,-7,107,-5,71,-13,67,13,7,-4,10,7,23,-10,14,7,1,-8,28,4,63,-9,13,-5,-14,-5,54,1,10,-6,11,5,-10,4,6,4,20,1,47,-12,31,2,-2,6,9,2,16,-4,0,-9,6,8,8,0,5,10,-23,10,1,11,12,7,23,-6,14,-11,-9,-5,19,-2,-1,-10,14,8,12,-7,-3,-7,9,-7,18,16,1,11,42,-7,-7,-11,7,-5,-1,-5,-19,-7,-25,2,-15,-18,-34,-12,-1,-6,-11,-2,-23,-19,-5,-20,15,-1,9,-17,14,2,59,-20,27,-2,2,-18,22,-21,13,14,-12,21,16,4,17,14,-8,16,-12,7,12,11,-8,24,43,1,24,-13,18,0,3,-21,17,-8,14,6,16,15,32,-33,-4,-7,45,-17,4,-8,11,-5,1,-12,-43,-19,-64,0,-47,-34,25,15,35,9,9,-5,-9,-6,6,-19,30,-3,10,11,7,-11,-56,-24,-7,1,-1,9,18,8,-27,-2,1,-3,-36,-17,-2,-8,8,-7,-37,-7,18,0,-21,-1,-9,-19,-6,6,4,-11,-8,-12,2,7,-7,13,1,-11,-7,1,7,-3,6,-23,-56,-42,0,-14,12,-31,-3,-17,-8,0,-5,7,-12,20,0,12,-12,10,-10,-5,-13,8,-28,-1,-4,-1,4,-9,-10,-2,-36,6,-33,-19,-8,-54,20,-36,15,-7,30,8,6,4,5,17,32,5,3,-7,-10,-25,-5,2,-1,-20,-5,-6,39,1,16,-7,-5,-39,14,-18],[-825,96,11,-8,24,8,16,-9],[-717,197,17,-1,17,-10,-4,-4,-20,2,-7,-8,-10,6,-15,-2,-5,7,21,0,-9,12,15,-2],[148,381,7,1,-4,-16,-27,10,2,5,22,0],[-163,191,-7,28,26,44,48,36,-2,13,5,14,24,15,10,17,37,-6,37,14,80,7,7,-1,0,-5,9,2,-5,-5,3,-7,-6,-19,49,-15,5,-9,34,-11,10,7,0,12,14,6,74,-19,21,7,10,-7,18,1,8,5,14,31,2,21,-15,1,-22,-7,-8,5,-20,-5,-21,6,-13,15,5,8,-6,5,11,9,15,1,4,7,19,-1,24,9,17,0,31,-11,33,6,-1,11,-48,26,15,10,-5,4,14,7,-41,-10,0,-6,15,-2,-2,-4,-24,-7,-6,2,2,4,-10,3,11,6,-3,2,-26,5,-11,-16,-8,-1,-11,-23,11,-15,-12,-1,-12,-8,-3,6,-12,1,-12,-2,7,-6,-5,-1,-13,3,14,-26,-9,2,3,-5,-6,-1,4,-9,-7,0,-8,4,-6,15,-17,20,1,14,-35,18,-11,16,-9,-3,-1,8,-8,1,-8,-3,3,-13,25,-21,8,0,0,-5,26,-13,-2,-4,-14,6,-5,-6,8,-4,-1,-5,-10,-9,-4,-1,4,11,-7,10,-33,17,-16,12,-3,10,-13,5,-24,-13,-34,0,-1,-12,-22,-9,-11,-17,4,-6,-22,-20,-23,0,-10,-8,-11,10,-24,0,1,14,-7,4,7,21,-6,22,14,7,61,-3,5,6,2,20,-18,16,-15,4,-1,7,30,-1,-3,12,9,-5,23,8,3,8,22,7,9,15,34,4,7,5,-7,15,4,16,21,6,-4,-8,7,-4,-13,-10,3,-9,10,-6,16,5,16,-7,35,11,21,-5,16,8,-2,16,5,6,9,4,8,-8,8,0,3,14,-10,2,-1,6,47,3,11,5,-10,5,-52,-7,-16,9,2,10,-4,9,4,6,39,19,-15,9,-17,-3,-10,-7,2,-6,-36,-17,-7,-14,17,-12,-9,-11,-11,-3,-9,-26,-12,1,-6,-8,-12,0,-25,41,-20,-12,-14,-2,-13,5,-7,34,55,25,43,33,44,20,38,4,15,8,37,2,31,-7,-13,-3,11,-6,10,3,82,-20,8,-11,-11,-5,-16,-3,-52,6,16,-7,1,-15,21,-6,-5,10,7,3,24,-6,8,3,-6,7,23,10,18,-4,6,7,-8,6,5,6,-7,6,28,-4,5,-5,-12,-1,0,-6,7,-3,74,22,8,-1,-10,-6,53,7,11,-6,12,6,-11,6,6,3,79,-17,7,5,-23,9,4,4,-6,11,32,20,27,-2,2,-6,-10,-8,10,-10,-2,-14,11,-6,-24,-21,11,-1,27,16,-6,5,4,7,-11,1,-2,5,8,10,-13,8,18,7,-2,7,10,-5,-4,-10,11,-1,-5,7,17,4,39,-6,-9,9,-1,10,63,3,-8,6,12,6,136,13,12,9,24,4,17,-3,-14,-3,23,-1,2,-5,39,2,30,-9,-2,-5,-45,-11,36,-2,5,-7,21,5,76,-8,1,7,37,-1,16,-6,5,-6,-6,-4,28,-12,10,10,16,-4,60,1,-8,9,14,4,90,-6,35,-14,60,1,8,-4,-1,-8,12,-3,70,2,17,-9,12,3,-8,7,5,4,52,-2,43,-9],[1800,650,-26,-4,20,-16,-2,-7,-18,2,-37,-8,-34,-18,-14,7,-26,-8,-5,4,-23,-3,-15,-17,12,-6,-1,-14,-10,-1,-4,-8,4,-4,-17,-6,-4,-11,-15,-2,-3,-11,-14,-9,-14,44,5,14,9,10,16,3,53,30,8,15,-12,-1,-6,-9,-26,-11,-8,13,-26,-4,-25,-16,8,-7,-37,-3,0,7,-15,2,-13,-5,-63,-2,-71,-43,16,-1,15,-8,17,4,14,-11,1,-9,-8,-10,-5,-28,-19,-21,-33,-29,-14,-6,-12,5,-23,-14,-3,-10,-22,-11,-1,-6,21,-24,-4,-17,-26,-7,-4,23,8,2,-7,8,-15,4,6,15,-10,3,-32,-10,11,15,-6,5,-26,-16,-10,-1,-5,-5,14,-13,8,-2,11,7,16,-4,1,-6,-14,-2,-19,-18,10,-5,17,-27,0,-8,-6,-2,8,-9,-4,-16,-6,-1,-24,-36,-28,-17,-51,-14,-4,-11,-5,0,0,11,-14,3,-26,-19,-2,-7,32,-38,4,-19,-1,-17,-40,-31,-1,13,-16,7,-9,16,-18,4,2,8,-9,0,-9,-42,7,0,6,-18,25,-19,12,-42,-7,-1,-21,16,-13,37,-16,19,-2,-6,5,36,-16,55,-18,-12,-12,3,1,22,-29,46,-9,0,-2,-10,-33,-3,-5,-13,-14,-7,-29,-29,-19,-7,-4,-55,-24,-24,-9,9,-31,71,-9,54,-21,-5,-13,12,4,4,-3,3,-19,11,-10,15,-49,-3,-41,6,-9,14,-18,-6,-32,14,-14,22,-21,-1,8,-23,14,-10,6,-19,2,12,6,-2,2,-18,22,1,24,23,4,-22,19,-6,11,-13,-20,-21,-1,-13,-24,-17,-29,-8,-2,-8,-35,-16,-52,-14,-9,26,0,16,-35,45,-6,24,-10,6,-24,38,-5,0,3,14,-10,-19,-15,23,33,-60,-2,-8,14,-11,6,-34,9,-6,9,-21,40,-35,-6,-7,19,-13,65,16,-1,-14,-33,-64,-74,-68,-11,-21,-5,-12,7,-9,-2,-17,13,-23,3,-39,-7,-14,-53,-37,8,-23,-1,-20,-29,-16,3,-5,-4,-21,-24,-28,-19,-17,-24,-11,-32,0,-30,-9,-12,7,-5,15,3,9,-30,46,-9,50,-25,40,0,23,18,38,1,13,-18,57,-31,39,10,42,-4,6,-9,11,-26,-5,-16,20,-24,-2,-39,-14,-26,5,-29,-9,-15,5,-34,25,-24,36,-18,13,-1,14,-9,11,11,14,2,30],[1259,-84,11,1,3,-1,-3,-3,-35,-15,5,9,19,9],[-1800,-847,9,6,47,-4,44,6,119,-15,96,-2,54,6,2,4,-107,9,7,17,-39,9,62,-2,42,10,-31,9,-58,3,-28,11,-3,11,71,-5,52,9,-1,11,13,2,6,-3,91,12,155,-2,58,8,16,-10,117,-6,5,4,-24,8,-12,15,74,-10,62,3,9,7,40,-9,37,-4,12,8,41,-9,73,10,18,10,-14,23,9,12,-1,12,4,4,43,23,52,13,6,-2,-4,-4,-44,-9,-6,-7,5,-7,-16,-3,-20,-15,25,-12,14,-15,10,-30,-36,-16,-62,-13,-66,-1,35,-12,-42,-5,-1,-8,26,-11,157,-21,15,-8,84,15,70,-4,20,7,123,11,-12,10,-59,-2,-2,12,5,2,64,14,114,16,18,6,3,4,-11,2,11,8,31,7,20,11,29,-4,5,8,26,-6,36,3,5,-4,79,17,18,-1,13,-8,26,8,17,-4,42,5,33,-8,45,2,49,8,19,12,47,-13,159,40,19,-2,23,-13,27,-7,27,6,48,-5,8,-13,-19,-11,13,-4,-12,-12,20,-4,11,2,29,22,37,4,15,12,37,11,40,0,12,10,17,-10,61,-2,39,2,31,16,34,-13,74,10,20,-8,42,-6,34,8,56,-3,60,6,3,9,24,-17,80,1,11,-10,22,-5,37,-5,18,3,73,-20,57,-2,39,-9,-19,-20,-32,-7,-25,-18,-1,-9,12,-11,23,-6,-52,-4,-20,-17,96,-29,106,-9],[-1800,690,51,-18,-1,-6,7,-3,-3,8,27,-2,20,-9,-26,-6,-5,-11,-32,11,-22,0,-5,3,2,4,-12,-2,5,-5,-6,-4],[-612,-518,26,7,8,-5,-16,-6,-18,4],[467,446,24,18,21,6,18,-1,0,-16,-17,-1,0,-7,-10,1,10,-15,12,-3,3,-17,1,8,8,2,10,-11,-18,-1,-2,-9,7,0,-3,-7,8,-3,-1,-20,-30,-1,-16,7,-3,12,7,14,8,1,-29,27,1,7,-9,9],[-645,499,27,-8,-27,8],[-966,697,10,-6,-7,-3,-35,6,16,7,16,-4],[-1065,731,11,-4,9,-17,35,-10,-1,-4,-16,-1,6,-4,-3,-3,-36,4,-73,-7,-40,15,49,4,-55,1,-5,4,23,4,-33,3,15,11,27,6,10,-2,-5,-4,23,3,13,-5,12,5,17,-13,5,4,-7,10,19,0],[-798,728,-11,5,5,5,23,-1,18,-9,-35,0],[1399,734,22,5,15,-7,-37,2],[1482,753,25,-2,-27,-3,-19,4,21,1],[1388,761,63,-5,-8,-8,-53,-2,-20,7,5,6,13,2],[-986,766,9,-3,-5,-13,-43,6,-1,7,40,3],[1028,793,26,-6,-3,-4,-57,-4,19,13,15,1],[938,810,21,3,43,-15,-3,-9,-49,1,-38,13,26,7],[-960,806,17,4,-4,2,23,1,46,-10,20,-10,-32,-10,-39,0,-11,5,9,6,-19,0,-17,8,7,4],[-916,819,61,8,23,-4,8,6,31,2,175,-5,-59,-11,22,0,-57,-17,-57,-5,14,-1,-7,-2,8,-5,-44,-13,19,-4,-27,-6,-89,3,-1,5,18,2,-5,7,33,-4,-30,9,29,9,-18,10,51,2,-58,0,-40,14],[-468,826,82,9,115,0,63,-8,-106,-7,85,1,8,-4,-11,-5,74,7,36,-6,-78,-11,23,-1,-20,-13,0,-12,12,-6,-32,-4,19,-5,2,-9,-11,0,13,-9,-22,-1,12,-4,-4,-3,-28,-2,13,-11,-25,1,27,-8,3,-8,-17,-2,-20,9,3,-6,-12,-6,41,-1,-54,-16,-41,-4,-24,-14,-56,-12,-14,-20,-16,-8,4,-8,-10,-18,-14,-1,-15,9,-20,0,-33,27,-7,16,-14,9,4,7,-7,4,10,12,15,3,6,12,-26,-6,-12,3,3,12,30,-2,-44,11,11,9,-39,29,-27,6,-72,0,-29,9,46,4,-65,6,1,4,75,10,4,4,-27,3,58,12,-5,5,55,4,42,-3,26,5,59,-7,-24,5,1,4]];
  /* fixed location table [lat, lon]; sources in MAPPING.md */
  var PLACES = {
    ECB: { lat: 50.1090, lon: 8.7032, name: "ECB, Frankfurt am Main" },
    Fed: { lat: 38.8930, lon: -77.0458, name: "Federal Reserve, Washington DC" },
    Bundestag: { lat: 52.5191, lon: 13.3763, name: "Bundestag (Reichstag), Berlin" },
    "OPEC+": { lat: 48.2143, lon: 16.3659, name: "OPEC Secretariat, Vienna" },
    Google: { lat: 37.4225, lon: -122.0856, name: "Google, Mountain View" },
    Anthropic: { lat: 37.7749, lon: -122.4194, name: "San Francisco (city level)" },
    DeepMind: { lat: 51.5333, lon: -0.1260, name: "Google DeepMind, London" },
    "pad:SLC-4E": { lat: 34.633, lon: -120.613, name: "SLC-4E, Vandenberg SFB" },
    "pad:SLC-40": { lat: 28.5619, lon: -80.5772, name: "SLC-40, Cape Canaveral SFS" },
    "pad:LC-39A": { lat: 28.6083, lon: -80.6044, name: "LC-39A, Kennedy Space Center" },
    "pad:Starbase": { lat: 25.997, lon: -97.157, name: "Starbase, Texas" }
  };
  var FEED_ORG = { ecb: "ECB", fed: "Fed", bundestag: "Bundestag", google: "Google", deepmind: "DeepMind" }; // space, spacecom = media feeds without a place
  var HUE = { geo: 352, politics: 318, economy: 212, budget: 146, crypto: 268, energy: 36, web: 186 }; // same radar palette as orbstudio canvas3d.js
  var T = null, ren = null, scene = null, cam = null, clock = null, earth = null, ringG = null, dynE = null, dynR = null, globe = null;
  var el = null, tip = null, raf = 0, onScreen = true, data = null, ok = false, updatedAt = 0, nowMs = 0;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var G = { uTime: { value: 0 }, uSun: { value: null }, uReduce: { value: reduce ? 1 : 0 } };
  var spin = { a: 0, auto: !reduce, drag: false, idle: 0, sx: 0, sy: 0, moved: false, lt: 0 };
  var anim = { waves: [], bead: null }, picks = [], pinned = null, hover = null;
  var st = { frames: 0, tris: 0, calls: 0, events: 0, states: {}, placed: [], unplaced: [], onRing: 0, offRing: [], ribbons: 0, trails: 0, feeds: [] };
  var RING_R = 1.62, RING_SPAN = 150 * Math.PI / 180, DAYS = 30, R_EARTH = 1;
  var LANG = ((document.documentElement && document.documentElement.lang) || "en").slice(0, 2);
  var TX = {
    en: { live: "on air now", soon: "upcoming", text: "ended, text available", past: "ended, no text yet", unknown: "status unknown", tcf: "time not confirmed", in: "starts in", min: "min", h: "h", d: "d", texts: "official texts", watch: "watch", src: "source", feed: "official feed", items: "entries", more: "more", nd: "no data" },
    de: { live: "jetzt live", soon: "bevorstehend", text: "beendet, Text verfügbar", past: "beendet, noch kein Text", unknown: "Status unbekannt", tcf: "Zeit nicht bestätigt", in: "beginnt in", min: "Min.", h: "Std.", d: "T.", texts: "offizielle Texte", watch: "ansehen", src: "Quelle", feed: "offizieller Feed", items: "Einträge", more: "weitere", nd: "keine Daten" },
    ru: { live: "в эфире сейчас", soon: "скоро", text: "прошло, текст есть", past: "прошло, текста пока нет", unknown: "статус неизвестен", tcf: "время не подтверждено", in: "начало через", min: "мин", h: "ч", d: "дн", texts: "официальные тексты", watch: "смотреть", src: "источник", feed: "официальная лента", items: "записей", more: "ещё", nd: "нет данных" }
  };
  var L = TX[LANG] || TX.en;
  var COL = { live: 0xff2a3a, soon: 0xffb020, text: 0x45e6ff, past: 0x4a5a78, unknown: 0xb0b8c8 };

  function num(v) { return (typeof v === "number" && isFinite(v)) ? v : null; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
  function loc(o) { if (o == null) return ""; if (typeof o === "string") return o; if (typeof o === "object") { var v = o[LANG] || o.en || o.de || o.ru; return typeof v === "string" ? v : ""; } return ""; }
  function anyText(o) { if (typeof o === "string") return o; if (o && typeof o === "object") return [o.en, o.de, o.ru].filter(function (x) { return typeof x === "string"; }).join(" "); return ""; }
  function v3(lat, lon, r) { var a = lat * Math.PI / 180, b = lon * Math.PI / 180; return new T.Vector3(Math.cos(a) * Math.sin(b) * r, Math.sin(a) * r, Math.cos(a) * Math.cos(b) * r); }
  function safeUrl(u) { return (typeof u === "string" && /^https:\/\/[^\s"'<>]+$/i.test(u)) ? u : null; }

  /* sun position (subsolar point) for a UTC time, low-precision NOAA/Meeus formulas */
  function subsolar(ms) {
    var n = ms / 864e5 - 10957.5, R = Math.PI / 180;
    var Lm = (280.46 + 0.9856474 * n) % 360, g = ((357.528 + 0.9856003 * n) % 360) * R;
    var lam = (Lm + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * R, eps = (23.439 - 0.0000004 * n) * R;
    var dec = Math.asin(Math.sin(eps) * Math.sin(lam)), ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam));
    var gmst = (280.46061837 + 360.98564736629 * n) % 360;
    var lon = ((ra / R - gmst) % 360 + 540) % 360 - 180;
    return { lat: dec / R, lon: lon };
  }

  /* ================= static scene ================= */
  function buildStatic() {
    G.uSun.value = new T.Vector3(1, 0, 0);
    // stars (decor, deterministic)
    var sp = [], i; for (i = 0; i < 700; i++) { var u = hash("s" + i) * 2 - 1, th = hash("t" + i) * Math.PI * 2, r = 40, s = Math.sqrt(1 - u * u); sp.push(Math.cos(th) * s * r, u * r, Math.sin(th) * s * r); }
    var sg = new T.BufferGeometry(); sg.setAttribute("position", new T.Float32BufferAttribute(sp, 3));
    scene.add(new T.Points(sg, new T.PointsMaterial({ color: 0x8fa8d8, size: 0.09, transparent: true, opacity: 0.7, depthWrite: false })));
    // globe body: dark hologram, day/night from the real sun, fresnel rim, terminator glow
    globe = new T.Mesh(new T.SphereGeometry(R_EARTH, 72, 48), new T.ShaderMaterial({
      uniforms: { uSun: G.uSun, uTime: G.uTime },
      vertexShader: "varying vec3 vN; varying vec3 vW; varying vec3 vO; void main(){ vO = normalize(position); vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: "uniform vec3 uSun; varying vec3 vN; varying vec3 vW; varying vec3 vO; void main(){ float d = dot(vO, normalize(uSun)); float day = smoothstep(-0.08, 0.12, d);" +
        " vec3 V = normalize(cameraPosition - vW); float fr = pow(1.0 - max(dot(normalize(vN), V), 0.0), 2.5);" +
        " vec3 c = mix(vec3(0.002,0.004,0.012), vec3(0.05,0.15,0.27), day) + vec3(0.25,0.7,1.0) * fr * (0.12 + 0.6 * day) + vec3(1.0,0.55,0.2) * exp(-pow(d / 0.06, 2.0)) * 0.1;" +
        " gl_FragColor = vec4(c, 1.0); }"
    }));
    earth.add(globe);
    // atmosphere halo (decor)
    var atm = new T.Mesh(new T.SphereGeometry(R_EARTH * 1.1, 48, 24), new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.BackSide,
      vertexShader: "varying vec3 vN; varying vec3 vW; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: "varying vec3 vN; varying vec3 vW; void main(){ vec3 V = normalize(cameraPosition - vW); float f = pow(1.0 - abs(dot(normalize(vN), V)), 3.0); gl_FragColor = vec4(vec3(0.2,0.6,1.0) * f * 0.5, 1.0); }"
    }));
    scene.add(atm);
    // graticule (15°) + Natural Earth coastline, one draw call; brighter on the day side
    var lp = [], lt = [];
    function seg(a, b, k) { lp.push(a.x, a.y, a.z, b.x, b.y, b.z); lt.push(k, k); }
    var la, lo;
    for (la = -75; la <= 75; la += 15) for (lo = -180; lo < 180; lo += 5) seg(v3(la, lo, 1.001), v3(la, lo + 5, 1.001), 0);
    for (lo = -180; lo < 180; lo += 15) for (la = -85; la < 85; la += 5) seg(v3(la, lo, 1.001), v3(la + 5, lo, 1.001), 0);
    COAST.forEach(function (ln) { var x = 0, y = 0, prev = null; for (var k = 0; k < ln.length; k += 2) { x += ln[k]; y += ln[k + 1]; var p = v3(y / 10, x / 10, 1.003); if (prev) seg(prev, p, 1); prev = p; } });
    var lg = new T.BufferGeometry(); lg.setAttribute("position", new T.Float32BufferAttribute(lp, 3)); lg.setAttribute("aK", new T.Float32BufferAttribute(lt, 1));
    earth.add(new T.LineSegments(lg, new T.ShaderMaterial({
      uniforms: { uSun: G.uSun }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: "attribute float aK; varying float vK; varying float vD; uniform vec3 uSun; void main(){ vK = aK; vD = dot(normalize(position), normalize(uSun)); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying float vK; varying float vD; void main(){ float day = smoothstep(-0.1, 0.15, vD); vec3 c = vK > 0.5 ? mix(vec3(0.10,0.22,0.45), vec3(0.5,0.98,1.0), day) : mix(vec3(0.03,0.07,0.16), vec3(0.1,0.3,0.5), day) * 0.8; gl_FragColor = vec4(c * (vK > 0.5 ? 0.95 : 0.45), 1.0); }"
    })));
    // archive core below the south pole (position = decor; ribbons into it = data)
    var core = new T.Group(); core.position.set(0, -1.5, 0);
    var oct = new T.OctahedronGeometry(0.075, 0);
    core.add(new T.LineSegments(new T.EdgesGeometry(oct), new T.LineBasicMaterial({ color: 0x8ff3ff, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false })));
    core.add(new T.Mesh(new T.SphereGeometry(0.05, 12, 8), new T.MeshBasicMaterial({ color: 0x2bd6ff, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false })));
    earth.add(core); anim.core = core;
    // time ring frame: circle arc ±30 days, day ticks, week ticks (scale, not data)
    var rp = [], N = 160, a;
    for (i = 0; i < N; i++) { var a0 = -RING_SPAN + 2 * RING_SPAN * i / N, a1 = -RING_SPAN + 2 * RING_SPAN * (i + 1) / N; rp.push(Math.sin(a0) * RING_R, 0, Math.cos(a0) * RING_R, Math.sin(a1) * RING_R, 0, Math.cos(a1) * RING_R); }
    for (i = -DAYS; i <= DAYS; i++) { a = i / DAYS * RING_SPAN; var len = i % 7 === 0 ? 0.05 : 0.02; rp.push(Math.sin(a) * (RING_R - len), 0, Math.cos(a) * (RING_R - len), Math.sin(a) * RING_R, 0, Math.cos(a) * RING_R); }
    var rg = new T.BufferGeometry(); rg.setAttribute("position", new T.Float32BufferAttribute(rp, 3));
    ringG.add(new T.LineSegments(rg, new T.LineBasicMaterial({ color: 0x3f8fd0, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false })));
    // "now" marker
    var nowM = new T.Group(); nowM.position.set(0, 0, RING_R);
    nowM.add(new T.Mesh(new T.SphereGeometry(0.028, 14, 10), new T.MeshBasicMaterial({ color: 0xffffff })));
    var halo = new T.Mesh(new T.SphereGeometry(0.07, 14, 10), new T.MeshBasicMaterial({ color: 0x9ff0ff, transparent: true, opacity: 0.3, blending: T.AdditiveBlending, depthWrite: false }));
    nowM.add(halo); anim.nowHalo = halo;
    var stem = new T.BufferGeometry(); stem.setAttribute("position", new T.Float32BufferAttribute([0, -0.12, 0, 0, 0.12, 0], 3));
    nowM.add(new T.LineSegments(stem, new T.LineBasicMaterial({ color: 0xbff6ff })));
    ringG.add(nowM);
  }

  /* ================= data scene ================= */
  function disposeTree(o) { o.traverse(function (c) { if (c.geometry) c.geometry.dispose(); if (c.material) [].concat(c.material).forEach(function (m) { m.dispose(); }); }); }
  function clearDyn() { [dynE, dynR].forEach(function (g) { if (g) { g.parent.remove(g); disposeTree(g); } }); dynE = dynR = null; }
  function padFor(e) {
    var w = anyText(e.where); if (!w) return null;
    if (/vandenberg/i.test(w)) return "pad:SLC-4E";
    if (/\b39A\b|kennedy/i.test(w)) return "pad:LC-39A";
    if (/cape canaveral/i.test(w) && /\b40\b/.test(w)) return "pad:SLC-40";
    if (/starbase|boca chica/i.test(w)) return "pad:Starbase";
    return null;
  }
  function placeKey(e) {
    if (e.kind === "launch" || e.org === "SpaceX") return padFor(e);
    return PLACES[e.org] ? e.org : null;
  }
  function hasText(e) {
    var s = e.summary, okS = !!(s && (loc(s.headline) || loc(s.text) || typeof s === "string"));
    return okS || (Array.isArray(e.official_texts) && e.official_texts.length > 0);
  }
  function stateOf(e, liveSet) {
    if (e.status === "live" || liveSet[e.id]) return "live";
    if (e.status === "upcoming") return "soon";
    if (e.status === "summarized" || e.status === "text_available" || e.status === "awaiting_text" || e.status === "ended") return hasText(e) ? "text" : "past";
    var t = Date.parse(e.start); if (!isNaN(t) && t < nowMs) return hasText(e) ? "text" : "past";
    return "unknown";
  }
  var PRI = { live: 5, soon: 4, text: 3, past: 2, unknown: 1 };
  function reaction(e) {
    // radar_reaction shape not observed in live data (all []); accepted forms: number, {value|delta|change|strength}, or array of those
    var r = e.radar_reaction, m = null, radar = typeof e.radar === "string" ? e.radar : null;
    function mag(o) { if (num(o) !== null) return Math.abs(o); if (o && typeof o === "object") { if (typeof o.radar === "string") radar = o.radar; var k = ["magnitude", "strength", "delta", "change", "value"]; for (var i = 0; i < k.length; i++) if (num(o[k[i]]) !== null) return Math.abs(o[k[i]]); } return null; }
    if (Array.isArray(r)) r.forEach(function (o) { var x = mag(o); if (x !== null) m = Math.max(m || 0, x); }); else m = mag(r);
    return m === null ? null : { m: m, radar: radar };
  }

  function build() {
    clearDyn(); picks = []; anim.waves = []; anim.bead = null; pinned = null; hover = null; hideTip();
    st.events = 0; st.states = {}; st.placed = []; st.unplaced = []; st.onRing = 0; st.offRing = []; st.ribbons = 0; st.trails = 0; st.feeds = [];
    dynE = new T.Group(); earth.add(dynE); dynR = new T.Group(); ringG.add(dynR);
    var d = data, evs = (d && Array.isArray(d.events)) ? d.events : [];
    updatedAt = d && Date.parse(d.updated); if (!updatedAt || isNaN(updatedAt)) updatedAt = 0;
    nowMs = updatedAt || Date.now();
    var ss = subsolar(nowMs); G.uSun.value.copy(v3(ss.lat, ss.lon, 1)).normalize();
    var liveSet = {}; (d && Array.isArray(d.live_now) ? d.live_now : []).forEach(function (id) { if (typeof id === "string") liveSet[id] = 1; });
    var groups = {}, gorder = [], list = [];
    evs.forEach(function (e) {
      if (!e || typeof e !== "object" || typeof e.id !== "string") return;
      st.events++; var s = stateOf(e, liveSet); st.states[s] = (st.states[s] || 0) + 1;
      var k = placeKey(e), item = { e: e, s: s, k: k, ph: hash(e.id), t: Date.parse(e.start) };
      list.push(item);
      if (!k) { st.unplaced.push(e.id + " (" + (e.org || "?") + ")"); return; }
      if (!groups[k]) { groups[k] = []; gorder.push(k); } groups[k].push(item);
    });
    gorder.sort();
    // beacons (Points, one draw call) + pick spheres + per-location extras
    var bp = [], bc = [], bs = [], bm = [], bph = [];
    function pt(p, col, size, mode, ph) { bp.push(p.x, p.y, p.z); var c = new T.Color(col); bc.push(c.r, c.g, c.b); bs.push(size); bm.push(mode); bph.push(ph); }
    var dash = [], rib = [], trails = [];
    gorder.forEach(function (k) {
      var P = PLACES[k], items = groups[k].sort(function (a, b) { return (a.t || 0) - (b.t || 0); });
      st.placed.push(k + " ×" + items.length);
      var n = v3(P.lat, P.lon, 1).normalize(), base = n.clone().multiplyScalar(1.006);
      var dom = items.reduce(function (best, it) {
        if (!best || PRI[it.s] > PRI[best.s]) return it;
        if (PRI[it.s] === PRI[best.s]) { if (it.s === "soon" ? it.t < best.t : it.t > best.t) return it; }
        return best;
      }, null);
      var mode = dom.s === "live" ? 1 : dom.s === "soon" ? 2 : 0, size = dom.s === "past" ? 0.5 : dom.s === "unknown" ? 0.6 : 1;
      if (dom.s === "soon" && dom.t) size *= 0.75 + 0.35 * Math.exp(-Math.max(0, dom.t - nowMs) / (14 * 864e5));
      pt(base, COL[dom.s], size, mode, dom.ph);
      // small pips: one per event around the location (each in its own state colour)
      var tA = new T.Vector3(0, 1, 0).cross(n).normalize(); if (tA.lengthSq() < 1e-6) tA.set(1, 0, 0); var tB = n.clone().cross(tA).normalize();
      if (items.length > 1) items.forEach(function (it, i) {
        var ang = i / items.length * Math.PI * 2, rr = 0.03 + 0.003 * items.length;
        var p = base.clone().addScaledVector(tA, Math.cos(ang) * rr).addScaledVector(tB, Math.sin(ang) * rr);
        pt(p, COL[it.s], it.s === "past" ? 0.22 : 0.3, 0, it.ph);
      });
      // time_confirmed === false on the dominant event -> dashed ring
      if (dom.e.time_confirmed === false) { for (var q = 0; q < 24; q += 2) { var a0 = q / 24 * Math.PI * 2, a1 = (q + 1) / 24 * Math.PI * 2, r0 = 0.055; var p0 = base.clone().addScaledVector(tA, Math.cos(a0) * r0).addScaledVector(tB, Math.sin(a0) * r0), p1 = base.clone().addScaledVector(tA, Math.cos(a1) * r0).addScaledVector(tB, Math.sin(a1) * r0); dash.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z); } }
      // live: radio waves (radar colour + strength from radar_reaction if present, else red)
      if (dom.s === "live") {
        var rx = reaction(dom.e), wc = COL.live, amp = 1;
        if (rx) { wc = new T.Color().setHSL((HUE[rx.radar] != null ? HUE[rx.radar] : 0) / 360, 0.95, 0.6).getHex(); amp = clamp(0.6 + rx.m / 10, 0.6, 2.2); }
        for (var w = 0; w < 3; w++) {
          var ring = new T.Mesh(new T.RingGeometry(0.9, 1, 48), new T.MeshBasicMaterial({ color: wc, transparent: true, opacity: 0.6, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
          ring.position.copy(n.clone().multiplyScalar(1.008)); ring.lookAt(n.clone().multiplyScalar(2)); ring.scale.setScalar(0.05);
          dynE.add(ring); anim.waves.push({ m: ring, off: w / 3 + dom.ph, amp: amp });
        }
        var spike = new T.BufferGeometry(); spike.setAttribute("position", new T.Float32BufferAttribute([base.x, base.y, base.z, n.x * 1.28, n.y * 1.28, n.z * 1.28], 3));
        var spm = new T.LineBasicMaterial({ color: wc, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false }); dynE.add(new T.LineSegments(spike, spm)); anim.spike = spm;
      }
      // past with text -> ribbon into the archive core (one per event with text)
      items.forEach(function (it) {
        if (it.s !== "text") return;
        var off = (it.ph - 0.5) * 0.5, side = new T.Vector3(n.x, 0, n.z); if (side.lengthSq() < 1e-6) side.set(1, 0, 0); side.normalize();
        var c = new T.CubicBezierCurve3(base.clone(), n.clone().multiplyScalar(1.18 + off * 0.1), side.clone().multiplyScalar(1.05 + off * 0.2).add(new T.Vector3(0, -1.15, 0)), new T.Vector3(0, -1.5, 0));
        rib.push({ c: c, ph: it.ph }); st.ribbons++;
      });
      // SpaceX launches: past -> trail pad->orbit, future -> dashed trajectory (heading schematic, not in data)
      if (/^pad:/.test(k)) items.forEach(function (it) {
        if (!(it.s === "text" || it.s === "past" || it.s === "soon" || it.s === "live")) return;
        var east = tA.clone(), hd = (it.ph - 0.5) * 1.2, dir = east.multiplyScalar(Math.cos(hd)).addScaledVector(tB, Math.sin(hd));
        var p0 = base.clone(), p1 = n.clone().multiplyScalar(1.12).addScaledVector(dir, 0.04), p2 = n.clone().multiplyScalar(1.0).addScaledVector(dir, 0.32).normalize().multiplyScalar(1.16);
        trails.push({ c: new T.QuadraticBezierCurve3(p0, p1, p2), future: it.s === "soon", ph: it.ph }); st.trails++;
      });
      // pick target
      var hit = new T.Mesh(new T.SphereGeometry(0.07, 8, 6), new T.MeshBasicMaterial({ visible: false })); hit.position.copy(base); hit.userData.pick = { place: P, items: items }; dynE.add(hit); picks.push(hit);
    });
    if (bp.length) {
      var bg = new T.BufferGeometry(); bg.setAttribute("position", new T.Float32BufferAttribute(bp, 3)); bg.setAttribute("aCol", new T.Float32BufferAttribute(bc, 3)); bg.setAttribute("aSize", new T.Float32BufferAttribute(bs, 1)); bg.setAttribute("aMode", new T.Float32BufferAttribute(bm, 1)); bg.setAttribute("aPh", new T.Float32BufferAttribute(bph, 1));
      dynE.add(new T.Points(bg, new T.ShaderMaterial({
        uniforms: { uTime: G.uTime, uReduce: G.uReduce, uPx: G.uPx }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
        vertexShader: "attribute vec3 aCol; attribute float aSize, aMode, aPh; uniform float uTime, uReduce, uPx; varying vec3 vC; varying float vA;" +
          "void main(){ float k = 1.0; if (uReduce < 0.5) { if (aMode > 0.5 && aMode < 1.5) k = 0.55 + 0.45 * step(0.5, fract(uTime * 1.1 + aPh)) + 0.3 * sin(uTime * 9.0); if (aMode > 1.5) k = 0.8 + 0.2 * sin(uTime * 1.6 + aPh * 6.28); }" +
          " vC = aCol * k; vA = k; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = aSize * 115.0 * uPx / -mv.z * (aMode > 0.5 && aMode < 1.5 ? 1.6 : 1.0); gl_Position = projectionMatrix * mv; }",
        fragmentShader: "varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); float core = smoothstep(0.16, 0.06, d), halo = exp(-d * d * 18.0); gl_FragColor = vec4(vC * (halo * 0.8 + core * 1.2), 1.0); if (d > 0.5) discard; }"
      })));
    }
    if (dash.length) { var dg = new T.BufferGeometry(); dg.setAttribute("position", new T.Float32BufferAttribute(dash, 3)); dynE.add(new T.LineSegments(dg, new T.LineBasicMaterial({ color: 0xe8f0ff, transparent: true, opacity: 0.85, blending: T.AdditiveBlending, depthWrite: false }))); }
    // ribbons + trails: tubes merged into one geometry each (one draw call)
    function tubes(arr, rad, colFn) {
      if (!arr.length) return null;
      var pos = [], uu = [], cc = [], ph = [], fut = [];
      arr.forEach(function (r) {
        var g = new T.TubeGeometry(r.c, 40, rad, 4, false).toNonIndexed(), p = g.attributes.position.array, uv = g.attributes.uv.array, col = colFn(r);
        for (var i = 0; i < p.length / 3; i++) { pos.push(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]); uu.push(uv[i * 2]); cc.push(col.r, col.g, col.b); ph.push(r.ph); fut.push(r.future ? 1 : 0); }
        g.dispose();
      });
      var bg = new T.BufferGeometry(); bg.setAttribute("position", new T.Float32BufferAttribute(pos, 3)); bg.setAttribute("aU", new T.Float32BufferAttribute(uu, 1)); bg.setAttribute("aCol", new T.Float32BufferAttribute(cc, 3)); bg.setAttribute("aPh", new T.Float32BufferAttribute(ph, 1)); bg.setAttribute("aFut", new T.Float32BufferAttribute(fut, 1));
      return new T.Mesh(bg, new T.ShaderMaterial({
        uniforms: { uTime: G.uTime, uReduce: G.uReduce }, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
        vertexShader: "attribute float aU, aPh, aFut; attribute vec3 aCol; varying float vU, vPh, vFut; varying vec3 vC; void main(){ vU = aU; vPh = aPh; vFut = aFut; vC = aCol; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: "uniform float uTime, uReduce; varying float vU, vPh, vFut; varying vec3 vC; void main(){ float flow = uReduce > 0.5 ? 0.0 : exp(-pow((fract(vU - uTime * 0.18 - vPh) - 0.5) * 7.0, 2.0)); float a = 0.35 + 0.65 * flow;" +
          " if (vFut > 0.5) { if (fract(vU * 14.0) > 0.55) discard; a = 0.7; } else a *= (0.35 + 0.65 * vU); gl_FragColor = vec4(vC * a, 1.0); }"
      }));
    }
    var rm = tubes(rib, 0.0028, function () { return new T.Color(0x45e6ff).multiplyScalar(0.6); }); if (rm) dynE.add(rm);
    var tm = tubes(trails, 0.004, function (r) { return r.future ? new T.Color(0xffb020) : new T.Color(0xdff6ff); }); if (tm) dynE.add(tm);
    // official feeds: thin beams from org points, brightness = entry count; 0 entries -> dotted stub; feed without a place -> none
    var feeds = d && d.official_feeds && typeof d.official_feeds === "object" ? d.official_feeds : null;
    if (feeds) {
      var fp = [], fc = [], maxI = 1;
      Object.keys(feeds).forEach(function (k) { var it = feeds[k] && num(feeds[k].items); if (it !== null) maxI = Math.max(maxI, it); });
      Object.keys(feeds).sort().forEach(function (k) {
        var org = FEED_ORG[k], P = org && PLACES[org], it = feeds[k] && num(feeds[k].items);
        if (!P || it === null) { st.feeds.push(k + ": " + (P ? "no count" : "no place")); return; }
        st.feeds.push(k + ": " + it); var n = v3(P.lat, P.lon, 1).normalize(), b = clamp(it / Math.max(24, maxI), 0, 1);
        var off = new T.Vector3(0.012, 0, 0).applyAxisAngle(n, hash(k) * 6.28); // keep co-located beams apart
        if (it === 0) { for (var q = 0; q < 4; q++) { var a0 = 1.02 + q * 0.03; fp.push(n.x * a0 + off.x, n.y * a0 + off.y, n.z * a0 + off.z, n.x * (a0 + 0.012) + off.x, n.y * (a0 + 0.012) + off.y, n.z * (a0 + 0.012) + off.z); fc.push(0.3, 0.35, 0.4, 0.3, 0.35, 0.4); } return; }
        fp.push(n.x * 1.01 + off.x, n.y * 1.01 + off.y, n.z * 1.01 + off.z, n.x * 1.42 + off.x, n.y * 1.42 + off.y, n.z * 1.42 + off.z);
        fc.push(0.55 * b + 0.05, 0.85 * b + 0.05, 1.0 * b + 0.08, 0, 0, 0);
        var hit = new T.Mesh(new T.CylinderGeometry(0.015, 0.015, 0.4, 5), new T.MeshBasicMaterial({ visible: false })); hit.position.copy(n.clone().multiplyScalar(1.21).add(off)); hit.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), n);
        hit.userData.pick = { feed: k, items: it, url: feeds[k].url, place: P }; dynE.add(hit); picks.push(hit);
      });
      if (fp.length) { var fg = new T.BufferGeometry(); fg.setAttribute("position", new T.Float32BufferAttribute(fp, 3)); fg.setAttribute("color", new T.Float32BufferAttribute(fc, 3)); dynE.add(new T.LineSegments(fg, new T.LineBasicMaterial({ vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false }))); }
    }
    buildRing(list, d);
  }

  function dayAngle(days) { return clamp(days / DAYS, -1, 1) * RING_SPAN; }
  function buildRing(list, d) {
    var tp = [], tc = [];
    list.forEach(function (it) {
      if (!it.t || isNaN(it.t)) { st.offRing.push(it.e.id + " (no start)"); return; }
      var days = (it.t - nowMs) / 864e5;
      if (Math.abs(days) > DAYS) { st.offRing.push(it.e.id); return; }
      st.onRing++; var a = dayAngle(days), s = Math.sin(a), c = Math.cos(a), col = new T.Color(COL[it.s]), h = it.s === "past" ? 0.06 : 0.1, j = (it.ph - 0.5) * 0.01;
      if (it.e.time_confirmed === false) { for (var q = 0; q < 4; q++) { var y0 = 0.012 + q * h / 4, y1 = y0 + h / 8; tp.push(s * RING_R, y0, c * RING_R, s * RING_R, y1, c * RING_R); tc.push(col.r, col.g, col.b, col.r, col.g, col.b); } }
      else { tp.push(s * RING_R, 0.012, c * RING_R, s * RING_R, 0.012 + h, c * RING_R); tc.push(col.r, col.g, col.b, col.r, col.g, col.b); }
      var hit = new T.Mesh(new T.BoxGeometry(0.03, 0.14, 0.03), new T.MeshBasicMaterial({ visible: false })); hit.position.set(s * RING_R, 0.06, c * RING_R); hit.userData.pick = { place: it.k ? PLACES[it.k] : null, items: [it] }; dynR.add(hit); picks.push(hit);
    });
    if (tp.length) { var g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(tp, 3)); g.setAttribute("color", new T.Float32BufferAttribute(tc, 3)); dynR.add(new T.LineSegments(g, new T.LineBasicMaterial({ vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false }))); }
    // next_event bead: position from starts_in_min, counting down in real time since update(); glowing arc to "now"
    var ne = d && d.next_event, sim = ne && num(ne.starts_in_min);
    if (sim !== null) {
      var arc = [], N = 120; for (var i = 0; i < N; i++) { var f0 = i / N, f1 = (i + 1) / N; arc.push(f0, f1); }
      var pos = new Float32Array(N * 2 * 3), ag = new T.BufferGeometry(); ag.setAttribute("position", new T.BufferAttribute(pos, 3)); ag.setAttribute("aF", new T.Float32BufferAttribute(arc, 1));
      var am = new T.ShaderMaterial({
        uniforms: { uEnd: { value: 0 }, uR: { value: RING_R + 0.03 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
        vertexShader: "attribute float aF; uniform float uEnd, uR; varying float vF; void main(){ vF = aF; float a = aF * uEnd; vec3 p = vec3(sin(a) * uR, 0.0, cos(a) * uR); gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }",
        fragmentShader: "varying float vF; void main(){ gl_FragColor = vec4(vec3(1.0,0.7,0.2) * (0.15 + 0.6 * vF), 1.0); }"
      });
      var arcL = new T.LineSegments(ag, am); arcL.frustumCulled = false; dynR.add(arcL);
      var bead = new T.Mesh(new T.SphereGeometry(0.03, 14, 10), new T.MeshBasicMaterial({ color: 0xffb020 })); dynR.add(bead);
      var bh = new T.Mesh(new T.SphereGeometry(0.065, 14, 10), new T.MeshBasicMaterial({ color: 0xffb020, transparent: true, opacity: 0.3, blending: T.AdditiveBlending, depthWrite: false })); bead.add(bh);
      var neItem = null; list.forEach(function (it) { if (it.e.id === ne.id) neItem = it; });
      bead.userData.pick = { place: neItem && neItem.k ? PLACES[neItem.k] : null, items: neItem ? [neItem] : [], next: ne }; picks.push(bead);
      anim.bead = { m: bead, arc: am, sim: sim, t0: performance.now() };
      placeBead(0);
    }
  }
  function placeBead(elMin) {
    var b = anim.bead; if (!b) return;
    var days = Math.max(0, b.sim - elMin) / 1440, a = dayAngle(days);
    b.m.position.set(Math.sin(a) * (RING_R + 0.03), 0, Math.cos(a) * (RING_R + 0.03)); b.arc.uniforms.uEnd.value = a;
    b.beyond = days > DAYS; // beyond +30 d the bead parks at the ring end
  }

  /* ================= tooltip ================= */
  function hideTip() { if (tip) tip.style.display = "none"; }
  function row(box, txt, css) { var r = document.createElement("div"); if (css) r.style.cssText = css; r.textContent = txt; box.appendChild(r); return r; }
  function link(box, u, label) { var s = safeUrl(u); if (!s) return; var a = document.createElement("a"); a.href = s; a.target = "_blank"; a.rel = "noopener noreferrer nofollow"; a.textContent = label + " ↗"; a.style.cssText = "color:#8fe9ff;display:inline-block;margin-right:8px"; box.appendChild(a); }
  function fmtTime(s) { var t = Date.parse(s); if (isNaN(t)) return L.nd; try { return new Date(t).toLocaleString(LANG, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }); } catch (x) { return new Date(t).toISOString(); } }
  function fmtIn(m) { if (m === null) return null; if (m < 60) return Math.round(m) + " " + L.min; if (m < 2880) return Math.round(m / 60) + " " + L.h; return Math.round(m / 1440) + " " + L.d; }
  function showTip(info, px, py) {
    if (!tip) return; while (tip.firstChild) tip.removeChild(tip.firstChild);
    if (info.feed) {
      row(tip, L.feed + ": " + info.feed, "font-weight:600"); if (info.place) row(tip, info.place.name, "opacity:.7"); row(tip, info.items + " " + L.items); link(tip, info.url, L.src);
    } else {
      if (info.place) row(tip, info.place.name, "font-weight:600;margin-bottom:2px");
      var items = info.items.slice().sort(function (a, b) { return PRI[b.s] - PRI[a.s] || (b.t || 0) - (a.t || 0); });
      items.slice(0, 4).forEach(function (it) {
        var e = it.e, box = document.createElement("div"); box.style.cssText = "border-top:1px solid rgba(140,200,255,.25);padding-top:4px;margin-top:4px"; tip.appendChild(box);
        row(box, loc(e.title) || ((typeof e.org === "string" ? e.org + " · " : "") + e.id), "font-weight:600");
        row(box, fmtTime(e.start), "opacity:.85");
        var sl = L[it.s] || it.s; var si = num(e.starts_in_min); if (it.s === "soon" && si !== null) sl += " · " + L.in + " " + fmtIn(si);
        row(box, sl, "color:#" + new T.Color(COL[it.s]).getHexString());
        if (e.time_confirmed === false) row(box, L.tcf, "opacity:.75");
        var hl = e.summary && loc(e.summary.headline); if (hl) row(box, hl);
        if (Array.isArray(e.official_texts) && e.official_texts.length) { row(box, L.texts + ": " + e.official_texts.length, "opacity:.75"); var lb = document.createElement("div"); box.appendChild(lb); e.official_texts.slice(0, 2).forEach(function (o, i) { if (o) link(lb, o.url, (typeof o.source === "string" ? o.source : L.src) + (i ? " " + (i + 1) : "")); }); }
        var ln = document.createElement("div"); box.appendChild(ln); link(ln, e.watch_url, L.watch); link(ln, e.source_url, L.src);
      });
      if (items.length > 4) row(tip, "+" + (items.length - 4) + " " + L.more, "opacity:.6;margin-top:4px");
    }
    tip.style.display = "block";
    var W = el.clientWidth, H = el.clientHeight, tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = clamp(px + 14, 6, Math.max(6, W - tw - 6)) + "px"; tip.style.top = clamp(py - th / 2, 6, Math.max(6, H - th - 6)) + "px";
  }
  var ray = null, ndc = null;
  function pickAt(px, py) {
    if (!picks.length) return null;
    ndc.set(px / el.clientWidth * 2 - 1, -(py / el.clientHeight) * 2 + 1); ray.setFromCamera(ndc, cam);
    var hit = ray.intersectObjects([globe].concat(picks), false), feed = null, gd = Infinity;
    for (var i = 0; i < hit.length; i++) if (hit[i].object === globe) { gd = hit[i].distance; break; }
    for (i = 0; i < hit.length; i++) {
      var o = hit[i].object, pk = o.userData.pick;
      if (!pk || hit[i].distance > gd + 0.08) continue;   // behind the globe
      if (pk.feed) { if (!feed) feed = pk; continue; }    // events win over feed beams at the same spot
      return pk;
    }
    return feed;
  }

  /* ================= controls ================= */
  function bindControls(cv) {
    cv.style.touchAction = "pan-y"; var id = null;
    cv.addEventListener("pointerdown", function (e) { id = e.pointerId; spin.sx = e.clientX; spin.sy = e.clientY; spin.moved = false; spin.drag = false; });
    cv.addEventListener("pointermove", function (e) {
      var rc = cv.getBoundingClientRect(), px = e.clientX - rc.left, py = e.clientY - rc.top;
      if (id === e.pointerId) {
        var dx = e.clientX - spin.sx, dy = e.clientY - spin.sy;
        if (!spin.drag && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) { spin.drag = true; spin.auto = false; try { cv.setPointerCapture(e.pointerId); } catch (x) {} }
        if (spin.drag) { spin.a += dx * 0.008; spin.sx = e.clientX; spin.sy = e.clientY; spin.moved = true; spin.idle = performance.now(); hideTip(); pinned = null; }
      } else if (e.pointerType === "mouse" && !pinned) { var inf = pickAt(px, py); hover = inf; el.style.cursor = inf ? "pointer" : ""; if (inf) showTip(inf, px, py); else hideTip(); }
    });
    function end(e) {
      if (id !== e.pointerId) return; id = null;
      if (!spin.moved && e.type === "pointerup") { var rc = cv.getBoundingClientRect(), px = e.clientX - rc.left, py = e.clientY - rc.top, inf = pickAt(px, py); if (inf) { pinned = inf; showTip(inf, px, py); } else { pinned = null; hideTip(); } }
      spin.drag = false; spin.idle = performance.now();
    }
    cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
    cv.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse" && !pinned) hideTip(); });
  }

  /* ================= loop ================= */
  function resize() {
    if (!ren) return; var w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight), pr = Math.min(window.devicePixelRatio || 1, 1.75);
    ren.setPixelRatio(pr); ren.setSize(w, h, false); cam.aspect = w / h;
    var vh = Math.tan(cam.fov * Math.PI / 360), need = 1.62, dist = Math.max(need / vh, 1.9 / (vh * cam.aspect));
    cam.position.set(0, Math.sin(0.3) * dist, Math.cos(0.3) * dist); cam.lookAt(0, -0.3, 0); cam.updateProjectionMatrix();
    G.uPx.value = h * pr / 600;
  }
  function frame() {
    raf = 0; if (!onScreen || document.hidden || !ren) return;
    var t = clock.getElapsedTime(), now = performance.now(); G.uTime.value = t;
    var dt = Math.min(0.1, t - (spin.lt || t)); spin.lt = t;
    if (!spin.drag && !spin.auto && !reduce && now - spin.idle > 4000) spin.auto = true;
    if (spin.auto && !reduce) spin.a += dt * 0.07;
    earth.rotation.y = spin.a;
    anim.waves.forEach(function (w) { var f = reduce ? (w.off % 1) * 0.6 + 0.2 : (t * 0.45 + w.off) % 1; w.m.scale.setScalar(0.03 + f * 0.42 * w.amp); w.m.material.opacity = 0.75 * (1 - f); });
    if (anim.spike) anim.spike.opacity = reduce ? 0.8 : 0.5 + 0.5 * step(t * 1.1);
    if (anim.nowHalo) anim.nowHalo.scale.setScalar(reduce ? 1 : 1 + 0.25 * Math.sin(t * 2.2));
    if (anim.core) anim.core.rotation.y = reduce ? 0 : t * 0.4;
    if (anim.bead && (st.frames % 30 === 0)) placeBead((now - anim.bead.t0) / 60000);
    ren.render(scene, cam); st.tris = ren.info.render.triangles; st.calls = ren.info.render.calls; st.frames++;
    loop();
  }
  function step(x) { return (x % 1) > 0.5 ? 1 : 0; }
  function loop() { if (!raf && ren && onScreen && !document.hidden) raf = requestAnimationFrame(frame); }

  function init(target) {
    try {
      if (ok) return true;
      T = window.THREE; if (!T || !target) return false;
      var cv = document.createElement("canvas"), gl = null;
      try { gl = cv.getContext("webgl", { antialias: true }) || cv.getContext("experimental-webgl"); } catch (x) { gl = null; }
      if (!gl) return false;
      el = target; if (getComputedStyle(el).position === "static") el.style.position = "relative";
      ren = new T.WebGLRenderer({ canvas: cv, context: gl, antialias: true }); ren.setClearColor(0x03050c, 1);
      cv.style.cssText = "display:block;width:100%;height:100%"; el.appendChild(cv);
      scene = new T.Scene(); earth = new T.Group(); scene.add(earth);
      ringG = new T.Group(); ringG.position.y = -0.2; ringG.rotation.z = -0.05; scene.add(ringG);
      cam = new T.PerspectiveCamera(30, 1.6, 0.1, 200); clock = new T.Clock(); ray = new T.Raycaster(); ndc = new T.Vector2();
      G.uPx = { value: 1 };
      spin.a = -(-22) * Math.PI / 180; // start with the Atlantic (Europe + Americas) facing the viewer
      tip = document.createElement("div");
      tip.style.cssText = "position:absolute;display:none;max-width:320px;padding:8px 10px;border-radius:8px;background:rgba(6,12,28,.93);border:1px solid rgba(120,200,255,.35);color:#e6f2ff;font:12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;z-index:5;box-shadow:0 6px 24px rgba(0,0,0,.45)";
      el.appendChild(tip);
      buildStatic(); bindControls(cv); resize();
      if (window.ResizeObserver) new ResizeObserver(resize).observe(el); else window.addEventListener("resize", resize);
      if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; loop(); }, { threshold: 0.02 }).observe(el);
      document.addEventListener("visibilitychange", loop);
      ok = true; build(); loop(); return true;
    } catch (err) { if (window.console) console.warn("[OrbLive3D] init failed", err); return false; }
  }
  function update(d) {
    data = (d && typeof d === "object") ? d : null; if (!ok) return;
    try { build(); } catch (err) { if (window.console) console.warn("[OrbLive3D] update failed", err); try { data = null; build(); } catch (e2) {} }
  }
  function stats() { return { frames: st.frames, triangles: st.tris, calls: st.calls, events: st.events, states: st.states, placed: st.placed.slice(), unplaced: st.unplaced.slice(), onRing: st.onRing, offRing: st.offRing.slice(), ribbons: st.ribbons, trails: st.trails, feeds: st.feeds.slice(), reducedMotion: reduce }; }
  window.OrbLive3D = { init: init, update: update, stats: stats };
})();
