// Application specific Key Performance Index reporting
var kpi1 = 0;
var kpi2 = 0;
var kpi3 = 0;

module.exports = {

    update: function (p1, p2, p3) {
        kpi1 += p1;
        kpi2 = p2;
        kpi3 = p3;
    },

    getKpis: function (req, res) {
        res.json(
            [
                {name: "kpi1", value: kpi1, description: "Descriptive text", type: "transitiveCounter"},
                {name: "kpi2", value: kpi2, description: "Descriptive text"},
                {name: "kpi3", value: kpi3, description: "Descriptive text"}
            ]
        );
    }
};