const M = makeMap({ center: [17, 42], scale: 3800, highlight: ['008'] });   // 008 = Albania
const tr = M.pin('tr', 19.82, 41.33, 'Tiranë', 'r'), ro = M.pin('ro', 12.50, 41.90, 'Roma', 'l');
M.camTo([19.8, 41.3], 1.6, 0, 0);
M.camTo([19.8, 41.3], 1.8, 0, 1.2, 'none');
tr.show(0.5);
M.camTo([16.1, 41.6], 1.1, 1.2, 1.4);
M.route([19.82, 41.33], [12.5, 41.9], 1.4, 1.5);
ro.show(2.8);
up('#k1', 0.2); up('#h1', 0.45); hl('#hl1', 2.9); fadeIn('#src1', 3.2);
