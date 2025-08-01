/**
 * npm install papaparse
 * npm install iconv-jschardet
 */

const path = require("path");
const fs = require("fs");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");
const Papa = require("papaparse");
const iconv = require("iconv-jschardet");

const PATH_NAME = path.join(__dirname, "data.csv");

const data = [["name", "string"]]; // 二维数组

const csv = Papa.unparse(data, {
	// delimiter: ",", // 指定字符之间的分隔符
	// quotes: false, // 是否为所有字段添加双引号
	// quoteChar: '"', // 指定引号字符
	// escapeChar: '"', // 指定转义字符（默认与 quotehar 一致）
	header: false, // 是否在csv中添加标题行
	// newline: "\r\n", // 指定换行符
	// skipEmptyLines: false,  // 是否跳过空行
});

let csvString = iconv.encode(csv, "GBK");

const dataStream = Readable.from(csvString);
const writeStream = fs.createWriteStream(PATH_NAME);

async function fn() {
	try {
		await pipeline(dataStream, writeStream);
		console.log("导出csv成功");
	} catch (err) {
		console.log("导出csv失败");
	}
}
fn();
