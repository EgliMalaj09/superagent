// luxury: slow, expo/power4 eases, blur-ins, gold sweep, hairlines; sound = pad + one shimmer at the end
blurIn('#k1', 0.3, 0.9);
blurIn('#h1', 0.7, 1.1);
hl('#hl1', 1.6);
up('#n1', 2.2, 0.9); count('#n1', 0, 100, 2.2, 1.6, function (v) { return Math.round(v) + '%'; });
fadeIn('#b1', 2.8, 0.8);
growY('#chart .bar', 3.2, 1.1, 0.12);
fadeIn('#src1', 3.6, 0.8);
kenBurns('#s1', 0, D, 1.0, 1.03);
