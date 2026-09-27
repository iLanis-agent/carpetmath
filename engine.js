// CarpetMath engine - honest carpet ordering math.
// Pure logic, no DOM. Shared by app.html and the node test harness.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CarpetMath = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SQFT_PER_SQYD = 9;
  var STAIR_SQFT = 3;          // tread + riser allowance per stair
  var STAIR_WASTE = 1.15;      // piecing waste on stairs
  var DOORWAY_FT = 3;          // tack-strip deduction per room (one doorway)
  var TACK_PIECE_FT = 4;       // tack strips come in ~4 ft lengths
  var TACK_PRICE = 0.75;       // $ per piece
  var PATTERN_WASTE = { none: 0, small: 0.05, large: 0.10 };
  var BASE_WASTE = 1.10;       // cutting / trim waste when the room fits the roll
  var SEAM_EXTRA = 0.05;       // second strip off the roll when a seam is needed
  var PADDING_WASTE = 1.05;

  function round2(x) { return Math.round(x * 100) / 100; }

  function roomPlan(room, rollWidth, pattern) {
    var L = Math.max(room.lengthFt, room.widthFt);
    var W = Math.min(room.lengthFt, room.widthFt);
    var sqft = round2(L * W);
    var fits = W <= rollWidth;
    var seams = fits ? 0 : 1;
    var mult = BASE_WASTE + (fits ? 0 : SEAM_EXTRA) + (PATTERN_WASTE[pattern] || 0);
    return {
      name: room.name,
      sqft: sqft,
      fits: fits,
      seams: seams,
      wasteMult: round2(mult),
      orderSqFt: round2(sqft * mult)
    };
  }

  function plan(opts) {
    var rooms = opts.rooms.map(function (r) { return roomPlan(r, opts.rollWidth, opts.pattern); });
    var roomSqFt = round2(rooms.reduce(function (s, r) { return s + r.sqft; }, 0));
    var roomOrder = round2(rooms.reduce(function (s, r) { return s + r.orderSqFt; }, 0));
    var stairs = opts.stairs || 0;
    var stairSqFt = round2(stairs * STAIR_SQFT);
    var stairOrder = round2(stairSqFt * STAIR_WASTE);
    var orderSqFt = round2(roomOrder + stairOrder);
    // carpet is sold by the square yard, rounded up to half yards
    var orderSqYd = Math.ceil((orderSqFt / SQFT_PER_SQYD) * 2) / 2;
    var totalArea = round2(roomSqFt + stairSqFt);
    var paddingSqYd = Math.ceil((totalArea * PADDING_WASTE) / SQFT_PER_SQYD);
    var perim = opts.rooms.reduce(function (s, r) { return s + 2 * (r.lengthFt + r.widthFt); }, 0);
    var tackLf = round2(Math.max(0, perim - DOORWAY_FT * opts.rooms.length));
    var tackPieces = Math.ceil(tackLf / TACK_PIECE_FT);
    var seamRooms = rooms.filter(function (r) { return r.seams > 0; }).length;
    var carpetCost = round2(orderSqYd * opts.pricePerSqYd);
    var paddingCost = round2(paddingSqYd * opts.paddingPerSqYd);
    var tackCost = round2(tackPieces * TACK_PRICE);
    var totalCost = round2(carpetCost + paddingCost + tackCost);
    return {
      rooms: rooms,
      roomSqFt: roomSqFt,
      stairSqFt: stairSqFt,
      totalArea: totalArea,
      orderSqFt: orderSqFt,
      orderSqYd: orderSqYd,
      paddingSqYd: paddingSqYd,
      tackLf: tackLf,
      tackPieces: tackPieces,
      seamRooms: seamRooms,
      carpetCost: carpetCost,
      paddingCost: paddingCost,
      tackCost: tackCost,
      totalCost: totalCost
    };
  }

  return { plan: plan, roomPlan: roomPlan, round2: round2 };
});
