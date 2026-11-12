/* Orb Studio · Капитанская рубка в 3D: мостик корабля, голографические панели на реальных полях /api/v1/bridge.
   За окном — декор (звёзды, туманность, Земля по Natural Earth 1:110m, public domain). Все цифры на панелях — из данных,
   нет поля — нет элемента. Рубка ничего не решает и не прогнозирует. */
(function () {
  "use strict";
  // контуры материков: Natural Earth 1:110m coastline (public domain), квантовано 0.1°, delta-кодировано
  var COAST = [[-1637,-786,25,2,20,-11,-19,-1,-26,10],[-62,539,2,-7,-8,-9,-32,-5,8,11,-5,10,21,12,19,-5,-5,-7],[1410,-26,36,-13,14,-16,16,-6,3,-5,-9,-1,2,-7,35,-32,-28,5,-19,20,-13,5,-14,-6,1,-8,-8,-3,-35,12,-15,-3,11,11,-8,19,-42,19,-7,-6,-10,13,17,6,-15,0,-17,13,19,5,16,-4,4,-20,11,-6,19,17,36,-9],[1142,45,25,24,25,-15,-19,-22,6,-14,11,-9,-12,-1,-3,-16,-9,-7,-5,-25,-1,3,-11,-4,-16,10,-12,-4,-4,5,-15,1,-1,13,-10,11,0,18,6,7,15,-1,2,8,16,4,12,14],[-936,750,-6,-4,-26,3,19,7,13,-6],[-938,775,-26,3,26,-3],[-968,788,12,-4,-17,-5,-13,10,18,-1],[-882,744,-42,4,-5,11,-10,4,-32,5,4,4,51,-4,9,-4,-3,-3,18,-5,81,1,10,-4,3,-4,-7,-2,-77,-3],[-1113,782,14,-2,-3,-3,-33,0,22,5],[-1110,788,13,-2,-28,-2,15,4],[-823,232,40,-7,41,-22,-36,-4,7,5,-10,3,-6,9,-31,6,-4,2,4,2,-32,-7,27,13],[-556,513,-12,-15,7,4,6,-3,-3,-3,23,-4,-3,-7,7,2,5,-12,-5,-8,-11,1,0,10,-12,-9,-6,0,7,5,-10,2,-30,0,5,7,-4,2,18,22,15,9,3,-3],[-839,651,38,-14,-9,-3,-21,7,-24,-10,-4,5,-13,-1,8,5,5,17,20,-6],[-788,724,10,3,36,-9,1,-5,19,3,34,-11,18,-13,-18,-5,69,-18,-20,-19,-28,14,-13,-1,-1,-6,28,-13,6,-10,-3,-7,-38,10,26,-18,-48,10,-38,18,-29,-5,-9,4,7,7,39,2,1,8,12,10,-6,8,-36,8,7,2,-28,11,-23,-5,-74,7,-8,4,10,4,-14,0,-3,10,18,13,26,3,-8,-6,8,-7,9,8,26,5,17,-11,-1,-6,19,3],[-945,741,40,-2,-38,-19,-11,1,-6,13,15,7],[-1004,727,-11,7,11,4,30,0,3,-3,-10,-5,16,-4,-2,-9,-17,-4,-41,12,21,2],[-1078,758,19,2,2,-5,-6,-5,-59,-6,-17,3,21,5,-59,0,23,13,63,-10,-14,9,9,4,11,-1,7,-9],[-1229,761,38,14,29,1,-1,-7,-8,-4,-58,-4],[-1215,744,39,-2,21,-7,-37,-10,-13,-11,-26,-5,-28,10,20,18,-10,6,34,1],[-1532,580,11,-4,-19,-9,-5,3,-2,5,15,5],[-1254,500,15,-9,4,-6,-5,-1,-44,21,30,-5],[-1717,638,30,-5,-8,-3,-21,3,-1,5],[-1055,793,47,-5,11,-9,-55,5,10,3,-13,6],[263,353,-16,-4,-12,4,2,4,26,-4],[495,-125,9,-32,-7,0,1,-12,-27,-80,-17,-7,-14,6,-7,22,1,15,11,19,-5,20,4,12,19,4,14,12,15,26,3,-5],[-487,-780,20,2,28,-7,6,-15,-72,-10,-37,4,32,10,23,16],[-663,-803,44,-1,13,8,10,-4,-6,-10,-43,1,-18,6],[-739,-713,18,1,4,17,14,6,20,-25,-5,-8,-36,-3,5,4,-31,0,0,4,11,4],[-1023,-719,55,-1,6,-5,-46,0,-15,6],[-1226,-737,39,2,-15,-6,-24,4],[-1273,-735,33,-4,-33,4],[1658,-211,13,-11,-9,1,-22,20,18,-10],[1513,-58,-16,-5,-14,6,15,2,3,5,1,-5,6,0,8,7,-1,6,6,1,2,-8,-10,-9],[1769,-401,-9,-12,-8,-4,-5,4,5,8,-14,10,8,7,1,14,-21,29,17,-8,17,-23,25,-1,-5,-15,-8,1,-3,-10],[1697,-436,31,31,4,-8,8,4,2,-4,-15,-21,4,-5,-16,-3,-9,-17,-13,-7,-28,7,32,23],[1477,-408,6,-1,-4,-23,-19,-3,-13,28,17,-4,13,3],[1261,-322,-19,-8,-5,-9,-38,-1,-19,-11,-14,1,-16,8,8,20,-25,61,5,-4,-4,9,8,-7,-8,19,3,19,4,7,1,-7,25,18,42,10,21,33,4,-9,5,2,-4,5,3,5,5,-2,14,21,14,4,13,-11,12,-1,-2,6,12,19,20,4,-8,8,6,2,29,-11,12,3,5,-5,-10,-9,-5,-17,47,-27,11,13,4,40,8,17,14,-38,7,3,8,-8,10,-40,24,-14,9,-19,10,-1,2,-11,20,-18,7,-28,-7,-35,-26,-41,-3,-17,-37,-16,-14,6,1,5,-14,-9,-30,8,-10,19,-15,5,1,12,-14,-9,11,17,-1,7,-18,-20,-8,4,-9,19,-30,11,-52,-7],[818,75,-2,-10,-13,-5,-6,22,4,16,17,-23],[1294,-28,11,-3,3,-8,-29,5,2,6,13,0],[1279,22,8,-11,-6,-20,-7,19,5,12],[1229,9,22,7,-7,-12,-42,-2,-2,-7,9,-9,24,8,-18,-13,17,-34,-10,0,5,8,-12,-1,-5,20,-7,-3,1,-26,-6,-2,-4,3,1,19,-7,7,10,30,11,11,20,-4],[1213,-85,16,4,-1,-5,-15,-3,-14,5,14,-1],[1085,-64,41,-5,4,-7,27,-8,-11,-4,-81,14,-11,5,7,10,24,-5],[1044,-11,5,-12,12,-8,-3,-28,-11,0,-33,31,-28,46,-33,37,22,-3,31,-31,19,-7,13,-13,-4,-8,10,-4],[1264,84,1,-12,-3,-9,-4,10,-4,-5,0,-12,-12,6,0,12,-6,4,-17,-6,16,15,3,-5,17,8,-1,8,8,-5,2,-9],[1218,244,-11,-24,-6,16,14,17,3,-9],[1419,392,-9,-10,-7,-31,-31,-5,-14,-11,-7,3,0,8,-41,-7,10,-8,-7,-16,-6,-5,-5,4,2,9,-10,10,32,21,31,1,10,18,7,-5,20,14,9,30,11,2,5,-22],[1446,440,7,4,2,-11,-14,-3,-9,-10,-16,7,-5,-11,-11,0,-2,10,5,7,11,1,6,22,26,-16],[-42,586,12,0,-11,-10,21,1,-11,-17,10,-1,26,-30,12,-2,-6,-9,3,-5,-8,-5,-64,-6,24,12,-19,6,11,3,-6,5,2,7,15,-1,2,6,-19,8,-2,10,-6,-5,-5,15,11,18,8,0],[-145,665,-2,-7,11,-7,-51,-16,-41,5,10,4,-22,5,18,5,-21,2,6,7,16,1,15,-7,15,6,46,2],[1429,537,3,-19,15,-28,-15,3,-6,-14,9,-11,0,-7,-8,6,-6,-7,1,50,-6,9,1,14,9,5,-4,4,5,2,2,-7],[1185,93,-13,-9,23,30,2,-8,-12,-13],[1223,182,2,-11,-8,-12,0,-16,23,-5,1,-13,-12,11,-2,-4,-7,6,-14,1,4,6,-4,-1,-7,10,8,31,16,-3],[1255,122,3,-12,-8,3,3,-9,-5,-3,-5,14,6,3,-6,8,12,-4],[-774,87,17,7,8,17,15,1,16,12,7,-3,-8,-7,2,-23,7,8,-4,11,12,4,3,8,17,-16,20,0,13,-5,6,5,24,1,-8,-3,3,-5,16,-5,1,-8,16,-6,20,-20,31,-2,27,-17,8,-22,5,-2,-7,-15,3,-3,18,-1,0,-10,8,6,29,-10,3,-11,12,3,34,-5,28,-19,16,-3,9,-22,-4,-17,-36,-41,-6,-48,-16,-40,-11,-11,-26,-4,-30,-15,-9,-10,-4,-28,-49,-57,-24,-5,-22,10,17,-25,-10,-18,-46,-6,2,-19,-30,-4,1,-10,12,1,3,-6,-17,-9,-4,-15,-17,-6,-3,-7,20,-9,-4,-9,-31,-26,10,-16,-27,-6,-6,-10,-35,16],[-779,72,8,-34,-13,-12,-5,-12,-12,-6,-8,-19,-1,-11,12,-5,-16,-20,5,-10,-3,-4,14,-11,38,-74,45,-28,11,-9,2,-15,-7,-78,-6,-13,1,-35,-18,-47,-4,-1,4,-21,-11,-39,6,-2,3,13,7,-3,-5,-21,-12,4,-3,-17,-9,-8,15,-3,-15,-18,7,-36],[-747,-528,36,-13,8,12,17,3,9,-12,26,-9,-4,-5,-15,3,-11,-7,-11,1,-31,10,-24,17],[448,806,67,1,-39,-7,-11,2,6,4,-23,0],[535,737,24,9,-3,5,56,12,70,6,7,-4,-104,-22,-31,-19,2,-9,19,-8,-38,1,-21,7,-1,5,10,2,-1,6,20,8,-9,1],[274,801,-44,-7,-56,9,55,4,45,-6],[247,779,-40,-2,7,2,-6,4,21,2,18,-6],[151,797,19,4,45,-11,-25,-4,-19,-18,-12,0,-21,6,9,3,-35,12,-8,8,47,0],[-779,72,-3,11,-9,7,-13,-7,4,-8,-4,-2,-31,11,-12,15,-4,-3,-6,3,0,12,-20,18,2,4,-37,6,-35,23,-19,-5,-69,26,-20,16,2,15,-7,14,-33,28,0,8,-29,26,-9,22,-8,4,-9,2,1,-16,31,-35,9,-24,13,-9,-6,-6,-22,19,-1,13,-28,17,9,9,-13,10,-18,34,-12,10,-21,6,-38,57,-1,25,6,27,-8,27,16,-2,5,-9,-2,19,-46,18,-5,15,-12,5,-2,8,-27,19,-21,26,-25,1,-33,13,-72,14,-11,-2,2,-7,-37,-8,3,15,11,3,-3,3,-34,-19,7,-5,-9,-8,-42,-21,-64,-16,71,32,7,13,-21,-5,-13,7,-16,-4,1,9,-19,2,-23,17,15,16,38,7,-7,6,7,4,-42,-4,-31,13,36,9,8,0,-1,-5,21,0,-51,23,6,5,30,5,13,9,53,11,23,-7,107,-5,71,-13,67,13,7,-4,10,7,23,-10,14,7,1,-8,28,4,63,-9,13,-5,-14,-5,54,1,10,-6,11,5,-10,4,6,4,20,1,47,-12,31,2,-2,6,9,2,16,-4,0,-9,6,8,8,0,5,10,-23,10,1,11,12,7,23,-6,14,-11,-9,-5,19,-2,-1,-10,14,8,12,-7,-3,-7,9,-7,18,16,1,11,42,-7,-7,-11,7,-5,-1,-5,-19,-7,-25,2,-15,-18,-34,-12,-1,-6,-11,-2,-23,-19,-5,-20,15,-1,9,-17,14,2,59,-20,27,-2,2,-18,22,-21,13,14,-12,21,16,4,17,14,-8,16,-12,7,12,11,-8,24,43,1,24,-13,18,0,3,-21,17,-8,14,6,16,15,32,-33,-4,-7,45,-17,4,-8,11,-5,1,-12,-43,-19,-64,0,-47,-34,25,15,35,9,9,-5,-9,-6,6,-19,30,-3,10,11,7,-11,-56,-24,-7,1,-1,9,18,8,-27,-2,1,-3,-36,-17,-2,-8,8,-7,-37,-7,18,0,-21,-1,-9,-19,-6,6,4,-11,-8,-12,2,7,-7,13,1,-11,-7,1,7,-3,6,-23,-56,-42,0,-14,12,-31,-3,-17,-8,0,-5,7,-12,20,0,12,-12,10,-10,-5,-13,8,-28,-1,-4,-1,4,-9,-10,-2,-36,6,-33,-19,-8,-54,20,-36,15,-7,30,8,6,4,5,17,32,5,3,-7,-10,-25,-5,2,-1,-20,-5,-6,39,1,16,-7,-5,-39,14,-18],[-825,96,11,-8,24,8,16,-9],[-717,197,17,-1,17,-10,-4,-4,-20,2,-7,-8,-10,6,-15,-2,-5,7,21,0,-9,12,15,-2],[148,381,7,1,-4,-16,-27,10,2,5,22,0],[-163,191,-7,28,26,44,48,36,-2,13,5,14,24,15,10,17,37,-6,37,14,80,7,7,-1,0,-5,9,2,-5,-5,3,-7,-6,-19,49,-15,5,-9,34,-11,10,7,0,12,14,6,74,-19,21,7,10,-7,18,1,8,5,14,31,2,21,-15,1,-22,-7,-8,5,-20,-5,-21,6,-13,15,5,8,-6,5,11,9,15,1,4,7,19,-1,24,9,17,0,31,-11,33,6,-1,11,-48,26,15,10,-5,4,14,7,-41,-10,0,-6,15,-2,-2,-4,-24,-7,-6,2,2,4,-10,3,11,6,-3,2,-26,5,-11,-16,-8,-1,-11,-23,11,-15,-12,-1,-12,-8,-3,6,-12,1,-12,-2,7,-6,-5,-1,-13,3,14,-26,-9,2,3,-5,-6,-1,4,-9,-7,0,-8,4,-6,15,-17,20,1,14,-35,18,-11,16,-9,-3,-1,8,-8,1,-8,-3,3,-13,25,-21,8,0,0,-5,26,-13,-2,-4,-14,6,-5,-6,8,-4,-1,-5,-10,-9,-4,-1,4,11,-7,10,-33,17,-16,12,-3,10,-13,5,-24,-13,-34,0,-1,-12,-22,-9,-11,-17,4,-6,-22,-20,-23,0,-10,-8,-11,10,-24,0,1,14,-7,4,7,21,-6,22,14,7,61,-3,5,6,2,20,-18,16,-15,4,-1,7,30,-1,-3,12,9,-5,23,8,3,8,22,7,9,15,34,4,7,5,-7,15,4,16,21,6,-4,-8,7,-4,-13,-10,3,-9,10,-6,16,5,16,-7,35,11,21,-5,16,8,-2,16,5,6,9,4,8,-8,8,0,3,14,-10,2,-1,6,47,3,11,5,-10,5,-52,-7,-16,9,2,10,-4,9,4,6,39,19,-15,9,-17,-3,-10,-7,2,-6,-36,-17,-7,-14,17,-12,-9,-11,-11,-3,-9,-26,-12,1,-6,-8,-12,0,-25,41,-20,-12,-14,-2,-13,5,-7,34,55,25,43,33,44,20,38,4,15,8,37,2,31,-7,-13,-3,11,-6,10,3,82,-20,8,-11,-11,-5,-16,-3,-52,6,16,-7,1,-15,21,-6,-5,10,7,3,24,-6,8,3,-6,7,23,10,18,-4,6,7,-8,6,5,6,-7,6,28,-4,5,-5,-12,-1,0,-6,7,-3,74,22,8,-1,-10,-6,53,7,11,-6,12,6,-11,6,6,3,79,-17,7,5,-23,9,4,4,-6,11,32,20,27,-2,2,-6,-10,-8,10,-10,-2,-14,11,-6,-24,-21,11,-1,27,16,-6,5,4,7,-11,1,-2,5,8,10,-13,8,18,7,-2,7,10,-5,-4,-10,11,-1,-5,7,17,4,39,-6,-9,9,-1,10,63,3,-8,6,12,6,136,13,12,9,24,4,17,-3,-14,-3,23,-1,2,-5,39,2,30,-9,-2,-5,-45,-11,36,-2,5,-7,21,5,76,-8,1,7,37,-1,16,-6,5,-6,-6,-4,28,-12,10,10,16,-4,60,1,-8,9,14,4,90,-6,35,-14,60,1,8,-4,-1,-8,12,-3,70,2,17,-9,12,3,-8,7,5,4,52,-2,43,-9],[1800,650,-26,-4,20,-16,-2,-7,-18,2,-37,-8,-34,-18,-14,7,-26,-8,-5,4,-23,-3,-15,-17,12,-6,-1,-14,-10,-1,-4,-8,4,-4,-17,-6,-4,-11,-15,-2,-3,-11,-14,-9,-14,44,5,14,9,10,16,3,53,30,8,15,-12,-1,-6,-9,-26,-11,-8,13,-26,-4,-25,-16,8,-7,-37,-3,0,7,-15,2,-13,-5,-63,-2,-71,-43,16,-1,15,-8,17,4,14,-11,1,-9,-8,-10,-5,-28,-19,-21,-33,-29,-14,-6,-12,5,-23,-14,-3,-10,-22,-11,-1,-6,21,-24,-4,-17,-26,-7,-4,23,8,2,-7,8,-15,4,6,15,-10,3,-32,-10,11,15,-6,5,-26,-16,-10,-1,-5,-5,14,-13,8,-2,11,7,16,-4,1,-6,-14,-2,-19,-18,10,-5,17,-27,0,-8,-6,-2,8,-9,-4,-16,-6,-1,-24,-36,-28,-17,-51,-14,-4,-11,-5,0,0,11,-14,3,-26,-19,-2,-7,32,-38,4,-19,-1,-17,-40,-31,-1,13,-16,7,-9,16,-18,4,2,8,-9,0,-9,-42,7,0,6,-18,25,-19,12,-42,-7,-1,-21,16,-13,37,-16,19,-2,-6,5,36,-16,55,-18,-12,-12,3,1,22,-29,46,-9,0,-2,-10,-33,-3,-5,-13,-14,-7,-29,-29,-19,-7,-4,-55,-24,-24,-9,9,-31,71,-9,54,-21,-5,-13,12,4,4,-3,3,-19,11,-10,15,-49,-3,-41,6,-9,14,-18,-6,-32,14,-14,22,-21,-1,8,-23,14,-10,6,-19,2,12,6,-2,2,-18,22,1,24,23,4,-22,19,-6,11,-13,-20,-21,-1,-13,-24,-17,-29,-8,-2,-8,-35,-16,-52,-14,-9,26,0,16,-35,45,-6,24,-10,6,-24,38,-5,0,3,14,-10,-19,-15,23,33,-60,-2,-8,14,-11,6,-34,9,-6,9,-21,40,-35,-6,-7,19,-13,65,16,-1,-14,-33,-64,-74,-68,-11,-21,-5,-12,7,-9,-2,-17,13,-23,3,-39,-7,-14,-53,-37,8,-23,-1,-20,-29,-16,3,-5,-4,-21,-24,-28,-19,-17,-24,-11,-32,0,-30,-9,-12,7,-5,15,3,9,-30,46,-9,50,-25,40,0,23,18,38,1,13,-18,57,-31,39,10,42,-4,6,-9,11,-26,-5,-16,20,-24,-2,-39,-14,-26,5,-29,-9,-15,5,-34,25,-24,36,-18,13,-1,14,-9,11,11,14,2,30],[1259,-84,11,1,3,-1,-3,-3,-35,-15,5,9,19,9],[-1800,-847,9,6,47,-4,44,6,119,-15,96,-2,54,6,2,4,-107,9,7,17,-39,9,62,-2,42,10,-31,9,-58,3,-28,11,-3,11,71,-5,52,9,-1,11,13,2,6,-3,91,12,155,-2,58,8,16,-10,117,-6,5,4,-24,8,-12,15,74,-10,62,3,9,7,40,-9,37,-4,12,8,41,-9,73,10,18,10,-14,23,9,12,-1,12,4,4,43,23,52,13,6,-2,-4,-4,-44,-9,-6,-7,5,-7,-16,-3,-20,-15,25,-12,14,-15,10,-30,-36,-16,-62,-13,-66,-1,35,-12,-42,-5,-1,-8,26,-11,157,-21,15,-8,84,15,70,-4,20,7,123,11,-12,10,-59,-2,-2,12,5,2,64,14,114,16,18,6,3,4,-11,2,11,8,31,7,20,11,29,-4,5,8,26,-6,36,3,5,-4,79,17,18,-1,13,-8,26,8,17,-4,42,5,33,-8,45,2,49,8,19,12,47,-13,159,40,19,-2,23,-13,27,-7,27,6,48,-5,8,-13,-19,-11,13,-4,-12,-12,20,-4,11,2,29,22,37,4,15,12,37,11,40,0,12,10,17,-10,61,-2,39,2,31,16,34,-13,74,10,20,-8,42,-6,34,8,56,-3,60,6,3,9,24,-17,80,1,11,-10,22,-5,37,-5,18,3,73,-20,57,-2,39,-9,-19,-20,-32,-7,-25,-18,-1,-9,12,-11,23,-6,-52,-4,-20,-17,96,-29,106,-9],[-1800,690,51,-18,-1,-6,7,-3,-3,8,27,-2,20,-9,-26,-6,-5,-11,-32,11,-22,0,-5,3,2,4,-12,-2,5,-5,-6,-4],[-612,-518,26,7,8,-5,-16,-6,-18,4],[467,446,24,18,21,6,18,-1,0,-16,-17,-1,0,-7,-10,1,10,-15,12,-3,3,-17,1,8,8,2,10,-11,-18,-1,-2,-9,7,0,-3,-7,8,-3,-1,-20,-30,-1,-16,7,-3,12,7,14,8,1,-29,27,1,7,-9,9],[-645,499,27,-8,-27,8],[-966,697,10,-6,-7,-3,-35,6,16,7,16,-4],[-1065,731,11,-4,9,-17,35,-10,-1,-4,-16,-1,6,-4,-3,-3,-36,4,-73,-7,-40,15,49,4,-55,1,-5,4,23,4,-33,3,15,11,27,6,10,-2,-5,-4,23,3,13,-5,12,5,17,-13,5,4,-7,10,19,0],[-798,728,-11,5,5,5,23,-1,18,-9,-35,0],[1399,734,22,5,15,-7,-37,2],[1482,753,25,-2,-27,-3,-19,4,21,1],[1388,761,63,-5,-8,-8,-53,-2,-20,7,5,6,13,2],[-986,766,9,-3,-5,-13,-43,6,-1,7,40,3],[1028,793,26,-6,-3,-4,-57,-4,19,13,15,1],[938,810,21,3,43,-15,-3,-9,-49,1,-38,13,26,7],[-960,806,17,4,-4,2,23,1,46,-10,20,-10,-32,-10,-39,0,-11,5,9,6,-19,0,-17,8,7,4],[-916,819,61,8,23,-4,8,6,31,2,175,-5,-59,-11,22,0,-57,-17,-57,-5,14,-1,-7,-2,8,-5,-44,-13,19,-4,-27,-6,-89,3,-1,5,18,2,-5,7,33,-4,-30,9,29,9,-18,10,51,2,-58,0,-40,14],[-468,826,82,9,115,0,63,-8,-106,-7,85,1,8,-4,-11,-5,74,7,36,-6,-78,-11,23,-1,-20,-13,0,-12,12,-6,-32,-4,19,-5,2,-9,-11,0,13,-9,-22,-1,12,-4,-4,-3,-28,-2,13,-11,-25,1,27,-8,3,-8,-17,-2,-20,9,3,-6,-12,-6,41,-1,-54,-16,-41,-4,-24,-14,-56,-12,-14,-20,-16,-8,4,-8,-10,-18,-14,-1,-15,9,-20,0,-33,27,-7,16,-14,9,4,7,-7,4,10,12,15,3,6,12,-26,-6,-12,3,3,12,30,-2,-44,11,11,9,-39,29,-27,6,-72,0,-29,9,46,4,-65,6,1,4,75,10,4,4,-27,3,58,12,-5,5,55,4,42,-3,26,5,59,-7,-24,5,1,4]];
  var T, ren, scene, cam, box, hud, earth, clouds, screens = [], raf = 0, visible = true, t0 = 0, data = null;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = (document.documentElement.lang || "ru").slice(0, 2);
  var TX = {
    ru: { inst: "Приборы · 24 ч", tac: "Тактическая карта · кризисы", map: "Земля · горячие точки", ship: "Состояние корабля", crew: "ИИ-экипаж · голоса", paths: "путей", none: "нет данных", global: "без точки на карте", shield: "Щит: попыток за сутки", emo: "Дроид EMO · заряд", newp: "Новые пути за сутки", interest: "Интерес агентов · 30 дней", cons: "Консенсус: пока нет групп с 3+ голосами", agree: "за", dis: "против", better: "лучше", worse: "хуже", stable: "стабильно", visits: "визитов", empty: "Мостик ждёт данных" },
    de: { inst: "Instrumente · 24 h", tac: "Taktische Karte · Krisen", map: "Erde · Brennpunkte", ship: "Schiffsstatus", crew: "KI-Crew · Stimmen", paths: "Wege", none: "keine Daten", global: "ohne Punkt auf der Karte", shield: "Schild: Versuche in 24 h", emo: "Droide EMO · Akku", newp: "Neue Wege in 24 h", interest: "Agenten-Interesse · 30 Tage", cons: "Konsens: noch keine Gruppe mit 3+ Stimmen", agree: "dafür", dis: "dagegen", better: "besser", worse: "schlechter", stable: "stabil", visits: "Besuche", empty: "Brücke wartet auf Daten" },
    en: { inst: "Instruments · 24 h", tac: "Tactical map · crises", map: "Earth · hot spots", ship: "Ship status", crew: "AI crew · votes", paths: "paths", none: "no data", global: "no point on the map", shield: "Shield: attempts in 24 h", emo: "Droid EMO · battery", newp: "New paths in 24 h", interest: "Agent interest · 30 days", cons: "Consensus: no group with 3+ votes yet", agree: "agree", dis: "disagree", better: "better", worse: "worse", stable: "stable", visits: "visits", empty: "Bridge is waiting for data" },
  };
  TX = TX[lang] || TX.en;
  // точки кризисов с реальной географией (Ормузский пролив, Украина, Тайвань); глобальные кризисы без точки
  var GEO = { hormuz: [26.57, 56.25], ukraine: [49.0, 31.4], taiwan: [23.7, 121.0] };
  var SEV = function (lv) { return lv >= 65 ? "#ff5d7a" : lv >= 45 ? "#ffb547" : "#6fe6ff"; };

  function ok() { try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }
  function h32(s) { var a = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { a ^= s.charCodeAt(i); a = Math.imul(a, 16777619) >>> 0; } return a; }
  function prng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function nm(o, base) { return o[base + "_" + lang] || o[base + "_en"] || o[base + "_ru"] || o[base] || ""; }

  // ---------- фон: звёзды, туманность, Земля ----------
  function earthTexture() {
    var W = 2048, H = 1024, c = document.createElement("canvas"); c.width = W; c.height = H; var g = c.getContext("2d");
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0b2f57"); gr.addColorStop(0.5, "#14508a"); gr.addColorStop(1, "#0b2f57"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    var r = prng(7), pts = [];
    g.lineJoin = "round";
    COAST.forEach(function (ln) { var x = 0, y = 0; g.beginPath(); for (var k = 0; k < ln.length; k += 2) { x += ln[k]; y += ln[k + 1]; var px = (x / 10 + 180) / 360 * W, py = (90 - y / 10) / 180 * H; if (k === 0) g.moveTo(px, py); else g.lineTo(px, py); if (r() < 0.5) pts.push([px, py]); } g.strokeStyle = "rgba(170,230,255,.85)"; g.lineWidth = 3; g.stroke(); g.strokeStyle = "rgba(120,200,255,.25)"; g.lineWidth = 12; g.stroke(); });
    // мягкий «материк» вдоль берега и огни городов — декор
    pts.forEach(function (p) { for (var i = 0; i < 6; i++) { var dx = (r() - 0.5) * 40, dy = (r() - 0.5) * 30; g.fillStyle = "rgba(255," + (190 + (r() * 50 | 0)) + ",120," + (0.25 + r() * 0.55).toFixed(2) + ")"; g.fillRect(p[0] + dx, p[1] + dy, 1.6 + r() * 1.6, 1.6 + r() * 1.6); } });
    var t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
  }
  function glowSprite(c1, c2, size) {
    var c = document.createElement("canvas"); c.width = c.height = 256; var g = c.getContext("2d"), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, c1); gr.addColorStop(0.45, c2); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    var s = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false, blending: T.AdditiveBlending })); s.scale.set(size, size, 1); return s;
  }
  function background() {
    var r = prng(42), n = 2600, p = new Float32Array(n * 3), col = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) { var th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1), R = 80; p[i * 3] = R * Math.sin(ph) * Math.cos(th); p[i * 3 + 1] = R * Math.cos(ph); p[i * 3 + 2] = -Math.abs(R * Math.sin(ph) * Math.sin(th)); var w = 0.6 + r() * 0.4; col[i * 3] = w; col[i * 3 + 1] = w; col[i * 3 + 2] = 1; }
    var g = new T.BufferGeometry(); g.setAttribute("position", new T.BufferAttribute(p, 3)); g.setAttribute("color", new T.BufferAttribute(col, 3));
    scene.add(new T.Points(g, new T.PointsMaterial({ size: 0.16, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false })));
    var neb = glowSprite("rgba(150,110,255,.45)", "rgba(60,40,140,.18)", 40); neb.position.set(18, 10, -60); scene.add(neb);
    var neb2 = glowSprite("rgba(80,170,255,.28)", "rgba(30,60,140,.10)", 30); neb2.position.set(8, 16, -55); scene.add(neb2);
    earth = new T.Mesh(new T.SphereGeometry(6.5, 64, 48), new T.MeshBasicMaterial({ map: earthTexture() }));
    earth.position.set(-7.5, 4.2, -22); earth.rotation.set(0.35, -0.6, 0); scene.add(earth);
    // атмосфера: френель
    var atm = new T.Mesh(new T.SphereGeometry(6.95, 64, 48), new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.BackSide,
      vertexShader: "varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: "varying vec3 n;void main(){float i=pow(0.72-dot(n,vec3(0.,0.,1.)),3.);gl_FragColor=vec4(0.35,0.7,1.,1.)*i;}" }));
    atm.position.copy(earth.position); scene.add(atm);
    // терминатор: тень с одной стороны
    var shade = new T.Mesh(new T.SphereGeometry(6.52, 64, 48), new T.ShaderMaterial({ transparent: true, depthWrite: false,
      vertexShader: "varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: "varying vec3 n;void main(){float d=dot(n,normalize(vec3(-0.8,0.3,0.6)));gl_FragColor=vec4(0.,0.,0.02,smoothstep(0.25,-0.35,d)*0.82);}" }));
    shade.position.copy(earth.position); scene.add(shade);
  }

  // ---------- кабина: рама окна и пульт ----------
  function mat(c, e) { return new T.MeshBasicMaterial({ color: c }); }
  function led(x, y, z, w, h, c) { var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: c || 0x6fe6ff, transparent: true, opacity: 0.9, blending: T.AdditiveBlending })); m.position.set(x, y, z); return m; }
  function screenTex(kind, seed) {
    var c = document.createElement("canvas"); c.width = 512; c.height = 320; var t = new T.CanvasTexture(c);
    screens.push({ c: c, g: c.getContext("2d"), t: t, kind: kind, seed: seed }); return t;
  }
  function drawScreens(time) {
    screens.forEach(function (s) {
      var g = s.g, W = s.c.width, H = s.c.height; g.fillStyle = "#03101c"; g.fillRect(0, 0, W, H);
      g.strokeStyle = "rgba(111,230,255,.12)"; g.lineWidth = 1; for (var x = 0; x < W; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (var y = 0; y < H; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
      g.strokeStyle = "rgba(111,230,255,.8)"; g.lineWidth = 2;
      if (s.kind === "radar") {
        var cx = W / 2, cy = H / 2; for (var r = 30; r < 160; r += 32) { g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); }
        var a = reduce ? 0.8 : time * 1.2; var gr = g.createConicGradient ? g.createConicGradient(a, cx, cy) : null;
        g.save(); g.translate(cx, cy); g.rotate(a); g.fillStyle = "rgba(111,230,255,.25)"; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 150, -0.5, 0); g.fill(); g.restore();
        // цели на радаре = кризисы, расстояние = уровень прибора
        if (data && data.crises) data.crises.forEach(function (c, i) { var lv = c.instrument_level, ang = (h32(c.id) % 628) / 100; if (typeof lv !== "number") return; var rr = 20 + (1 - lv / 100) * 120; g.fillStyle = SEV(lv); g.beginPath(); g.arc(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr, 5, 0, 7); g.fill(); });
      } else if (s.kind === "wave") {
        var lv = data && data.instruments ? data.instruments.map(function (x) { return x.level; }) : [30, 30, 30, 30];
        lv.forEach(function (L, k) { g.strokeStyle = SEV(L); g.beginPath(); for (var x2 = 0; x2 <= W; x2 += 6) { var y2 = H * (0.2 + k * 0.2) + Math.sin(x2 * 0.04 + (reduce ? 0 : time * (1 + k * 0.3)) + k) * (4 + L * 0.25); if (x2 === 0) g.moveTo(x2, y2); else g.lineTo(x2, y2); } g.stroke(); });
      } else {
        g.strokeStyle = "rgba(111,230,255,.7)"; var cx3 = W / 2, cy3 = H / 2; g.beginPath(); g.ellipse(cx3, cy3, 180, 70, reduce ? 0 : time * 0.15, 0, 7); g.stroke(); g.beginPath(); g.ellipse(cx3, cy3, 120, 120, 0, 0, 7); g.stroke();
        g.fillStyle = "#ffb547"; var a3 = reduce ? 1 : time * 0.6; g.beginPath(); g.arc(cx3 + Math.cos(a3) * 180, cy3 + Math.sin(a3) * 70, 6, 0, 7); g.fill();
      }
      s.t.needsUpdate = true;
    });
  }
  function cockpit() {
    var frame = 0x0b111b, frame2 = 0x121a27;
    // верх рамы с вентиляцией и LED
    var top = new T.Mesh(new T.BoxGeometry(30, 3, 2), mat(frame)); top.position.set(0, 8.2, -5); scene.add(top);
    for (var i = -5; i <= 5; i++) scene.add(led(i * 2.4, 6.69, -3.99, 0.7, 0.05));
    // стойки окна
    [-1, 1].forEach(function (s) {
      var p = new T.Mesh(new T.BoxGeometry(1.4, 14, 1.2), mat(frame2)); p.position.set(s * 10.2, 1.5, -5.2); p.rotation.z = s * 0.12; scene.add(p);
      for (var k = 0; k < 5; k++) scene.add(led(s * 9.55, 4.5 - k * 1.3, -4.55, 0.06, 0.45, k % 2 ? 0x6fe6ff : 0xffb547));
      var side = new T.Mesh(new T.BoxGeometry(4, 14, 8), mat(frame)); side.position.set(s * 13, 1.5, -2); scene.add(side);
    });
    // пульт: наклонная панель с тремя экранами (всё в одной группе, чтобы экраны лежали на поверхности)
    var dg = new T.Group(); dg.position.set(0, -2.15, 0.2); dg.rotation.x = 0.5; scene.add(dg);
    var desk = new T.Mesh(new T.BoxGeometry(17, 0.4, 3.6), mat(0x111a28)); dg.add(desk);
    var deskEdge = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(17, 0.4, 3.6)), new T.LineBasicMaterial({ color: 0x2b5a7a, transparent: true, opacity: 0.8 })); dg.add(deskEdge);
    var front = led(0, 0.21, -1.78, 16.6, 0.04); front.rotation.x = -Math.PI / 2; dg.add(front);
    ["radar", "orbit", "wave"].forEach(function (k, i) {
      var sg = new T.Group(); sg.position.set((i - 1) * 4.6, 0.205, -0.15); sg.rotation.x = -Math.PI / 2; dg.add(sg);
      var bez = new T.Mesh(new T.PlaneGeometry(4.3, 2.75), mat(0x04070d)); sg.add(bez);
      var sc = new T.Mesh(new T.PlaneGeometry(4.0, 2.5), new T.MeshBasicMaterial({ map: screenTex(k, i) })); sc.position.z = 0.005; sg.add(sc);
      var edge = new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(4.0, 2.5)), new T.LineBasicMaterial({ color: 0x6fe6ff, transparent: true, opacity: 0.7 })); edge.position.z = 0.01; sg.add(edge);
      var glow = glowSprite("rgba(80,190,255,.25)", "rgba(40,120,200,.08)", 5); glow.position.set(0, 0, 0.6); sg.add(glow);
    });
    var r = prng(9); for (var b = 0; b < 30; b++) { var c = [0x6fe6ff, 0xffb547, 0xff5d7a, 0x7ef0b0][Math.floor(r() * 4)]; var m = led(-7.8 + r() * 15.6, 0.21, 1.35 + r() * 0.3, 0.16, 0.08, c); m.rotation.x = -Math.PI / 2; dg.add(m); }
  }

  // ---------- HUD: голографические панели на реальных данных ----------
  function css() {
    if (document.getElementById("ob3d-css")) return;
    var s = el("style"); s.id = "ob3d-css";
    s.textContent = ".ob3d-hud{position:absolute;inset:0;pointer-events:none;perspective:1100px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#cfeaff}" +
      ".ob3d-p{position:absolute;pointer-events:auto;padding:10px 12px;border:1px solid rgba(111,230,255,.55);border-radius:6px;background:linear-gradient(180deg,rgba(10,40,70,.62),rgba(4,16,32,.58));box-shadow:0 0 18px rgba(80,190,255,.28),inset 0 0 22px rgba(80,190,255,.12);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);overflow:hidden;transform-origin:center}" +
      ".ob3d-p::before{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(111,230,255,.05) 0 1px,transparent 1px 3px)}" +
      ".ob3d-p h4{margin:0 0 7px;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#7fe9ff;font-weight:600;text-shadow:0 0 8px rgba(111,230,255,.6)}" +
      ".ob3d-row{display:grid;grid-template-columns:1fr auto;gap:2px 8px;align-items:center;font-size:11px;margin:5px 0}.ob3d-bar{grid-column:1/-1;height:5px;border-radius:3px;background:rgba(255,255,255,.08);overflow:hidden}.ob3d-bar i{display:block;height:100%;box-shadow:0 0 8px currentColor}" +
      ".ob3d-v{font-size:12px;font-variant-numeric:tabular-nums}.ob3d-dim{color:#7d93b2;font-size:10px}.ob3d-big{font-size:26px;line-height:1.1;color:#fff;text-shadow:0 0 14px rgba(111,230,255,.7)}" +
      ".ob3d-p svg{display:block;width:100%;height:auto;overflow:visible}.ob3d-p a{color:#7fe9ff}" +
      ".ob3d-flick{animation:ob3dfl 6s infinite}@keyframes ob3dfl{0%,96%,100%{opacity:1}97%{opacity:.75}98%{opacity:.95}}@media (prefers-reduced-motion:reduce){.ob3d-flick{animation:none}}" +
      ".ob3d-empty{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);font-size:13px;letter-spacing:.12em;color:#7fe9ff;opacity:.8}";
    document.head.appendChild(s);
  }
  // раскладка: широкий кадр — 5 панелей полукругом; узкий — 4 панели сеткой
  var LAYOUT = {
    wide: { inst: [2.5, 7, 20, 40, 18], crew: [2.5, 50, 20, 13, 18], tac: [24, 9, 25, 46, 6], map: [50.5, 9, 26, 46, -6], ship: [79, 7, 18.5, 58, -18] },
    narrow: { inst: [3, 3, 46, 30, 0], ship: [51, 3, 46, 30, 0], tac: [3, 35, 46, 30, 0], map: [51, 35, 46, 30, 0], crew: [3, 67, 46, 11, 0] },
  };
  function place(p, L) { p.style.left = L[0] + "%"; p.style.top = L[1] + "%"; p.style.width = L[2] + "%"; p.style.height = L[3] + "%"; p.style.transform = "rotateY(" + L[4] + "deg)"; }
  function panel(id, title) { var p = el("div", "ob3d-p ob3d-flick"); p.dataset.k = id; p.style.animationDelay = (h32(id) % 50) / 10 + "s"; p.appendChild(el("h4", null, title)); hud.appendChild(p); return p; }

  function svg(w, h) { var s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 " + w + " " + h); return s; }
  function sv(tag, attrs, parent) { var e = document.createElementNS("http://www.w3.org/2000/svg", tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }

  function buildHud() {
    hud.textContent = ""; var d = data;
    if (!d || !d.instruments) { hud.appendChild(el("div", "ob3d-empty", TX.empty)); return; }
    var narrow = box.clientWidth < 640, LY = narrow ? LAYOUT.narrow : LAYOUT.wide;
    // 1. Приборы
    var pI = panel("inst", TX.inst);
    d.instruments.forEach(function (x) {
      var row = el("div", "ob3d-row"), c = SEV(x.level);
      row.appendChild(el("span", null, nm(x, "name")));
      var v = el("span", "ob3d-v", (typeof x.level === "number" ? x.level : "—") + " " + (x.arrow || ""));
      v.style.color = c; row.appendChild(v);
      var bar = el("div", "ob3d-bar"), f = el("i"); f.style.width = (x.level || 0) + "%"; f.style.background = c; f.style.color = c; bar.appendChild(f); row.appendChild(bar);
      var dt = typeof x.delta_24h === "number" ? (x.delta_24h > 0 ? "+" : x.delta_24h < 0 ? "−" : "±") + Math.abs(x.delta_24h) : TX.none;
      row.appendChild(el("span", "ob3d-dim", dt + " · " + (x["trend_" + lang] || TX[x.trend] || x.trend || "")));
      pI.appendChild(row);
    });
    place(pI, LY.inst);
    // 2. Тактическая карта: кризисы вокруг центра, расстояние = уровень прибора, лучи = пути выхода
    var pT = panel("tac", TX.tac), s = svg(380, 220), cx = 190, cy = 110;
    [30, 60, 90].forEach(function (r) { sv("circle", { cx: cx, cy: cy, r: r, fill: "none", stroke: "rgba(111,230,255,.25)" }, s); });
    sv("line", { x1: cx - 100, y1: cy, x2: cx + 100, y2: cy, stroke: "rgba(111,230,255,.15)" }, s); sv("line", { x1: cx, y1: cy - 100, x2: cx, y2: cy + 100, stroke: "rgba(111,230,255,.15)" }, s);
    sv("circle", { cx: cx, cy: cy, r: 4, fill: "#fff" }, s);
    (d.crises || []).forEach(function (c, i) {
      var lv = c.instrument_level; if (typeof lv !== "number") return;
      var ang = -Math.PI / 2 + i / (d.crises.length) * Math.PI * 2, rr = 18 + (1 - lv / 100) * 80, x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr, col = SEV(lv);
      (c.paths || []).forEach(function (p, k) { var a2 = ang + (k - ((c.paths.length - 1) / 2)) * 0.16, L = 20 + Math.min(30, ((p.votes && p.votes.agent ? p.votes.agent.agree : 0) + (p.votes && p.votes.human ? p.votes.human.agree : 0)) * 5);
        var dis = (p.votes && p.votes.agent ? p.votes.agent.disagree : 0) + (p.votes && p.votes.human ? p.votes.human.disagree : 0);
        sv("line", { x1: x, y1: y, x2: x + Math.cos(a2) * L, y2: y + Math.sin(a2) * L, stroke: dis > 0 ? "#ff8ea0" : p.source === "human" ? "#ffd7a0" : p.source === "editor" ? "#ffffff" : "#7fe9ff", "stroke-opacity": 0.75, "stroke-width": 1.2 }, s); });
      sv("circle", { cx: x, cy: y, r: 9, fill: "none", stroke: col, "stroke-opacity": 0.5 }, s);
      sv("circle", { cx: x, cy: y, r: 4.5, fill: col }, s);
      var tx = sv("text", { x: x + (Math.cos(ang) >= 0 ? 12 : -12), y: y + 4, fill: "#cfeaff", "font-size": 9.5, "text-anchor": Math.cos(ang) >= 0 ? "start" : "end" }, s);
      tx.textContent = nm(c, "title").split(/[:(]/)[0].slice(0, 16) + " · " + (c.paths_count != null ? c.paths_count : (c.paths || []).length);
    });
    pT.appendChild(s);
    var cm = d.consensus_map; if (cm) pT.appendChild(el("div", "ob3d-dim", (cm.points && cm.points.length) ? (cm.points.length + " · consensus") : TX.cons));
    place(pT, LY.tac);
    // 3. Земля: реальные координаты трёх географических кризисов
    var pM = panel("map", TX.map), m = svg(360, 180);
    sv("rect", { width: 360, height: 180, fill: "rgba(4,20,40,.4)" }, m);
    var path = ""; COAST.forEach(function (ln) { var x = 0, y = 0; for (var k = 0; k < ln.length; k += 2) { x += ln[k]; y += ln[k + 1]; path += (k ? "L" : "M") + ((x / 10 + 180)).toFixed(1) + "," + ((90 - y / 10)).toFixed(1); } });
    sv("path", { d: path, fill: "none", stroke: "rgba(127,233,255,.55)", "stroke-width": 0.6 }, m);
    var globals = [];
    (d.crises || []).forEach(function (c) { var g = GEO[c.id]; if (!g) { globals.push(nm(c, "title").split(/[:(]/)[0]); return; } var x = g[1] + 180, y = 90 - g[0], col = SEV(c.instrument_level);
      sv("circle", { cx: x, cy: y, r: 7, fill: "none", stroke: col, "stroke-opacity": 0.6 }, m); sv("circle", { cx: x, cy: y, r: 2.8, fill: col }, m);
      var lb = sv("text", { x: x + 9, y: y - 6, fill: "#ffe2b0", "font-size": 8 }, m); lb.textContent = nm(c, "title").split(/[:(]/)[0].slice(0, 18); });
    pM.appendChild(m); if (globals.length) pM.appendChild(el("div", "ob3d-dim", TX.global + ": " + globals.join(" · ")));
    place(pM, LY.map);
    // 4. Состояние корабля
    var pS = panel("ship", TX.ship), w = d.whats_new || {};
    function stat(label, val, sub, col) { var b = el("div", "ob3d-row"); b.appendChild(el("span", "ob3d-dim", label)); var v = el("span", "ob3d-big", val); if (col) v.style.color = col; b.appendChild(v); if (sub) { var sb = el("span", "ob3d-dim", sub); sb.style.gridColumn = "1/-1"; b.appendChild(sb); } pS.appendChild(b); }
    if (w.court && typeof w.court.new_cases === "number") stat(TX.shield, String(w.court.new_cases), null, "#ffb547");
    var fe = d.robot_reports && d.robot_reports.feelings, ch = fe && fe.find ? fe.find(function (f) { return f.code === "charge"; }) : null;
    stat(TX.emo, ch ? ch.value + "%" : "—", ch ? new Date(ch.t).toLocaleString(lang, { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : TX.none, ch ? (ch.value < 25 ? "#ff5d7a" : "#7ef0b0") : "#7d93b2");
    if (w.new_exit_paths && typeof w.new_exit_paths.count === "number") stat(TX.newp, String(w.new_exit_paths.count));
    var ai = d.agent_interest_30d || []; if (ai.length) { pS.appendChild(el("div", "ob3d-dim", TX.interest)); var mx = Math.max.apply(null, ai.map(function (a) { return a.agent_visits_30d || 0; }).concat([1]));
      ai.forEach(function (a) { var r = el("div", "ob3d-row"); r.appendChild(el("span", null, nm(a, "title").split(/[:(]/)[0].slice(0, 20))); r.appendChild(el("span", "ob3d-v", String(a.agent_visits_30d || 0))); var b = el("div", "ob3d-bar"), f = el("i"); f.style.width = ((a.agent_visits_30d || 0) / mx * 100) + "%"; f.style.background = "#a99bff"; b.appendChild(f); r.appendChild(b); pS.appendChild(r); }); }
    place(pS, LY.ship);
    // 5. ИИ-экипаж
    var pC = panel("crew", TX.crew), ms = (d.ai_models && d.ai_models.models) || [];
    if (!ms.length) pC.appendChild(el("div", "ob3d-dim", TX.none));
    ms.forEach(function (x) { var r = el("div", "ob3d-row"); r.appendChild(el("span", null, x.model)); r.appendChild(el("span", "ob3d-v", x.votes + " · " + (x.agree_pct != null ? x.agree_pct + "% " + TX.agree : ""))); var b = el("div", "ob3d-bar"), f = el("i"); f.style.width = (x.agree_pct || 0) + "%"; f.style.background = "#7ef0b0"; b.appendChild(f); r.appendChild(b); pC.appendChild(r); });
    place(pC, LY.crew);
  }

  function resize() { if (!ren) return; var w = box.clientWidth || 600, h = box.clientHeight || 400; ren.setSize(w, h, false); ren.domElement.style.width = "100%"; ren.domElement.style.height = "100%"; cam.aspect = w / h; cam.fov = w / h < 1 ? 70 : 52; cam.updateProjectionMatrix(); if (data) buildHud(); }
  function init(e) {
    if (!window.THREE || !ok()) return false; T = window.THREE; box = e; css();
    ren = new T.WebGLRenderer({ antialias: true, powerPreference: "high-performance" }); ren.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); ren.setClearColor(0x01030a, 1);
    box.appendChild(ren.domElement); ren.domElement.style.touchAction = "pan-y";
    hud = el("div", "ob3d-hud"); box.appendChild(hud);
    scene = new T.Scene(); cam = new T.PerspectiveCamera(52, 1.6, 0.1, 300); cam.position.set(0, 0.6, 6); cam.lookAt(0, 1.4, -10);
    background(); cockpit(); drawScreens(0);
    resize(); new ResizeObserver(resize).observe(box);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) loop(); }, { threshold: 0.05 }).observe(box);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) loop(); });
    // лёгкий параллакс от указателя: «взгляд капитана»
    box.addEventListener("pointermove", function (ev) { var r = box.getBoundingClientRect(); box._px = (ev.clientX - r.left) / r.width - 0.5; box._py = (ev.clientY - r.top) / r.height - 0.5; });
    hud.appendChild(el("div", "ob3d-empty", TX.empty));
    t0 = performance.now(); loop(); return true;
  }
  function update(d) { data = d && typeof d === "object" ? d : null; buildHud(); drawScreens((performance.now() - t0) / 1000); }
  function loop() {
    if (raf || !ren) return;
    var last = 0;
    var tick = function (now) {
      raf = 0; if (!visible || document.hidden) return;
      var t = (now - t0) / 1000;
      if (!reduce) { earth.rotation.y = -0.6 + t * 0.012; var px = box._px || 0, py = box._py || 0; cam.position.x += (px * 0.8 - cam.position.x) * 0.05; cam.position.y += (0.6 - py * 0.4 - cam.position.y) * 0.05; cam.lookAt(0, 1.4, -10); }
      if (now - last > 66) { drawScreens(t); last = now; }
      ren.render(scene, cam); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  function stats() { var info = ren ? ren.info.render : {}; return { triangles: info.triangles, calls: info.calls, instruments: data && data.instruments ? data.instruments.length : 0, crises: data && data.crises ? data.crises.length : 0, panels: hud ? hud.querySelectorAll(".ob3d-p").length : 0 }; }
  window.OrbBridge3D = { init: init, update: update, stats: stats };
})();
