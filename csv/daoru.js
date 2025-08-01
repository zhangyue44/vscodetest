const path = require("path");
const fs = require("fs");
const Papa = require("papaparse");
const iconv = require("iconv-jschardet");

const PATH_NAME = path.join(__dirname, "data.csv");

const completeData = [];

const data = fs.readFileSync(PATH_NAME, { flag: "r" });
const dataInfo = iconv.detect(data);
let wholeString;
if (dataInfo.encoding === "UTF-8") {
	wholeString = iconv.decode(data, "UTF-8");
} else {
	wholeString = iconv.decode(data, "GBK");
}

Papa.parse(wholeString, {
	step: function (results) {
		// 每解析一行，都会触发这个回调
		const data = results.data.map((item) => {
			return (item || "").trim();
		});
		completeData.push(data);
	},
	complete: function () {
		console.log("csv文件解析完成");
		console.log(completeData);
	},
	error: function (err) {
		console.log("err", err.message);
	},
});
