r(O.prototype, {
    addPoint: function (a, b, c, d) {
        d = { series: this };
        this.pointClass.prototype.applyOptions.apply(d, [a]);
        g = d.x;
        h = q.length;
        if (this.requireSorting && g < q[h - 1])
            for (m = !0; h && q[h - 1] > g;)
                h--;
        this.updateParallelArrays(d, 'splice', h, 0, 0);
        this.updateParallelArrays(d, h);
        if (j)
            j[g] = d.name;
        l.splice(h, 0, a);
        m && (this.data.splice(h, 0, null), this.processData());
        e.legendType === 'point' && this.generatePoints();
        c && (f[0] && f[0].remove ? f[0].remove(!1) : (f.shift(), this.updateParallelArrays(d, 'shift'), l.shift()));
        this.isDirtyData = this.isDirty = !0;
        b && (this.getAttribs(), i.redraw());
    },
    remove: function (a, b) {
        var c = this, d = c.chart, a = n(a, !0);
        if (!c.isRemoving)
            c.isRemoving = !0, A(c, 'remove', null, function () {
                c.destroy();
                d.isDirtyLegend = d.isDirtyBox = !0;
                d.linkSeries();
                a && d.redraw(b);
            });
        c.isRemoving = !1;
    },
    update: function (a, b) {
        var c = this.chart, d = this.type, e = L[d].prototype, f, a = x(this.userOptions, {
                animation: !1,
                index: this.index,
                pointStart: this.xData[0]
            }, { data: this.options.data }, a);
        this.remove(!1);
        for (f in e)
            e.hasOwnProperty(f) && (this[f] = u);
        r(this, L[a.type || d].prototype);
        this.init(c, a);
        n(b, !0) && c.redraw(!1);
    }
});