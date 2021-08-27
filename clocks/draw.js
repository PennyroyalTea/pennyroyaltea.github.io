var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
window.onload = function () {
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    var screenAspect = window.innerWidth / window.innerHeight;
    var layout;
    if ((28 / 6) / screenAspect < screenAspect / (10 / 18)) {
        layout = new HorizontalLayout(0, 0, canvas.width, canvas.height);
    }
    else {
        layout = new VerticalLayout(0, 0, canvas.width, canvas.height);
    }
    setInterval(function () {
        layout.redraw(ctx);
    }, 16);
    setInterval(function () {
        var now = new Date();
        var h = now.getHours();
        var m = now.getMinutes();
        var s = now.getSeconds();
        layout.set([Math.floor(h / 10), h % 10, Math.floor(m / 10), m % 10, Math.floor(s / 10), s % 10]);
    }, 1000);
};
var Clock = /** @class */ (function () {
    function Clock(rotationSpeed) {
        this.MINS_ARROW_LEN = .9;
        this.HRS_ARROW_LEN = .7;
        this.hours = 0;
        this.minutes = 0;
        this.targetHours = 0;
        this.targetMinutes = 0;
        this.rotationSpeed = rotationSpeed;
        this.lastUpdTs = Date.now();
    }
    Clock.prototype.setTarget = function (hours, minutes) {
        this.targetHours = hours;
        this.targetMinutes = minutes;
    };
    Clock.prototype.moveArrows = function () {
        var curTs = Date.now();
        var tsDiff = curTs - this.lastUpdTs;
        this.lastUpdTs = curTs;
        if (this.hours === this.targetHours && this.minutes === this.targetMinutes) {
            return false;
        }
        var targetHours = (this.targetHours < this.hours ? this.targetHours + 2 * Math.PI : this.targetHours);
        var targetMinutes = (this.targetMinutes < this.minutes ? this.targetMinutes + 2 * Math.PI : this.targetMinutes);
        var nextHours = Math.min(targetHours, this.hours + this.rotationSpeed * tsDiff / 1000);
        var nextMinutes = Math.min(targetMinutes, this.minutes + this.rotationSpeed * tsDiff / 1000);
        this.hours = (nextHours > 2 * Math.PI ? nextHours - 2 * Math.PI : nextHours);
        this.minutes = (nextMinutes > 2 * Math.PI ? nextMinutes - 2 * Math.PI : nextMinutes);
        return true;
    };
    Clock.prototype.draw = function (ctx, x, y, r) {
        var changed = this.moveArrows();
        if (!changed) {
            return;
        }
        ctx.beginPath();
        ctx.clearRect(x - r - 1, y - r - 1, 2 * (r + 1), 2 * (r + 1));
        ctx.lineWidth = 1;
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.sin(this.hours) * r * this.HRS_ARROW_LEN, y - Math.cos(this.hours) * r * this.HRS_ARROW_LEN);
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.sin(this.minutes) * r * this.MINS_ARROW_LEN, y - Math.cos(this.minutes) * r * this.MINS_ARROW_LEN);
        ctx.stroke();
    };
    return Clock;
}());
var Segment = /** @class */ (function () {
    function Segment(x, y, w, h, gapx, gapy, n, m) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.gapx = gapx;
        this.gapy = gapy;
        this.n = n;
        this.m = m;
        this.clocks = [];
        for (var i = 0; i < n; ++i) {
            var curRow = [];
            for (var j = 0; j < m; ++j) {
                curRow.push(new Clock(2 * Math.PI));
            }
            this.clocks.push(curRow);
        }
    }
    Segment.prototype.draw = function (ctx) {
        var clocksW = (this.w - this.gapx * (this.m - 1)) / this.m;
        var clocksH = (this.h - this.gapy * (this.n - 1)) / this.n;
        var r = Math.min(clocksW, clocksH) / 2;
        for (var i = 0; i < this.n; ++i) {
            for (var j = 0; j < this.m; ++j) {
                this.clocks[i][j].draw(ctx, this.x + j * (clocksW + this.gapx) + clocksW / 2, this.y + i * (clocksH + this.gapy) + clocksH / 2, r);
            }
        }
    };
    Segment.prototype.clear = function () {
        for (var i = 0; i < this.n; ++i) {
            for (var j = 0; j < this.m; ++j) {
                this.clocks[i][j].setTarget(XX[0], XX[1]);
            }
        }
    };
    return Segment;
}());
var Digit = /** @class */ (function (_super) {
    __extends(Digit, _super);
    function Digit(x, y, w, h, gapx, gapy) {
        return _super.call(this, x, y, w, h, gapx, gapy, 6, 4) || this;
    }
    Digit.prototype.setTarget = function (target) {
        for (var i = 0; i < this.n; ++i) {
            for (var j = 0; j < this.m; ++j) {
                this.clocks[i][j].setTarget(positions[target][i][j][0], positions[target][i][j][1]);
            }
        }
    };
    return Digit;
}(Segment));
var Separator = /** @class */ (function (_super) {
    __extends(Separator, _super);
    function Separator(x, y, w, h, gapx, gapy) {
        return _super.call(this, x, y, w, h, gapx, gapy, 6, 2) || this;
    }
    Separator.prototype.set = function () {
        for (var i = 0; i < this.n; ++i) {
            for (var j = 0; j < this.m; ++j) {
                this.clocks[i][j].setTarget(positions['separator'][i][j][0], positions['separator'][i][j][1]);
            }
        }
    };
    return Separator;
}(Segment));
var EmptySeparator = /** @class */ (function (_super) {
    __extends(EmptySeparator, _super);
    function EmptySeparator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmptySeparator.prototype.set = function () {
        for (var i = 0; i < this.n; ++i) {
            for (var j = 0; j < this.m; ++j) {
                this.clocks[i][j].setTarget(XX[0], XX[1]);
            }
        }
    };
    return EmptySeparator;
}(Separator));
var RD = [0.5 * Math.PI, Math.PI];
var RL = [0.5 * Math.PI, 1.5 * Math.PI];
var DL = [Math.PI, 1.5 * Math.PI];
var DU = [Math.PI, 0];
var RU = [0.5 * Math.PI, 0];
var LU = [1.5 * Math.PI, 0];
var XX = [1.25 * Math.PI, 1.25 * Math.PI];
var UX = [0, 1.25 * Math.PI];
var XD = [0.25 * Math.PI, Math.PI];
var UY = [0, 0.75 * Math.PI];
var YD = [1.75 * Math.PI, Math.PI];
var positions = {
    'separator': [[XX, XX], [RD, DL], [RU, LU], [RD, DL], [RU, LU], [XX, XX]],
    0: [[RD, RL, RL, DL], [DU, RD, DL, DU], [DU, DU, DU, DU], [DU, DU, DU, DU], [DU, RU, LU, DU], [RU, RL, RL, LU]],
    1: [[RD, RL, DL, XX], [RU, DL, DU, XX], [XX, DU, DU, XX], [XX, DU, DU, XX], [RD, LU, RU, DL], [RU, RL, RL, LU]],
    2: [[RD, RL, RL, DL], [RU, RL, DL, DU], [RD, RL, LU, DU], [DU, RD, RL, LU], [DU, RU, RL, DL], [RU, RL, RL, LU]],
    3: [[RD, RL, RL, DL], [RU, RL, DL, DU], [RD, RL, LU, DU], [RU, RL, DL, DU], [RD, RL, LU, DU], [RU, RL, RL, LU]],
    4: [[RD, DL, RD, DL], [DU, DU, DU, DU], [DU, RU, LU, DU], [RU, RL, DL, DU], [XX, XX, DU, DU], [XX, XX, RU, LU]],
    5: [[RD, RL, RL, DL], [DU, RD, RL, LU], [DU, RU, RL, DL], [RU, RL, DL, DU], [RD, RL, LU, DU], [RU, RL, RL, LU]],
    6: [[RD, RL, RL, DL], [DU, RD, RL, LU], [DU, RU, RL, DL], [DU, RD, DL, DU], [DU, RU, LU, DU], [RU, RL, RL, LU]],
    7: [[RD, RL, RL, DL], [RU, RL, DL, DU], [XX, XX, UX, UX], [XX, XD, XD, XX], [XX, DU, DU, XX], [XX, RU, LU, XX]],
    8: [[RD, RL, RL, DL], [DU, RD, DL, DU], [UY, RU, LU, UX], [XD, RD, DL, YD], [DU, RU, LU, DU], [RU, RL, RL, LU]],
    9: [[RD, RL, RL, DL], [DU, RD, DL, DU], [DU, RU, LU, DU], [RU, RL, DL, DU], [RD, RL, LU, DU], [RU, RL, RL, LU]]
};
var Layout = /** @class */ (function () {
    function Layout(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.segments = [];
    }
    Layout.prototype.redraw = function (ctx) {
        for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            segment.draw(ctx);
        }
    };
    Layout.prototype.set = function (values) {
        var cur = 0;
        for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            if (segment instanceof Digit) {
                segment.setTarget(values[cur]);
                cur += 1;
            }
            else if (segment instanceof Separator) {
                segment.set();
            }
            else {
                throw "Unexpected segment type";
            }
        }
    };
    return Layout;
}());
var HorizontalLayout = /** @class */ (function (_super) {
    __extends(HorizontalLayout, _super);
    function HorizontalLayout(x, y, w, h) {
        var _this = _super.call(this, x, y, w, h) || this;
        var gap = 5;
        var clockSize = Math.floor(Math.min((w - gap * 27) / 28, (h - gap * 5) / 6));
        var digitW = 3 * (clockSize + gap) + clockSize;
        var digitH = 5 * (clockSize + gap) + clockSize;
        var sepW = 2 * clockSize + gap;
        _this.segments.push(new Digit(x, y, digitW, digitH, gap, gap), new Digit(x + digitW + gap, y, digitW, digitH, gap, gap), new Separator(x + 2 * (digitW + gap), y, sepW, digitH, gap, gap), new Digit(x + 2 * (digitW + gap) + sepW + gap, y, digitW, digitH, gap, gap), new Digit(x + 3 * (digitW + gap) + sepW + gap, y, digitW, digitH, gap, gap), new Separator(x + 4 * (digitW + gap) + sepW + gap, y, sepW, digitH, gap, gap), new Digit(x + 4 * (digitW + gap) + 2 * (sepW + gap), y, digitW, digitH, gap, gap), new Digit(x + 5 * (digitW + gap) + 2 * (sepW + gap), y, digitW, digitH, gap, gap));
        return _this;
    }
    return HorizontalLayout;
}(Layout));
var VerticalLayout = /** @class */ (function (_super) {
    __extends(VerticalLayout, _super);
    function VerticalLayout(x, y, w, h) {
        var _this = _super.call(this, x, y, w, h) || this;
        var gap = 5;
        var clockSize = Math.floor(Math.min((w - gap * 7) / 8, (h - gap * 17) / 18));
        var digitW = 3 * (clockSize + gap) + clockSize;
        var digitH = 5 * (clockSize + gap) + clockSize;
        var sepW = 2 * clockSize + gap;
        _this.segments.push(new Digit(x, y, digitW, digitH, gap, gap), new Digit(x + digitW + gap, y, digitW, digitH, gap, gap), new Digit(x, y + digitH + gap, digitW, digitH, gap, gap), new Digit(x + digitW + gap, y + digitH + gap, digitW, digitH, gap, gap), new Digit(x, y + 2 * (digitH + gap), digitW, digitH, gap, gap), new Digit(x + digitW + gap, y + 2 * (digitH + gap), digitW, digitH, gap, gap));
        return _this;
    }
    return VerticalLayout;
}(Layout));
//# sourceMappingURL=draw.js.map